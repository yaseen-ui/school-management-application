import { prisma } from "../../lib/prisma.js";

const buildingInclude = {
  _count: {
    select: {
      floors: true,
    },
  },
};

class BuildingsService {
  async createBuilding(data, tenantId) {
    const { name, code, description } = data || {};

    if (!name) {
      throw new Error("Building name is required.");
    }

    const duplicate = await prisma.building.findFirst({
      where: { tenantId, name },
      select: { id: true },
    });
    if (duplicate) {
      throw new Error(`Building with the name '${name}' already exists.`);
    }

    const created = await prisma.building.create({
      data: { tenantId, name, code, description },
    });

    return prisma.building.findFirst({
      where: { id: created.id, tenantId },
      include: buildingInclude,
    });
  }

  async getBuildings(tenantId) {
    return prisma.building.findMany({
      where: { tenantId },
      include: {
        ...buildingInclude,
        floors: {
          include: {
            rooms: {
              orderBy: { roomNumber: "asc" },
            },
          },
          orderBy: { floorNumber: "asc" },
        },
      },
      orderBy: [{ createdAt: "desc" }],
    });
  }

  async getBuildingById(buildingId, tenantId) {
    const building = await prisma.building.findFirst({
      where: { id: buildingId, tenantId },
      include: {
        ...buildingInclude,
        floors: {
          include: {
            rooms: {
              orderBy: { roomNumber: "asc" },
            },
          },
          orderBy: { floorNumber: "asc" },
        },
      },
    });

    if (!building) {
      throw new Error("Building not found or unauthorized");
    }

    return building;
  }

  async updateBuilding(buildingId, data, tenantId) {
    const existing = await prisma.building.findFirst({
      where: { id: buildingId, tenantId },
      select: { id: true, name: true },
    });
    if (!existing) throw new Error("Building not found or unauthorized");

    const { name, code, description } = data || {};
    if (name && name !== existing.name) {
      const dup = await prisma.building.findFirst({
        where: {
          tenantId,
          name,
          NOT: { id: buildingId },
        },
        select: { id: true },
      });
      if (dup) {
        throw new Error(`Building with the name '${name}' already exists.`);
      }
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (code !== undefined) updates.code = code;
    if (description !== undefined) updates.description = description;

    await prisma.building.update({
      where: { id: buildingId },
      data: updates,
    });

    return prisma.building.findFirst({
      where: { id: buildingId, tenantId },
      include: buildingInclude,
    });
  }

  async deleteBuilding(buildingId, tenantId) {
    const existing = await prisma.building.findFirst({
      where: { id: buildingId, tenantId },
      select: { id: true },
    });
    if (!existing) throw new Error("Building not found or unauthorized");

    await prisma.building.delete({ where: { id: buildingId } });
    return { success: true };
  }
}

export default new BuildingsService();
