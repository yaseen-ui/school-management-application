import GradesService from "./grades.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";
import { tableColumns } from "../../utils/columns.js";

class GradesController {
  static async createGrade(req, res) {
    try {
      console.log("Tenant ID:", req.tenantId, "Request Body:", req.body);
      const grade = await GradesService.createGrade(req.body, req.tenantId);
      return responseHandler(
        res,
        "success",
        grade,
        "Grade created successfully."
      );
    } catch (error) {
      logger.error(`Error creating grade: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getGrades(req, res) {
    try {
      const grades = await GradesService.getGrades(
        req.tenantId,
        req.query.courseId
      );
      const result = {
        rows: grades,
        columns: tableColumns.grades,
      };
      return responseHandler(
        res,
        "success",
        result,
        "Grades retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving grades: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getGradeById(req, res) {
    try {
      const gradeId = req.params.id;
      const grade = await GradesService.getGradeById(gradeId, req.tenantId);
      return responseHandler(
        res,
        "success",
        grade,
        "Grade retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving grade: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async updateGrade(req, res) {
    try {
      const { id } = req.params;
      const updatedGrade = await GradesService.updateGrade(
        id,
        req.body,
        req.tenantId
      );
      if (!updatedGrade) {
        logger.warn(`Grade not found for ID: ${id}`);
        return responseHandler(res, "fail", null, "Grade not found.");
      }
      logger.info(`Grade updated: ID=${id}`);
      return responseHandler(
        res,
        "success",
        updatedGrade,
        "Grade updated successfully."
      );
    } catch (error) {
      logger.error(`Error updating grade: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async deleteGrade(req, res) {
    try {
      const { id } = req.params;
      const deleted = await GradesService.deleteGrade(id, req.tenantId);
      if (!deleted) {
        logger.warn(`Grade not found for deletion: ID=${id}`);
        return responseHandler(res, "fail", null, "Grade not found.");
      }
      logger.info(`Grade deleted: ID=${id}`);
      return responseHandler(
        res,
        "success",
        null,
        "Grade deleted successfully."
      );
    } catch (error) {
      logger.error(`Error deleting grade: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }
}

export default GradesController;
