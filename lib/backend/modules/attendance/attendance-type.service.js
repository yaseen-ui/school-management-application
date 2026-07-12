import { prisma } from "../../lib/prisma.js";

class AttendanceTypeService {
  async create(data, tenantId) {
    if (!data?.name) throw new Error("Name is required.");
    if (!data?.category) throw new Error("Category is required.");
    if (!["shift", "period", "exam"].includes(data.category)) {
      throw new Error("Category must be one of: shift, period, exam.");
    }

    // Check uniqueness
    const existing = await prisma.attendanceType.findFirst({
      where: { tenantId, name: data.name },
    });
    if (existing) throw new Error("An attendance type with this name already exists.");

    const created = await prisma.attendanceType.create({
      data: {
        tenantId,
        name: data.name,
        category: data.category,
        sortOrder: data.sortOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    });

    return created;
  }

  async getAll(tenantId, filters = {}) {
    const where = { tenantId };
    if (filters.category) where.category = filters.category;
    if (filters.isActive !== undefined) where.isActive = filters.isActive === "true";

    const rows = await prisma.attendanceType.findMany({
      where,
      include: { _count: { select: { sessions: true } } },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return rows.map((r) => ({
      ...r,
      _count: r._count,
    }));
  }

  async getById(id, tenantId) {
    const row = await prisma.attendanceType.findFirst({
      where: { id, tenantId },
      include: { _count: { select: { sessions: true } } },
    });
    if (!row) return null;
    return { ...row, _count: row._count };
  }

  async update(id, data, tenantId) {
    const existing = await prisma.attendanceType.findFirst({ where: { id, tenantId } });
    if (!existing) return null;

    // Check name uniqueness (excluding self)
    if (data.name && data.name !== existing.name) {
      const dup = await prisma.attendanceType.findFirst({
        where: { tenantId, name: data.name, id: { not: id } },
      });
      if (dup) throw new Error("An attendance type with this name already exists.");
    }

    if (data.category && !["shift", "period", "exam"].includes(data.category)) {
      throw new Error("Category must be one of: shift, period, exam.");
    }

    const toUpdate = {};
    if (data.name !== undefined) toUpdate.name = data.name;
    if (data.category !== undefined) toUpdate.category = data.category;
    if (data.sortOrder !== undefined) toUpdate.sortOrder = data.sortOrder;
    if (data.isActive !== undefined) toUpdate.isActive = data.isActive;

    await prisma.attendanceType.update({ where: { id }, data: toUpdate });
    return this.getById(id, tenantId);
  }

  async delete(id, tenantId) {
    const existing = await prisma.attendanceType.findFirst({ where: { id, tenantId } });
    if (!existing) return null;

    // Check if any sessions reference this type
    const count = await prisma.attendanceSession.count({
      where: { tenantId, attendanceTypeId: id },
    });
    if (count > 0) {
      throw new Error(`Cannot delete: ${count} attendance session(s) are using this type.`);
    }

    await prisma.attendanceType.delete({ where: { id } });
    return existing;
  }
}

export default new AttendanceTypeService();