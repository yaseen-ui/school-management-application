import StaffAttendanceService from "./staffAttendance.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";
import { tableColumns } from "../../utils/columns.js";

class StaffAttendanceController {
  // ---- Check-in / Check-out (self-service) ----

  async checkIn(req, res) {
    try {
      const { tenantId, id: userId } = req.user;
      const record = await StaffAttendanceService.checkIn(tenantId, userId, req.body);
      return responseHandler(
        res,
        "success",
        record,
        "Check-in recorded successfully."
      );
    } catch (error) {
      logger.error("Error during staff check-in:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async checkOut(req, res) {
    try {
      const { tenantId, id: userId } = req.user;
      const record = await StaffAttendanceService.checkOut(tenantId, userId, req.body);
      return responseHandler(
        res,
        "success",
        record,
        "Check-out recorded successfully."
      );
    } catch (error) {
      logger.error("Error during staff check-out:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getMyToday(req, res) {
    try {
      const { tenantId, id: userId } = req.user;
      const record = await StaffAttendanceService.getMyToday(tenantId, userId);
      return responseHandler(
        res,
        "success",
        record,
        "Today's attendance retrieved."
      );
    } catch (error) {
      logger.error("Error retrieving my today attendance:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ---- CRUD (admin) ----

  async getById(req, res) {
    try {
      const { tenantId } = req.user;
      const record = await StaffAttendanceService.getById(req.params.id, tenantId);
      if (!record) {
        return responseHandler(res, "error", null, "Staff attendance record not found.");
      }
      return responseHandler(
        res,
        "success",
        record,
        "Staff attendance record retrieved."
      );
    } catch (error) {
      logger.error("Error retrieving staff attendance:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getAll(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const records = await StaffAttendanceService.getAll(tenantId, filters);
      const result = {
        columns: tableColumns.staffAttendances || [],
        rows: records,
      };
      return responseHandler(
        res,
        "success",
        result,
        "Staff attendance records retrieved."
      );
    } catch (error) {
      logger.error("Error retrieving staff attendance records:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getTodayAll(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const records = await StaffAttendanceService.getTodayAll(tenantId, filters);
      const result = {
        columns: tableColumns.staffAttendances || [],
        rows: records,
      };
      return responseHandler(
        res,
        "success",
        result,
        "Today's staff attendance retrieved."
      );
    } catch (error) {
      logger.error("Error retrieving today's staff attendance:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async create(req, res) {
    try {
      const { tenantId } = req.user;
      const record = await StaffAttendanceService.create(tenantId, req.body);
      return responseHandler(
        res,
        "success",
        record,
        "Staff attendance record created."
      );
    } catch (error) {
      logger.error("Error creating staff attendance:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async update(req, res) {
    try {
      const { tenantId } = req.user;
      const updated = await StaffAttendanceService.update(
        req.params.id,
        tenantId,
        req.body
      );
      if (!updated) {
        return responseHandler(res, "error", null, "Staff attendance record not found.");
      }
      return responseHandler(
        res,
        "success",
        updated,
        "Staff attendance record updated."
      );
    } catch (error) {
      logger.error("Error updating staff attendance:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async delete(req, res) {
    try {
      const { tenantId } = req.user;
      const deleted = await StaffAttendanceService.delete(req.params.id, tenantId);
      if (!deleted) {
        return responseHandler(res, "error", null, "Staff attendance record not found.");
      }
      return responseHandler(
        res,
        "success",
        null,
        "Staff attendance record deleted."
      );
    } catch (error) {
      logger.error("Error deleting staff attendance:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ---- Reports ----

  async getReport(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const report = await StaffAttendanceService.getReport(tenantId, filters);
      return responseHandler(
        res,
        "success",
        report,
        "Staff attendance report retrieved."
      );
    } catch (error) {
      logger.error("Error retrieving staff attendance report:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }
}

export default new StaffAttendanceController();