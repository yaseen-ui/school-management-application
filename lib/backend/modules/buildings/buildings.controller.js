import BuildingsService from "./buildings.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";

class BuildingsController {
  static async createBuilding(req, res) {
    try {
      const building = await BuildingsService.createBuilding(
        req.body,
        req.tenantId
      );
      logger.info(`Building created: ${JSON.stringify(building)}`);
      return responseHandler(
        res,
        "success",
        building,
        "Building created successfully."
      );
    } catch (error) {
      logger.error(`Error creating building: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getBuildings(req, res) {
    try {
      const buildings = await BuildingsService.getBuildings(req.tenantId);
      return responseHandler(
        res,
        "success",
        buildings,
        "Buildings retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving buildings: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getBuildingById(req, res) {
    try {
      const building = await BuildingsService.getBuildingById(
        req.params.id,
        req.tenantId
      );
      return responseHandler(
        res,
        "success",
        building,
        "Building retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving building: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async updateBuilding(req, res) {
    try {
      const building = await BuildingsService.updateBuilding(
        req.params.id,
        req.body,
        req.tenantId
      );
      logger.info(`Building updated: ${JSON.stringify(building)}`);
      return responseHandler(
        res,
        "success",
        building,
        "Building updated successfully."
      );
    } catch (error) {
      logger.error(`Error updating building: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async deleteBuilding(req, res) {
    try {
      await BuildingsService.deleteBuilding(req.params.id, req.tenantId);
      logger.info(`Building deleted: ID=${req.params.id}`);
      return responseHandler(
        res,
        "success",
        null,
        "Building deleted successfully."
      );
    } catch (error) {
      logger.error(`Error deleting building: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }
}

export default BuildingsController;
