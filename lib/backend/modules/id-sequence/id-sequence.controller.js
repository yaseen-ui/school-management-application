import idSequenceService from "./id-sequence.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";

/** Safe utility to get tenant context from req (works with or without JWT) */
function getContext(req) {
  const tenantId = req.user?.tenantId || req.tenantId || null;
  const userId = req.user?.userId || null;
  return { tenantId, userId };
}

class IdSequenceController {
  /**
   * GET /api/settings/id-sequences
   * List all patterns for the tenant
   */
  async getAllPatterns(req, res) {
    try {
      const { tenantId } = getContext(req);
      const { entityType } = req.query;
      const patterns = await idSequenceService.getPatterns(tenantId, entityType || null);
      return responseHandler(res, "success", patterns, "Patterns retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving ID sequence patterns:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  /**
   * GET /api/settings/id-sequences/:id
   * Get a single pattern with recent logs
   */
  async getPatternById(req, res) {
    try {
      const { tenantId } = getContext(req);
      const { id } = req.params;
      const pattern = await idSequenceService.getPatternById(id, tenantId);
      if (!pattern) {
        return responseHandler(res, "error", null, "Pattern not found.");
      }
      return responseHandler(res, "success", pattern, "Pattern retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving ID sequence pattern:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  /**
   * POST /api/settings/id-sequences
   * Create or update a pattern
   */
  async upsertPattern(req, res) {
    try {
      const { tenantId, userId } = getContext(req);
      const { entityType, academicYearId, pattern, isActive } = req.body;

      if (!entityType || !pattern) {
        return responseHandler(res, "error", null, "entityType and pattern are required.");
      }

      if (!["admission", "employee_code"].includes(entityType)) {
        return responseHandler(res, "error", null, 'entityType must be "admission" or "employee_code".');
      }

      if (!pattern.includes("{SEQ:")) {
        return responseHandler(res, "error", null, 'Pattern must include a {SEQ:N} placeholder, e.g., "13091A{SEQ:4}".');
      }

      const result = await idSequenceService.upsertPattern(tenantId, {
        entityType,
        academicYearId: academicYearId || null,
        pattern,
        isActive,
      }, userId);

      return responseHandler(res, "success", result, "Pattern saved successfully.");
    } catch (error) {
      logger.error("Error upserting ID sequence pattern:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  /**
   * PUT /api/settings/id-sequences/:id
   * Update an existing pattern
   */
  async updatePattern(req, res) {
    try {
      const { tenantId, userId } = getContext(req);
      const { id } = req.params;
      const { pattern, isActive, academicYearId } = req.body;

      if (pattern && !pattern.includes("{SEQ:")) {
        return responseHandler(res, "error", null, 'Pattern must include a {SEQ:N} placeholder, e.g., "13091A{SEQ:4}".');
      }

      const result = await idSequenceService.updatePattern(id, tenantId, {
        pattern,
        isActive,
        academicYearId,
        updatedById: userId,
      });
      return responseHandler(res, "success", result, "Pattern updated successfully.");
    } catch (error) {
      logger.error("Error updating ID sequence pattern:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  /**
   * GET /api/settings/id-sequences/logs
   * Get recent ID generation logs
   */
  async getLogs(req, res) {
    try {
      const { tenantId } = getContext(req);
      const { entityType, limit } = req.query;
      const logs = await idSequenceService.getLogs(tenantId, {
        entityType: entityType || null,
        limit: limit ? parseInt(limit, 10) : 50,
      });
      return responseHandler(res, "success", logs, "Logs retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving ID sequence logs:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  /**
   * GET /api/settings/id-sequences/next
   * Preview the next ID without incrementing
   */
  async previewNextId(req, res) {
    try {
      const { tenantId } = getContext(req);
      const { entityType, academicYearId } = req.query;

      if (!entityType) {
        return responseHandler(res, "error", null, "entityType is required.");
      }

      const nextId = await idSequenceService.previewNextId(tenantId, entityType, academicYearId || null);
      return responseHandler(res, "success", { nextId, entityType, academicYearId: academicYearId || null }, "Preview retrieved.");
    } catch (error) {
      logger.error("Error previewing ID:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }
}

export default new IdSequenceController();