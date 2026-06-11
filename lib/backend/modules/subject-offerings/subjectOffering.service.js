import { prisma } from "../../lib/prisma.js";

function mapOfferingIn(data = {}, tenantId) {
  const out = { tenantId };

  if (data.subjectId !== undefined) out.subjectId = data.subjectId;
  if (data.courseId !== undefined) out.courseId = data.courseId || null;
  if (data.gradeId !== undefined) out.gradeId = data.gradeId || null;
  if (data.scope !== undefined) out.scope = data.scope;
  if (data.isElective !== undefined) out.isElective = data.isElective;
  if (data.weeklyPeriods !== undefined) out.weeklyPeriods = data.weeklyPeriods;
  if (data.status !== undefined) out.status = data.status;

  return out;
}

function mapOfferingOut(row) {
  if (!row) return null;

  return {
    id: row.id,
    tenantId: row.tenantId,
    subjectId: row.subjectId,
    courseId: row.courseId,
    gradeId: row.gradeId,
    scope: row.scope,
    isElective: row.isElective,
    weeklyPeriods: row.weeklyPeriods,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    subject: row.subject
      ? {
          id: row.subject.id,
          subjectName: row.subject.subjectName,
          isCommon: row.subject.isCommon,
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

class SubjectOfferingService {
  async create(data, tenantId) {
    if (!data?.subjectId) {
      throw new Error("subjectId is required.");
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

    // Auto-detect scope based on provided courseId/gradeId if not explicitly set
    let scope = data.scope;
    if (!scope) {
      if (data.courseId && data.gradeId) {
        scope = "course_grade";
      } else if (data.courseId && !data.gradeId) {
        scope = "course_all_grades";
      } else if (!data.courseId && data.gradeId) {
        scope = "grade_all_courses";
      } else {
        scope = "all_courses_all_grades";
      }
    }

    const toCreate = mapOfferingIn({ ...data, scope }, tenantId);
    const created = await prisma.subjectOffering.create({
      data: toCreate,
      include: {
        subject: { select: { id: true, subjectName: true, isCommon: true } },
        course: { select: { id: true, courseName: true } },
        grade: { select: { id: true, gradeName: true } },
      },
    });

    return mapOfferingOut(created);
  }

  async getById(id, tenantId) {
    const row = await prisma.subjectOffering.findFirst({
      where: { id, tenantId },
      include: {
        subject: { select: { id: true, subjectName: true, isCommon: true } },
        course: { select: { id: true, courseName: true } },
        grade: { select: { id: true, gradeName: true } },
      },
    });
    return mapOfferingOut(row);
  }

  async getAll(tenantId, filters = {}) {
    const where = { tenantId };

    if (filters.subjectId) where.subjectId = filters.subjectId;
    if (filters.courseId) where.courseId = filters.courseId;
    if (filters.gradeId) where.gradeId = filters.gradeId;
    if (filters.scope) where.scope = filters.scope;
    if (filters.isElective !== undefined) {
      where.isElective = filters.isElective === "true" || filters.isElective === true;
    }
    if (filters.status) where.status = filters.status;

    const rows = await prisma.subjectOffering.findMany({
      where,
      include: {
        subject: { select: { id: true, subjectName: true, isCommon: true } },
        course: { select: { id: true, courseName: true } },
        grade: { select: { id: true, gradeName: true } },
      },
      orderBy: [{ createdAt: "desc" }],
    });

    return rows.map(mapOfferingOut);
  }

  async update(id, data, tenantId) {
    const existing = await prisma.subjectOffering.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return null;

    const toUpdate = mapOfferingIn(data, tenantId);
    delete toUpdate.tenantId;

    // Remove undefined keys
    Object.keys(toUpdate).forEach((k) => toUpdate[k] === undefined && delete toUpdate[k]);

    await prisma.subjectOffering.update({
      where: { id },
      data: toUpdate,
    });

    return this.getById(id, tenantId);
  }

  async delete(id, tenantId) {
    const existing = await prisma.subjectOffering.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return null;

    // Check if any sectionSubjects reference this offering
    const referenced = await prisma.sectionSubject.findFirst({
      where: { subjectOfferingId: id, tenantId },
      select: { id: true },
    });
    if (referenced) {
      throw new Error(
        "Cannot delete this subject offering as it is referenced by one or more sections. Remove the section mappings first."
      );
    }

    await prisma.subjectOffering.delete({
      where: { id },
    });

    return mapOfferingOut(existing);
  }
}

export default new SubjectOfferingService();
