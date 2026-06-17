import TimetableStructureService from "./timetableStructure.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";
import { tableColumns } from "../../utils/columns.js";

class TimetableStructureController {
  async create(req, res) {
    try {
      const { tenantId } = req.user;
      const structure = await TimetableStructureService.create(req.body, tenantId);
      return responseHandler(
        res,
        "success",
        structure,
        "Timetable structure created successfully."
      );
    } catch (error) {
      logger.error("Error creating timetable structure:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getById(req, res) {
    try {
      const { tenantId } = req.user;
      const structure = await TimetableStructureService.getById(
        req.params.id,
        tenantId
      );
      if (!structure) {
        return responseHandler(res, "error", null, "Timetable structure not found.");
      }
      return responseHandler(
        res,
        "success",
        structure,
        "Timetable structure retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving timetable structure:", error);
      return responseHandler(
        res,
        "error",
        null,
        "Failed to retrieve timetable structure."
      );
    }
  }

  async getAll(req, res) {
    try {
      const { tenantId } = req.user;
      const structures = await TimetableStructureService.getAll(tenantId);
      const result = {
        columns: tableColumns.timetableStructures || [],
        rows: structures,
      };
      return responseHandler(
        res,
        "success",
        result,
        "Timetable structures retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving timetable structures:", error);
      return responseHandler(
        res,
        "error",
        null,
        "Failed to retrieve timetable structures."
      );
    }
  }

  async update(req, res) {
    try {
      const { tenantId } = req.user;
      const updated = await TimetableStructureService.update(
        req.params.id,
        req.body,
        tenantId
      );
      if (!updated) {
        return responseHandler(res, "error", null, "Timetable structure not found.");
      }
      return responseHandler(
        res,
        "success",
        updated,
        "Timetable structure updated successfully."
      );
    } catch (error) {
      logger.error("Error updating timetable structure:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async delete(req, res) {
    try {
      const { tenantId } = req.user;
      const deleted = await TimetableStructureService.delete(
        req.params.id,
        tenantId
      );
      if (!deleted) {
        return responseHandler(res, "error", null, "Timetable structure not found.");
      }
      return responseHandler(
        res,
        "success",
        null,
        "Timetable structure deleted successfully."
      );
    } catch (error) {
      logger.error("Error deleting timetable structure:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }
}

export default new TimetableStructureController();
