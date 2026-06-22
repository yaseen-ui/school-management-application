import { prisma } from "../../lib/prisma.js";

const sectionInclude = {
  grade: { select: { gradeName: true, courseId: true } },
  sectionSubjects: {
    include: {
      subject: true,
    },
  },
  room: {
    include: {
      floor: {
        include: {
          building: true,
        },
      },
    },
  },
};

class SectionsService {
  async createSection(data, tenantId) {
    const { gradeId, sectionName, roomId } = data || {};

    if (!gradeId) {
      throw new Error("gradeId is required to create a section.");
    }

    const duplicate = await prisma.section.findFirst({
      where: { tenantId, gradeId, sectionName },
      select: { id: true },
    });
    if (duplicate) {
      const grade = await prisma.grade.findUnique({
        where: { id: gradeId },
        select: { gradeName: true },
      });
      throw new Error(
        `Section with the name '${sectionName}' already exists for grade '${grade ? grade.gradeName : "Unknown Grade"}'.`
      );
    }

    const created = await prisma.section.create({
      data: { tenantId, gradeId, sectionName, roomId: roomId || null },
    });

    return prisma.section.findFirst({
      where: { id: created.id, tenantId },
      include: sectionInclude,
    });
  }

  async getSections(tenantId, gradeId, courseId) {
    const where = { tenantId };
    if (gradeId) {
      where.gradeId = gradeId;
    } else if (courseId) {
      where.grade = { courseId };
    }

    return prisma.section.findMany({
      where,
      include: sectionInclude,
      orderBy: [{ createdAt: "desc" }],
    });
  }

  async getSectionById(sectionId, tenantId) {
    const section = await prisma.section.findFirst({
      where: { id: sectionId, tenantId },
      include: sectionInclude,
    });

    if (!section) {
      throw new Error("Section not found or unauthorized");
    }

    return section;
  }

  async updateSection(sectionId, data, tenantId) {
    const existing = await prisma.section.findFirst({
      where: { id: sectionId, tenantId },
      select: { id: true, sectionName: true, gradeId: true },
    });
    if (!existing) throw new Error("Section not found or unauthorized");

    const { sectionName, roomId } = data || {};
    if (sectionName && sectionName !== existing.sectionName) {
      const dup = await prisma.section.findFirst({
        where: {
          tenantId,
          gradeId: existing.gradeId,
          sectionName,
          NOT: { id: sectionId },
        },
        select: { id: true },
      });
      if (dup) {
        throw new Error(
          `Section with the name '${sectionName}' already exists for this grade.`
        );
      }
    }

    const updates = {};
    if (sectionName !== undefined) updates.sectionName = sectionName;
    if (roomId !== undefined) updates.roomId = roomId || null;

    await prisma.section.update({
      where: { id: sectionId },
      data: updates,
    });

    return prisma.section.findFirst({
      where: { id: sectionId, tenantId },
      include: sectionInclude,
    });
  }

  async deleteSection(sectionId, tenantId) {
    const existing = await prisma.section.findFirst({
      where: { id: sectionId, tenantId },
      select: { id: true },
    });
    if (!existing) throw new Error("Section not found or unauthorized");

    await prisma.section.delete({ where: { id: sectionId } });
    return { success: true };
  }
}

export default new SectionsService();
