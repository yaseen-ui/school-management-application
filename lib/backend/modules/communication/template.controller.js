import templateService from "./template.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";

/**
 * TemplateController — Request handlers for notification templates.
 */
class TemplateController {
  /**
   * POST /api/communication/templates — Create a new template.
   */
  static async create(req, res) {
    try {
      const template = await templateService.create(req.body, req.tenantId, req.userId);
      return responseHandler(res, "success", template, "Template created successfully.");
    } catch (error) {
      logger.error(`Error creating template: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * GET /api/communication/templates — List templates.
   */
  static async list(req, res) {
    try {
      const { type, isActive, isSystem, limit, offset } = req.query;
      const result = await templateService.list({
        tenantId: req.tenantId,
        type,
        isActive: isActive !== undefined ? isActive === "true" : undefined,
        isSystem: isSystem !== undefined ? isSystem === "true" : undefined,
        limit: limit ? parseInt(limit) : 50,
        offset: offset ? parseInt(offset) : 0,
      });
      return responseHandler(res, "success", result, "Templates retrieved successfully.");
    } catch (error) {
      logger.error(`Error listing templates: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * GET /api/communication/templates/[id] — Get a single template.
   */
  static async getById(req, res) {
    try {
      const template = await templateService.getById(req.params.id, req.tenantId);
      return responseHandler(res, "success", template, "Template retrieved successfully.");
    } catch (error) {
      logger.error(`Error retrieving template: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * PATCH /api/communication/templates/[id] — Update a template.
   */
  static async update(req, res) {
    try {
      const template = await templateService.update(req.params.id, req.body, req.tenantId, req.userId);
      return responseHandler(res, "success", template, "Template updated successfully.");
    } catch (error) {
      logger.error(`Error updating template: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * DELETE /api/communication/templates/[id] — Delete a template.
   */
  static async delete(req, res) {
    try {
      const result = await templateService.delete(req.params.id, req.tenantId);
      return responseHandler(res, "success", result, "Template deleted successfully.");
    } catch (error) {
      logger.error(`Error deleting template: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * POST /api/communication/templates/[id]/preview — Preview a template with placeholder values.
   */
  static async preview(req, res) {
    try {
      const { payload } = req.body;
      const result = await templateService.preview(req.params.id, payload || {}, req.tenantId);
      return responseHandler(res, "success", result, "Template preview generated.");
    } catch (error) {
      logger.error(`Error previewing template: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }
}

export default TemplateController;