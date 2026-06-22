import { prisma } from "../../lib/prisma.js";

const floorInclude = {
  _count: {
    select: {
      rooms: true,
    },
  },
};

class FloorsService {
  async createFloor(data, tenantId) {
    const { buildingId, floorNumber, name } = data || {};

    if (!buildingId) {
      throw new Error("buildingId is required to create a floor.");
    }
    if (floorNumber === undefined || floorNumber === null) {
      throw new Error("floorNumber is required to create a floor.");
    }

    // Verify building exists
    const building = await prisma.building.findFirst({
      where: { id: buildingId, tenantId },
      select: { id: true },
    });
    if (!building) {
      throw new Error("Building not found or unauthorized.");
    }

    const duplicate = await prisma.floor.findFirst({
      where: { tenantId, buildingId, floorNumber },
      select: { id: true },
    });
    if (duplicate) {
      throw new Error(
        `Floor number ${floorNumber} already exists in this building.`
      );
    }

    const created = await prisma.floor.create({
      data: { tenantId, buildingId, floorNumber, name },
    });

    return prisma.floor.findFirst({
      where: { id: created.id, tenantId },
      include: floorInclude,
    });
  }

  async getFloors(tenantId, buildingId) {
    const where = { tenantId };
    if (buildingId) {
      where.buildingId = buildingId;
    }

    return prisma.floor.findMany({
      where,
      include: {
        ...floorInclude,
        rooms: {
          orderBy: { roomNumber: "asc" },
        },
      },
      orderBy: [{ floorNumber: "asc" }],
    });
  }

  async getFloorById(floorId, tenantId) {
    const floor = await prisma.floor.findFirst({
      where: { id: floorId, tenantId },
      include: {
        ...floorInclude,
        rooms: {
          orderBy: { roomNumber: "asc" },
        },
      },
    });

    if (!floor) {
      throw new Error("Floor not found or unauthorized");
    }

    return floor;
  }

  async updateFloor(floorId, data, tenantId) {
    const existing = await prisma.floor.findFirst({
      where: { id: floorId, tenantId },
      select: { id: true, floorNumber: true, buildingId: true },
    });
    if (!existing) throw new Error("Floor not found or unauthorized");

    const { floorNumber, name } = data || {};
    if (floorNumber !== undefined && floorNumber !== existing.floorNumber) {
      const dup = await prisma.floor.findFirst({
        where: {
          tenantId,
          buildingId: existing.buildingId,
          floorNumber,
          NOT: { id: floorId },
        },
        select: { id: true },
      });
      if (dup) {
        throw new Error(
          `Floor number ${floorNumber} already exists in this building.`
        );
      }
    }

    const updates = {};
    if (floorNumber !== undefined) updates.floorNumber = floorNumber;
    if (name !== undefined) updates.name = name;

    await prisma.floor.update({
      where: { id: floorId },
      data: updates,
    });

    return prisma.floor.findFirst({
      where: { id: floorId, tenantId },
      include: floorInclude,
    });
  }

  async deleteFloor(floorId, tenantId) {
    const existing = await prisma.floor.findFirst({
      where: { id: floorId, tenantId },
      select: { id: true },
    });
    if (!existing) throw new Error("Floor not found or unauthorized");

    await prisma.floor.delete({ where: { id: floorId } });
    return { success: true };
  }
}

export default new FloorsService();
