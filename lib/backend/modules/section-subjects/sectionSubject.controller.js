import SectionSubjectService from "./sectionSubject.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";
import { tableColumns } from "../../utils/columns.js";

class SectionSubjectController {
  async create(req, res) {
    try {
      const { tenantId } = req.user;
      const sectionSubject = await SectionSubjectService.create(req.body, tenantId);
      return responseHandler(
        res,
        "success",
        sectionSubject,
        "Section subject created successfully."
      );
    } catch (error) {
      logger.error("Error creating section subject:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getById(req, res) {
    try {
      const { tenantId } = req.user;
      const sectionSubject = await SectionSubjectService.getById(
        req.params.id,
        tenantId
      );
      if (!sectionSubject) {
        return responseHandler(res, "error", null, "Section subject not found.");
      }
      return responseHandler(
        res,
        "success",
        sectionSubject,
        "Section subject retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving section subject:", error);
      return responseHandler(
        res,
        "error",
        null,
        "Failed to retrieve section subject."
      );
    }
  }

  async getAll(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const sectionSubjects = await SectionSubjectService.getAll(tenantId, filters);
      const result = {
        columns: tableColumns.sectionSubjects || [],
        rows: sectionSubjects,
      };
      return responseHandler(
        res,
        "success",
        result,
        "Section subjects retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving section subjects:", error);
      return responseHandler(
        res,
        "error",
        null,
        "Failed to retrieve section subjects."
      );
    }
  }

  async update(req, res) {
    try {
      const { tenantId } = req.user;
      const updated = await SectionSubjectService.update(
        req.params.id,
        req.body,
        tenantId
      );
      if (!updated) {
        return responseHandler(res, "error", null, "Section subject not found.");
      }
      return responseHandler(
        res,
        "success",
        updated,
        "Section subject updated successfully."
      );
    } catch (error) {
      logger.error("Error updating section subject:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async delete(req, res) {
    try {
      const { tenantId } = req.user;
      const deleted = await SectionSubjectService.delete(
        req.params.id,
        tenantId
      );
      if (!deleted) {
        return responseHandler(res, "error", null, "Section subject not found.");
      }
      return responseHandler(
        res,
        "success",
        null,
        "Section subject deleted successfully."
      );
    } catch (error) {
      logger.error("Error deleting section subject:", error);
      return responseHandler(res, "error", null, "Failed to delete section subject.");
    }
  }
}

export default new SectionSubjectController();
