// src/modules/subjects/subjects.service.js  (Prisma version)
import { prisma } from "../../lib/prisma.js";

// map incoming camelCase -> prisma fields
const mapIn = (data = {}, tenantId) => {
  const out = {
    tenantId,
    subjectName: data.subjectName ?? data.subject_name,
    courseId: data.courseId ?? data.course_id,
    isCommon: data.isCommon ?? data.is_common,
  };
  Object.keys(out).forEach((k) => out[k] === undefined && delete out[k]);
  return out;
};

// map prisma row -> outgoing camelCase
const mapOut = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    subjectName: row.subjectName,
    courseId: row.courseId,
    isCommon: row.isCommon,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
};

class SubjectsService {
  async createSubject(data, tenantId) {
    const created = await prisma.subject.create({
      data: mapIn(data, tenantId),
    });
    return mapOut(created);
  }

  async getSubjects(tenantId, courseId) {
    const where = { tenantId };
    if (courseId) where.courseId = courseId;

    const rows = await prisma.subject.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return rows.map(mapOut);
  }

  async getSubjectById(id, tenantId) {
    const row = await prisma.subject.findFirst({
      where: { id, tenantId },
    });
    if (!row) throw new Error("Subject not found");
    return mapOut(row);
  }

  async getSubjectsByCourse(courseId, tenantId) {
    const rows = await prisma.subject.findMany({
      where: { courseId, tenantId },
      orderBy: { createdAt: "desc" },
    });
    if (!rows || rows.length === 0) {
      throw new Error("No subjects found for this course");
    }
    return rows.map(mapOut);
  }

  async updateSubject(id, data, tenantId) {
    const existing = await prisma.subject.findFirst({
      where: { id, tenantId },
    });
    if (!existing) throw new Error("Subject not found");

    await prisma.subject.update({
      where: { id },
      data: mapIn(data, tenantId), // only mapped fields are sent
    });

    const updated = await prisma.subject.findFirst({
      where: { id, tenantId },
    });
    return mapOut(updated);
  }

  async deleteSubject(id, tenantId) {
    const existing = await prisma.subject.findFirst({
      where: { id, tenantId },
    });
    if (!existing) throw new Error("Subject not found");

    await prisma.subject.delete({ where: { id } });
    return mapOut(existing); // return deleted row (parity with your old service)
  }

  async getCommonSubjects(tenantId) {
    const rows = await prisma.subject.findMany({
      where: { tenantId, isCommon: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(mapOut);
  }
}

export default new SubjectsService();
