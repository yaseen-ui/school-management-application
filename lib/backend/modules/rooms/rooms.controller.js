import RoomsService from "./rooms.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";

class RoomsController {
  static async createRoom(req, res) {
    try {
      const room = await RoomsService.createRoom(req.body, req.tenantId);
      logger.info(`Room created: ${JSON.stringify(room)}`);
      return responseHandler(
        res,
        "success",
        room,
        "Room created successfully."
      );
    } catch (error) {
      logger.error(`Error creating room: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getRooms(req, res) {
    try {
      const floorId = req.query.floorId;
      const rooms = await RoomsService.getRooms(req.tenantId, floorId);
      return responseHandler(
        res,
        "success",
        rooms,
        "Rooms retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving rooms: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getRoomById(req, res) {
    try {
      const room = await RoomsService.getRoomById(
        req.params.id,
        req.tenantId
      );
      return responseHandler(
        res,
        "success",
        room,
        "Room retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving room: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async updateRoom(req, res) {
    try {
      const room = await RoomsService.updateRoom(
        req.params.id,
        req.body,
        req.tenantId
      );
      logger.info(`Room updated: ${JSON.stringify(room)}`);
      return responseHandler(
        res,
        "success",
        room,
        "Room updated successfully."
      );
    } catch (error) {
      logger.error(`Error updating room: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async deleteRoom(req, res) {
    try {
      await RoomsService.deleteRoom(req.params.id, req.tenantId);
      logger.info(`Room deleted: ID=${req.params.id}`);
      return responseHandler(
        res,
        "success",
        null,
        "Room deleted successfully."
      );
    } catch (error) {
      logger.error(`Error deleting room: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }
}

export default RoomsController;
