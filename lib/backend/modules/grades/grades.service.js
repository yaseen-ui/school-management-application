import { prisma } from "../../lib/prisma.js";

// ------ mappers: in <= out (camelCase) ------
const mapIn = (data = {}) => ({
  tenantId: data.tenantId,
  courseId: data.courseId,
  gradeName: data.gradeName,
});

const mapUpdateIn = (data = {}) => {
  const out = {
    gradeName: data.gradeName,
  };
  Object.keys(out).forEach((k) => out[k] === undefined && delete out[k]);
  return out;
};

const mapOut = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    courseId: row.courseId,
    gradeName: row.gradeName,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    courseName: row.course ? row.course.courseName : null,
  };
};

class GradesService {
  async createGrade(data, tenantId) {
    if (!data?.courseId) {
      throw new Error("courseId is required to create a grade.");
    }

    // Duplicate guard: (tenantId, courseId, gradeName)
    const duplicate = await prisma.grade.findFirst({
      where: {
        tenantId,
        courseId: data.courseId,
        gradeName: data.gradeName,
      },
    });
    if (duplicate) {
      const course = await prisma.course.findUnique({
        where: { id: data.courseId },
        select: { courseName: true },
      });
      throw new Error(
        `Grade with the name '${data.gradeName}' already exists for the course '${course ? course.courseName : "Unknown Course"}'.`
      );
    }

    const created = await prisma.grade.create({
      data: {
        ...mapIn(data),
        tenantId,
      },
      include: { course: { select: { courseName: true } } },
    });

    return mapOut(created);
  }

  async getGrades(tenantId, courseId) {
    const where = { tenantId };
    if (courseId) where.courseId = courseId;

    const grades = await prisma.grade.findMany({
      where,
      include: { course: { select: { courseName: true } } },
      orderBy: [{ createdAt: "desc" }],
    });

    return grades.map(mapOut);
  }

  async updateGrade(gradeId, data, tenantId) {
    const existing = await prisma.grade.findFirst({
      where: { id: gradeId, tenantId },
    });
    if (!existing) throw new Error("Grade not found or unauthorized");

    // If changing gradeName, ensure no duplicate on same course
    const nextName = data.gradeName;
    if (nextName && nextName !== existing.gradeName) {
      const dup = await prisma.grade.findFirst({
        where: {
          tenantId,
          courseId: existing.courseId,
          gradeName: nextName,
          NOT: { id: gradeId },
        },
      });
      if (dup) {
        throw new Error("Grade with the same name already exists for this course.");
      }
    }

    await prisma.grade.update({
      where: { id: gradeId },
      data: mapUpdateIn(data),
    });

    const updated = await prisma.grade.findFirst({
      where: { id: gradeId, tenantId },
      include: { course: { select: { courseName: true } } },
    });

    return mapOut(updated);
  }

  async deleteGrade(gradeId, tenantId) {
    const existing = await prisma.grade.findFirst({
      where: { id: gradeId, tenantId },
    });
    if (!existing) throw new Error("Grade not found or unauthorized");

    // ensure tenant guard
    await prisma.grade.delete({ where: { id: gradeId } });
    return { success: true };
  }

  async getGradeById(gradeId, tenantId) {
    const grade = await prisma.grade.findFirst({
      where: { id: gradeId, tenantId },
      include: { course: { select: { courseName: true } } },
    });
    if (!grade) throw new Error("Grade not found or unauthorized");
    return mapOut(grade);
  }
}

export default new GradesService();
