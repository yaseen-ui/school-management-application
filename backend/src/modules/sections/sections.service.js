import { prisma } from "../../lib/prisma.js";

// ---- mappers (camelCase) ----
const mapIn = (data = {}, tenantId) => {
  const out = {
    tenantId,
    gradeId: data.gradeId ?? data.grade_id,
    sectionName: data.sectionName ?? data.section_name,
  };
  Object.keys(out).forEach((k) => out[k] === undefined && delete out[k]);
  return out;
};

const mapUpdateIn = (data = {}) => {
  const out = {
    sectionName: data.sectionName ?? data.section_name,
  };
  Object.keys(out).forEach((k) => out[k] === undefined && delete out[k]);
  return out;
};

const mapOut = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    gradeId: row.gradeId,
    sectionName: row.sectionName,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    gradeName: row.grade ? row.grade.gradeName : null,
    subjects: row.sectionSubjects
      ? row.sectionSubjects.map((ss) => ({
          id: ss.subject.id,
          subjectName: ss.subject.subjectName,
          courseId: ss.subject.courseId,
          isCommon: ss.subject.isCommon,
          sectionSubjectId: ss.id,
          isElective: ss.isElective,
        }))
      : [],
  };
};

class SectionsService {
  async createSection(data, tenantId) {
    if (!data?.gradeId && !data?.grade_id) {
      throw new Error("gradeId is required to create a section.");
    }

    // Duplicate check within (tenant, grade, sectionName)
    const duplicate = await prisma.section.findFirst({
      where: {
        tenantId,
        gradeId: data.gradeId ?? data.grade_id,
        sectionName: data.sectionName ?? data.section_name,
      },
      select: { id: true },
    });
    if (duplicate) {
      const grade = await prisma.grade.findUnique({
        where: { id: data.gradeId ?? data.grade_id },
        select: { gradeName: true },
      });
      throw new Error(
        `Section with the name '${data.sectionName ?? data.section_name}' already exists for grade '${grade ? grade.gradeName : "Unknown Grade"}'.`
      );
    }

    const created = await prisma.section.create({
      data: mapIn(data, tenantId),
      include: { grade: { select: { gradeName: true } } },
    });

    // Create SectionSubject records if subjectIds are provided
    if (data.subjectIds && Array.isArray(data.subjectIds) && data.subjectIds.length > 0) {
      await prisma.sectionSubject.createMany({
        data: data.subjectIds.map((subjectId) => ({
          tenantId,
          sectionId: created.id,
          subjectId,
          isElective: false, // default value
        })),
      });
    }

    // Fetch the created section with subjects included
    const sectionWithSubjects = await prisma.section.findFirst({
      where: { id: created.id, tenantId },
      include: {
        grade: { select: { gradeName: true } },
        sectionSubjects: {
          include: { subject: true },
        },
      },
    });

    return mapOut(sectionWithSubjects);
  }

  async getSections(tenantId, gradeId) {
    const where = { tenantId };
    if (gradeId) where.gradeId = gradeId;

    const sections = await prisma.section.findMany({
      where,
      include: {
        grade: { select: { gradeName: true } },
        sectionSubjects: {
          include: { subject: true },
        },
      },
      orderBy: [{ createdAt: "desc" }],
    });

    return sections.map(mapOut);
  }

  async getSectionById(sectionId, tenantId) {
    const section = await prisma.section.findFirst({
      where: { id: sectionId, tenantId },
      include: { grade: { select: { gradeName: true } } },
    });

    if (!section) {
      throw new Error("Section not found or unauthorized");
    }

    return mapOut(section);
  }

  async updateSection(sectionId, data, tenantId) {
    const existing = await prisma.section.findFirst({
      where: { id: sectionId, tenantId },
      select: { id: true, sectionName: true, gradeId: true },
    });
    if (!existing) throw new Error("Section not found or unauthorized");

    const nextName = data.sectionName ?? data.section_name;
    if (nextName && nextName !== existing.sectionName) {
      const dup = await prisma.section.findFirst({
        where: {
          tenantId,
          gradeId: existing.gradeId,
          sectionName: nextName,
          NOT: { id: sectionId },
        },
        select: { id: true },
      });
      if (dup) {
        throw new Error(
          `Section with the name '${nextName}' already exists for this grade.`
        );
      }
    }

    await prisma.section.update({
      where: { id: sectionId },
      data: mapUpdateIn(data),
    });

    const updated = await prisma.section.findFirst({
      where: { id: sectionId, tenantId },
      include: { grade: { select: { gradeName: true } } },
    });

    return mapOut(updated);
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
