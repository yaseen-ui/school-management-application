import { prisma } from "../../lib/prisma.js";

const examInclude = {
  academicYear: { select: { id: true, name: true } },
  gradingScale: { select: { id: true, name: true } },
  targetGrades: {
    include: {
      grade: { select: { id: true, gradeName: true } },
    },
  },
  targetSections: {
    include: {
      section: {
        select: { id: true, sectionName: true, gradeId: true },
      },
    },
  },
  _count: {
    select: { schedules: true },
  },
};

const scheduleInclude = {
  exam: { select: { id: true, name: true, examType: true } },
  section: {
    select: {
      id: true,
      sectionName: true,
      grade: { select: { id: true, gradeName: true } },
    },
  },
  papers: {
    include: {
      sectionSubject: {
        include: {
          subject: { select: { id: true, subjectName: true } },
        },
      },
      inCharge: { select: { id: true, fullName: true, employeeCode: true } },
    },
    orderBy: { examDate: "asc" },
  },
};

const paperInclude = {
  schedule: {
    select: {
      id: true,
      name: true,
      sectionId: true,
      section: { select: { id: true, sectionName: true } },
    },
  },
  sectionSubject: {
    include: {
      subject: { select: { id: true, subjectName: true } },
    },
  },
  inCharge: { select: { id: true, fullName: true, employeeCode: true } },
  _count: { select: { marks: true } },
};

/**
 * Convert "HH:MM" string to minutes from midnight (Int)
 * e.g., "22:15" -> 1335, "09:30" -> 570
 * If already a number, returns as-is.
 */
function convertToMinutes(timeStr) {
  if (typeof timeStr === "number") return timeStr;
  if (!timeStr || typeof timeStr !== "string") return null;
  const parts = timeStr.split(":");
  if (parts.length !== 2) return null;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return null;
  return hours * 60 + minutes;
}

class ExamService {
  // ─── Exam CRUD (Admin Flow) ───────────────────────────────────────────────

  async createExam(data, tenantId) {
    const {
      academicYearId,
      name,
      description,
      examType,
      startDate,
      endDate,
      gradingScaleId,
      isCommon,
      targetCourseIds,
      targetAudienceRows,
      targetGradeIds,
      targetSectionIds,
    } = data || {};

    if (!academicYearId || !name || !examType || !startDate || !endDate) {
      throw new Error(
        "Missing required fields: academicYearId, name, examType, startDate, endDate"
      );
    }

    // Check for duplicate exam name within the same academic year
    const duplicate = await prisma.exam.findFirst({
      where: { tenantId, academicYearId, name },
      select: { id: true },
    });
    if (duplicate) {
      throw new Error(
        `An exam with the name '${name}' already exists for this academic year.`
      );
    }

    // Resolve target grades and sections
    let resolvedGradeIds = [];
    let resolvedSectionIds = [];

    if (isCommon && targetCourseIds?.length) {
      // Common mode: resolve all grades under selected courses, all sections under those grades
      const grades = await prisma.grade.findMany({
        where: { tenantId, courseId: { in: targetCourseIds } },
        select: { id: true },
      });
      resolvedGradeIds = grades.map((g) => g.id);

      const sections = await prisma.section.findMany({
        where: { tenantId, gradeId: { in: resolvedGradeIds } },
        select: { id: true },
      });
      resolvedSectionIds = sections.map((s) => s.id);
    } else if (targetAudienceRows?.length) {
      // Table mode: resolve from the row definitions
      const gradeIds = targetAudienceRows.map((r) => r.gradeId);
      const sectionIds = targetAudienceRows.flatMap((r) => r.sectionIds);
      resolvedGradeIds = [...new Set(gradeIds)];
      resolvedSectionIds = [...new Set(sectionIds)];
    } else {
      // Fallback to direct grade/section IDs (backward compatibility)
      resolvedGradeIds = targetGradeIds || [];
      resolvedSectionIds = targetSectionIds || [];
    }

    const exam = await prisma.exam.create({
      data: {
        tenantId,
        academicYearId,
        name,
        description,
        examType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        gradingScaleId: gradingScaleId || null,
        source: "admin",
      },
    });

    // Create target grades and sections separately (nested create doesn't work
    // with composite unique constraint relations in Prisma)
    if (resolvedGradeIds.length > 0) {
      await prisma.examTargetGrade.createMany({
        data: resolvedGradeIds.map((gradeId) => ({
          tenantId,
          examId: exam.id,
          gradeId,
        })),
      });
    }

    if (resolvedSectionIds.length > 0) {
      await prisma.examTargetSection.createMany({
        data: resolvedSectionIds.map((sectionId) => ({
          tenantId,
          examId: exam.id,
          sectionId,
        })),
      });
    }

    return this.getExamById(exam.id, tenantId);
  }

