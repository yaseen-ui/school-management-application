import { prisma } from "../../lib/prisma.js";

function mapAvailabilityIn(data = {}, tenantId) {
  const out = { tenantId };

  if (data.teacherId !== undefined) out.teacherId = data.teacherId;
  if (data.dayOfWeek !== undefined) out.dayOfWeek = data.dayOfWeek;
  if (data.startTime !== undefined) out.startTime = data.startTime;
  if (data.endTime !== undefined) out.endTime = data.endTime;
  if (data.isAvailable !== undefined) out.isAvailable = data.isAvailable;

  return out;
}

function mapAvailabilityOut(row) {
  if (!row) return null;

  return {
    id: row.id,
    tenantId: row.tenantId,
    teacherId: row.teacherId,
    dayOfWeek: row.dayOfWeek,
    startTime: row.startTime,
    endTime: row.endTime,
    isAvailable: row.isAvailable,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    teacher: row.teacher
      ? {
          id: row.teacher.id,
          fullName: row.teacher.fullName,
          employeeCode: row.teacher.employeeCode,
        }
      : null,
  };
}

class TeacherAvailabilityService {
  async getByTeacher(teacherId, tenantId) {
    const rows = await prisma.teacherAvailability.findMany({
      where: { teacherId, tenantId },
      include: {
        teacher: { select: { id: true, fullName: true, employeeCode: true } },
      },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    return rows.map(mapAvailabilityOut);
  }

  async upsertBulk(teacherId, slots, tenantId) {
    // Validate teacher exists
    const teacher = await prisma.teacher.findFirst({
      where: { id: teacherId, tenantId },
      select: { id: true },
    });
    if (!teacher) {
      throw new Error("Teacher not found.");
    }

    // Validate each slot
    for (const slot of slots) {
      if (slot.dayOfWeek === undefined) throw new Error("dayOfWeek is required for each slot.");
      if (slot.startTime === undefined) throw new Error("startTime is required for each slot.");
      if (slot.endTime === undefined) throw new Error("endTime is required for each slot.");
      if (slot.startTime >= slot.endTime) {
        throw new Error("startTime must be before endTime.");
      }
    }

    // Replace all slots for this teacher in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Delete all existing slots for this teacher
      await tx.teacherAvailability.deleteMany({
        where: { teacherId, tenantId },
      });

      // Create new slots
      const created = [];
      for (const slot of slots) {
        const record = await tx.teacherAvailability.create({
          data: {
            tenantId,
            teacherId,
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isAvailable: slot.isAvailable !== undefined ? slot.isAvailable : true,
          },
          include: {
            teacher: { select: { id: true, fullName: true, employeeCode: true } },
          },
        });
        created.push(record);
      }

      return created;
    });

    return result.map(mapAvailabilityOut);
  }

  async getAll(tenantId, filters = {}) {
    const where = { tenantId };

    if (filters.teacherId) where.teacherId = filters.teacherId;
    if (filters.dayOfWeek) where.dayOfWeek = filters.dayOfWeek;
    if (filters.isAvailable !== undefined) {
      where.isAvailable = filters.isAvailable === "true" || filters.isAvailable === true;
    }

    const rows = await prisma.teacherAvailability.findMany({
      where,
      include: {
        teacher: { select: { id: true, fullName: true, employeeCode: true } },
      },
      orderBy: [{ teacherId: "asc" }, { dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    return rows.map(mapAvailabilityOut);
  }

  async delete(id, tenantId) {
    const existing = await prisma.teacherAvailability.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return null;

    await prisma.teacherAvailability.delete({
      where: { id },
    });

    return mapAvailabilityOut(existing);
  }
}

export default new TeacherAvailabilityService();
