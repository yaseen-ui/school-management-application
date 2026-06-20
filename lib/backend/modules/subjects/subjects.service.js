import { prisma } from "../../lib/prisma.js";

class SubjectsService {
  async createSubject(data, tenantId) {
    const { subjectName, courseId, isCommon } = data || {};
    return prisma.subject.create({
      data: { tenantId, subjectName, courseId, isCommon },
    });
  }

  async getSubjects(tenantId, courseId) {
    const where = { tenantId };
    if (courseId) where.courseId = courseId;

    return prisma.subject.findMany({
      where,
      include: {
        course: {
          select: { courseName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getSubjectById(id, tenantId) {
    const row = await prisma.subject.findFirst({
      where: { id, tenantId },
      include: {
        course: {
          select: { courseName: true },
        },
      },
    });
    if (!row) throw new Error("Subject not found");
    return row;
  }

  async getSubjectsByCourse(courseId, tenantId) {
    const rows = await prisma.subject.findMany({
      where: { courseId, tenantId },
      include: {
        course: {
          select: { courseName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    if (!rows || rows.length === 0) {
      throw new Error("No subjects found for this course");
    }
    return rows;
  }

  async updateSubject(id, data, tenantId) {
    const existing = await prisma.subject.findFirst({
      where: { id, tenantId },
    });
    if (!existing) throw new Error("Subject not found");

    const { subjectName, courseId, isCommon } = data || {};
    const updates = { subjectName, courseId, isCommon };
    Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);

    await prisma.subject.update({
      where: { id },
      data: updates,
    });

    return prisma.subject.findFirst({
      where: { id, tenantId },
      include: {
        course: {
          select: { courseName: true },
        },
      },
    });
  }

  async deleteSubject(id, tenantId) {
    const existing = await prisma.subject.findFirst({
      where: { id, tenantId },
    });
    if (!existing) throw new Error("Subject not found");

    await prisma.subject.delete({ where: { id } });
    return existing;
  }

  async getCommonSubjects(tenantId) {
    return prisma.subject.findMany({
      where: { tenantId, isCommon: true },
      include: {
        course: {
          select: { courseName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

export default new SubjectsService();
