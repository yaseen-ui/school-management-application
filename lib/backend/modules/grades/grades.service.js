import { prisma } from "../../lib/prisma.js";

const gradeInclude = { course: { select: { courseName: true } } };

class GradesService {
  async createGrade(data, tenantId) {
    const { courseId, gradeName } = data || {};

    if (!courseId) {
      throw new Error("courseId is required to create a grade.");
    }

    const duplicate = await prisma.grade.findFirst({
      where: { tenantId, courseId, gradeName },
    });
    if (duplicate) {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: { courseName: true },
      });
      throw new Error(
        `Grade with the name '${gradeName}' already exists for the course '${course ? course.courseName : "Unknown Course"}'.`
      );
    }

    return prisma.grade.create({
      data: { tenantId, courseId, gradeName },
      include: gradeInclude,
    });
  }

  async getGrades(tenantId, courseId) {
    const where = { tenantId };
    if (courseId) where.courseId = courseId;

    return prisma.grade.findMany({
      where,
      include: gradeInclude,
      orderBy: [{ createdAt: "desc" }],
    });
  }

  async updateGrade(gradeId, data, tenantId) {
    const existing = await prisma.grade.findFirst({
      where: { id: gradeId, tenantId },
    });
    if (!existing) throw new Error("Grade not found or unauthorized");

    const { gradeName } = data || {};
    if (gradeName && gradeName !== existing.gradeName) {
      const dup = await prisma.grade.findFirst({
        where: {
          tenantId,
          courseId: existing.courseId,
          gradeName,
          NOT: { id: gradeId },
        },
      });
      if (dup) {
        throw new Error("Grade with the same name already exists for this course.");
      }
    }

    const updates = {};
    if (gradeName !== undefined) updates.gradeName = gradeName;

    await prisma.grade.update({
      where: { id: gradeId },
      data: updates,
    });

    return prisma.grade.findFirst({
      where: { id: gradeId, tenantId },
      include: gradeInclude,
    });
  }

  async deleteGrade(gradeId, tenantId) {
    const existing = await prisma.grade.findFirst({
      where: { id: gradeId, tenantId },
    });
    if (!existing) throw new Error("Grade not found or unauthorized");

    await prisma.grade.delete({ where: { id: gradeId } });
    return { success: true };
  }

  async getGradeById(gradeId, tenantId) {
    const grade = await prisma.grade.findFirst({
      where: { id: gradeId, tenantId },
      include: gradeInclude,
    });
    if (!grade) throw new Error("Grade not found or unauthorized");
    return grade;
  }
}

export default new GradesService();
