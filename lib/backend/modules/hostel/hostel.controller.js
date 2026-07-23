import hostelService from "./hostel.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";

class HostelController {
  // ----------------------- BLOCKS -----------------------
  static async createBlock(req, res) {
    try {
      const block = await hostelService.createBlock(req.body, req.tenantId);
      logger.info(`Hostel block created: ${block.name}`);
      return responseHandler(res, "success", block, "Block created successfully.");
    } catch (error) {
      logger.error(`Error creating hostel block: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getBlocks(req, res) {
    try {
      const blocks = await hostelService.getBlocks(req.tenantId);
      return responseHandler(res, "success", blocks, "Blocks retrieved successfully.");
    } catch (error) {
      logger.error(`Error retrieving hostel blocks: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getBlockById(req, res) {
    try {
      const block = await hostelService.getBlockById(req.params.id, req.tenantId);
      return responseHandler(res, "success", block, "Block retrieved successfully.");
    } catch (error) {
      logger.error(`Error retrieving hostel block: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async updateBlock(req, res) {
    try {
      const block = await hostelService.updateBlock(req.params.id, req.body, req.tenantId);
      logger.info(`Hostel block updated: ${block.name}`);
      return responseHandler(res, "success", block, "Block updated successfully.");
    } catch (error) {
      logger.error(`Error updating hostel block: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async deleteBlock(req, res) {
    try {
      await hostelService.deleteBlock(req.params.id, req.tenantId);
      logger.info(`Hostel block deleted: ${req.params.id}`);
      return responseHandler(res, "success", null, "Block deleted successfully.");
    } catch (error) {
      logger.error(`Error deleting hostel block: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  // ----------------------- FLOORS -----------------------
  static async createFloor(req, res) {
    try {
      const floor = await hostelService.createFloor(req.body, req.tenantId);
      logger.info(`Hostel floor created: Floor ${floor.floorNumber}`);
      return responseHandler(res, "success", floor, "Floor created successfully.");
    } catch (error) {
      logger.error(`Error creating hostel floor: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getFloors(req, res) {
    try {
      const floors = await hostelService.getFloors(req.query?.blockId, req.tenantId);
      return responseHandler(res, "success", floors, "Floors retrieved successfully.");
    } catch (error) {
      logger.error(`Error retrieving hostel floors: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getFloorById(req, res) {
    try {
      const floor = await hostelService.getFloorById(req.params.id, req.tenantId);
      return responseHandler(res, "success", floor, "Floor retrieved successfully.");
    } catch (error) {
      logger.error(`Error retrieving hostel floor: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async updateFloor(req, res) {
    try {
      const floor = await hostelService.updateFloor(req.params.id, req.body, req.tenantId);
      logger.info(`Hostel floor updated: Floor ${floor.floorNumber}`);
      return responseHandler(res, "success", floor, "Floor updated successfully.");
    } catch (error) {
      logger.error(`Error updating hostel floor: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async deleteFloor(req, res) {
    try {
      await hostelService.deleteFloor(req.params.id, req.tenantId);
      logger.info(`Hostel floor deleted: ${req.params.id}`);
      return responseHandler(res, "success", null, "Floor deleted successfully.");
    } catch (error) {
      logger.error(`Error deleting hostel floor: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  // ----------------------- ROOM TYPES -----------------------
  static async createRoomType(req, res) {
    try {
      const roomType = await hostelService.createRoomType(req.body, req.tenantId);
      logger.info(`Hostel room type created: ${roomType.name}`);
      return responseHandler(res, "success", roomType, "Room type created successfully.");
    } catch (error) {
      logger.error(`Error creating room type: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getRoomTypes(req, res) {
    try {
      const roomTypes = await hostelService.getRoomTypes(req.tenantId);
      return responseHandler(res, "success", roomTypes, "Room types retrieved successfully.");
    } catch (error) {
      logger.error(`Error retrieving room types: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async updateRoomType(req, res) {
    try {
      const roomType = await hostelService.updateRoomType(req.params.id, req.body, req.tenantId);
      return responseHandler(res, "success", roomType, "Room type updated successfully.");
    } catch (error) {
      logger.error(`Error updating room type: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async deleteRoomType(req, res) {
    try {
      await hostelService.deleteRoomType(req.params.id, req.tenantId);
      return responseHandler(res, "success", null, "Room type deleted successfully.");
    } catch (error) {
      logger.error(`Error deleting room type: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  // ----------------------- ROOMS -----------------------
  static async createRoom(req, res) {
    try {
      const room = await hostelService.createRoom(req.body, req.tenantId);
      logger.info(`Hostel room created: ${room.roomNumber}`);
      return responseHandler(res, "success", room, "Room created successfully.");
    } catch (error) {
      logger.error(`Error creating hostel room: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getRooms(req, res) {
    try {
      const rooms = await hostelService.getRooms(req.query, req.tenantId);
      return responseHandler(res, "success", rooms, "Rooms retrieved successfully.");
    } catch (error) {
      logger.error(`Error retrieving hostel rooms: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getRoomById(req, res) {
    try {
      const room = await hostelService.getRoomById(req.params.id, req.tenantId);
      return responseHandler(res, "success", room, "Room retrieved successfully.");
    } catch (error) {
      logger.error(`Error retrieving hostel room: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async updateRoom(req, res) {
    try {
      const room = await hostelService.updateRoom(req.params.id, req.body, req.tenantId);
      logger.info(`Hostel room updated: ${room.roomNumber}`);
      return responseHandler(res, "success", room, "Room updated successfully.");
    } catch (error) {
      logger.error(`Error updating hostel room: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async deleteRoom(req, res) {
    try {
      await hostelService.deleteRoom(req.params.id, req.tenantId);
      logger.info(`Hostel room deleted: ${req.params.id}`);
      return responseHandler(res, "success", null, "Room deleted successfully.");
    } catch (error) {
      logger.error(`Error deleting hostel room: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  // ----------------------- SECTIONS -----------------------
  static async createSection(req, res) {
    try {
      const section = await hostelService.createSection(req.body, req.tenantId);
      logger.info(`Hostel section created: ${section.sectionName}`);
      return responseHandler(res, "success", section, "Section created successfully.");
    } catch (error) {
      logger.error(`Error creating hostel section: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getSections(req, res) {
    try {
      const sections = await hostelService.getSections(req.query?.blockId, req.tenantId);
      return responseHandler(res, "success", sections, "Sections retrieved successfully.");
    } catch (error) {
      logger.error(`Error retrieving hostel sections: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getSectionById(req, res) {
    try {
      const section = await hostelService.getSectionById(req.params.id, req.tenantId);
      return responseHandler(res, "success", section, "Section retrieved successfully.");
    } catch (error) {
      logger.error(`Error retrieving hostel section: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async updateSection(req, res) {
    try {
      const section = await hostelService.updateSection(req.params.id, req.body, req.tenantId);
      logger.info(`Hostel section updated: ${section.sectionName}`);
      return responseHandler(res, "success", section, "Section updated successfully.");
    } catch (error) {
      logger.error(`Error updating hostel section: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async deleteSection(req, res) {
    try {
      await hostelService.deleteSection(req.params.id, req.tenantId);
      return responseHandler(res, "success", null, "Section deleted successfully.");
    } catch (error) {
      logger.error(`Error deleting hostel section: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  // ----------------------- SECTION ROOM MAPPING -----------------------
  static async batchAddRoomsToSection(req, res) {
    try {
      const { roomIds } = req.body || {};
      const result = await hostelService.batchAddRoomsToSection(req.params.id, roomIds, req.tenantId);
      return responseHandler(res, "success", result, `${result.count} rooms assigned successfully.`);
    } catch (error) {
      logger.error(`Error batch assigning rooms: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async addRoomToSection(req, res) {
    try {
      const { roomId, sortOrder } = req.body || {};
      const mapping = await hostelService.addRoomToSection(req.params.id, roomId, sortOrder, req.tenantId);
      return responseHandler(res, "success", mapping, "Room added to section successfully.");
    } catch (error) {
      logger.error(`Error adding room to section: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async removeRoomFromSection(req, res) {
    try {
      await hostelService.removeRoomFromSection(req.params.id, req.params.roomId, req.tenantId);
      return responseHandler(res, "success", null, "Room removed from section successfully.");
    } catch (error) {
      logger.error(`Error removing room from section: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  // ----------------------- STAFF ASSIGNMENTS -----------------------
  static async assignStaff(req, res) {
    try {
      const assignment = await hostelService.assignStaff(req.body, req.tenantId);
      logger.info(`Hostel staff assignment created: ${assignment.id}`);
      return responseHandler(res, "success", assignment, "Staff assigned successfully.");
    } catch (error) {
      logger.error(`Error assigning hostel staff: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getStaffAssignments(req, res) {
    try {
      const assignments = await hostelService.getStaffAssignments(req.query?.blockId, req.tenantId);
      return responseHandler(res, "success", assignments, "Staff assignments retrieved successfully.");
    } catch (error) {
      logger.error(`Error retrieving staff assignments: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async updateStaffAssignment(req, res) {
    try {
      const assignment = await hostelService.updateStaffAssignment(req.params.id, req.body, req.tenantId);
      return responseHandler(res, "success", assignment, "Staff assignment updated successfully.");
    } catch (error) {
      logger.error(`Error updating staff assignment: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async deleteStaffAssignment(req, res) {
    try {
      await hostelService.deleteStaffAssignment(req.params.id, req.tenantId);
      return responseHandler(res, "success", null, "Staff assignment deleted successfully.");
    } catch (error) {
      logger.error(`Error deleting staff assignment: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  // ----------------------- STUDENT ALLOCATIONS -----------------------
  static async allocateStudent(req, res) {
    try {
      const allocation = await hostelService.allocateStudent(req.body, req.tenantId);
      logger.info(`Hostel allocation created: ${allocation.id}`);
      return responseHandler(res, "success", allocation, "Student allocated successfully.");
    } catch (error) {
      logger.error(`Error allocating student: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getAllocations(req, res) {
    try {
      const allocations = await hostelService.getAllocations(req.query, req.tenantId);
      return responseHandler(res, "success", allocations, "Allocations retrieved successfully.");
    } catch (error) {
      logger.error(`Error retrieving allocations: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async updateAllocation(req, res) {
    try {
      const allocation = await hostelService.updateAllocation(req.params.id, req.body, req.tenantId);
      return responseHandler(res, "success", allocation, "Allocation updated successfully.");
    } catch (error) {
      logger.error(`Error updating allocation: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async deleteAllocation(req, res) {
    try {
      await hostelService.deleteAllocation(req.params.id, req.tenantId);
      return responseHandler(res, "success", null, "Allocation deleted successfully.");
    } catch (error) {
      logger.error(`Error deleting allocation: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }
}

export default HostelController;