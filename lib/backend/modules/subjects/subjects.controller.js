import SubjectsService from "./subjects.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";

class SubjectsController {
  static async createSubject(req, res) {
    try {
      const subject = await SubjectsService.createSubject(
        req.body,
        req.tenantId
      );
      logger.info(`Subject created: ${JSON.stringify(subject)}`);
      return responseHandler(
        res,
        "success",
        subject,
        "Subject created successfully."
      );
    } catch (error) {
      logger.error(`Error creating subject: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getSubjects(req, res) {
    try {
      const subjects = await SubjectsService.getSubjects(req.tenantId);
      return responseHandler(
        res,
        "success",
        subjects,
        "Subjects retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving subjects: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getSubjectById(req, res) {
    try {
      const { id } = req.params;
      const subject = await SubjectsService.getSubjectById(id, req.tenantId);
      return responseHandler(
        res,
        "success",
        subject,
        "Subject retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving subject: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getSubjectsByCourse(req, res) {
    try {
      const { courseId } = req.params;
      console.log("Fetching subjects for course ID:", courseId);
      const subjects = await SubjectsService.getSubjectsByCourse(
        courseId,
        req.tenantId
      );
      return responseHandler(
        res,
        "success",
        subjects,
        "Subjects retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving subjects by course: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async updateSubject(req, res) {
    try {
      const subject = await SubjectsService.updateSubject(
        req.params.id,
        req.body,
        req.tenantId
      );
      logger.info(`Subject updated: ${JSON.stringify(subject)}`);
      return responseHandler(
        res,
        "success",
        subject,
        "Subject updated successfully."
      );
    } catch (error) {
      logger.error(`Error updating subject: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async deleteSubject(req, res) {
    try {
      await SubjectsService.deleteSubject(req.params.id, req.tenantId);
      logger.info(`Subject deleted: ID=${req.params.id}`);
      return responseHandler(
        res,
        "success",
        null,
        "Subject deleted successfully."
      );
    } catch (error) {
      logger.error(`Error deleting subject: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }
}

export default SubjectsController;
