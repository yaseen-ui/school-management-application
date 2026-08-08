/**
 * Student Dashboard aggregate (Parent USP + reusable for staff).
 * Primary key: enrollmentId
 * Exams: published / completed / locked ("released")
 */

import { prisma } from "../../lib/prisma.js";
import { hasPermission, resolveEffectivePermissions } from "../../rbac/engine.js";

const RELEASED_EXAM_STATUSES = ["published", "completed", "locked"];
const CLASS_AVG_MIN_SAMPLE = 3;

function pct(obtained, max) {
  if (max == null || max <= 0 || obtained == null) return null;
  return Math.round((Number(obtained) / Number(max)) * 10000) / 100;
}

function gradeFromPercentage(percentage) {
  if (percentage == null) return null;
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 35) return "D";
  return "F";
}

function fullName(student) {
  if (!student) return "";
  return [student.firstName, student.middleName, student.lastName].filter(Boolean).join(" ");
}

async function assertCanViewEnrollment(user, tenantId, enrollment) {
  if (!user?.userId && !user?.id) {
    const err = new Error("Authentication required.");
    err.statusCode = 401;
    throw err;
  }
  if (user.userType === "company") {
    const err = new Error("Company users cannot access student dashboards.");
    err.statusCode = 403;
    err.code = "COMPANY_TENANT_FORBIDDEN";
    throw err;
  }

  const userId = user.userId || user.id;

  // Parent: must be linked via StudentParent
  const parent = await prisma.parent.findFirst({
    where: { userId, tenantId, deletedAt: null },
    select: {
      id: true,
      students: { select: { studentId: true } },
    },
  });

  if (parent) {
    const linked = parent.students.some((s) => s.studentId === enrollment.studentId);
    if (linked) return { role: "parent", parentId: parent.id, userId };
  }

  // Staff: students:read (or super via hasPermission)
  const perms = await resolveEffectivePermissions(user);
  if (hasPermission(perms, "students:read") || hasPermission(perms, "admin:super")) {
    return { role: "staff", userId };
  }

  const err = new Error("You do not have access to this student dashboard.");
  err.statusCode = 403;
  throw err;
}

