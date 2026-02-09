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
      const sections = await SectionsService.getSections(req.tenantId, gradeId);
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
}

export default SectionsController;
