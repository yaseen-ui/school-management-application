import AttendanceService from "./attendance.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";
import { tableColumns } from "../../utils/columns.js";

class AttendanceController {
  // ---- Sessions ----

  async createSession(req, res) {
    try {
      const { tenantId } = req.user;
      const session = await AttendanceService.createSession(req.body, tenantId);
      return responseHandler(
        res,
        "success",
        session,
        "Attendance session created successfully."
      );
    } catch (error) {
      logger.error("Error creating attendance session:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getSessionById(req, res) {
    try {
      const { tenantId } = req.user;
      const session = await AttendanceService.getSessionById(
        req.params.id,
        tenantId
      );
      if (!session) {
        return responseHandler(res, "error", null, "Attendance session not found.");
      }
      return responseHandler(
        res,
        "success",
        session,
        "Attendance session retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving attendance session:", error);
      return responseHandler(
        res,
        "error",
        null,
        "Failed to retrieve attendance session."
      );
    }
  }

  async getAllSessions(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const sessions = await AttendanceService.getAllSessions(tenantId, filters);
      const result = {
        columns: tableColumns.attendanceSessions || [],
        rows: sessions,
      };
      return responseHandler(
        res,
        "success",
        result,
        "Attendance sessions retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving attendance sessions:", error);
      return responseHandler(
        res,
        "error",
        null,
        "Failed to retrieve attendance sessions."
      );
    }
  }

  async updateSession(req, res) {
    try {
      const { tenantId } = req.user;
      const updated = await AttendanceService.updateSession(
        req.params.id,
        req.body,
        tenantId
      );
      if (!updated) {
        return responseHandler(res, "error", null, "Attendance session not found.");
      }
      return responseHandler(
        res,
        "success",
        updated,
        "Attendance session updated successfully."
      );
    } catch (error) {
      logger.error("Error updating attendance session:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deleteSession(req, res) {
    try {
      const { tenantId } = req.user;
      const deleted = await AttendanceService.deleteSession(
        req.params.id,
        tenantId
      );
      if (!deleted) {
        return responseHandler(res, "error", null, "Attendance session not found.");
      }
      return responseHandler(
        res,
        "success",
        null,
        "Attendance session deleted successfully."
      );
    } catch (error) {
      logger.error("Error deleting attendance session:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ---- Marks ----

  async getMarksForSession(req, res) {
    try {
      const { tenantId } = req.user;
      const marks = await AttendanceService.getMarksForSession(
        req.params.sessionId,
        tenantId
      );
      return responseHandler(
        res,
        "success",
        marks,
        "Attendance marks retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving attendance marks:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async upsertMark(req, res) {
    try {
      const { tenantId } = req.user;
      const mark = await AttendanceService.upsertMark(req.body, tenantId);
      return responseHandler(
        res,
        "success",
        mark,
        "Attendance mark saved successfully."
      );
    } catch (error) {
      logger.error("Error saving attendance mark:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async bulkUpsertMarks(req, res) {
    try {
      const { tenantId } = req.user;
      const { sessionId, marks } = req.body;
      const result = await AttendanceService.bulkUpsertMarks(sessionId, marks, tenantId);
      return responseHandler(
        res,
        "success",
        result,
        `Saved ${result.results.length} marks with ${result.errors.length} errors.`
      );
    } catch (error) {
      logger.error("Error bulk saving attendance marks:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deleteMark(req, res) {
    try {
      const { tenantId } = req.user;
      const deleted = await AttendanceService.deleteMark(
        req.params.id,
        tenantId
      );
      if (!deleted) {
        return responseHandler(res, "error", null, "Attendance mark not found.");
      }
      return responseHandler(
        res,
        "success",
        null,
        "Attendance mark deleted successfully."
      );
    } catch (error) {
      logger.error("Error deleting attendance mark:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ---- Reports ----

  async getAttendanceSummary(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const summary = await AttendanceService.getAttendanceSummary(tenantId, filters);
      return responseHandler(
        res,
        "success",
        summary,
        "Attendance summary retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving attendance summary:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getStudentAttendance(req, res) {
    try {
      const { tenantId } = req.user;
      const { enrollmentId } = req.params;
      const filters = req.query || {};
      const records = await AttendanceService.getStudentAttendance(
        tenantId,
        enrollmentId,
        filters
      );
      return responseHandler(
        res,
        "success",
        records,
        "Student attendance records retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving student attendance:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }
}

export default new AttendanceController();
