import { prisma } from "../../lib/prisma.js";

function mapCapabilityIn(data = {}, tenantId) {
  const out = { tenantId };

  if (data.teacherId !== undefined) out.teacherId = data.teacherId;
  if (data.subjectId !== undefined) out.subjectId = data.subjectId;
  if (data.courseId !== undefined) out.courseId = data.courseId || null;
  if (data.gradeId !== undefined) out.gradeId = data.gradeId || null;
  if (data.expertiseLevel !== undefined) out.expertiseLevel = data.expertiseLevel;
  if (data.isPrimary !== undefined) out.isPrimary = data.isPrimary;
  if (data.priorityScore !== undefined) out.priorityScore = data.priorityScore;
  if (data.canBeClassTeacher !== undefined) out.canBeClassTeacher = data.canBeClassTeacher;
  if (data.remarks !== undefined) out.remarks = data.remarks;

  return out;
}

function mapCapabilityOut(row) {
  if (!row) return null;

  return {
    id: row.id,
    tenantId: row.tenantId,
    teacherId: row.teacherId,
    subjectId: row.subjectId,
    courseId: row.courseId,
    gradeId: row.gradeId,
    expertiseLevel: row.expertiseLevel,
    isPrimary: row.isPrimary,
    priorityScore: row.priorityScore,
    canBeClassTeacher: row.canBeClassTeacher,
    remarks: row.remarks,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    teacher: row.teacher
      ? {
          id: row.teacher.id,
          fullName: row.teacher.fullName,
          employeeCode: row.teacher.employeeCode,
        }
      : null,
    subject: row.subject
      ? {
          id: row.subject.id,
          subjectName: row.subject.subjectName,
        }
      : null,
    course: row.course
      ? {
          id: row.course.id,
          courseName: row.course.courseName,
        }
      : null,
    grade: row.grade
      ? {
          id: row.grade.id,
          gradeName: row.grade.gradeName,
        }
      : null,
  };
}

class TeacherCapabilityService {
  async create(data, tenantId) {
    // Validate required fields
    if (!data?.teacherId) {
      throw new Error("teacherId is required.");
    }
    if (!data?.subjectId) {
      throw new Error("subjectId is required.");
    }

    // Verify teacher exists and is active
    const teacher = await prisma.teacher.findFirst({
      where: { id: data.teacherId, tenantId },
      select: { id: true, status: true },
    });
    if (!teacher) {
      throw new Error("Teacher not found.");
    }
    if (teacher.status !== "active") {
      throw new Error("Cannot add capability for an inactive teacher.");
    }

    // Verify subject exists
    const subject = await prisma.subject.findFirst({
      where: { id: data.subjectId, tenantId },
      select: { id: true },
    });
    if (!subject) {
      throw new Error("Subject not found.");
    }

    // Verify course if provided
    if (data.courseId) {
      const course = await prisma.course.findFirst({
        where: { id: data.courseId, tenantId },
        select: { id: true },
      });
      if (!course) {
        throw new Error("Course not found.");
      }
    }

    // Verify grade if provided
    if (data.gradeId) {
      const grade = await prisma.grade.findFirst({
        where: { id: data.gradeId, tenantId },
        select: { id: true },
      });
      if (!grade) {
        throw new Error("Grade not found.");
      }
    }

    // Check for duplicate capability (service-level, not unique constraint)
    // A duplicate is: same teacher + subject + course (both null or same) + grade (both null or same)
    const duplicate = await prisma.teacherCapability.findFirst({
      where: {
        tenantId,
        teacherId: data.teacherId,
        subjectId: data.subjectId,
        courseId: data.courseId || null,
        gradeId: data.gradeId || null,
      },
      select: { id: true },
    });
    if (duplicate) {
      throw new Error(
        "A capability for this teacher, subject, course, and grade combination already exists."
      );
    }

    const toCreate = mapCapabilityIn(data, tenantId);
    const created = await prisma.teacherCapability.create({
      data: toCreate,
      include: {
        teacher: { select: { id: true, fullName: true, employeeCode: true } },
        subject: { select: { id: true, subjectName: true } },
        course: { select: { id: true, courseName: true } },
        grade: { select: { id: true, gradeName: true } },
      },
    });

    return mapCapabilityOut(created);
  }