export default {
  async getDashboard(enrollmentId, tenantId, user, { examScheduleId } = {}) {
    if (!enrollmentId) {
      const err = new Error("enrollmentId is required.");
      err.statusCode = 400;
      throw err;
    }
    if (!tenantId) {
      const err = new Error("Tenant context is required.");
      err.statusCode = 400;
      throw err;
    }

    const enrollment = await prisma.studentEnrollment.findFirst({
      where: { id: enrollmentId, tenantId },
      include: {
        student: true,
        grade: { select: { id: true, gradeName: true } },
        section: { select: { id: true, sectionName: true } },
        academicYear: { select: { id: true, name: true, status: true } },
      },
    });

    if (!enrollment) {
      const err = new Error("Enrollment not found.");
      err.statusCode = 404;
      throw err;
    }

    const access = await assertCanViewEnrollment(user, tenantId, enrollment);

    // ── Released exam marks for this enrollment ──────────────────────
    const marks = await prisma.examMark.findMany({
      where: {
        tenantId,
        enrollmentId,
        examPaper: {
          schedule: {
            exam: { status: { in: RELEASED_EXAM_STATUSES } },
          },
        },
      },
      include: {
        examPaper: {
          include: {
            schedule: {
              include: {
                exam: {
                  select: {
                    id: true,
                    name: true,
                    examType: true,
                    status: true,
                    startDate: true,
                    endDate: true,
                  },
                },
              },
            },
            sectionSubject: {
              include: {
                subject: { select: { id: true, subjectName: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Group by schedule
    const scheduleMap = new Map();
    for (const mark of marks) {
      const schedule = mark.examPaper?.schedule;
      const exam = schedule?.exam;
      if (!schedule || !exam) continue;
      if (!scheduleMap.has(schedule.id)) {
        scheduleMap.set(schedule.id, {
          examId: exam.id,
          examName: exam.name,
          examType: exam.examType,
          scheduleId: schedule.id,
          scheduleName: schedule.name,
          startDate: exam.startDate,
          endDate: exam.endDate,
          marks: [],
        });
      }
      scheduleMap.get(schedule.id).marks.push(mark);
    }

    const exams = [...scheduleMap.values()]
      .map((s) => ({
        examId: s.examId,
        scheduleId: s.scheduleId,
        name: s.scheduleName || s.examName,
        examName: s.examName,
        examType: s.examType,
        dateRange: {
          start: s.startDate,
          end: s.endDate,
        },
        endDate: s.endDate,
      }))
      .sort((a, b) => new Date(b.endDate || 0) - new Date(a.endDate || 0));

    // Select schedule
    let selectedScheduleId = examScheduleId || exams[0]?.scheduleId || null;
    if (examScheduleId && !scheduleMap.has(examScheduleId)) {
      selectedScheduleId = exams[0]?.scheduleId || null;
    }

    let selectedExam = null;
    let progress = [];

    // Progress across all released schedules
    for (const s of scheduleMap.values()) {
      let total = 0;
      let max = 0;
      for (const m of s.marks) {
        if (!m.isAbsent && m.marksObtained != null) {
          total += Number(m.marksObtained);
          max += Number(m.examPaper?.maxMarks || 0);
        }
      }
      const percentage = pct(total, max);
      progress.push({
        scheduleId: s.scheduleId,
        name: s.scheduleName || s.examName,
        examName: s.examName,
        percentage,
        totalMarks: total,
        totalMaxMarks: max,
        endDate: s.endDate,
      });
    }
    progress.sort((a, b) => new Date(a.endDate || 0) - new Date(b.endDate || 0));

    if (selectedScheduleId && scheduleMap.has(selectedScheduleId)) {
      const selected = scheduleMap.get(selectedScheduleId);
      const paperIds = selected.marks.map((m) => m.examPaperId).filter(Boolean);

      // Class averages for each paper (same section peers)
      const peerMarks =
        paperIds.length > 0
          ? await prisma.examMark.findMany({
              where: {
                tenantId,
                examPaperId: { in: paperIds },
                isAbsent: false,
                marksObtained: { not: null },
                enrollment: {
                  sectionId: enrollment.sectionId,
                },
              },
              select: {
                examPaperId: true,
                marksObtained: true,
              },
            })
          : [];

      const peerByPaper = new Map();
      for (const pm of peerMarks) {
        if (!peerByPaper.has(pm.examPaperId)) peerByPaper.set(pm.examPaperId, []);
        peerByPaper.get(pm.examPaperId).push(Number(pm.marksObtained));
      }

      let total = 0;
      let max = 0;
      const subjects = [];

      for (const m of selected.marks) {
        const maxMarks = m.examPaper?.maxMarks || 0;
        const passMarks = m.examPaper?.passMarks || 0;
        const obtained = m.isAbsent ? null : m.marksObtained;
        if (!m.isAbsent && obtained != null) {
          total += Number(obtained);
          max += Number(maxMarks);
        }

        const peers = peerByPaper.get(m.examPaperId) || [];
        let classAverage = null;
        if (peers.length >= CLASS_AVG_MIN_SAMPLE) {
          const sum = peers.reduce((a, b) => a + b, 0);
          const avgMarks = Math.round((sum / peers.length) * 100) / 100;
          classAverage = {
            avgMarks,
            avgPercentage: pct(avgMarks, maxMarks),
            sampleSize: peers.length,
          };
        }

        subjects.push({
          subjectId: m.examPaper?.sectionSubject?.subject?.id || null,
          subjectName: m.examPaper?.sectionSubject?.subject?.subjectName || "Subject",
          marksObtained: obtained,
          maxMarks,
          passMarks,
          isAbsent: m.isAbsent,
          gradeLabel: m.gradeLabel || gradeFromPercentage(pct(obtained, maxMarks)),
          remarks: m.remarks || null,
          breakup: m.breakup || null,
          classAverage,
        });
      }

      const percentage = pct(total, max);
      // overall class avg % when enough subjects have class avg
      const classPcts = subjects
        .map((s) => s.classAverage?.avgPercentage)
        .filter((v) => v != null);
      const classAvgPercentage =
        classPcts.length >= 1
          ? Math.round((classPcts.reduce((a, b) => a + b, 0) / classPcts.length) * 100) / 100
          : null;

      selectedExam = {
        scheduleId: selected.scheduleId,
        scheduleName: selected.scheduleName,
        examId: selected.examId,
        examName: selected.examName,
        examType: selected.examType,
        overall: {
          total,
          max,
          percentage,
          gradeLabel: gradeFromPercentage(percentage),
          classAvgPercentage,
        },
        subjects,
      };
    }

    // ── Attendance (last 90 days + current month) ─────────────────────
    const now = new Date();
    const heatStart = new Date(now);
    heatStart.setDate(heatStart.getDate() - 90);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const attendanceMarks = await prisma.attendanceMark.findMany({
      where: {
        tenantId,
        enrollmentId,
        session: { date: { gte: heatStart } },
      },
      include: {
        session: { select: { date: true, notes: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const heatmap = [];
    const monthSummary = { present: 0, absent: 0, late: 0, half_day: 0, excused: 0, leave: 0, total: 0 };
    let todayStatus = null;
    const todayStr = now.toISOString().slice(0, 10);

    // one status per day (latest session wins)
    const byDate = new Map();
    for (const am of attendanceMarks) {
      const d = am.session?.date ? new Date(am.session.date).toISOString().slice(0, 10) : null;
      if (!d) continue;
      if (!byDate.has(d)) byDate.set(d, am);
    }

    for (const [date, am] of [...byDate.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
      heatmap.push({ date, status: am.status, remarks: am.remarks || null });
      const dt = new Date(date);
      if (dt >= monthStart) {
        monthSummary.total += 1;
        if (monthSummary[am.status] != null) monthSummary[am.status] += 1;
      }
      if (date === todayStr) todayStatus = am.status;
    }

    const presentLike = monthSummary.present + monthSummary.late + monthSummary.half_day + monthSummary.excused;
    const attendancePercentage =
      monthSummary.total > 0
        ? Math.round((presentLike / monthSummary.total) * 10000) / 100
        : null;

    // ── Timeline: remarks + communications ───────────────────────────
    const timeline = [];

    for (const am of attendanceMarks) {
      if (!am.remarks) continue;
      timeline.push({
        id: `att-${am.id}`,
        at: am.session?.date || am.createdAt,
        type: "attendance_remark",
        title: "Attendance note",
        body: am.remarks,
        subjectName: null,
        teacherName: null,
      });
    }

    for (const m of marks) {
      if (!m.remarks) continue;
      timeline.push({
        id: `exam-${m.id}`,
        at: m.updatedAt || m.createdAt,
        type: "exam_remark",
        title: "Exam remark",
        body: m.remarks,
        subjectName: m.examPaper?.sectionSubject?.subject?.subjectName || null,
        teacherName: null,
      });
    }

    // Communications for parent user (or staff skips personal inbox merge lightly)
    if (access.role === "parent" && access.userId) {
      const recipients = await prisma.communicationRecipient.findMany({
        where: {
          tenantId,
          userId: access.userId,
        },
        include: {
          communication: {
            select: {
              id: true,
              title: true,
              message: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      });

      for (const r of recipients) {
        const c = r.communication;
        if (!c) continue;
        timeline.push({
          id: `comm-${r.id}`,
          at: c.createdAt,
          type: "communication",
          title: c.title || "Message",
          body: c.message || "",
          subjectName: null,
          teacherName: null,
          deepLink: "/parent-portal/communications",
        });
      }
    }

    timeline.sort((a, b) => new Date(b.at) - new Date(a.at));

    // ── Fees secondary (optional) ────────────────────────────────────
    let feesDue = null;
    try {
      const fee = await prisma.studentFee.findFirst({
        where: { tenantId, enrollmentId },
        include: {
          payments: { select: { amountPaid: true } },
        },
      });
      if (fee) {
        const total = Number(fee.totalNegotiatedFee || fee.totalActualFee || 0);
        const paid = (fee.payments || []).reduce(
          (s, p) => s + Number(p.amountPaid || 0),
          0
        );
        feesDue = Math.max(0, total - paid);
      }
    } catch {
      feesDue = null;
    }

    const prevProgress = progress.length >= 2 ? progress[progress.length - 2]?.percentage : null;
    const latestProgress = progress.length >= 1 ? progress[progress.length - 1]?.percentage : null;
    const trendDelta =
      prevProgress != null && latestProgress != null
        ? Math.round((latestProgress - prevProgress) * 100) / 100
        : null;

    return {
      student: {
        id: enrollment.student.id,
        fullName: fullName(enrollment.student),
        firstName: enrollment.student.firstName,
        lastName: enrollment.student.lastName,
        admissionNumber: enrollment.student.admissionNumber || null,
      },
      enrollment: {
        id: enrollment.id,
        rollNumber: enrollment.rollNumber || null,
        gradeId: enrollment.gradeId,
        gradeName: enrollment.grade?.gradeName || null,
        sectionId: enrollment.sectionId,
        sectionName: enrollment.section?.sectionName || null,
        academicYearId: enrollment.academicYearId,
        academicYearLabel: enrollment.academicYear?.name || null,
        status: enrollment.status,
      },
      today: {
        attendanceStatus: todayStatus,
      },
      exams: exams.map((e, i) => ({
        ...e,
        isLatest: i === 0,
      })),
      selectedExam,
      progress,
      trendDelta,
      attendance: {
        monthSummary: {
          ...monthSummary,
          percentage: attendancePercentage,
        },
        heatmap,
      },
      timeline: timeline.slice(0, 30),
      secondary: {
        feesDue,
      },
      accessRole: access.role,
    };
  },
};
