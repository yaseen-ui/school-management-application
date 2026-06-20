import TeacherCapabilityService from "./teacherCapability.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";
import { tableColumns } from "../../utils/columns.js";

class TeacherCapabilityController {
  async create(req, res) {
    try {
      const { tenantId } = req.user;
      const capability = await TeacherCapabilityService.create(req.body, tenantId);
      return responseHandler(
        res,
        "success",
        capability,
        "Teacher capability created successfully."
      );
    } catch (error) {
      logger.error("Error creating teacher capability:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getById(req, res) {
    try {
      const { tenantId } = req.user;
      const capability = await TeacherCapabilityService.getById(
        req.params.id,
        tenantId
      );
      if (!capability) {
        return responseHandler(res, "error", null, "Teacher capability not found.");
      }
      return responseHandler(
        res,
        "success",
        capability,
        "Teacher capability retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving teacher capability:", error);
      return responseHandler(
        res,
        "error",
        null,
        "Failed to retrieve teacher capability."
      );
    }
  }

  async getAll(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const capabilities = await TeacherCapabilityService.getAll(tenantId, filters);
      const result = {
        columns: tableColumns.teacherCapabilities || [],
        rows: capabilities,
      };
      return responseHandler(
        res,
        "success",
        result,
        "Teacher capabilities retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving teacher capabilities:", error);
      return responseHandler(
        res,
        "error",
        null,
        "Failed to retrieve teacher capabilities."
      );
    }
  }

  async update(req, res) {
    try {
      const { tenantId } = req.user;
      const updated = await TeacherCapabilityService.update(
        req.params.id,
        req.body,
        tenantId
      );
      if (!updated) {
        return responseHandler(res, "error", null, "Teacher capability not found.");
      }
      return responseHandler(
        res,
        "success",
        updated,
        "Teacher capability updated successfully."
      );
    } catch (error) {
      logger.error("Error updating teacher capability:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async createBulk(req, res) {
    try {
      const { tenantId } = req.user;
      const capabilities = await TeacherCapabilityService.createBulk(req.body, tenantId);
      return responseHandler(
        res,
        "success",
        capabilities,
        "Teacher capabilities created successfully."
      );
    } catch (error) {
      logger.error("Error creating teacher capabilities in bulk:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async delete(req, res) {
    try {
      const { tenantId } = req.user;
      const deleted = await TeacherCapabilityService.delete(
        req.params.id,
        tenantId
      );
      if (!deleted) {
        return responseHandler(res, "error", null, "Teacher capability not found.");
      }
      return responseHandler(
        res,
        "success",
        null,
        "Teacher capability deleted successfully."
      );
    } catch (error) {
      logger.error("Error deleting teacher capability:", error);
      return responseHandler(res, "error", null, "Failed to delete teacher capability.");
    }
  }
}

export default new TeacherCapabilityController();
