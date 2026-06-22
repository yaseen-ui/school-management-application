import { prisma } from "../../lib/prisma.js";

function mapSectionSubjectOut(row) {
  if (!row) return null;

  return {
    id: row.id,
    tenantId: row.tenantId,
    sectionId: row.sectionId,
    subjectId: row.subjectId,
    isElective: row.isElective,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    section: row.section
      ? {
          id: row.section.id,
          sectionName: row.section.sectionName,
          grade: row.section.grade
            ? { id: row.section.grade.id, gradeName: row.section.grade.gradeName }
            : null,
        }
      : null,
    subject: row.subject
      ? {
          id: row.subject.id,
          subjectName: row.subject.subjectName,
        }
      : null,
  };
}

class SectionSubjectService {
  async create(data, tenantId) {
    if (!data?.sectionId) {
      throw new Error("sectionId is required.");
    }

    // Support both single subjectId and multiple subjectIds
    const subjectIds = data.subjectIds || (data.subjectId ? [data.subjectId] : []);

    if (subjectIds.length === 0) {
      throw new Error("At least one subjectId is required.");
    }

    // Verify section exists
    const section = await prisma.section.findFirst({
      where: { id: data.sectionId, tenantId },
      select: { id: true },
    });
    if (!section) {
      throw new Error("Section not found.");
    }

    // Verify all subjects exist
    const subjects = await prisma.subject.findMany({
      where: { id: { in: subjectIds }, tenantId },
      select: { id: true },
    });
    if (subjects.length !== subjectIds.length) {
      throw new Error("One or more subjects not found.");
    }

    // Check for existing duplicates
    const existing = await prisma.sectionSubject.findMany({
      where: {
        tenantId,
        sectionId: data.sectionId,
        subjectId: { in: subjectIds },
      },
      select: { subjectId: true },
    });
    const existingSubjectIds = new Set(existing.map((e) => e.subjectId));
    const newSubjectIds = subjectIds.filter((id) => !existingSubjectIds.has(id));

    if (newSubjectIds.length === 0) {
      throw new Error("All selected subjects are already assigned to this section.");
    }

    // Create all section subjects in a transaction
    const created = await prisma.$transaction(
      newSubjectIds.map((subjectId) =>
        prisma.sectionSubject.create({
          data: {
            tenantId,
            sectionId: data.sectionId,
            subjectId,
            isElective: data.isElective || false,
          },
          include: {
            section: {
              include: {
                grade: { select: { id: true, gradeName: true } },
              },
            },
            subject: { select: { id: true, subjectName: true } },
          },
        })
      )
    );

    return created.map(mapSectionSubjectOut);
  }

  async getById(id, tenantId) {
    const row = await prisma.sectionSubject.findFirst({
      where: { id, tenantId },
      include: {
        section: {
          include: {
            grade: { select: { id: true, gradeName: true } },
          },
        },
        subject: { select: { id: true, subjectName: true } },
      },
    });
    return mapSectionSubjectOut(row);
  }

  async getAll(tenantId, filters = {}) {
    const where = { tenantId };

    if (filters.sectionId) where.sectionId = filters.sectionId;
    if (filters.subjectId) where.subjectId = filters.subjectId;
    if (filters.isElective !== undefined) {
      where.isElective = filters.isElective === "true" || filters.isElective === true;
    }

    // Filter by gradeId through section relation
    if (filters.gradeId) {
      where.section = { gradeId: filters.gradeId };
    }

    // Filter by courseId through section -> grade relation
    if (filters.courseId) {
      where.section = {
        ...(where.section || {}),
        grade: { courseId: filters.courseId },
      };
    }

    const rows = await prisma.sectionSubject.findMany({
      where,
      include: {
        section: {
          include: {
            grade: { select: { id: true, gradeName: true } },
          },
        },
        subject: { select: { id: true, subjectName: true } },
      },
      orderBy: [{ createdAt: "desc" }],
    });

    return rows.map(mapSectionSubjectOut);
  }

  async update(id, data, tenantId) {
    const existing = await prisma.sectionSubject.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return null;

    // If changing subjectId, verify new subject exists
    if (data.subjectId && data.subjectId !== existing.subjectId) {
      const subject = await prisma.subject.findFirst({
        where: { id: data.subjectId, tenantId },
        select: { id: true },
      });
      if (!subject) throw new Error("Subject not found.");
    }

    // Check for duplicate if sectionId or subjectId changed
    const newSectionId = data.sectionId || existing.sectionId;
    const newSubjectId = data.subjectId || existing.subjectId;

    if (newSectionId !== existing.sectionId || newSubjectId !== existing.subjectId) {
      const duplicate = await prisma.sectionSubject.findFirst({
        where: {
          tenantId,
          sectionId: newSectionId,
          subjectId: newSubjectId,
          id: { not: id },
        },
        select: { id: true },
      });
      if (duplicate) {
        throw new Error("This subject is already assigned to this section.");
      }
    }

    const toUpdate = {};
    if (data.isElective !== undefined) toUpdate.isElective = data.isElective;
    if (data.sectionId !== undefined) toUpdate.sectionId = data.sectionId;
    if (data.subjectId !== undefined) toUpdate.subjectId = data.subjectId;

    await prisma.sectionSubject.update({
      where: { id },
      data: toUpdate,
    });

    return this.getById(id, tenantId);
  }

  async delete(id, tenantId) {
    const existing = await prisma.sectionSubject.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return null;

    await prisma.sectionSubject.delete({
      where: { id },
    });

    return mapSectionSubjectOut(existing);
  }
}

export default new SectionSubjectService();
