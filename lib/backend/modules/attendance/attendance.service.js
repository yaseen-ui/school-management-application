import { prisma } from "../../lib/prisma.js";

function mapSessionIn(data = {}, tenantId) {
  const out = { tenantId };

  if (data.academicYearId !== undefined) out.academicYearId = data.academicYearId;
  if (data.sectionId !== undefined) out.sectionId = data.sectionId;
  if (data.takenById !== undefined) out.takenById = data.takenById || null;
  if (data.attendanceTypeId !== undefined) out.attendanceTypeId = data.attendanceTypeId;
  if (data.date !== undefined) out.date = new Date(data.date);
  if (data.periodId !== undefined) out.periodId = data.periodId || null;
  if (data.sectionSubjectId !== undefined) out.sectionSubjectId = data.sectionSubjectId || null;
  if (data.examScheduleId !== undefined) out.examScheduleId = data.examScheduleId || null;
  if (data.shift !== undefined) out.shift = data.shift || null;
  if (data.notes !== undefined) out.notes = data.notes || null;

  return out;
}

function mapSessionOut(row) {
  if (!row) return null;

  return {
    id: row.id,
    tenantId: row.tenantId,
    academicYearId: row.academicYearId,
    sectionId: row.sectionId,
    takenById: row.takenById,
    attendanceTypeId: row.attendanceTypeId,
    date: row.date,
    periodId: row.periodId,
    sectionSubjectId: row.sectionSubjectId,
    examScheduleId: row.examScheduleId,
    shift: row.shift,
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    academicYear: row.academicYear
      ? { id: row.academicYear.id, name: row.academicYear.name }
      : null,
    section: row.section
      ? { id: row.section.id, sectionName: row.section.sectionName }
      : null,
    attendanceType: row.attendanceType
      ? { id: row.attendanceType.id, name: row.attendanceType.name, category: row.attendanceType.category }
      : null,
    takenBy: row.takenBy
      ? { id: row.takenBy.id, fullName: row.takenBy.fullName }
      : null,
    period: row.period
      ? { id: row.period.id, name: row.period.name, startTime: row.period.startTime, endTime: row.period.endTime }
      : null,
    sectionSubject: row.sectionSubject
      ? {
          id: row.sectionSubject.id,
          subject: row.sectionSubject.subject
            ? { id: row.sectionSubject.subject.id, subjectName: row.sectionSubject.subject.subjectName }
            : null,
        }
      : null,
    examSchedule: row.examSchedule
      ? { id: row.examSchedule.id, name: row.examSchedule.name }
      : null,
    marks: row.marks
      ? row.marks.map((m) => ({
          id: m.id,
          enrollmentId: m.enrollmentId,
          status: m.status,
          remarks: m.remarks,
          student: m.enrollment
            ? {
                id: m.enrollment.student.id,
                firstName: m.enrollment.student.firstName,
                lastName: m.enrollment.student.lastName,
                rollNumber: m.enrollment.rollNumber,
              }
            : null,
        }))
      : null,
    _count: row._count
      ? {
          marks: row._count.marks,
          present: row._count.marks
            ? row.marks?.filter((m) => m.status === "present").length
            : 0,
        }
      : null,
  };
}

function mapMarkIn(data = {}, tenantId) {
  const out = { tenantId };

  if (data.sessionId !== undefined) out.sessionId = data.sessionId;
  if (data.enrollmentId !== undefined) out.enrollmentId = data.enrollmentId;
  if (data.status !== undefined) out.status = data.status;
  if (data.remarks !== undefined) out.remarks = data.remarks || null;

  return out;
}

class AttendanceService {
  // ---- Sessions ----

