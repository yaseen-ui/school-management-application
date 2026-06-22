import FloorsService from "./floors.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";

class FloorsController {
  static async createFloor(req, res) {
    try {
      const floor = await FloorsService.createFloor(req.body, req.tenantId);
      logger.info(`Floor created: ${JSON.stringify(floor)}`);
      return responseHandler(
        res,
        "success",
        floor,
        "Floor created successfully."
      );
    } catch (error) {
      logger.error(`Error creating floor: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getFloors(req, res) {
    try {
      const buildingId = req.query.buildingId;
      const floors = await FloorsService.getFloors(req.tenantId, buildingId);
      return responseHandler(
        res,
        "success",
        floors,
        "Floors retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving floors: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getFloorById(req, res) {
    try {
      const floor = await FloorsService.getFloorById(
        req.params.id,
        req.tenantId
      );
      return responseHandler(
        res,
        "success",
        floor,
        "Floor retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving floor: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async updateFloor(req, res) {
    try {
      const floor = await FloorsService.updateFloor(
        req.params.id,
        req.body,
        req.tenantId
      );
      logger.info(`Floor updated: ${JSON.stringify(floor)}`);
      return responseHandler(
        res,
        "success",
        floor,
        "Floor updated successfully."
      );
    } catch (error) {
      logger.error(`Error updating floor: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async deleteFloor(req, res) {
    try {
      await FloorsService.deleteFloor(req.params.id, req.tenantId);
      logger.info(`Floor deleted: ID=${req.params.id}`);
      return responseHandler(
        res,
        "success",
        null,
        "Floor deleted successfully."
      );
    } catch (error) {
      logger.error(`Error deleting floor: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }
}

export default FloorsController;
