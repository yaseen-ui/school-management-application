import AttendanceService from "./attendance.service.js";
import AttendanceTypeService from "./attendance-type.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";
import { tableColumns } from "../../utils/columns.js";

class AttendanceController {
  // ---- Attendance Types ----

  async createType(req, res) {
    try {
      const { tenantId } = req.user;
      const type = await AttendanceTypeService.create(req.body, tenantId);
      return responseHandler(res, "success", type, "Attendance type created successfully.");
    } catch (error) {
      logger.error("Error creating attendance type:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getAllTypes(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const types = await AttendanceTypeService.getAll(tenantId, filters);
      return responseHandler(res, "success", types, "Attendance types retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving attendance types:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getTypeById(req, res) {
    try {
      const { tenantId } = req.user;
      const type = await AttendanceTypeService.getById(req.params.id, tenantId);
      if (!type) return responseHandler(res, "error", null, "Attendance type not found.");
      return responseHandler(res, "success", type, "Attendance type retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving attendance type:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async updateType(req, res) {
    try {
      const { tenantId } = req.user;
      const updated = await AttendanceTypeService.update(req.params.id, req.body, tenantId);
      if (!updated) return responseHandler(res, "error", null, "Attendance type not found.");
      return responseHandler(res, "success", updated, "Attendance type updated successfully.");
    } catch (error) {
      logger.error("Error updating attendance type:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deleteType(req, res) {
    try {
      const { tenantId } = req.user;
      const deleted = await AttendanceTypeService.delete(req.params.id, tenantId);
      if (!deleted) return responseHandler(res, "error", null, "Attendance type not found.");
      return responseHandler(res, "success", null, "Attendance type deleted successfully.");
    } catch (error) {
      logger.error("Error deleting attendance type:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ---- Sessions ----

  async createSession(req, res) {
    try {
      const { tenantId } = req.user;
      const session = await AttendanceService.createSession(req.body, tenantId);
      return responseHandler(res, "success", session, "Attendance session created successfully.");
    } catch (error) {
      logger.error("Error creating attendance session:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getSessionById(req, res) {
    try {
      const { tenantId } = req.user;
      const session = await AttendanceService.getSessionById(req.params.id, tenantId);
      if (!session) return responseHandler(res, "error", null, "Attendance session not found.");
      return responseHandler(res, "success", session, "Attendance session retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving attendance session:", error);
      return responseHandler(res, "error", null, "Failed to retrieve attendance session.");
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
      return responseHandler(res, "success", result, "Attendance sessions retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving attendance sessions:", error);
      return responseHandler(res, "error", null, "Failed to retrieve attendance sessions.");
    }
  }

  async updateSession(req, res) {
    try {
      const { tenantId } = req.user;
      const updated = await AttendanceService.updateSession(req.params.id, req.body, tenantId);
      if (!updated) return responseHandler(res, "error", null, "Attendance session not found.");
      return responseHandler(res, "success", updated, "Attendance session updated successfully.");
    } catch (error) {
      logger.error("Error updating attendance session:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deleteSession(req, res) {
    try {
      const { tenantId } = req.user;
      const deleted = await AttendanceService.deleteSession(req.params.id, tenantId);
      if (!deleted) return responseHandler(res, "error", null, "Attendance session not found.");
      return responseHandler(res, "success", null, "Attendance session deleted successfully.");
    } catch (error) {
      logger.error("Error deleting attendance session:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ---- Mark Attendance (combined create-session + marks) ----

  async markAttendance(req, res) {
    try {
      const { tenantId } = req.user;
      const result = await AttendanceService.markAttendance(req.body, tenantId);
      return responseHandler(res, "success", result, `Saved ${result.results.length} marks with ${result.errors.length} errors.`);
    } catch (error) {
      logger.error("Error marking attendance:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ---- Marks ----

  async getMarksForSession(req, res) {
    try {
      const { tenantId } = req.user;
      const marks = await AttendanceService.getMarksForSession(req.params.sessionId, tenantId);
      return responseHandler(res, "success", marks, "Attendance marks retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving attendance marks:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async upsertMark(req, res) {
    try {
      const { tenantId } = req.user;
      const mark = await AttendanceService.upsertMark(req.body, tenantId);
      return responseHandler(res, "success", mark, "Attendance mark saved successfully.");
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
      return responseHandler(res, "success", result, `Saved ${result.results.length} marks with ${result.errors.length} errors.`);
    } catch (error) {
      logger.error("Error bulk saving attendance marks:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deleteMark(req, res) {
    try {
      const { tenantId } = req.user;
      const deleted = await AttendanceService.deleteMark(req.params.id, tenantId);
      if (!deleted) return responseHandler(res, "error", null, "Attendance mark not found.");
      return responseHandler(res, "success", null, "Attendance mark deleted successfully.");
    } catch (error) {
      logger.error("Error deleting attendance mark:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ---- Context Options ----

  async getContextOptions(req, res) {
    try {
      const { tenantId } = req.user;
      const { sectionId, attendanceTypeId } = req.query;
      if (!sectionId || !attendanceTypeId) {
        return responseHandler(res, "error", null, "sectionId and attendanceTypeId are required.");
      }
      const result = await AttendanceService.getContextOptions(tenantId, sectionId, attendanceTypeId);
      return responseHandler(res, "success", result, "Context options retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving context options:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ---- Reports ----

  async getAttendanceSummary(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const summary = await AttendanceService.getAttendanceSummary(tenantId, filters);
      return responseHandler(res, "success", summary, "Attendance summary retrieved successfully.");
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
      const records = await AttendanceService.getStudentAttendance(tenantId, enrollmentId, filters);
      return responseHandler(res, "success", records, "Student attendance records retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving student attendance:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ---- Register ----

  async getAttendanceRegister(req, res) {
    try {
      const { tenantId } = req.user;
      const { sectionId, month, year } = req.query;
      if (!sectionId || !month || !year) {
        return responseHandler(res, "error", null, "sectionId, month, and year are required.");
      }
      const result = await AttendanceService.getAttendanceRegister(tenantId, sectionId, parseInt(month), parseInt(year));
      return responseHandler(res, "success", result, "Attendance register retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving attendance register:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getStudentAttendanceDetail(req, res) {
    try {
      const { tenantId } = req.user;
      const { enrollmentId } = req.params;
      const { month, year } = req.query;
      if (!month || !year) {
        return responseHandler(res, "error", null, "month and year are required.");
      }
      const result = await AttendanceService.getStudentAttendanceDetail(tenantId, enrollmentId, parseInt(month), parseInt(year));
      return responseHandler(res, "success", result, "Student attendance detail retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving student attendance detail:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }
}

export default new AttendanceController();