  async createSession(data, tenantId) {
    if (!data?.academicYearId) throw new Error("Academic year is required.");
    if (!data?.sectionId) throw new Error("Section is required.");
    if (!data?.attendanceTypeId) throw new Error("Attendance type is required.");
    if (!data?.date) throw new Error("Date is required.");

    const toCreate = mapSessionIn(data, tenantId);

    // Check for duplicate session
    const existing = await prisma.attendanceSession.findFirst({
      where: {
        tenantId,
        sectionId: toCreate.sectionId,
        date: toCreate.date,
        attendanceTypeId: toCreate.attendanceTypeId,
        periodId: toCreate.periodId || null,
      },
    });
    if (existing) {
      throw new Error("An attendance session already exists for this section, date, and attendance type/period.");
    }

    const created = await prisma.attendanceSession.create({
      data: toCreate,
      include: {
        academicYear: { select: { id: true, name: true } },
        section: { select: { id: true, sectionName: true } },
        attendanceType: { select: { id: true, name: true, category: true } },
        takenBy: { select: { id: true, fullName: true } },
        period: { select: { id: true, name: true, startTime: true, endTime: true } },
        sectionSubject: {
          select: {
            id: true,
            subject: { select: { id: true, subjectName: true } },
          },
        },
        examSchedule: { select: { id: true, name: true } },
        marks: {
          include: {
            enrollment: {
              select: {
                id: true,
                rollNumber: true,
                student: { select: { id: true, firstName: true, lastName: true } },
              },
            },
          },
        },
        _count: { select: { marks: true } },
      },
    });

    return mapSessionOut(created);
  }

  async getSessionById(id, tenantId) {
    const row = await prisma.attendanceSession.findFirst({
      where: { id, tenantId },
      include: {
        academicYear: { select: { id: true, name: true } },
        section: { select: { id: true, sectionName: true } },
        attendanceType: { select: { id: true, name: true, category: true } },
        takenBy: { select: { id: true, fullName: true } },
        period: { select: { id: true, name: true, startTime: true, endTime: true } },
        sectionSubject: {
          select: {
            id: true,
            subject: { select: { id: true, subjectName: true } },
          },
        },
        examSchedule: { select: { id: true, name: true } },
        marks: {
          include: {
            enrollment: {
              select: {
                id: true,
                rollNumber: true,
                student: { select: { id: true, firstName: true, lastName: true } },
              },
            },
          },
        },
        _count: { select: { marks: true } },
      },
    });
    return mapSessionOut(row);
  }

  async getAllSessions(tenantId, filters = {}) {
    const where = { tenantId };

    if (filters.academicYearId) where.academicYearId = filters.academicYearId;
    if (filters.sectionId) where.sectionId = filters.sectionId;
    if (filters.attendanceTypeId) where.attendanceTypeId = filters.attendanceTypeId;
    if (filters.date) where.date = new Date(filters.date);
    if (filters.periodId) where.periodId = filters.periodId;
    if (filters.takenById) where.takenById = filters.takenById;

    if (filters.dateFrom || filters.dateTo) {
      where.date = {};
      if (filters.dateFrom) where.date.gte = new Date(filters.dateFrom);
      if (filters.dateTo) where.date.lte = new Date(filters.dateTo);
    }

    const rows = await prisma.attendanceSession.findMany({
      where,
      include: {
        academicYear: { select: { id: true, name: true } },
        section: { select: { id: true, sectionName: true } },
        attendanceType: { select: { id: true, name: true, category: true } },
        takenBy: { select: { id: true, fullName: true } },
        period: { select: { id: true, name: true, startTime: true, endTime: true } },
        sectionSubject: {
          select: {
            id: true,
            subject: { select: { id: true, subjectName: true } },
          },
        },
        examSchedule: { select: { id: true, name: true } },
        _count: { select: { marks: true } },
      },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });

    return rows.map(mapSessionOut);
  }

