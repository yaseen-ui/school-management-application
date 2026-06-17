import TimetableEntryService from "./timetableEntry.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";
import { tableColumns } from "../../utils/columns.js";

class TimetableEntryController {
  async create(req, res) {
    try {
      const { tenantId } = req.user;
      const entry = await TimetableEntryService.create(req.body, tenantId);
      return responseHandler(
        res,
        "success",
        entry,
        "Timetable entry created successfully."
      );
    } catch (error) {
      logger.error("Error creating timetable entry:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getById(req, res) {
    try {
      const { tenantId } = req.user;
      const entry = await TimetableEntryService.getById(
        req.params.id,
        tenantId
      );
      if (!entry) {
        return responseHandler(res, "error", null, "Timetable entry not found.");
      }
      return responseHandler(
        res,
        "success",
        entry,
        "Timetable entry retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving timetable entry:", error);
      return responseHandler(
        res,
        "error",
        null,
        "Failed to retrieve timetable entry."
      );
    }
  }

  async getAll(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const entries = await TimetableEntryService.getAll(tenantId, filters);
      const result = {
        columns: tableColumns.timetableEntries || [],
        rows: entries,
      };
      return responseHandler(
        res,
        "success",
        result,
        "Timetable entries retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving timetable entries:", error);
      return responseHandler(
        res,
        "error",
        null,
        "Failed to retrieve timetable entries."
      );
    }
  }

  async update(req, res) {
    try {
      const { tenantId } = req.user;
      const updated = await TimetableEntryService.update(
        req.params.id,
        req.body,
        tenantId
      );
      if (!updated) {
        return responseHandler(res, "error", null, "Timetable entry not found.");
      }
      return responseHandler(
        res,
        "success",
        updated,
        "Timetable entry updated successfully."
      );
    } catch (error) {
      logger.error("Error updating timetable entry:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async delete(req, res) {
    try {
      const { tenantId } = req.user;
      const deleted = await TimetableEntryService.delete(
        req.params.id,
        tenantId
      );
      if (!deleted) {
        return responseHandler(res, "error", null, "Timetable entry not found.");
      }
      return responseHandler(
        res,
        "success",
        null,
        "Timetable entry deleted successfully."
      );
    } catch (error) {
      logger.error("Error deleting timetable entry:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async bulkCreate(req, res) {
    try {
      const { tenantId } = req.user;
      const { entries } = req.body;
      const result = await TimetableEntryService.bulkCreate(entries, tenantId);
      return responseHandler(
        res,
        "success",
        result,
        `Created ${result.results.length} entries with ${result.errors.length} errors.`
      );
    } catch (error) {
      logger.error("Error bulk creating timetable entries:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getGridForSection(req, res) {
    try {
      const { tenantId } = req.user;
      const { sectionId, academicYearId } = req.params;
      const entries = await TimetableEntryService.getGridForSection(
        tenantId,
        sectionId,
        academicYearId
      );
      return responseHandler(
        res,
        "success",
        entries,
        "Timetable grid retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving timetable grid:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }
}

export default new TimetableEntryController();
