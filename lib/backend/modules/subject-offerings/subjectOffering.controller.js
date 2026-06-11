import SubjectOfferingService from "./subjectOffering.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";
import { tableColumns } from "../../utils/columns.js";

class SubjectOfferingController {
  async create(req, res) {
    try {
      const { tenantId } = req.user;
      const offering = await SubjectOfferingService.create(req.body, tenantId);
      return responseHandler(
        res,
        "success",
        offering,
        "Subject offering created successfully."
      );
    } catch (error) {
      logger.error("Error creating subject offering:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getById(req, res) {
    try {
      const { tenantId } = req.user;
      const offering = await SubjectOfferingService.getById(
        req.params.id,
        tenantId
      );
      if (!offering) {
        return responseHandler(res, "error", null, "Subject offering not found.");
      }
      return responseHandler(
        res,
        "success",
        offering,
        "Subject offering retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving subject offering:", error);
      return responseHandler(
        res,
        "error",
        null,
        "Failed to retrieve subject offering."
      );
    }
  }

  async getAll(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const offerings = await SubjectOfferingService.getAll(tenantId, filters);
      const result = {
        columns: tableColumns.subjectOfferings || [],
        rows: offerings,
      };
      return responseHandler(
        res,
        "success",
        result,
        "Subject offerings retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving subject offerings:", error);
      return responseHandler(
        res,
        "error",
        null,
        "Failed to retrieve subject offerings."
      );
    }
  }

  async update(req, res) {
    try {
      const { tenantId } = req.user;
      const updated = await SubjectOfferingService.update(
        req.params.id,
        req.body,
        tenantId
      );
      if (!updated) {
        return responseHandler(res, "error", null, "Subject offering not found.");
      }
      return responseHandler(
        res,
        "success",
        updated,
        "Subject offering updated successfully."
      );
    } catch (error) {
      logger.error("Error updating subject offering:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async delete(req, res) {
    try {
      const { tenantId } = req.user;
      const deleted = await SubjectOfferingService.delete(
        req.params.id,
        tenantId
      );
      if (!deleted) {
        return responseHandler(res, "error", null, "Subject offering not found.");
      }
      return responseHandler(
        res,
        "success",
        null,
        "Subject offering deleted successfully."
      );
    } catch (error) {
      logger.error("Error deleting subject offering:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }
}

export default new SubjectOfferingController();