  async createBulk(data, tenantId) {
    // Validate required fields
    if (!data?.teacherId) {
      throw new Error("teacherId is required.");
    }
    if (!data?.subjects || !Array.isArray(data.subjects) || data.subjects.length === 0) {
      throw new Error("At least one subject is required.");
    }

    // Verify teacher exists and is active
    const teacher = await prisma.teacher.findFirst({
      where: { id: data.teacherId, tenantId },
      select: { id: true, status: true },
    });
    if (!teacher) {
      throw new Error("Teacher not found.");
    }
    if (teacher.status !== "active") {
      throw new Error("Cannot add capability for an inactive teacher.");
    }

    // Verify course if provided
    if (data.courseId) {
      const course = await prisma.course.findFirst({
        where: { id: data.courseId, tenantId },
        select: { id: true },
      });
      if (!course) {
        throw new Error("Course not found.");
      }
    }

    // Verify grades if provided
    if (data.gradeIds && Array.isArray(data.gradeIds) && data.gradeIds.length > 0) {
      const gradeCount = await prisma.grade.count({
        where: { id: { in: data.gradeIds }, tenantId },
      });
      if (gradeCount !== data.gradeIds.length) {
        throw new Error("One or more grades not found.");
      }
    }

    // Verify all subjects exist
    const subjectIds = data.subjects.map((s) => s.subjectId);
    const existingSubjects = await prisma.subject.findMany({
      where: { id: { in: subjectIds }, tenantId },
      select: { id: true },
    });
    const existingSubjectIds = new Set(existingSubjects.map((s) => s.id));
    const missingSubject = subjectIds.find((id) => !existingSubjectIds.has(id));
    if (missingSubject) {
      throw new Error(`Subject not found: ${missingSubject}`);
    }

    // Build capability records
    const gradeIds = data.gradeIds || [];
    const recordsToCreate = [];

    for (const subject of data.subjects) {
      // If multiple grades selected, create one record per grade
      // If no grades selected, create one record with gradeId = null
      const gradeList = gradeIds.length > 0 ? gradeIds : [null];

      for (const gradeId of gradeList) {
        // Check for duplicate
        const duplicate = await prisma.teacherCapability.findFirst({
          where: {
            tenantId,
            teacherId: data.teacherId,
            subjectId: subject.subjectId,
            courseId: data.courseId || null,
            gradeId: gradeId || null,
          },
          select: { id: true },
        });
        if (duplicate) {
          throw new Error(
            `A capability for this teacher, subject, course, and grade combination already exists for subject ${subject.subjectId}.`
          );
        }

        recordsToCreate.push({
          tenantId,
          teacherId: data.teacherId,
          subjectId: subject.subjectId,
          courseId: data.courseId || null,
          gradeId: gradeId || null,
          expertiseLevel: subject.expertiseLevel || "intermediate",
          isPrimary: subject.isPrimary || false,
          priorityScore: subject.priorityScore || 50,
          canBeClassTeacher: subject.canBeClassTeacher || false,
          remarks: subject.remarks || null,
        });
      }
    }

    // Create all records in a single transaction
    const created = await prisma.$transaction(
      recordsToCreate.map((record) =>
        prisma.teacherCapability.create({
          data: record,
          include: {
            teacher: { select: { id: true, fullName: true, employeeCode: true } },
            subject: { select: { id: true, subjectName: true } },
            course: { select: { id: true, courseName: true } },
            grade: { select: { id: true, gradeName: true } },
          },
        })
      )
    );

    return created.map(mapCapabilityOut);
  }

  async getById(id, tenantId) {
    const row = await prisma.teacherCapability.findFirst({
      where: { id, tenantId },
      include: {
        teacher: { select: { id: true, fullName: true, employeeCode: true } },
        subject: { select: { id: true, subjectName: true } },
        course: { select: { id: true, courseName: true } },
        grade: { select: { id: true, gradeName: true } },
      },
    });
    return mapCapabilityOut(row);
  }

  async getAll(tenantId, filters = {}) {
    const where = { tenantId };

    if (filters.teacherId) where.teacherId = filters.teacherId;
    if (filters.subjectId) where.subjectId = filters.subjectId;
    if (filters.courseId) where.courseId = filters.courseId;
    if (filters.gradeId) where.gradeId = filters.gradeId;
    if (filters.expertiseLevel) where.expertiseLevel = filters.expertiseLevel;
    if (filters.canBeClassTeacher !== undefined) {
      where.canBeClassTeacher = filters.canBeClassTeacher === "true" || filters.canBeClassTeacher === true;
    }

    const rows = await prisma.teacherCapability.findMany({
      where,
      include: {
        teacher: { select: { id: true, fullName: true, employeeCode: true } },
        subject: { select: { id: true, subjectName: true } },
        course: { select: { id: true, courseName: true } },
        grade: { select: { id: true, gradeName: true } },
      },
      orderBy: [
        { isPrimary: "desc" },
        { priorityScore: "desc" },
        { createdAt: "desc" },
      ],
    });

    return rows.map(mapCapabilityOut);
  }

  async update(id, data, tenantId) {
    const existing = await prisma.teacherCapability.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return null;

    // If changing teacherId, verify new teacher exists
    if (data.teacherId && data.teacherId !== existing.teacherId) {
      const teacher = await prisma.teacher.findFirst({
        where: { id: data.teacherId, tenantId },
        select: { id: true, status: true },
      });
      if (!teacher) throw new Error("Teacher not found.");
      if (teacher.status !== "active") {
        throw new Error("Cannot assign capability to an inactive teacher.");
      }
    }

    // If changing subjectId, verify new subject exists
    if (data.subjectId && data.subjectId !== existing.subjectId) {
      const subject = await prisma.subject.findFirst({
        where: { id: data.subjectId, tenantId },
        select: { id: true },
      });
      if (!subject) throw new Error("Subject not found.");
    }

    // Check for duplicate if relevant fields changed
    const newTeacherId = data.teacherId || existing.teacherId;
    const newSubjectId = data.subjectId || existing.subjectId;
    const newCourseId = data.courseId !== undefined ? data.courseId : existing.courseId;
    const newGradeId = data.gradeId !== undefined ? data.gradeId : existing.gradeId;

    const duplicate = await prisma.teacherCapability.findFirst({
      where: {
        tenantId,
        teacherId: newTeacherId,
        subjectId: newSubjectId,
        courseId: newCourseId || null,
        gradeId: newGradeId || null,
        id: { not: id },
      },
      select: { id: true },
    });
    if (duplicate) {
      throw new Error(
        "A capability for this teacher, subject, course, and grade combination already exists."
      );
    }

    const toUpdate = mapCapabilityIn(data, tenantId);
    delete toUpdate.tenantId;

    // Remove undefined keys
    Object.keys(toUpdate).forEach((k) => toUpdate[k] === undefined && delete toUpdate[k]);

    await prisma.teacherCapability.update({
      where: { id },
      data: toUpdate,
    });

    return this.getById(id, tenantId);
  }

  async delete(id, tenantId) {
    const existing = await prisma.teacherCapability.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return null;

    await prisma.teacherCapability.delete({
      where: { id },
    });

    return mapCapabilityOut(existing);
  }
}

export default new TeacherCapabilityService();