  async updateSession(id, data, tenantId) {
    const existing = await prisma.attendanceSession.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return null;

    const toUpdate = mapSessionIn(data, tenantId);
    delete toUpdate.tenantId;
    delete toUpdate.academicYearId;
    delete toUpdate.sectionId;
    delete toUpdate.attendanceTypeId;

    Object.keys(toUpdate).forEach((k) => toUpdate[k] === undefined && delete toUpdate[k]);

    if (Object.keys(toUpdate).length === 0) return this.getSessionById(id, tenantId);

    await prisma.attendanceSession.update({
      where: { id },
      data: toUpdate,
    });

    return this.getSessionById(id, tenantId);
  }

  async deleteSession(id, tenantId) {
    const existing = await prisma.attendanceSession.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return null;

    await prisma.attendanceMark.deleteMany({
      where: { sessionId: id, tenantId },
    });

    await prisma.attendanceSession.delete({
      where: { id },
    });

    return mapSessionOut(existing);
  }

  // ---- Combined create-session + mark in one call ----
  async markAttendance(data, tenantId) {
    if (!data?.academicYearId) throw new Error("Academic year is required.");
    if (!data?.sectionId) throw new Error("Section is required.");
    if (!data?.attendanceTypeId) throw new Error("Attendance type is required.");
    if (!data?.date) throw new Error("Date is required.");

    const toCreate = mapSessionIn(data, tenantId);

    // Check for existing session
    let session = await prisma.attendanceSession.findFirst({
      where: {
        tenantId,
        sectionId: toCreate.sectionId,
        date: toCreate.date,
        attendanceTypeId: toCreate.attendanceTypeId,
        periodId: toCreate.periodId || null,
      },
    });

    // Create session if not exists
    if (!session) {
      session = await prisma.attendanceSession.create({
        data: toCreate,
      });
    }

    // Upsert marks
    const marks = data.marks || [];
    const results = [];
    const errors = [];

    for (const mark of marks) {
      try {
        const result = await this.upsertMark(
          { sessionId: session.id, ...mark },
          tenantId
        );
        results.push(result);
      } catch (error) {
        errors.push({ mark, error: error.message });
      }
    }

    return { session: mapSessionOut(await this.getSessionById(session.id, tenantId)), results, errors };
  }

  // ---- Marks ----

