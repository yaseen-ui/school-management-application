import { prisma } from "../../lib/prisma.js";

function mapAssignmentIn(data = {}, tenantId) {
  const out = { tenantId };

  if (data.academicYearId !== undefined) out.academicYearId = data.academicYearId;
  if (data.teacherId !== undefined) out.teacherId = data.teacherId;
  if (data.sectionSubjectId !== undefined) out.sectionSubjectId = data.sectionSubjectId;
  if (data.role !== undefined) out.role = data.role;

  return out;
}

function mapAssignmentOut(row) {
  if (!row) return null;

  return {
    id: row.id,
    tenantId: row.tenantId,
    academicYearId: row.academicYearId,
    teacherId: row.teacherId,
    sectionSubjectId: row.sectionSubjectId,
    role: row.role,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    academicYear: row.academicYear
      ? {
          id: row.academicYear.id,
          name: row.academicYear.name,
          status: row.academicYear.status,
        }
      : null,
    teacher: row.teacher
      ? {
          id: row.teacher.id,
          fullName: row.teacher.fullName,
          employeeCode: row.teacher.employeeCode,
          email: row.teacher.email,
        }
      : null,
    sectionSubject: row.sectionSubject
      ? {
          id: row.sectionSubject.id,
          sectionId: row.sectionSubject.sectionId,
          subjectId: row.sectionSubject.subjectId,
          isElective: row.sectionSubject.isElective,
          section: row.sectionSubject.section
            ? {
                id: row.sectionSubject.section.id,
                sectionName: row.sectionSubject.section.sectionName,
                gradeId: row.sectionSubject.section.gradeId,
                grade: row.sectionSubject.section.grade
                  ? {
                      id: row.sectionSubject.section.grade.id,
                      gradeName: row.sectionSubject.section.grade.gradeName,
                      courseId: row.sectionSubject.section.grade.courseId,
                    }
                  : null,
              }
            : null,
          subject: row.sectionSubject.subject
            ? {
                id: row.sectionSubject.subject.id,
                subjectName: row.sectionSubject.subject.subjectName,
              }
            : null,
        }
      : null,
  };
}

class TeacherAssignmentService {
  async create(data, tenantId, options = {}) {
    const { overrideCapabilityCheck = false } = options;

    // Validate required fields
    if (!data?.academicYearId) {
      throw new Error("academicYearId is required.");
    }
    if (!data?.teacherId) {
      throw new Error("teacherId is required.");
    }
    if (!data?.sectionSubjectId) {
      throw new Error("sectionSubjectId is required.");
    }

    // 1. Validate teacher exists and is active
    const teacher = await prisma.teacher.findFirst({
      where: { id: data.teacherId, tenantId },
      select: { id: true, fullName: true, status: true, yearsOfExperience: true },
    });
    if (!teacher) {
      throw new Error("Teacher not found.");
    }
    if (teacher.status !== "active") {
      throw new Error("Cannot assign an inactive teacher.");
    }

    // 2. Validate academic year exists and is active
    const academicYear = await prisma.academicYear.findFirst({
      where: { id: data.academicYearId, tenantId },
      select: { id: true, name: true, status: true },
    });
    if (!academicYear) {
      throw new Error("Academic year not found.");
    }
    if (academicYear.status !== "active") {
      throw new Error("Cannot assign teachers to a non-active academic year.");
    }

    // 3. Validate sectionSubject exists
    const sectionSubject = await prisma.sectionSubject.findFirst({
      where: { id: data.sectionSubjectId, tenantId },
      include: {
        section: {
          include: {
            grade: { select: { id: true, gradeName: true, courseId: true } },
          },
        },
        subject: { select: { id: true, subjectName: true } },
      },
    });
    if (!sectionSubject) {
      throw new Error("Section subject mapping not found.");
    }

    // 4. Validate teacher capability (unless override flag is set)
    if (!overrideCapabilityCheck) {
      const section = sectionSubject.section;
      const subject = sectionSubject.subject;
      const grade = section.grade;

      // Find matching capabilities - ordered by specificity
      const capabilities = await prisma.teacherCapability.findMany({
        where: {
          tenantId,
          teacherId: data.teacherId,
          subjectId: subject.id,
        },
        orderBy: [
          // Most specific first: course + grade match, then course only, then grade only, then broad
          { courseId: "desc" },
          { gradeId: "desc" },
          { isPrimary: "desc" },
          { priorityScore: "desc" },
        ],
      });

      if (capabilities.length === 0) {
        throw new Error(
          `Teacher "${teacher.fullName}" is not eligible to teach "${subject.subjectName}". No matching capability found.`
        );
      }

      // Check if any capability matches the section's course and grade
      const hasMatchingCapability = capabilities.some((cap) => {
        // If capability has courseId, it must match section's grade.courseId
        if (cap.courseId && cap.courseId !== grade.courseId) return false;
        // If capability has gradeId, it must match section's gradeId
        if (cap.gradeId && cap.gradeId !== grade.id) return false;
        return true;
      });

      if (!hasMatchingCapability) {
        throw new Error(
          `Teacher "${teacher.fullName}" is not eligible to teach "${subject.subjectName}" for the selected section's course and grade.`
        );
      }

      // 5. If role is class_teacher, check canBeClassTeacher capability
      if (data.role === "class_teacher") {
        const hasClassTeacherCapability = capabilities.some(
          (cap) => cap.canBeClassTeacher
        );
        if (!hasClassTeacherCapability) {
          throw new Error(
            `Teacher "${teacher.fullName}" does not have class teacher capability for "${subject.subjectName}". Set canBeClassTeacher on their capability or use override.`
          );
        }
      }
    }

    // 6. Check for duplicate assignment (same teacher + sectionSubject + academicYear)
    const duplicate = await prisma.teacherAssignment.findFirst({
      where: {
        tenantId,
        academicYearId: data.academicYearId,
        teacherId: data.teacherId,
        sectionSubjectId: data.sectionSubjectId,
      },
      select: { id: true, role: true },
    });
    if (duplicate) {
      throw new Error(
        `Teacher is already assigned to this section subject with role "${duplicate.role}" for this academic year.`
      );
    }

    // 7. Allow multiple teachers only if roles are different
    if (data.role) {
      const existingAssignments = await prisma.teacherAssignment.findMany({
        where: {
          tenantId,
          academicYearId: data.academicYearId,
          sectionSubjectId: data.sectionSubjectId,
        },
        select: { role: true },
      });

      const hasSameRole = existingAssignments.some(
        (a) => a.role === data.role
      );
      if (hasSameRole) {
        throw new Error(
          `A teacher with role "${data.role}" is already assigned to this section subject. Choose a different role or remove the existing assignment first.`
        );
      }
    }

    const toCreate = mapAssignmentIn(data, tenantId);
    const created = await prisma.teacherAssignment.create({
      data: toCreate,
      include: {
        academicYear: { select: { id: true, name: true, status: true } },
        teacher: {
          select: { id: true, fullName: true, employeeCode: true, email: true },
        },
        sectionSubject: {
          include: {
            section: {
              include: {
                grade: { select: { id: true, gradeName: true, courseId: true } },
              },
            },
            subject: { select: { id: true, subjectName: true } },
          },
        },
      },
    });

    return mapAssignmentOut(created);
  }

