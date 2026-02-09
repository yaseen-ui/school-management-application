import StudentService from "./students.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";
import { tableColumns } from "../../utils/columns.js";

class StudentController {
  async createStudent(req, res) {
    try {
      const { tenantId } = req.user; // Extract tenantId from user session
      // academicYearId can be passed from middleware (resolveAcademicYear) or null to auto-resolve
      const academicYearId = req.academicYearId || null;
      const student = await StudentService.createStudent(
        req.body,
        tenantId,
        academicYearId
      );
      return responseHandler(
        res,
        "success",
        student,
        "Student created successfully. Use the update API to complete the profile."
      );
    } catch (error) {
      logger.error("Error creating student:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getStudentById(req, res) {
    try {
      const { tenantId } = req.user;
      const student = await StudentService.getStudentById(
        req.params.id,
        tenantId
      );
      if (!student) {
        return responseHandler(res, "error", null, "Student not found.");
      }
      return responseHandler(
        res,
        "success",
        student,
        "Student retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving student:", error);
      return responseHandler(res, "error", null, "Failed to retrieve student.");
    }
  }

  async updateStudent(req, res) {
    try {
      const { tenantId } = req.user;
      const updated = await StudentService.updateStudent(
        req.params.id,
        req.body,
        tenantId
      );
      if (!updated) {
        return responseHandler(res, "error", null, "Student not found.");
      }
      return responseHandler(
        res,
        "success",
        null,
        "Student updated successfully."
      );
    } catch (error) {
      logger.error("Error updating student:", error);
      return responseHandler(res, "error", null, "Failed to update student.");
    }
  }

  async deleteStudent(req, res) {
    try {
      const { tenantId } = req.user;
      const deleted = await StudentService.deleteStudent(
        req.params.id,
        tenantId
      );
      if (!deleted) {
        return responseHandler(res, "error", null, "Student not found.");
      }
      return responseHandler(
        res,
        "success",
        null,
        "Student deleted successfully."
      );
    } catch (error) {
      logger.error("Error deleting student:", error);
      return responseHandler(res, "error", null, "Failed to delete student.");
    }
  }

  async getAllStudents(req, res) {
    try {
      const { tenantId } = req.user;
      const studentsList = await StudentService.getAllStudents(tenantId);
      const result = {
        columns: tableColumns.students,
        rows: studentsList,
      };
      return responseHandler(
        res,
        "success",
        result,
        "Students retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving students:", error);
      return responseHandler(
        res,
        "error",
        null,
        "Failed to retrieve students."
      );
    }
  }
}

export default new StudentController();
