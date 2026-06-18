import { prisma } from "../../lib/prisma.js";

function timeToMinutes(value) {
  if (typeof value === "number") return value;
  if (typeof value === "string" && /^\d{1,2}:\d{2}$/.test(value)) {
    const [h, m] = value.split(":").map(Number);
    return h * 60 + m;
  }
  return value;
}

function mapPeriodIn(data = {}, tenantId) {
  const out = { tenantId };

  if (data.structureId !== undefined) out.structureId = data.structureId;
  if (data.name !== undefined) out.name = data.name;
  if (data.type !== undefined) out.type = data.type;
  if (data.startTime !== undefined) out.startTime = timeToMinutes(data.startTime);
  if (data.endTime !== undefined) out.endTime = timeToMinutes(data.endTime);
  if (data.sortOrder !== undefined) out.sortOrder = data.sortOrder;
  // Accept sequenceOrder as alias for sortOrder
  if (data.sequenceOrder !== undefined && data.sortOrder === undefined) out.sortOrder = data.sequenceOrder;

  return out;
}


function mapPeriodOut(row) {
  if (!row) return null;

  return {
    id: row.id,
    tenantId: row.tenantId,
    structureId: row.structureId,
    name: row.name,
    type: row.type,
    startTime: row.startTime,
    endTime: row.endTime,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,

    structure: row.structure
      ? {
          id: row.structure.id,
          name: row.structure.name,
        }
      : null,
  };
}

function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

class TimetablePeriodService {
  async create(data, tenantId) {
    if (!data?.structureId) {
      throw new Error("structureId is required.");
    }
    if (!data?.name) {
      throw new Error("Period name is required.");
    }
    if (data.startTime === undefined || data.startTime === null) {
      throw new Error("Start time is required.");
    }
    if (data.endTime === undefined || data.endTime === null) {
      throw new Error("End time is required.");
    }

    // Verify structure exists
    const structure = await prisma.timetableStructure.findFirst({
      where: { id: data.structureId, tenantId },
      select: { id: true },
    });
    if (!structure) {
      throw new Error("Timetable structure not found.");
    }

    const toCreate = mapPeriodIn(data, tenantId);
    const created = await prisma.timetablePeriod.create({
      data: toCreate,
      include: {
        structure: { select: { id: true, name: true } },
      },
    });

    return mapPeriodOut(created);
  }

  async getById(id, tenantId) {
    const row = await prisma.timetablePeriod.findFirst({
      where: { id, tenantId },
      include: {
        structure: { select: { id: true, name: true } },
      },
    });
    return mapPeriodOut(row);
  }

  async getAll(tenantId, filters = {}) {
    const where = { tenantId };

    if (filters.structureId) {
      where.structureId = filters.structureId;
    }

    const rows = await prisma.timetablePeriod.findMany({
      where,
      include: {
        structure: { select: { id: true, name: true } },
      },
      orderBy: [{ sortOrder: "asc" }, { startTime: "asc" }],
    });

    return rows.map(mapPeriodOut);
  }

  async update(id, data, tenantId) {
    const existing = await prisma.timetablePeriod.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return null;

    const toUpdate = mapPeriodIn(data, tenantId);
    delete toUpdate.tenantId;
    delete toUpdate.structureId; // Don't allow changing structure

    Object.keys(toUpdate).forEach((k) => toUpdate[k] === undefined && delete toUpdate[k]);

    await prisma.timetablePeriod.update({
      where: { id },
      data: toUpdate,
    });

    return this.getById(id, tenantId);
  }

  async delete(id, tenantId) {
    const existing = await prisma.timetablePeriod.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return null;

    // Check if any timetable entries reference this period
    const referenced = await prisma.timetableEntry.findFirst({
      where: { periodId: id, tenantId },
      select: { id: true },
    });
    if (referenced) {
      throw new Error(
        "Cannot delete this period as it is used in timetable entries. Remove the entries first."
      );
    }

    await prisma.timetablePeriod.delete({
      where: { id },
    });

    return mapPeriodOut(existing);
  }
}

export default new TimetablePeriodService();