  async getById(id, tenantId) {
    const row = await prisma.teacherAssignment.findFirst({
      where: { id, tenantId },
      include: {
        academicYear: { select: { id: true, name: true, status: true } },
        teacher: {
          select: { id: true, fullName: true, employeeCode: true, email: true },
        },
        sectionSubject: {
          include: {
            section: {
              include: {
                grade: { select: { id: true, gradeName: true, courseId: true } },
              },
            },
            subject: { select: { id: true, subjectName: true } },
          },
        },
      },
    });
    return mapAssignmentOut(row);
  }

  async getAll(tenantId, filters = {}) {
    const where = { tenantId };

    if (filters.academicYearId) where.academicYearId = filters.academicYearId;
    if (filters.teacherId) where.teacherId = filters.teacherId;
    if (filters.sectionSubjectId) where.sectionSubjectId = filters.sectionSubjectId;
    if (filters.role) where.role = filters.role;

    const rows = await prisma.teacherAssignment.findMany({
      where,
      include: {
        academicYear: { select: { id: true, name: true, status: true } },
        teacher: {
          select: { id: true, fullName: true, employeeCode: true, email: true },
        },
        sectionSubject: {
          include: {
            section: {
              include: {
                grade: { select: { id: true, gradeName: true, courseId: true } },
              },
            },
            subject: { select: { id: true, subjectName: true } },
          },
        },
      },
      orderBy: [{ createdAt: "desc" }],
    });

    return rows.map(mapAssignmentOut);
  }

  async update(id, data, tenantId) {
    const existing = await prisma.teacherAssignment.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return null;

    // If role is changing, validate no conflict
    if (data.role && data.role !== existing.role) {
      const conflict = await prisma.teacherAssignment.findFirst({
        where: {
          tenantId,
          academicYearId: existing.academicYearId,
          sectionSubjectId: existing.sectionSubjectId,
          role: data.role,
          id: { not: id },
        },
        select: { id: true },
      });
      if (conflict) {
        throw new Error(
          `A teacher with role "${data.role}" is already assigned to this section subject.`
        );
      }
    }

    const toUpdate = mapAssignmentIn(data, tenantId);
    delete toUpdate.tenantId;

    // Remove undefined keys
    Object.keys(toUpdate).forEach((k) => toUpdate[k] === undefined && delete toUpdate[k]);

    await prisma.teacherAssignment.update({
      where: { id },
      data: toUpdate,
    });

    return this.getById(id, tenantId);
  }

  async delete(id, tenantId) {
    const existing = await prisma.teacherAssignment.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return null;

    // Check if there are timetable entries referencing this assignment
    const timetableEntries = await prisma.timetableEntry.findFirst({
      where: { teacherAssignmentId: id, tenantId },
      select: { id: true },
    });
    if (timetableEntries) {
      throw new Error(
        "Cannot delete this assignment as it has timetable entries. Remove the timetable entries first."
      );
    }

    // Check if there are attendance sessions referencing this assignment
    const attendanceSessions = await prisma.attendanceSession.findFirst({
      where: { teacherAssignmentId: id, tenantId },
      select: { id: true },
    });
    if (attendanceSessions) {
      throw new Error(
        "Cannot delete this assignment as it has attendance sessions. Remove the attendance sessions first."
      );
    }

    await prisma.teacherAssignment.delete({
      where: { id },
    });

    return mapAssignmentOut(existing);
  }
}

export default new TeacherAssignmentService();