  async getMarksForSession(sessionId, tenantId) {
    const marks = await prisma.attendanceMark.findMany({
      where: { sessionId, tenantId },
      include: {
        enrollment: {
          select: {
            id: true,
            rollNumber: true,
            student: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
      orderBy: [{ enrollment: { rollNumber: "asc" } }],
    });

    return marks.map((m) => ({
      id: m.id,
      sessionId: m.sessionId,
      enrollmentId: m.enrollmentId,
      status: m.status,
      remarks: m.remarks,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
      student: m.enrollment
        ? {
            id: m.enrollment.student.id,
            firstName: m.enrollment.student.firstName,
            lastName: m.enrollment.student.lastName,
            rollNumber: m.enrollment.rollNumber,
          }
        : null,
    }));
  }

  async upsertMark(data, tenantId) {
    if (!data?.sessionId) throw new Error("Session ID is required.");
    if (!data?.enrollmentId) throw new Error("Enrollment ID is required.");
    if (!data?.status) throw new Error("Attendance status is required.");

    const toUpsert = mapMarkIn(data, tenantId);

    const existing = await prisma.attendanceMark.findFirst({
      where: {
        tenantId,
        sessionId: toUpsert.sessionId,
        enrollmentId: toUpsert.enrollmentId,
      },
    });

    let mark;
    if (existing) {
      mark = await prisma.attendanceMark.update({
        where: { id: existing.id },
        data: { status: toUpsert.status, remarks: toUpsert.remarks ?? existing.remarks },
      });
    } else {
      mark = await prisma.attendanceMark.create({
        data: toUpsert,
      });
    }

    return mark;
  }

  async bulkUpsertMarks(sessionId, marks, tenantId) {
    if (!sessionId) throw new Error("Session ID is required.");
    if (!Array.isArray(marks) || marks.length === 0) {
      throw new Error("Marks array is required.");
    }

    const results = [];
    const errors = [];

    for (const mark of marks) {
      try {
        const result = await this.upsertMark(
          { sessionId, ...mark },
          tenantId
        );
        results.push(result);
      } catch (error) {
        errors.push({ mark, error: error.message });
      }
    }

    return { results, errors };
  }

  async deleteMark(id, tenantId) {
    const existing = await prisma.attendanceMark.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return null;

    await prisma.attendanceMark.delete({
      where: { id },
    });

    return existing;
  }

  // ---- Reports / Aggregations ----

  async getAttendanceSummary(tenantId, filters = {}) {
    const where = { tenantId };

    if (filters.academicYearId) where.academicYearId = filters.academicYearId;
    if (filters.sectionId) where.sectionId = filters.sectionId;
    if (filters.attendanceTypeId) where.attendanceTypeId = filters.attendanceTypeId;
    if (filters.date) where.date = new Date(filters.date);
    if (filters.dateFrom || filters.dateTo) {
      where.date = {};
      if (filters.dateFrom) where.date.gte = new Date(filters.dateFrom);
      if (filters.dateTo) where.date.lte = new Date(filters.dateTo);
    }

    const sessions = await prisma.attendanceSession.findMany({
      where,
      include: {
        _count: { select: { marks: true } },
        marks: {
          select: { status: true },
        },
      },
    });

    const summary = {
      totalSessions: sessions.length,
      totalMarks: 0,
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      excused: 0,
    };

    for (const session of sessions) {
      summary.totalMarks += session._count.marks;
      for (const mark of session.marks) {
        switch (mark.status) {
          case "present": summary.present++; break;
          case "absent": summary.absent++; break;
          case "late": summary.late++; break;
          case "half_day": summary.halfDay++; break;
          case "excused": summary.excused++; break;
        }
      }
    }

    return summary;
  }

  async getStudentAttendance(tenantId, enrollmentId, filters = {}) {
    const where = { tenantId, enrollmentId };

    if (filters.academicYearId) {
      where.session = { academicYearId: filters.academicYearId };
    }
    if (filters.dateFrom || filters.dateTo) {
      where.session = where.session || {};
      where.session.date = {};
      if (filters.dateFrom) where.session.date.gte = new Date(filters.dateFrom);
      if (filters.dateTo) where.session.date.lte = new Date(filters.dateTo);
    }

    const marks = await prisma.attendanceMark.findMany({
      where,
      include: {
        session: {
          select: {
            id: true,
            date: true,
            attendanceType: { select: { id: true, name: true, category: true } },
            period: { select: { id: true, name: true } },
            sectionSubject: {
              select: {
                subject: { select: { id: true, subjectName: true } },
              },
            },
          },
        },
      },
      orderBy: [{ session: { date: "desc" } }],
    });

    return marks.map((m) => ({
      id: m.id,
      status: m.status,
      remarks: m.remarks,
      date: m.session.date,
      attendanceType: m.session.attendanceType,
      period: m.session.period,
      subject: m.session.sectionSubject?.subject || null,
    }));
  }

  // ---- Context Options (periods / exam schedules for a section) ----

  async getContextOptions(tenantId, sectionId, attendanceTypeId) {
    const type = await prisma.attendanceType.findFirst({
      where: { id: attendanceTypeId, tenantId },
    });

    if (!type) throw new Error("Attendance type not found.");

    const result = {
      attendanceType: { id: type.id, name: type.name, category: type.category },
      options: [],
    };

    if (type.category === "period") {
      // Get section's timetable structure and periods for today
      const section = await prisma.section.findFirst({
        where: { id: sectionId, tenantId },
        select: { structureId: true },
      });

      if (section?.structureId) {
        const today = new Date();
        const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][today.getDay()];

        // Get periods from the structure, ordered by sort order
        const periods = await prisma.timetablePeriod.findMany({
          where: { tenantId, structureId: section.structureId },
          orderBy: { sortOrder: "asc" },
          select: { id: true, name: true, type: true, startTime: true, endTime: true, sortOrder: true },
        });

        // Filter periods that are class type (not break, lunch, etc.) — but still return all for reference
        result.options = periods.map((p) => ({
          id: p.id,
          name: p.name,
          type: p.type,
          startTime: p.startTime,
          endTime: p.endTime,
          sortOrder: p.sortOrder,
          label: `${p.name} (${Math.floor(p.startTime / 60).toString().padStart(2, "0")}:${(p.startTime % 60).toString().padStart(2, "0")} - ${Math.floor(p.endTime / 60).toString().padStart(2, "0")}:${(p.endTime % 60).toString().padStart(2, "0")})`,
        }));
      }
    } else if (type.category === "exam") {
      // Get today's exam schedules for the section
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      const schedules = await prisma.examSchedule.findMany({
        where: {
          tenantId,
          sectionId,
          startDate: { lte: endOfDay },
          endDate: { gte: startOfDay },
          status: { in: ["scheduled", "pending"] },
        },
        select: { id: true, name: true, startDate: true, endDate: true },
        orderBy: { startDate: "asc" },
      });

      result.options = schedules.map((s) => ({
        id: s.id,
        name: s.name,
        label: s.name,
      }));
    }

    return result;
  }

  // ---- Register View ----
  async getAttendanceRegister(tenantId, sectionId, month, year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Get all enrollments for this section
    const enrollments = await prisma.studentEnrollment.findMany({
      where: { tenantId, sectionId, status: "active" },
      include: {
        student: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { rollNumber: "asc" },
    });

    // Get all sessions for this section in the date range
    const sessions = await prisma.attendanceSession.findMany({
      where: {
        tenantId,
        sectionId,
        date: { gte: startDate, lte: endDate },
      },
      include: {
        attendanceType: { select: { id: true, name: true, category: true } },
        marks: { select: { enrollmentId: true, status: true } },
      },
      orderBy: { date: "asc" },
    });

    // Build date -> type -> marks map
    const dateMap = {};
    const activeTypes = new Set();

    for (const session of sessions) {
      const dateStr = session.date.toISOString().split("T")[0];
      if (!dateMap[dateStr]) dateMap[dateStr] = {};
      const typeName = session.attendanceType.name;
      activeTypes.add(typeName);

      const markMap = {};
      for (const mark of session.marks) {
        markMap[mark.enrollmentId] = mark.status;
      }
      dateMap[dateStr][typeName] = markMap;
    }

    return {
      enrollments: enrollments.map((e) => ({
        enrollmentId: e.id,
        rollNumber: e.rollNumber,
        studentName: `${e.student.firstName} ${e.student.lastName}`,
      })),
      activeTypes: Array.from(activeTypes),
      attendance: dateMap,
    };
  }

  async getStudentAttendanceDetail(tenantId, enrollmentId, month, year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const marks = await prisma.attendanceMark.findMany({
      where: {
        tenantId,
        enrollmentId,
        session: {
          date: { gte: startDate, lte: endDate },
        },
      },
      include: {
        session: {
          select: {
            id: true,
            date: true,
            attendanceType: { select: { id: true, name: true, category: true } },
          },
        },
      },
      orderBy: { session: { date: "asc" } },
    });

    const total = marks.length;
    const present = marks.filter((m) => m.status === "present").length;
    const absent = marks.filter((m) => m.status === "absent").length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return {
      enrollmentId,
      month,
      year,
      stats: { total, present, absent, percentage },
      marks: marks.map((m) => ({
        date: m.session.date,
        status: m.status,
        attendanceType: m.session.attendanceType?.name || null,
        remarks: m.remarks,
      })),
    };
  }
}

export default new AttendanceService();