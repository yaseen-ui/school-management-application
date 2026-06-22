import { prisma } from "../../lib/prisma.js";

class RoomsService {
  async createRoom(data, tenantId) {
    const { floorId, roomNumber, roomName, roomType, roomCategory, capacity } =
      data || {};

    if (!floorId) {
      throw new Error("floorId is required to create a room.");
    }
    if (!roomNumber) {
      throw new Error("roomNumber is required to create a room.");
    }
    if (capacity === undefined || capacity === null) {
      throw new Error("capacity is required to create a room.");
    }

    // Verify floor exists
    const floor = await prisma.floor.findFirst({
      where: { id: floorId, tenantId },
      select: { id: true },
    });
    if (!floor) {
      throw new Error("Floor not found or unauthorized.");
    }

    const duplicate = await prisma.room.findFirst({
      where: { tenantId, floorId, roomNumber },
      select: { id: true },
    });
    if (duplicate) {
      throw new Error(
        `Room with number '${roomNumber}' already exists on this floor.`
      );
    }

    const created = await prisma.room.create({
      data: {
        tenantId,
        floorId,
        roomNumber,
        roomName,
        roomType,
        roomCategory,
        capacity,
      },
    });

    return prisma.room.findFirst({
      where: { id: created.id, tenantId },
    });
  }

  async getRooms(tenantId, floorId) {
    const where = { tenantId };
    if (floorId) {
      where.floorId = floorId;
    }

    return prisma.room.findMany({
      where,
      orderBy: [{ roomNumber: "asc" }],
    });
  }

  async getRoomById(roomId, tenantId) {
    const room = await prisma.room.findFirst({
      where: { id: roomId, tenantId },
    });

    if (!room) {
      throw new Error("Room not found or unauthorized");
    }

    return room;
  }

  async updateRoom(roomId, data, tenantId) {
    const existing = await prisma.room.findFirst({
      where: { id: roomId, tenantId },
      select: { id: true, roomNumber: true, floorId: true },
    });
    if (!existing) throw new Error("Room not found or unauthorized");

    const { roomNumber, roomName, roomType, roomCategory, capacity, status } =
      data || {};

    if (roomNumber && roomNumber !== existing.roomNumber) {
      const dup = await prisma.room.findFirst({
        where: {
          tenantId,
          floorId: existing.floorId,
          roomNumber,
          NOT: { id: roomId },
        },
        select: { id: true },
      });
      if (dup) {
        throw new Error(
          `Room with number '${roomNumber}' already exists on this floor.`
        );
      }
    }

    const updates = {};
    if (roomNumber !== undefined) updates.roomNumber = roomNumber;
    if (roomName !== undefined) updates.roomName = roomName;
    if (roomType !== undefined) updates.roomType = roomType;
    if (roomCategory !== undefined) updates.roomCategory = roomCategory;
    if (capacity !== undefined) updates.capacity = capacity;
    if (status !== undefined) updates.status = status;

    await prisma.room.update({
      where: { id: roomId },
      data: updates,
    });

    return prisma.room.findFirst({
      where: { id: roomId, tenantId },
    });
  }

  async deleteRoom(roomId, tenantId) {
    const existing = await prisma.room.findFirst({
      where: { id: roomId, tenantId },
      select: { id: true },
    });
    if (!existing) throw new Error("Room not found or unauthorized");

    await prisma.room.delete({ where: { id: roomId } });
    return { success: true };
  }
}

export default new RoomsService();
