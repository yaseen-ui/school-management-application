import TimetablePeriodService from "./timetablePeriod.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";
import { tableColumns } from "../../utils/columns.js";

class TimetablePeriodController {
  async create(req, res) {
    try {
      const { tenantId } = req.user;
      const period = await TimetablePeriodService.create(req.body, tenantId);
      return responseHandler(
        res,
        "success",
        period,
        "Timetable period created successfully."
      );
    } catch (error) {
      logger.error("Error creating timetable period:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getById(req, res) {
    try {
      const { tenantId } = req.user;
      const period = await TimetablePeriodService.getById(
        req.params.id,
        tenantId
      );
      if (!period) {
        return responseHandler(res, "error", null, "Timetable period not found.");
      }
      return responseHandler(
        res,
        "success",
        period,
        "Timetable period retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving timetable period:", error);
      return responseHandler(
        res,
        "error",
        null,
        "Failed to retrieve timetable period."
      );
    }
  }

  async getAll(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const periods = await TimetablePeriodService.getAll(tenantId, filters);
      const result = {
        columns: tableColumns.timetablePeriods || [],
        rows: periods,
      };
      return responseHandler(
        res,
        "success",
        result,
        "Timetable periods retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving timetable periods:", error);
      return responseHandler(
        res,
        "error",
        null,
        "Failed to retrieve timetable periods."
      );
    }
  }

  async update(req, res) {
    try {
      const { tenantId } = req.user;
      const updated = await TimetablePeriodService.update(
        req.params.id,
        req.body,
        tenantId
      );
      if (!updated) {
        return responseHandler(res, "error", null, "Timetable period not found.");
      }
      return responseHandler(
        res,
        "success",
        updated,
        "Timetable period updated successfully."
      );
    } catch (error) {
      logger.error("Error updating timetable period:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async delete(req, res) {
    try {
      const { tenantId } = req.user;
      const deleted = await TimetablePeriodService.delete(
        req.params.id,
        tenantId
      );
      if (!deleted) {
        return responseHandler(res, "error", null, "Timetable period not found.");
      }
      return responseHandler(
        res,
        "success",
        null,
        "Timetable period deleted successfully."
      );
    } catch (error) {
      logger.error("Error deleting timetable period:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }
}

export default new TimetablePeriodController();
