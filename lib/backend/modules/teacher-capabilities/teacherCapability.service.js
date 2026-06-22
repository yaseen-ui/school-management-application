import { prisma } from "../../lib/prisma.js";

function mapCapabilityIn(data = {}, tenantId) {
  const out = { tenantId };

  if (data.teacherId !== undefined) out.teacherId = data.teacherId;
  if (data.subjectId !== undefined) out.subjectId = data.subjectId;
  if (data.courseId !== undefined) out.courseId = data.courseId || null;
  if (data.gradeId !== undefined) out.gradeId = data.gradeId || null;
  if (data.sectionId !== undefined) out.sectionId = data.sectionId || null;
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
    sectionId: row.sectionId,
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
    section: row.section
      ? {
          id: row.section.id,
          sectionName: row.section.sectionName,
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

    // Verify section if provided
    if (data.sectionId) {
      const section = await prisma.section.findFirst({
        where: { id: data.sectionId, tenantId },
        select: { id: true },
      });
      if (!section) {
        throw new Error("Section not found.");
      }
    }

    // Check for duplicate capability
    const duplicate = await prisma.teacherCapability.findFirst({
      where: {
        tenantId,
        teacherId: data.teacherId,
        subjectId: data.subjectId,
        courseId: data.courseId || null,
        gradeId: data.gradeId || null,
        sectionId: data.sectionId || null,
      },
      select: { id: true },
    });
    if (duplicate) {
      throw new Error(
        "A capability for this teacher, subject, course, grade, and section combination already exists."
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
        section: { select: { id: true, sectionName: true } },
      },
    });

    return mapCapabilityOut(created);
  }

  async createBulk(data, tenantId) {
    // Validate required fields
    if (!data?.teacherId) {
      throw new Error("teacherId is required.");
    }
    if (!data?.courses || !Array.isArray(data.courses) || data.courses.length === 0) {
      throw new Error("At least one course is required.");
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

    // Collect all unique IDs for batch validation
    const courseIds = data.courses.map((c) => c.courseId);
    const gradeIds = data.courses.flatMap((c) => c.grades.map((g) => g.gradeId));
    const sectionIds = data.courses.flatMap((c) => c.grades.flatMap((g) => g.sections.map((s) => s.sectionId)));
    const subjectIds = data.courses.flatMap((c) =>
      c.grades.flatMap((g) => g.sections.flatMap((s) => s.subjects.map((sub) => sub.subjectId)))
    );

    // Verify all courses exist
    const existingCourses = await prisma.course.findMany({
      where: { id: { in: courseIds }, tenantId },
      select: { id: true },
    });
    const existingCourseIds = new Set(existingCourses.map((c) => c.id));
    const missingCourse = courseIds.find((id) => !existingCourseIds.has(id));
    if (missingCourse) {
      throw new Error(`Course not found: ${missingCourse}`);
    }

    // Verify all grades exist
    if (gradeIds.length > 0) {
      const existingGrades = await prisma.grade.findMany({
        where: { id: { in: gradeIds }, tenantId },
        select: { id: true },
      });
      const existingGradeIds = new Set(existingGrades.map((g) => g.id));
      const missingGrade = gradeIds.find((id) => !existingGradeIds.has(id));
      if (missingGrade) {
        throw new Error(`Grade not found: ${missingGrade}`);
      }
    }

    // Verify all sections exist
    if (sectionIds.length > 0) {
      const existingSections = await prisma.section.findMany({
        where: { id: { in: sectionIds }, tenantId },
        select: { id: true },
      });
      const existingSectionIds = new Set(existingSections.map((s) => s.id));
      const missingSection = sectionIds.find((id) => !existingSectionIds.has(id));
      if (missingSection) {
        throw new Error(`Section not found: ${missingSection}`);
      }
    }

    // Verify all subjects exist
    if (subjectIds.length > 0) {
      const existingSubjects = await prisma.subject.findMany({
        where: { id: { in: subjectIds }, tenantId },
        select: { id: true },
      });
      const existingSubjectIds = new Set(existingSubjects.map((s) => s.id));
      const missingSubject = subjectIds.find((id) => !existingSubjectIds.has(id));
      if (missingSubject) {
        throw new Error(`Subject not found: ${missingSubject}`);
      }
    }

    // Build capability records
    const recordsToCreate = [];

    for (const course of data.courses) {
      for (const grade of course.grades) {
        for (const section of grade.sections) {
          for (const subject of section.subjects) {
            // Check for duplicate
            const duplicate = await prisma.teacherCapability.findFirst({
              where: {
                tenantId,
                teacherId: data.teacherId,
                subjectId: subject.subjectId,
                courseId: course.courseId,
                gradeId: grade.gradeId,
                sectionId: section.sectionId,
              },
              select: { id: true },
            });
            if (duplicate) {
              throw new Error(
                `A capability for this teacher, subject, course, grade, and section combination already exists for subject ${subject.subjectId}.`
              );
            }

            recordsToCreate.push({
              tenantId,
              teacherId: data.teacherId,
              subjectId: subject.subjectId,
              courseId: course.courseId,
              gradeId: grade.gradeId,
              sectionId: section.sectionId,
              expertiseLevel: subject.expertiseLevel || "intermediate",
              isPrimary: subject.isPrimary || false,
              priorityScore: subject.priorityScore || 50,
              canBeClassTeacher: subject.canBeClassTeacher || false,
              remarks: subject.remarks || null,
            });
          }
        }
      }
    }

    if (recordsToCreate.length === 0) {
      throw new Error("No capability records to create. Please configure at least one subject.");
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
            section: { select: { id: true, sectionName: true } },
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
        section: { select: { id: true, sectionName: true } },
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
    if (filters.sectionId) where.sectionId = filters.sectionId;
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
        section: { select: { id: true, sectionName: true } },
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
    const newSectionId = data.sectionId !== undefined ? data.sectionId : existing.sectionId;

    const duplicate = await prisma.teacherCapability.findFirst({
      where: {
        tenantId,
        teacherId: newTeacherId,
        subjectId: newSubjectId,
        courseId: newCourseId || null,
        gradeId: newGradeId || null,
        sectionId: newSectionId || null,
        id: { not: id },
      },
      select: { id: true },
    });
    if (duplicate) {
      throw new Error(
        "A capability for this teacher, subject, course, grade, and section combination already exists."
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
