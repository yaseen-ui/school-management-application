import SectionsService from "./sections.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";
import { tableColumns } from "../../utils/columns.js";

class SectionsController {
  static async createSection(req, res) {
    try {
      const section = await SectionsService.createSection(
        req.body,
        req.tenantId
      );
      logger.info(`Section created: ${JSON.stringify(section)}`);
      return responseHandler(
        res,
        "success",
        section,
        "Section created successfully."
      );
    } catch (error) {
      logger.error(`Error creating section: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getSections(req, res) {
    try {
      const gradeId = req.query.gradeId;
      const courseId = req.query.courseId;
      const sections = await SectionsService.getSectionsWithRollStatus(req.tenantId, gradeId, courseId);
      const result = {
        rows: sections,
        columns: tableColumns.section,
      };
      return responseHandler(
        res,
        "success",
        result,
        "Sections retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving sections: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getSectionById(req, res) {
    try {
      const section = await SectionsService.getSectionById(
        req.params.id,
        req.tenantId
      );
      return responseHandler(
        res,
        "success",
        section,
        "Section retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving section: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async updateSection(req, res) {
    try {
      const section = await SectionsService.updateSection(
        req.params.id,
        req.body,
        req.tenantId
      );
      logger.info(`Section updated: ${JSON.stringify(section)}`);
      return responseHandler(
        res,
        "success",
        section,
        "Section updated successfully."
      );
    } catch (error) {
      logger.error(`Error updating section: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async deleteSection(req, res) {
    try {
      await SectionsService.deleteSection(req.params.id, req.tenantId);
      logger.info(`Section deleted: ID=${req.params.id}`);
      return responseHandler(
        res,
        "success",
        null,
        "Section deleted successfully."
      );
    } catch (error) {
      logger.error(`Error deleting section: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async generateRollNumbers(req, res) {
    try {
      const result = await SectionsService.generateRollNumbers(
        req.params.id,
        req.tenantId
      );
      logger.info(`Roll numbers generated for section ID=${req.params.id}: ${result.count} students`);
      return responseHandler(
        res,
        "success",
        result,
        result.message
      );
    } catch (error) {
      logger.error(`Error generating roll numbers: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getRollNumbersStatus(req, res) {
    try {
      const result = await SectionsService.getRollNumbersStatus(
        req.params.id,
        req.tenantId
      );
      return responseHandler(
        res,
        "success",
        result,
        "Roll numbers status retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error getting roll numbers status: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }
}

export default SectionsController;
