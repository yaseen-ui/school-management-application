import TeachersService from "./teachers.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";
import { tableColumns } from "../../utils/columns.js";

class TeachersController {
  // ==================== TEACHER CRUD ====================

  async createTeacher(req, res) {
    try {
      const { tenantId } = req.user;
      const teacher = await TeachersService.createTeacher(req.body, tenantId);
      return responseHandler(
        res,
        "success",
        teacher,
        "Teacher created successfully."
      );
    } catch (error) {
      logger.error("Error creating teacher:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getTeacherById(req, res) {
    try {
      const { tenantId } = req.user;
      const teacher = await TeachersService.getTeacherById(
        req.params.id,
        tenantId
      );
      if (!teacher) {
        return responseHandler(res, "error", null, "Teacher not found.");
      }
      return responseHandler(
        res,
        "success",
        teacher,
        "Teacher retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving teacher:", error);
      return responseHandler(res, "error", null, "Failed to retrieve teacher.");
    }
  }

  async getAllTeachers(req, res) {
    try {
      const { tenantId } = req.user;
      const teachersList = await TeachersService.getAllTeachers(tenantId);
      const result = {
        columns: tableColumns.teachers || [],
        rows: teachersList,
      };
      return responseHandler(
        res,
        "success",
        result,
        "Teachers retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving teachers:", error);
      return responseHandler(
        res,
        "error",
        null,
        "Failed to retrieve teachers."
      );
    }
  }

  async updateTeacher(req, res) {
    try {
      const { tenantId } = req.user;
      const updated = await TeachersService.updateTeacher(
        req.params.id,
        req.body,
        tenantId
      );
      if (!updated) {
        return responseHandler(res, "error", null, "Teacher not found.");
      }
      return responseHandler(
        res,
        "success",
        updated,
        "Teacher updated successfully."
      );
    } catch (error) {
      logger.error("Error updating teacher:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deleteTeacher(req, res) {
    try {
      const { tenantId } = req.user;
      const deleted = await TeachersService.deleteTeacher(
        req.params.id,
        tenantId
      );
      if (!deleted) {
        return responseHandler(res, "error", null, "Teacher not found.");
      }
      return responseHandler(
        res,
        "success",
        null,
        "Teacher deleted successfully."
      );
    } catch (error) {
      logger.error("Error deleting teacher:", error);
      return responseHandler(res, "error", null, "Failed to delete teacher.");
    }
  }

  // ==================== QUALIFICATIONS ====================

  async addQualification(req, res) {
    try {
      const { tenantId } = req.user;
      const { teacherId } = req.params;
      const qualification = await TeachersService.addQualification(
        teacherId,
        req.body,
        tenantId
      );
      return responseHandler(
        res,
        "success",
        qualification,
        "Qualification added successfully."
      );
    } catch (error) {
      logger.error("Error adding qualification:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getQualificationById(req, res) {
    try {
      const { tenantId } = req.user;
      const { qualificationId } = req.params;
      const qualification = await TeachersService.getQualificationById(
        qualificationId,
        tenantId
      );
      if (!qualification) {
        return responseHandler(res, "error", null, "Qualification not found.");
      }
      return responseHandler(
        res,
        "success",
        qualification,
        "Qualification retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving qualification:", error);
      return responseHandler(
        res,
        "error",
        null,
        "Failed to retrieve qualification."
      );
    }
  }

  async getQualificationsByTeacher(req, res) {
    try {
      const { tenantId } = req.user;
      const { teacherId } = req.params;
      const qualifications = await TeachersService.getQualificationsByTeacher(
        teacherId,
        tenantId
      );
      return responseHandler(
        res,
        "success",
        qualifications,
        "Qualifications retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving qualifications:", error);
      return responseHandler(
        res,
        "error",
        null,
        "Failed to retrieve qualifications."
      );
    }
  }

  async updateQualification(req, res) {
    try {
      const { tenantId } = req.user;
      const { qualificationId } = req.params;
      const updated = await TeachersService.updateQualification(
        qualificationId,
        req.body,
        tenantId
      );
      if (!updated) {
        return responseHandler(res, "error", null, "Qualification not found.");
      }
      return responseHandler(
        res,
        "success",
        updated,
        "Qualification updated successfully."
      );
    } catch (error) {
      logger.error("Error updating qualification:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deleteQualification(req, res) {
    try {
      const { tenantId } = req.user;
      const { qualificationId } = req.params;
      const deleted = await TeachersService.deleteQualification(
        qualificationId,
        tenantId
      );
      if (!deleted) {
        return responseHandler(res, "error", null, "Qualification not found.");
      }
      return responseHandler(
        res,
        "success",
        null,
        "Qualification deleted successfully."
      );
    } catch (error) {
      logger.error("Error deleting qualification:", error);
      return responseHandler(
        res,
        "error",
        null,
        "Failed to delete qualification."
      );
    }
  }

  // ==================== EMPLOYMENT HISTORY ====================

  async addEmploymentHistory(req, res) {
    try {
      const { tenantId } = req.user;
      const { teacherId } = req.params;
      const employmentRecord = await TeachersService.addEmploymentHistory(
        teacherId,
        req.body,
        tenantId
      );
      return responseHandler(
        res,
        "success",
        employmentRecord,
        "Employment history added successfully."
      );
    } catch (error) {
      logger.error("Error adding employment history:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getEmploymentHistoryById(req, res) {
    try {
      const { tenantId } = req.user;
      const { employmentHistoryId } = req.params;
      const employmentRecord = await TeachersService.getEmploymentHistoryById(
        employmentHistoryId,
        tenantId
      );
      if (!employmentRecord) {
        return responseHandler(
          res,
          "error",
          null,
          "Employment history record not found."
        );
      }
      return responseHandler(
        res,
        "success",
        employmentRecord,
        "Employment history retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving employment history:", error);
      return responseHandler(
        res,
        "error",
        null,
        "Failed to retrieve employment history."
      );
    }
  }

  async getEmploymentHistoryByTeacher(req, res) {
    try {
      const { tenantId } = req.user;
      const { teacherId } = req.params;
      const employmentRecords =
        await TeachersService.getEmploymentHistoryByTeacher(teacherId, tenantId);
      return responseHandler(
        res,
        "success",
        employmentRecords,
        "Employment history retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving employment history:", error);
      return responseHandler(
        res,
        "error",
        null,
        "Failed to retrieve employment history."
      );
    }
  }

  async updateEmploymentHistory(req, res) {
    try {
      const { tenantId } = req.user;
      const { employmentHistoryId } = req.params;
      const updated = await TeachersService.updateEmploymentHistory(
        employmentHistoryId,
        req.body,
        tenantId
      );
      if (!updated) {
        return responseHandler(
          res,
          "error",
          null,
          "Employment history record not found."
        );
      }
      return responseHandler(
        res,
        "success",
        updated,
        "Employment history updated successfully."
      );
    } catch (error) {
      logger.error("Error updating employment history:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deleteEmploymentHistory(req, res) {
    try {
      const { tenantId } = req.user;
      const { employmentHistoryId } = req.params;
      const deleted = await TeachersService.deleteEmploymentHistory(
        employmentHistoryId,
        tenantId
      );
      if (!deleted) {
        return responseHandler(
          res,
          "error",
          null,
          "Employment history record not found."
        );
      }
      return responseHandler(
        res,
        "success",
        null,
        "Employment history deleted successfully."
      );
    } catch (error) {
      logger.error("Error deleting employment history:", error);
      return responseHandler(
        res,
        "error",
        null,
        "Failed to delete employment history."
      );
    }
  }
}

export default new TeachersController();
