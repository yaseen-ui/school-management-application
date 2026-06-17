import { prisma } from "../../lib/prisma.js";

function mapStructureIn(data = {}, tenantId) {
  const out = { tenantId };

  if (data.name !== undefined) out.name = data.name;
  if (data.description !== undefined) out.description = data.description || null;

  return out;
}

function mapStructureOut(row) {
  if (!row) return null;

  return {
    id: row.id,
    tenantId: row.tenantId,
    name: row.name,
    description: row.description,
    periodCount: row._count?.periods ?? row.periods?.length ?? 0,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

class TimetableStructureService {
  async create(data, tenantId) {
    if (!data?.name) {
      throw new Error("Structure name is required.");
    }

    const toCreate = mapStructureIn(data, tenantId);
    const created = await prisma.timetableStructure.create({
      data: toCreate,
      include: {
        _count: { select: { periods: true } },
      },
    });

    return mapStructureOut(created);
  }

  async getById(id, tenantId) {
    const row = await prisma.timetableStructure.findFirst({
      where: { id, tenantId },
      include: {
        _count: { select: { periods: true } },
      },
    });
    return mapStructureOut(row);
  }

  async getAll(tenantId) {
    const rows = await prisma.timetableStructure.findMany({
      where: { tenantId },
      include: {
        _count: { select: { periods: true } },
      },
      orderBy: [{ createdAt: "desc" }],
    });

    return rows.map(mapStructureOut);
  }

  async update(id, data, tenantId) {
    const existing = await prisma.timetableStructure.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return null;

    const toUpdate = mapStructureIn(data, tenantId);
    delete toUpdate.tenantId;

    Object.keys(toUpdate).forEach((k) => toUpdate[k] === undefined && delete toUpdate[k]);

    await prisma.timetableStructure.update({
      where: { id },
      data: toUpdate,
    });

    return this.getById(id, tenantId);
  }

  async delete(id, tenantId) {
    const existing = await prisma.timetableStructure.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return null;

    // Check if any sections reference this structure
    const referenced = await prisma.section.findFirst({
      where: { structureId: id, tenantId },
      select: { id: true },
    });
    if (referenced) {
      throw new Error(
        "Cannot delete this timetable structure as it is assigned to one or more sections. Remove the section assignments first."
      );
    }

    await prisma.timetableStructure.delete({
      where: { id },
    });

    return mapStructureOut(existing);
  }
}

export default new TimetableStructureService();
