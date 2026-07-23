import { prisma } from "../../lib/prisma.js";

// ==================== Hostel Blocks ====================

const blockInclude = {
  _count: {
    select: {
      floors: true,
      staffAssignments: true,
    },
  },
};

class HostelService {
  // ----------------------- BLOCKS -----------------------
  async createBlock(data, tenantId) {
    const { name, code, description, gender } = data || {};
    if (!name) throw new Error("Block name is required.");

    const duplicate = await prisma.hostelBlock.findFirst({
      where: { tenantId, name },
      select: { id: true },
    });
    if (duplicate) throw new Error(`Block '${name}' already exists.`);

    const created = await prisma.hostelBlock.create({
      data: { tenantId, name, code, description, gender },
    });

    return prisma.hostelBlock.findFirst({
      where: { id: created.id, tenantId },
      include: blockInclude,
    });
  }

  async getBlocks(tenantId) {
    return prisma.hostelBlock.findMany({
      where: { tenantId },
      include: {
        ...blockInclude,
        floors: {
          include: {
            _count: { select: { rooms: true } },
          },
          orderBy: { floorNumber: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getBlockById(blockId, tenantId) {
    const block = await prisma.hostelBlock.findFirst({
      where: { id: blockId, tenantId },
      include: {
        ...blockInclude,
        floors: {
          include: {
            _count: { select: { rooms: true } },
            rooms: {
              include: {
                roomType: { select: { id: true, name: true } },
              },
              orderBy: { roomNumber: "asc" },
            },
          },
          orderBy: { floorNumber: "asc" },
        },
        staffAssignments: {
          where: { status: "active" },
          include: {
            teacher: { select: { id: true, fullName: true, phone: true } },
          },
        },
      },
    });
    if (!block) throw new Error("Block not found or unauthorized.");
    return block;
  }

  async updateBlock(blockId, data, tenantId) {
    const existing = await prisma.hostelBlock.findFirst({
      where: { id: blockId, tenantId },
    });
    if (!existing) throw new Error("Block not found or unauthorized.");

    const { name, code, description, gender, status } = data || {};

    if (name && name !== existing.name) {
      const duplicate = await prisma.hostelBlock.findFirst({
        where: { tenantId, name, id: { not: blockId } },
        select: { id: true },
      });
      if (duplicate) throw new Error(`Block '${name}' already exists.`);
    }

    return prisma.hostelBlock.update({
      where: { id: blockId, tenantId },
      data: { name, code, description, gender, status },
      include: blockInclude,
    });
  }

  async deleteBlock(blockId, tenantId) {
    const existing = await prisma.hostelBlock.findFirst({
      where: { id: blockId, tenantId },
    });
    if (!existing) throw new Error("Block not found or unauthorized.");

    const allocations = await prisma.studentHostelAllocation.count({
      where: { room: { floor: { blockId: blockId } }, status: "active" },
    });
    if (allocations > 0) {
      throw new Error(
        "Cannot delete block with active student allocations."
      );
    }

    return prisma.hostelBlock.delete({
      where: { id: blockId, tenantId },
    });
  }

  // ----------------------- FLOORS -----------------------
  async createFloor(data, tenantId) {
    const { blockId, floorNumber, name, gender } = data || {};
    if (!blockId) throw new Error("Block is required.");
    if (floorNumber == null) throw new Error("Floor number is required.");

    const block = await prisma.hostelBlock.findFirst({
      where: { id: blockId, tenantId },
    });
    if (!block) throw new Error("Block not found or unauthorized.");

    const duplicate = await prisma.hostelFloor.findFirst({
      where: { tenantId, blockId, floorNumber },
      select: { id: true },
    });
    if (duplicate)
      throw new Error(
        `Floor ${floorNumber} already exists in this block.`
      );

    return prisma.hostelFloor.create({
      data: { tenantId, blockId, floorNumber, name, gender },
      include: {
        _count: { select: { rooms: true } },
      },
    });
  }

  async getFloors(blockId, tenantId) {
    const where = { tenantId };
    if (blockId) where.blockId = blockId;

    return prisma.hostelFloor.findMany({
      where,
      include: {
        block: { select: { id: true, name: true } },
        _count: { select: { rooms: true } },
      },
      orderBy: { floorNumber: "asc" },
    });
  }

  async getFloorById(floorId, tenantId) {
    const floor = await prisma.hostelFloor.findFirst({
      where: { id: floorId, tenantId },
      include: {
        block: { select: { id: true, name: true } },
        rooms: {
          include: {
            roomType: { select: { id: true, name: true } },
            _count: {
              select: {
                studentAllocations: {
                  where: { status: "active" },
                },
              },
            },
          },
          orderBy: { roomNumber: "asc" },
        },
      },
    });
    if (!floor) throw new Error("Floor not found or unauthorized.");
    return floor;
  }

  async updateFloor(floorId, data, tenantId) {
    const existing = await prisma.hostelFloor.findFirst({
      where: { id: floorId, tenantId },
    });
    if (!existing) throw new Error("Floor not found or unauthorized.");

    const { floorNumber, name, gender } = data || {};

    if (floorNumber != null && floorNumber !== existing.floorNumber) {
      const duplicate = await prisma.hostelFloor.findFirst({
        where: {
          tenantId,
          blockId: existing.blockId,
          floorNumber,
          id: { not: floorId },
        },
        select: { id: true },
      });
      if (duplicate)
        throw new Error(
          `Floor ${floorNumber} already exists in this block.`
        );
    }

    return prisma.hostelFloor.update({
      where: { id: floorId, tenantId },
      data: { floorNumber, name, gender },
      include: {
        _count: { select: { rooms: true } },
      },
    });
  }

  async deleteFloor(floorId, tenantId) {
    const existing = await prisma.hostelFloor.findFirst({
      where: { id: floorId, tenantId },
    });
    if (!existing) throw new Error("Floor not found or unauthorized.");

    const allocations = await prisma.studentHostelAllocation.count({
      where: { room: { floorId }, status: "active" },
    });
    if (allocations > 0) {
      throw new Error(
        "Cannot delete floor with active student allocations."
      );
    }

    return prisma.hostelFloor.delete({
      where: { id: floorId, tenantId },
    });
  }

  // ----------------------- ROOM TYPES -----------------------
  async createRoomType(data, tenantId) {
    const { name, description, defaultCapacity, amenities } = data || {};
    if (!name) throw new Error("Room type name is required.");

    const duplicate = await prisma.hostelRoomType.findFirst({
      where: { tenantId, name },
      select: { id: true },
    });
    if (duplicate) throw new Error(`Room type '${name}' already exists.`);

    return prisma.hostelRoomType.create({
      data: { tenantId, name, description, defaultCapacity, amenities },
      include: {
        _count: { select: { rooms: true, feeHeads: true } },
      },
    });
  }

  async getRoomTypes(tenantId) {
    return prisma.hostelRoomType.findMany({
      where: { tenantId },
      include: {
        _count: { select: { rooms: true, feeHeads: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateRoomType(typeId, data, tenantId) {
    const existing = await prisma.hostelRoomType.findFirst({
      where: { id: typeId, tenantId },
    });
    if (!existing) throw new Error("Room type not found or unauthorized.");

    const { name, description, defaultCapacity, amenities } = data || {};

    if (name && name !== existing.name) {
      const duplicate = await prisma.hostelRoomType.findFirst({
        where: { tenantId, name, id: { not: typeId } },
        select: { id: true },
      });
      if (duplicate) throw new Error(`Room type '${name}' already exists.`);
    }

    return prisma.hostelRoomType.update({
      where: { id: typeId, tenantId },
      data: { name, description, defaultCapacity, amenities },
      include: {
        _count: { select: { rooms: true, feeHeads: true } },
      },
    });
  }

  async deleteRoomType(typeId, tenantId) {
    const existing = await prisma.hostelRoomType.findFirst({
      where: { id: typeId, tenantId },
    });
    if (!existing) throw new Error("Room type not found or unauthorized.");

    const roomCount = await prisma.hostelRoom.count({
      where: { roomTypeId: typeId },
    });
    if (roomCount > 0) {
      throw new Error(
        "Cannot delete room type used by existing rooms."
      );
    }

    return prisma.hostelRoomType.delete({
      where: { id: typeId, tenantId },
    });
  }

  // ----------------------- ROOMS -----------------------
  async createRoom(data, tenantId) {
    const { floorId, roomTypeId, roomNumber, capacity } = data || {};
    if (!floorId) throw new Error("Floor is required.");
    if (!roomTypeId) throw new Error("Room type is required.");
    if (!roomNumber) throw new Error("Room number is required.");

    const floor = await prisma.hostelFloor.findFirst({
      where: { id: floorId, tenantId },
    });
    if (!floor) throw new Error("Floor not found or unauthorized.");

    const duplicate = await prisma.hostelRoom.findFirst({
      where: { tenantId, floorId, roomNumber },
      select: { id: true },
    });
    if (duplicate)
      throw new Error(
        `Room '${roomNumber}' already exists on this floor.`
      );

    return prisma.hostelRoom.create({
      data: { tenantId, floorId, roomTypeId, roomNumber, capacity },
      include: {
        roomType: { select: { id: true, name: true } },
        floor: {
          select: { id: true, floorNumber: true, blockId: true },
        },
        _count: {
          select: {
            studentAllocations: {
              where: { status: "active" },
            },
          },
        },
      },
    });
  }

  async getRooms(filters, tenantId) {
    const where = { tenantId };
    if (filters?.floorId) where.floorId = filters.floorId;
    if (filters?.roomTypeId) where.roomTypeId = filters.roomTypeId;
    if (filters?.status) where.status = filters.status;

    return prisma.hostelRoom.findMany({
      where,
      include: {
        roomType: { select: { id: true, name: true } },
        floor: {
          select: {
            id: true,
            floorNumber: true,
            name: true,
            block: { select: { id: true, name: true } },
          },
        },
        _count: {
          select: {
            studentAllocations: {
              where: { status: "active" },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getRoomById(roomId, tenantId) {
    const room = await prisma.hostelRoom.findFirst({
      where: { id: roomId, tenantId },
      include: {
        roomType: { select: { id: true, name: true, defaultCapacity: true, amenities: true } },
        floor: {
          select: {
            id: true,
            floorNumber: true,
            name: true,
            block: { select: { id: true, name: true } },
          },
        },
        sectionRooms: {
          include: {
            section: { select: { id: true, section: { select: { sectionName: true } } } },
          },
        },
        studentAllocations: {
          where: { status: "active" },
          include: {
            enrollment: {
              select: {
                id: true,
                rollNumber: true,
                student: {
                  select: { id: true, firstName: true, lastName: true },
                },
              },
            },
          },
        },
      },
    });
    if (!room) throw new Error("Room not found or unauthorized.");
    return room;
  }

  async updateRoom(roomId, data, tenantId) {
    const existing = await prisma.hostelRoom.findFirst({
      where: { id: roomId, tenantId },
    });
    if (!existing) throw new Error("Room not found or unauthorized.");

    const { roomNumber, roomTypeId, capacity, status } = data || {};

    if (roomNumber && roomNumber !== existing.roomNumber) {
      const duplicate = await prisma.hostelRoom.findFirst({
        where: {
          tenantId,
          floorId: existing.floorId,
          roomNumber,
          id: { not: roomId },
        },
        select: { id: true },
      });
      if (duplicate)
        throw new Error(
          `Room '${roomNumber}' already exists on this floor.`
        );
    }

    if (capacity != null) {
      const activeAllocations =
        await prisma.studentHostelAllocation.count({
          where: { roomId, status: "active" },
        });
      if (capacity < activeAllocations) {
        throw new Error(
          `Cannot reduce capacity to ${capacity}. There are ${activeAllocations} active allocations.`
        );
      }
    }

    return prisma.hostelRoom.update({
      where: { id: roomId, tenantId },
      data: { roomNumber, roomTypeId, capacity, status },
      include: {
        roomType: { select: { id: true, name: true } },
        _count: {
          select: {
            studentAllocations: {
              where: { status: "active" },
            },
          },
        },
      },
    });
  }

  async deleteRoom(roomId, tenantId) {
    const existing = await prisma.hostelRoom.findFirst({
      where: { id: roomId, tenantId },
    });
    if (!existing) throw new Error("Room not found or unauthorized.");

    const allocations = await prisma.studentHostelAllocation.count({
      where: { roomId, status: "active" },
    });
    if (allocations > 0) {
      throw new Error(
        "Cannot delete room with active student allocations."
      );
    }

    return prisma.hostelRoom.delete({
      where: { id: roomId, tenantId },
    });
  }

  // ----------------------- SECTIONS -----------------------
  async createSection(data, tenantId) {
    const { sectionId, description } = data || {};
    if (!sectionId) throw new Error("Academic section is required.");

    const academicSection = await prisma.section.findFirst({
      where: { id: sectionId, tenantId },
    });
    if (!academicSection) throw new Error("Academic section not found.");

    const duplicate = await prisma.hostelSection.findFirst({
      where: { tenantId, sectionId },
      select: { id: true },
    });
    if (duplicate)
      throw new Error("This academic section already has a hostel link.");

    return prisma.hostelSection.create({
      data: { tenantId, sectionId, description },
      include: {
        section: {
          select: { id: true, sectionName: true, grade: { select: { id: true, gradeName: true, course: { select: { id: true, courseName: true } } } } },
        },
        _count: { select: { sectionRooms: true, studentAllocations: true } },
      },
    });
  }

  async getSections(tenantId) {
    return prisma.hostelSection.findMany({
      where: { tenantId },
      include: {
        sectionRooms: {
          include: {
            room: {
              select: {
                id: true,
                roomNumber: true,
                capacity: true,
                roomType: { select: { id: true, name: true } },
                floor: {
                  select: {
                    id: true,
                    floorNumber: true,
                    block: { select: { id: true, name: true } },
                  },
                },
              },
            },
          },
          orderBy: { sortOrder: "asc" },
        },
        _count: { select: { studentAllocations: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getSectionById(sectionId, tenantId) {
    const section = await prisma.hostelSection.findFirst({
      where: { id: sectionId, tenantId },
      include: {
        sectionRooms: {
          include: {
            room: {
              select: {
                id: true,
                roomNumber: true,
                capacity: true,
                roomType: { select: { id: true, name: true } },
                floor: {
                  select: {
                    id: true,
                    floorNumber: true,
                    block: { select: { id: true, name: true } },
                  },
                },
              },
            },
          },
          orderBy: { sortOrder: "asc" },
        },
        studentAllocations: {
          where: { status: "active" },
          include: {
            enrollment: {
              select: {
                id: true,
                rollNumber: true,
                student: {
                  select: { id: true, firstName: true, lastName: true },
                },
              },
            },
            room: {
              select: { id: true, roomNumber: true },
            },
          },
        },
      },
    });
    if (!section) throw new Error("Section not found or unauthorized.");
    return section;
  }

  async updateSection(sectionId, data, tenantId) {
    const existing = await prisma.hostelSection.findFirst({
      where: { id: sectionId, tenantId },
    });
    if (!existing) throw new Error("Section not found or unauthorized.");

    const { description } = data || {};

    return prisma.hostelSection.update({
      where: { id: sectionId, tenantId },
      data: { description },
      include: {
        _count: { select: { sectionRooms: true, studentAllocations: true } },
      },
    });
  }

  async deleteSection(sectionId, tenantId) {
    const existing = await prisma.hostelSection.findFirst({
      where: { id: sectionId, tenantId },
    });
    if (!existing) throw new Error("Section not found or unauthorized.");

    return prisma.hostelSection.delete({
      where: { id: sectionId, tenantId },
    });
  }

  // ----------------------- SECTION ROOM MAPPING -----------------------
  async batchAddRoomsToSection(sectionId, roomIds, tenantId) {
    if (!roomIds || roomIds.length === 0) throw new Error("At least one room is required.");

    const section = await prisma.hostelSection.findFirst({
      where: { id: sectionId, tenantId },
    });
    if (!section) throw new Error("Section not found or unauthorized.");

    // Verify all rooms exist
    const rooms = await prisma.hostelRoom.findMany({
      where: { id: { in: roomIds }, tenantId },
      select: { id: true },
    });
    if (rooms.length !== roomIds.length) throw new Error("One or more rooms not found.");

    // Create in transaction — skip existing
    const results = await prisma.$transaction(async (tx) => {
      const created = [];
      for (let i = 0; i < roomIds.length; i++) {
        const roomId = roomIds[i];
        const existing = await tx.hostelSectionRoom.findFirst({
          where: { tenantId, sectionId, roomId },
        });
        if (!existing) {
          const record = await tx.hostelSectionRoom.create({
            data: { tenantId, sectionId, roomId, sortOrder: i },
          });
          created.push(record);
        }
      }
      return created;
    });

    return {
      count: results.length,
      rooms
    };
  }

  async addRoomToSection(sectionId, roomId, sortOrder, tenantId) {
    const section = await prisma.hostelSection.findFirst({
      where: { id: sectionId, tenantId },
    });
    if (!section) throw new Error("Section not found or unauthorized.");

    const room = await prisma.hostelRoom.findFirst({
      where: { id: roomId, tenantId },
    });
    if (!room) throw new Error("Room not found or unauthorized.");

    const existing = await prisma.hostelSectionRoom.findFirst({
      where: { tenantId, sectionId, roomId },
    });
    if (existing)
      throw new Error("Room is already assigned to this section.");

    return prisma.hostelSectionRoom.create({
      data: { tenantId, sectionId, roomId, sortOrder },
      include: {
        room: {
          select: {
            id: true,
            roomNumber: true,
            roomType: { select: { id: true, name: true } },
          },
        },
        section: { select: { id: true, section: { select: { sectionName: true } } } },
      },
    });
  }

  async removeRoomFromSection(sectionId, roomId, tenantId) {
    const mapping = await prisma.hostelSectionRoom.findFirst({
      where: { tenantId, sectionId, roomId },
    });
    if (!mapping)
      throw new Error("Room not found in this section.");

    return prisma.hostelSectionRoom.delete({
      where: { id: mapping.id, tenantId },
    });
  }

  // ----------------------- STAFF ASSIGNMENTS -----------------------
  async assignStaff(data, tenantId) {
    const { blockId, teacherId, role, fromDate, toDate } = data || {};
    if (!blockId) throw new Error("Block is required.");
    if (!teacherId) throw new Error("Staff member is required.");
    if (!role) throw new Error("Role is required.");

    const block = await prisma.hostelBlock.findFirst({
      where: { id: blockId, tenantId },
    });
    if (!block) throw new Error("Block not found or unauthorized.");

    const teacher = await prisma.teacher.findFirst({
      where: { id: teacherId, tenantId },
    });
    if (!teacher) throw new Error("Staff member not found.");

    // Enforce single incharge per block
    if (role === "in_charge") {
      const existingIncharge =
        await prisma.hostelStaffAssignment.count({
          where: {
            tenantId,
            blockId,
            role: "in_charge",
            status: "active",
          },
        });
      if (existingIncharge > 0) {
        throw new Error(
          "This block already has an active incharge."
        );
      }
    }

    return prisma.hostelStaffAssignment.create({
      data: { tenantId, blockId, teacherId, role, fromDate, toDate },
      include: {
        teacher: { select: { id: true, fullName: true, phone: true } },
        block: { select: { id: true, name: true } },
      },
    });
  }

  async getStaffAssignments(blockId, tenantId) {
    const where = { tenantId };
    if (blockId) where.blockId = blockId;

    return prisma.hostelStaffAssignment.findMany({
      where,
      include: {
        teacher: { select: { id: true, fullName: true, phone: true, employeeCode: true } },
        block: { select: { id: true, name: true } },
      },
      orderBy: [{ status: "asc" }, { fromDate: "desc" }],
    });
  }

  async updateStaffAssignment(assignmentId, data, tenantId) {
    const existing = await prisma.hostelStaffAssignment.findFirst({
      where: { id: assignmentId, tenantId },
    });
    if (!existing)
      throw new Error("Staff assignment not found or unauthorized.");

    const { role, status, toDate } = data || {};

    if (role === "in_charge" && role !== existing.role) {
      const existingIncharge =
        await prisma.hostelStaffAssignment.count({
          where: {
            tenantId,
            blockId: existing.blockId,
            role: "in_charge",
            status: "active",
            id: { not: assignmentId },
          },
        });
      if (existingIncharge > 0) {
        throw new Error(
          "This block already has an active incharge."
        );
      }
    }

    return prisma.hostelStaffAssignment.update({
      where: { id: assignmentId, tenantId },
      data: { role, status, toDate },
      include: {
        teacher: { select: { id: true, fullName: true, phone: true } },
        block: { select: { id: true, name: true } },
      },
    });
  }

  async deleteStaffAssignment(assignmentId, tenantId) {
    const existing = await prisma.hostelStaffAssignment.findFirst({
      where: { id: assignmentId, tenantId },
    });
    if (!existing)
      throw new Error("Staff assignment not found or unauthorized.");

    return prisma.hostelStaffAssignment.delete({
      where: { id: assignmentId, tenantId },
    });
  }

  // ----------------------- STUDENT ALLOCATIONS -----------------------
  async allocateStudent(data, tenantId) {
    const { enrollmentId, roomId, sectionId, academicYearId, fromDate, toDate } =
      data || {};
    if (!enrollmentId) throw new Error("Enrollment is required.");
    if (!roomId) throw new Error("Room is required.");

    // Auto-select active academic year if not provided
    let finalAcademicYearId = academicYearId;
    if (!finalAcademicYearId) {
      const activeYear = await prisma.academicYear.findFirst({
        where: { tenantId, status: "active" },
        select: { id: true },
      });
      if (!activeYear) throw new Error("No active academic year found.");
      finalAcademicYearId = activeYear.id;
    }

    // Validate enrollment
    const enrollment = await prisma.studentEnrollment.findFirst({
      where: { id: enrollmentId, tenantId },
    });
    if (!enrollment) throw new Error("Enrollment not found.");

    // Check existing allocation for this year
    const existing = await prisma.studentHostelAllocation.findFirst({
      where: { tenantId, enrollmentId, academicYearId },
    });
    if (existing) {
      throw new Error(
        "Student already has a hostel allocation for this academic year."
      );
    }

    // Validate room
    const room = await prisma.hostelRoom.findFirst({
      where: { id: roomId, tenantId, status: "active" },
    });
    if (!room) throw new Error("Room not found or not active.");

    // Check capacity
    const occupied = await prisma.studentHostelAllocation.count({
      where: { roomId, status: "active" },
    });
    if (occupied >= room.capacity) {
      throw new Error(
        `Room is at full capacity (${occupied}/${room.capacity}).`
      );
    }

    // If sectionId is provided, validate it; otherwise leave as null (override)
    if (sectionId) {
      const section = await prisma.hostelSection.findFirst({
        where: { id: sectionId, tenantId },
      });
      if (!section) throw new Error("Section not found.");
    }

    return prisma.studentHostelAllocation.create({
      data: {
        tenantId,
        enrollmentId,
        roomId,
        sectionId,
        academicYearId: finalAcademicYearId,
        fromDate,
        toDate,
      },
      include: {
        room: {
          select: {
            id: true,
            roomNumber: true,
            floor: { select: { id: true, floorNumber: true } },
            roomType: { select: { id: true, name: true } },
          },
        },
        section: { select: { id: true, section: { select: { sectionName: true } } } },
        enrollment: {
          select: {
            id: true,
            rollNumber: true,
            student: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
    });
  }

  async getAllocations(filters, tenantId) {
    const where = { tenantId };
    if (filters?.academicYearId) where.academicYearId = filters.academicYearId;
    if (filters?.roomId) where.roomId = filters.roomId;
    if (filters?.sectionId) where.sectionId = filters.sectionId;
    if (filters?.status) where.status = filters.status;

    return prisma.studentHostelAllocation.findMany({
      where,
      include: {
        room: {
          select: {
            id: true,
            roomNumber: true,
            floor: {
              select: {
                id: true,
                floorNumber: true,
                block: { select: { id: true, name: true } },
              },
            },
            roomType: { select: { id: true, name: true } },
          },
        },
        section: { select: { id: true, section: { select: { sectionName: true } } } },
        enrollment: {
          select: {
            id: true,
            rollNumber: true,
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            grade: { select: { id: true, gradeName: true } },
            section: { select: { id: true, sectionName: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateAllocation(allocationId, data, tenantId) {
    const existing = await prisma.studentHostelAllocation.findFirst({
      where: { id: allocationId, tenantId },
    });
    if (!existing)
      throw new Error("Allocation not found or unauthorized.");

    const { roomId, sectionId, status, toDate } = data || {};

    if (roomId && roomId !== existing.roomId) {
      const room = await prisma.hostelRoom.findFirst({
        where: { id: roomId, tenantId, status: "active" },
      });
      if (!room) throw new Error("Room not found or not active.");

      const occupied = await prisma.studentHostelAllocation.count({
        where: {
          roomId,
          status: "active",
          id: { not: allocationId },
        },
      });
      if (occupied >= room.capacity) {
        throw new Error(
          `Room is at full capacity (${occupied}/${room.capacity}).`
        );
      }
    }

    return prisma.studentHostelAllocation.update({
      where: { id: allocationId, tenantId },
      data: { roomId, sectionId, status, toDate },
      include: {
        room: {
          select: {
            id: true,
            roomNumber: true,
            roomType: { select: { id: true, name: true } },
          },
        },
        section: { select: { id: true, section: { select: { sectionName: true } } } },
        enrollment: {
          select: {
            id: true,
            rollNumber: true,
            student: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
    });
  }

  async deleteAllocation(allocationId, tenantId) {
    const existing = await prisma.studentHostelAllocation.findFirst({
      where: { id: allocationId, tenantId },
    });
    if (!existing)
      throw new Error("Allocation not found or unauthorized.");

    return prisma.studentHostelAllocation.update({
      where: { id: allocationId, tenantId },
      data: { status: "inactive", toDate: new Date() },
    });
  }
}

const hostelService = new HostelService();
export default hostelService;