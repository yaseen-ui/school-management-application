import TeacherAssignmentService from "./teacherAssignment.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";
import { tableColumns } from "../../utils/columns.js";

class TeacherAssignmentController {
  async create(req, res) {
    try {
      const { tenantId } = req.user;
      const { overrideCapabilityCheck } = req.query;
      const options = {
        overrideCapabilityCheck: overrideCapabilityCheck === "true",
      };
      const assignment = await TeacherAssignmentService.create(
        req.body,
        tenantId,
        options
      );
      return responseHandler(
        res,
        "success",
        assignment,
        "Teacher assignment created successfully."
      );
    } catch (error) {
      logger.error("Error creating teacher assignment:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getById(req, res) {
    try {
      const { tenantId } = req.user;
      const assignment = await TeacherAssignmentService.getById(
        req.params.id,
        tenantId
      );
      if (!assignment) {
        return responseHandler(res, "error", null, "Teacher assignment not found.");
      }
      return responseHandler(
        res,
        "success",
        assignment,
        "Teacher assignment retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving teacher assignment:", error);
      return responseHandler(
        res,
        "error",
        null,
        "Failed to retrieve teacher assignment."
      );
    }
  }

  async getAll(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const assignments = await TeacherAssignmentService.getAll(tenantId, filters);
      const result = {
        columns: tableColumns.teacherAssignments || [],
        rows: assignments,
      };
      return responseHandler(
        res,
        "success",
        result,
        "Teacher assignments retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving teacher assignments:", error);
      return responseHandler(
        res,
        "error",
        null,
        "Failed to retrieve teacher assignments."
      );
    }
  }

  async update(req, res) {
    try {
      const { tenantId } = req.user;
      const updated = await TeacherAssignmentService.update(
        req.params.id,
        req.body,
        tenantId
      );
      if (!updated) {
        return responseHandler(res, "error", null, "Teacher assignment not found.");
      }
      return responseHandler(
        res,
        "success",
        updated,
        "Teacher assignment updated successfully."
      );
    } catch (error) {
      logger.error("Error updating teacher assignment:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async delete(req, res) {
    try {
      const { tenantId } = req.user;
      const deleted = await TeacherAssignmentService.delete(
        req.params.id,
        tenantId
      );
      if (!deleted) {
        return responseHandler(res, "error", null, "Teacher assignment not found.");
      }
      return responseHandler(
        res,
        "success",
        null,
        "Teacher assignment deleted successfully."
      );
    } catch (error) {
      logger.error("Error deleting teacher assignment:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }
}

export default new TeacherAssignmentController();