  async getExams(tenantId, academicYearId, examType) {
    const where = { tenantId };
    if (academicYearId) where.academicYearId = academicYearId;
    if (examType) where.examType = examType;

    return prisma.exam.findMany({
      where,
      include: examInclude,
      orderBy: [{ createdAt: "desc" }],
    });
  }

  async getExamById(examId, tenantId) {
    const exam = await prisma.exam.findFirst({
      where: { id: examId, tenantId },
      include: examInclude,
    });

    if (!exam) {
      throw new Error("Exam not found or unauthorized");
    }

    return exam;
  }

  async updateExam(examId, data, tenantId) {
    const existing = await prisma.exam.findFirst({
      where: { id: examId, tenantId },
      select: { id: true, name: true, academicYearId: true },
    });
    if (!existing) throw new Error("Exam not found or unauthorized");

    const {
      name,
      description,
      examType,
      startDate,
      endDate,
      status,
      gradingScaleId,
      isCommon,
      targetCourseIds,
      targetAudienceRows,
      targetGradeIds,
      targetSectionIds,
    } = data || {};

    // Check duplicate name if name changed
    if (name && name !== existing.name) {
      const dup = await prisma.exam.findFirst({
        where: {
          tenantId,
          academicYearId: existing.academicYearId,
          name,
          NOT: { id: examId },
        },
        select: { id: true },
      });
      if (dup) {
        throw new Error(
          `An exam with the name '${name}' already exists for this academic year.`
        );
      }
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (examType !== undefined) updates.examType = examType;
    if (startDate !== undefined) updates.startDate = new Date(startDate);
    if (endDate !== undefined) updates.endDate = new Date(endDate);
    if (status !== undefined) updates.status = status;
    if (gradingScaleId !== undefined)
      updates.gradingScaleId = gradingScaleId || null;

    await prisma.exam.update({
      where: { id: examId },
      data: updates,
    });

    // Resolve target grades and sections if audience fields are provided
    if (
      isCommon !== undefined ||
      targetCourseIds !== undefined ||
      targetAudienceRows !== undefined ||
      targetGradeIds !== undefined ||
      targetSectionIds !== undefined
    ) {
      let resolvedGradeIds = [];
      let resolvedSectionIds = [];

      if (isCommon && targetCourseIds?.length) {
        const grades = await prisma.grade.findMany({
          where: { tenantId, courseId: { in: targetCourseIds } },
          select: { id: true },
        });
        resolvedGradeIds = grades.map((g) => g.id);

        const sections = await prisma.section.findMany({
          where: { tenantId, gradeId: { in: resolvedGradeIds } },
          select: { id: true },
        });
        resolvedSectionIds = sections.map((s) => s.id);
      } else if (targetAudienceRows?.length) {
        const gradeIds = targetAudienceRows.map((r) => r.gradeId);
        const sectionIds = targetAudienceRows.flatMap((r) => r.sectionIds);
        resolvedGradeIds = [...new Set(gradeIds)];
        resolvedSectionIds = [...new Set(sectionIds)];
      } else {
        resolvedGradeIds = targetGradeIds || [];
        resolvedSectionIds = targetSectionIds || [];
      }

      // Update target grades
      await prisma.examTargetGrade.deleteMany({
        where: { examId, tenantId },
      });
      if (resolvedGradeIds.length > 0) {
        await prisma.examTargetGrade.createMany({
          data: resolvedGradeIds.map((gradeId) => ({
            tenantId,
            examId,
            gradeId,
          })),
        });
      }

      // Update target sections
      await prisma.examTargetSection.deleteMany({
        where: { examId, tenantId },
      });
      if (resolvedSectionIds.length > 0) {
        await prisma.examTargetSection.createMany({
          data: resolvedSectionIds.map((sectionId) => ({
            tenantId,
            examId,
            sectionId,
          })),
        });
      }
    }

    return this.getExamById(examId, tenantId);
  }

  async deleteExam(examId, tenantId) {
    const existing = await prisma.exam.findFirst({
      where: { id: examId, tenantId },
      select: { id: true },
    });
    if (!existing) throw new Error("Exam not found or unauthorized");

    await prisma.exam.delete({ where: { id: examId } });
    return { success: true };
  }

  // ─── Exam Schedule CRUD (Faculty Flow) ────────────────────────────────────

  async createSchedule(data, tenantId) {
    const {
      examId,
      sectionId,
      name,
      description,
      startDate,
      endDate,
      papers,
    } = data || {};

    if (!sectionId || !name || !startDate || !endDate) {
      throw new Error(
        "Missing required fields: sectionId, name, startDate, endDate"
      );
    }

    // If examId is provided, verify it exists and belongs to tenant
    if (examId) {
      const exam = await prisma.exam.findFirst({
        where: { id: examId, tenantId },
        select: { id: true },
      });
      if (!exam) throw new Error("Referenced exam not found or unauthorized");
    }

    const schedule = await prisma.examSchedule.create({
      data: {
        tenantId,
        examId: examId || null,
        sectionId,
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: "pending",
        papers: papers?.length
          ? {
              create: papers.map((paper) => ({
                sectionSubjectId: paper.sectionSubjectId,
                examDate: new Date(paper.examDate),
                startTime: convertToMinutes(paper.startTime),
                endTime: convertToMinutes(paper.endTime),
                durationMinutes: paper.durationMinutes || null,
                room: paper.room || null,
                inChargeId: paper.inChargeId || null,
                maxMarks: paper.maxMarks || 100,
                passMarks: paper.passMarks || 35,
              })),
            }
          : undefined,
      },
    });

    return this.getScheduleById(schedule.id, tenantId);
  }

  async getSchedules(tenantId, examId, sectionId, status) {
    const where = { tenantId };
    if (examId) where.examId = examId;
    if (sectionId) where.sectionId = sectionId;
    if (status) where.status = status;

    return prisma.examSchedule.findMany({
      where,
      include: scheduleInclude,
      orderBy: [{ endDate: "desc" }, { createdAt: "desc" }],
    });
  }

  async getScheduleById(scheduleId, tenantId) {
    const schedule = await prisma.examSchedule.findFirst({
      where: { id: scheduleId, tenantId },
      include: scheduleInclude,
    });

    if (!schedule) {
      throw new Error("Schedule not found or unauthorized");
    }

    return schedule;
  }

  async updateSchedule(scheduleId, data, tenantId) {
    const existing = await prisma.examSchedule.findFirst({
      where: { id: scheduleId, tenantId },
      select: { id: true },
    });
    if (!existing) throw new Error("Schedule not found or unauthorized");

    const { name, description, startDate, endDate, status } = data || {};

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (startDate !== undefined) updates.startDate = new Date(startDate);
    if (endDate !== undefined) updates.endDate = new Date(endDate);
    if (status !== undefined) updates.status = status;

    await prisma.examSchedule.update({
      where: { id: scheduleId },
      data: updates,
    });

    return this.getScheduleById(scheduleId, tenantId);
  }

  async deleteSchedule(scheduleId, tenantId) {
    const existing = await prisma.examSchedule.findFirst({
      where: { id: scheduleId, tenantId },
      select: { id: true },
    });
    if (!existing) throw new Error("Schedule not found or unauthorized");

    await prisma.examSchedule.delete({ where: { id: scheduleId } });
    return { success: true };
  }

  // ─── Exam Schedule Papers (Subject Rows) ──────────────────────────────────

  async upsertPapers(scheduleId, papers, tenantId) {
    // Verify schedule exists
    const schedule = await prisma.examSchedule.findFirst({
      where: { id: scheduleId, tenantId },
      select: { id: true },
    });
    if (!schedule) throw new Error("Schedule not found or unauthorized");

    // Delete existing papers for this schedule and recreate
    await prisma.examSchedulePaper.deleteMany({
      where: { scheduleId, tenantId },
    });

    if (papers?.length > 0) {
      await prisma.examSchedulePaper.createMany({
        data: papers.map((paper) => ({
          tenantId,
          scheduleId,
          sectionSubjectId: paper.sectionSubjectId,
          examDate: new Date(paper.examDate),
          startTime: convertToMinutes(paper.startTime),
          endTime: convertToMinutes(paper.endTime),
          durationMinutes: paper.durationMinutes || null,
          room: paper.room || null,
          inChargeId: paper.inChargeId || null,
          maxMarks: paper.maxMarks || 100,
          passMarks: paper.passMarks || 35,
        })),
      });
    }

    return this.getScheduleById(scheduleId, tenantId);
  }

  async getPapers(scheduleId, tenantId) {
    const schedule = await prisma.examSchedule.findFirst({
      where: { id: scheduleId, tenantId },
      select: { id: true },
    });
    if (!schedule) throw new Error("Schedule not found or unauthorized");

    return prisma.examSchedulePaper.findMany({
      where: { scheduleId, tenantId },
      include: paperInclude,
      orderBy: { examDate: "asc" },
    });
  }

  async getPaperById(paperId, tenantId) {
    const paper = await prisma.examSchedulePaper.findFirst({
      where: { id: paperId, tenantId },
      include: paperInclude,
    });

    if (!paper) {
      throw new Error("Paper not found or unauthorized");
    }

    return paper;
  }

  async updatePaper(paperId, data, tenantId) {
    const existing = await prisma.examSchedulePaper.findFirst({
      where: { id: paperId, tenantId },
      select: { id: true },
    });
    if (!existing) throw new Error("Paper not found or unauthorized");

    const {
      examDate,
      startTime,
      endTime,
      durationMinutes,
      room,
      inChargeId,
      maxMarks,
      passMarks,
    } = data || {};

    const updates = {};
    if (examDate !== undefined) updates.examDate = new Date(examDate);
    if (startTime !== undefined) updates.startTime = convertToMinutes(startTime);
    if (endTime !== undefined) updates.endTime = convertToMinutes(endTime);
    if (durationMinutes !== undefined)
      updates.durationMinutes = durationMinutes;
    if (room !== undefined) updates.room = room || null;
    if (inChargeId !== undefined) updates.inChargeId = inChargeId || null;
    if (maxMarks !== undefined) updates.maxMarks = maxMarks;
    if (passMarks !== undefined) updates.passMarks = passMarks;

    await prisma.examSchedulePaper.update({
      where: { id: paperId },
      data: updates,
    });

    return this.getPaperById(paperId, tenantId);
  }

  async deletePaper(paperId, tenantId) {
    const existing = await prisma.examSchedulePaper.findFirst({
      where: { id: paperId, tenantId },
      select: { id: true },
    });
    if (!existing) throw new Error("Paper not found or unauthorized");

    await prisma.examSchedulePaper.delete({ where: { id: paperId } });
    return { success: true };
  }

  // ─── Exam Marks ───────────────────────────────────────────────────────────

  async upsertMarks(paperId, marks, tenantId) {
    // Verify paper exists
    const paper = await prisma.examSchedulePaper.findFirst({
      where: { id: paperId, tenantId },
      select: { id: true },
    });
    if (!paper) throw new Error("Paper not found or unauthorized");

    // Delete existing marks for this paper and recreate
    await prisma.examMark.deleteMany({
      where: { examPaperId: paperId, tenantId },
    });

    if (marks?.length > 0) {
      await prisma.examMark.createMany({
        data: marks.map((mark) => {
          // Auto-calculate marksObtained from breakup sum if breakup is provided
          let marksObtained = mark.marksObtained;
          if (mark.breakup && marksObtained === undefined) {
            const topics = mark.breakup.topics || [];
            marksObtained = topics.reduce((sum, t) => sum + (t.marks || 0), 0);
          }

          return {
            tenantId,
            examPaperId: paperId,
            enrollmentId: mark.enrollmentId,
            marksObtained: marksObtained ?? null,
            isAbsent: mark.isAbsent || false,
            breakup: mark.breakup || undefined,
            remarks: mark.remarks || null,
            gradeLabel: mark.gradeLabel || null,
          };
        }),
      });
    }

    return prisma.examMark.findMany({
      where: { examPaperId: paperId, tenantId },
      include: {
        enrollment: {
          select: {
            id: true,
            rollNumber: true,
            student: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async getMarks(paperId, tenantId) {
    const paper = await prisma.examSchedulePaper.findFirst({
      where: { id: paperId, tenantId },
      select: { id: true },
    });
    if (!paper) throw new Error("Paper not found or unauthorized");

    return prisma.examMark.findMany({
      where: { examPaperId: paperId, tenantId },
      include: {
        enrollment: {
          select: {
            id: true,
            rollNumber: true,
            student: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async getStudentMarks(enrollmentId, tenantId) {
    return prisma.examMark.findMany({
      where: { enrollmentId, tenantId },
      include: {
        examPaper: {
          include: {
            schedule: {
              select: {
                id: true,
                name: true,
                exam: { select: { id: true, name: true, examType: true } },
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
  }

  // ─── Marks Entry Grid (Schedule-level) ─────────────────────────────────────

  /**
   * Get the marks entry grid for a schedule.
   * Returns:
   * - papers: The subject columns (papers) for this schedule
   * - students: Array of students with their marks for each paper
   */
  async getScheduleMarksGrid(scheduleId, tenantId) {
    // Verify schedule exists
    const schedule = await prisma.examSchedule.findFirst({
      where: { id: scheduleId, tenantId },
      select: {
        id: true,
        name: true,
        sectionId: true,
        section: { select: { sectionName: true } },
      },
    });
    if (!schedule) throw new Error("Schedule not found or unauthorized");

    // Get all papers (subjects) for this schedule
    const papers = await prisma.examSchedulePaper.findMany({
      where: { scheduleId, tenantId },
      include: {
        sectionSubject: {
          include: {
            subject: { select: { id: true, subjectName: true } },
          },
        },
      },
      orderBy: { examDate: "asc" },
    });

    // Get all enrolled students for this section
    const enrollments = await prisma.studentEnrollment.findMany({
      where: {
        tenantId,
        sectionId: schedule.sectionId,
        status: "active",
      },
      select: {
        id: true,
        rollNumber: true,
        student: {
          select: { id: true, firstName: true, lastName: true, admissionNumber: true },
        },
      },
      orderBy: { rollNumber: "asc" },
    });

    // Get existing marks for all papers in this schedule
    const paperIds = papers.map((p) => p.id);
    const existingMarks = await prisma.examMark.findMany({
      where: {
        tenantId,
        examPaperId: { in: paperIds },
        enrollmentId: { in: enrollments.map((e) => e.id) },
      },
      select: {
        id: true,
        examPaperId: true,
        enrollmentId: true,
        marksObtained: true,
        isAbsent: true,
        breakup: true,
        remarks: true,
        gradeLabel: true,
      },
    });

    // Build a lookup map: enrollmentId -> paperId -> mark
    const marksMap = {};
    for (const mark of existingMarks) {
      if (!marksMap[mark.enrollmentId]) marksMap[mark.enrollmentId] = {};
      marksMap[mark.enrollmentId][mark.examPaperId] = mark;
    }

    // Build the grid
    const students = enrollments.map((enrollment) => {
      const studentMarks = [];
      for (const paper of papers) {
        const mark = marksMap[enrollment.id]?.[paper.id] || null;
        studentMarks.push({
          paperId: paper.id,
          marksObtained: mark?.marksObtained ?? null,
          isAbsent: mark?.isAbsent || false,
          breakup: mark?.breakup || null,
          remarks: mark?.remarks || null,
        });
      }
      return {
        enrollmentId: enrollment.id,
        rollNumber: enrollment.rollNumber,
        studentName: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
        marks: studentMarks,
      };
    });

    return {
      schedule: {
        id: schedule.id,
        name: schedule.name,
        sectionName: schedule.section?.sectionName || "",
      },
      papers: papers.map((p) => ({
        paperId: p.id,
        sectionSubjectId: p.sectionSubjectId,
        subjectName: p.sectionSubject.subject.subjectName,
        maxMarks: p.maxMarks,
        passMarks: p.passMarks,
      })),
      students,
    };
  }

  /**
   * Upsert marks for a single student across all papers in a schedule.
   * marksData is an array of { paperId, marksObtained, isAbsent, breakup, remarks }
   */
  async upsertStudentScheduleMarks(scheduleId, enrollmentId, marksData, tenantId) {
    // Verify schedule exists
    const schedule = await prisma.examSchedule.findFirst({
      where: { id: scheduleId, tenantId },
      select: { id: true },
    });
    if (!schedule) throw new Error("Schedule not found or unauthorized");

    // Verify enrollment exists and belongs to tenant
    const enrollment = await prisma.studentEnrollment.findFirst({
      where: { id: enrollmentId, tenantId },
      select: { id: true },
    });
    if (!enrollment) throw new Error("Enrollment not found or unauthorized");

    // Upsert each mark
    const results = [];
    for (const mark of marksData) {
      // Auto-calculate marksObtained from breakup sum if breakup is provided
      let marksObtained = mark.marksObtained;
      if (mark.breakup && marksObtained === undefined) {
        const topics = mark.breakup.topics || [];
        marksObtained = topics.reduce((sum, t) => sum + (t.marks || 0), 0);
      }

      const upserted = await prisma.examMark.upsert({
        where: {
          uniqueMarkPerStudentPerPaper: {
            tenantId,
            examPaperId: mark.paperId,
            enrollmentId,
          },
        },
        update: {
          marksObtained: marksObtained ?? null,
          isAbsent: mark.isAbsent || false,
          breakup: mark.breakup || undefined,
          remarks: mark.remarks || null,
          gradeLabel: mark.gradeLabel || null,
        },
        create: {
          tenantId,
          examPaperId: mark.paperId,
          enrollmentId,
          marksObtained: marksObtained ?? null,
          isAbsent: mark.isAbsent || false,
          breakup: mark.breakup || undefined,
          remarks: mark.remarks || null,
          gradeLabel: mark.gradeLabel || null,
        },
      });
      results.push(upserted);
    }

    return results;
  }

  // ─── Results / Consolidated View ───────────────────────────────────────────

  /**
   * Get consolidated exam results for a schedule.
   * Returns students with subject-wise marks, total, percentage, rank, pass/fail.
   */
  async getScheduleResults(scheduleId, tenantId) {
    // Verify schedule exists with section info
    const schedule = await prisma.examSchedule.findFirst({
      where: { id: scheduleId, tenantId },
      select: {
        id: true,
        name: true,
        sectionId: true,
        section: { select: { sectionName: true } },
        exam: { select: { id: true, name: true, examType: true } },
      },
    });
    if (!schedule) throw new Error("Schedule not found or unauthorized");

    // Get all papers (subjects) for this schedule
    const papers = await prisma.examSchedulePaper.findMany({
      where: { scheduleId, tenantId },
      include: {
        sectionSubject: {
          include: {
            subject: { select: { id: true, subjectName: true } },
          },
        },
      },
      orderBy: { examDate: "asc" },
    });

    // Get all enrolled students
    const enrollments = await prisma.studentEnrollment.findMany({
      where: {
        tenantId,
        sectionId: schedule.sectionId,
        status: "active",
      },
      select: {
        id: true,
        rollNumber: true,
        student: {
          select: { id: true, firstName: true, lastName: true, admissionNumber: true },
        },
      },
      orderBy: { rollNumber: "asc" },
    });

    // Get all marks for these papers and students
    const paperIds = papers.map((p) => p.id);
    const enrollmentIds = enrollments.map((e) => e.id);
    const allMarks = await prisma.examMark.findMany({
      where: {
        tenantId,
        examPaperId: { in: paperIds },
        enrollmentId: { in: enrollmentIds },
      },
      select: {
        examPaperId: true,
        enrollmentId: true,
        marksObtained: true,
        isAbsent: true,
        breakup: true,
      },
    });

    // Build marks lookup: enrollmentId -> paperId -> mark
    const marksMap = {};
    for (const mark of allMarks) {
      if (!marksMap[mark.enrollmentId]) marksMap[mark.enrollmentId] = {};
      marksMap[mark.enrollmentId][mark.examPaperId] = mark;
    }

    // Build student results
    const studentResults = enrollments.map((enrollment) => {
      let totalMarks = 0;
      let totalMaxMarks = 0;
      let hasFailed = false;
      const subjectMarks = [];

      for (const paper of papers) {
        const mark = marksMap[enrollment.id]?.[paper.id];
        const obtained = mark?.marksObtained ?? null;
        const isAbsent = mark?.isAbsent || false;

        subjectMarks.push({
          paperId: paper.id,
          subjectName: paper.sectionSubject.subject.subjectName,
          maxMarks: paper.maxMarks,
          passMarks: paper.passMarks,
          marksObtained: obtained,
          isAbsent,
        });

        if (obtained !== null && !isAbsent) {
          totalMarks += obtained;
          totalMaxMarks += paper.maxMarks;
          if (obtained < paper.passMarks) {
            hasFailed = true;
          }
        } else if (isAbsent) {
          hasFailed = true;
        } else {
          // No marks entered yet — don't count in total
        }
      }

      const percentage = totalMaxMarks > 0
        ? Math.round((totalMarks / totalMaxMarks) * 100 * 100) / 100
        : null;

      return {
        enrollmentId: enrollment.id,
        rollNumber: enrollment.rollNumber,
        studentName: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
        subjectMarks,
        totalMarks,
        totalMaxMarks,
        percentage,
        hasFailed,
        isPassed: !hasFailed && totalMaxMarks > 0,
      };
    });

    // Sort by total marks descending for ranking
    const sorted = [...studentResults].sort((a, b) => b.totalMarks - a.totalMarks);

    // Assign ranks (handle ties: same total = same rank)
    let currentRank = 0;
    let previousTotal = null;
    const rankedResults = sorted.map((result, index) => {
      if (result.totalMarks !== previousTotal) {
        currentRank = index + 1;
        previousTotal = result.totalMarks;
      }
      return { ...result, rank: currentRank };
    });

    return {
      schedule: {
        id: schedule.id,
        name: schedule.name,
        sectionName: schedule.section?.sectionName || "",
      },
      papers: papers.map((p) => ({
        paperId: p.id,
        sectionSubjectId: p.sectionSubjectId,
        subjectName: p.sectionSubject.subject.subjectName,
        maxMarks: p.maxMarks,
        passMarks: p.passMarks,
      })),
      results: rankedResults,
    };
  }
}

export default new ExamService();
