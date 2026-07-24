import { prisma } from "../../lib/prisma.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";

/**
 * RulesController — Request handlers for automation rules.
 */
class RulesController {
  /**
   * POST /api/communication/rules — Create a new automation rule.
   */
  static async create(req, res) {
    try {
      const rule = await prisma.automationRule.create({
        data: {
          tenantId: req.tenantId,
          name: req.body.name,
          description: req.body.description || null,
          sourceModule: req.body.sourceModule,
          event: req.body.event,
          templateId: req.body.templateId,
          channels: req.body.channels || ["in_app"],
          isEnabled: req.body.isEnabled !== undefined ? req.body.isEnabled : true,
          cooldownMinutes: req.body.cooldownMinutes || null,
          filterCriteria: req.body.filterCriteria || null,
        },
      });
      logger.info(`Automation rule created: ${rule.id} (${rule.name})`);
      return responseHandler(res, "success", rule, "Automation rule created successfully.");
    } catch (error) {
      logger.error(`Error creating automation rule: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * GET /api/communication/rules — List automation rules.
   */
  static async list(req, res) {
    try {
      const { sourceModule, isEnabled, limit, offset } = req.query;
      const where = { tenantId: req.tenantId };
      if (sourceModule) where.sourceModule = sourceModule;
      if (isEnabled !== undefined) where.isEnabled = isEnabled === "true";

      const [items, total] = await Promise.all([
        prisma.automationRule.findMany({
          where,
          include: {
            template: { select: { id: true, name: true, subject: true } },
          },
          orderBy: { sourceModule: "asc" },
          take: limit ? parseInt(limit) : 50,
          skip: offset ? parseInt(offset) : 0,
        }),
        prisma.automationRule.count({ where }),
      ]);

      return responseHandler(res, "success", { items, total }, "Rules retrieved successfully.");
    } catch (error) {
      logger.error(`Error listing automation rules: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * GET /api/communication/rules/[id] — Get a single rule.
   */
  static async getById(req, res) {
    try {
      const rule = await prisma.automationRule.findFirst({
        where: { id: req.params.id, tenantId: req.tenantId },
        include: {
          template: true,
        },
      });
      if (!rule) {
        return responseHandler(res, "fail", null, "Rule not found.");
      }
      return responseHandler(res, "success", rule, "Rule retrieved successfully.");
    } catch (error) {
      logger.error(`Error retrieving rule: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * PATCH /api/communication/rules/[id] — Update an automation rule.
   */
  static async update(req, res) {
    try {
      const existing = await prisma.automationRule.findFirst({
        where: { id: req.params.id, tenantId: req.tenantId },
      });
      if (!existing) {
        return responseHandler(res, "fail", null, "Rule not found.");
      }

      const rule = await prisma.automationRule.update({
        where: { id: req.params.id, tenantId: req.tenantId },
        data: {
          name: req.body.name,
          description: req.body.description,
          sourceModule: req.body.sourceModule,
          event: req.body.event,
          templateId: req.body.templateId,
          channels: req.body.channels,
          isEnabled: req.body.isEnabled,
          cooldownMinutes: req.body.cooldownMinutes,
          filterCriteria: req.body.filterCriteria,
        },
      });

      logger.info(`Automation rule updated: ${rule.id}`);
      return responseHandler(res, "success", rule, "Rule updated successfully.");
    } catch (error) {
      logger.error(`Error updating rule: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * DELETE /api/communication/rules/[id] — Delete an automation rule.
   */
  static async delete(req, res) {
    try {
      const existing = await prisma.automationRule.findFirst({
        where: { id: req.params.id, tenantId: req.tenantId },
      });
      if (!existing) {
        return responseHandler(res, "fail", null, "Rule not found.");
      }

      await prisma.automationRule.delete({
        where: { id: req.params.id, tenantId: req.tenantId },
      });

      logger.info(`Automation rule deleted: ${req.params.id}`);
      return responseHandler(res, "success", { deleted: true }, "Rule deleted successfully.");
    } catch (error) {
      logger.error(`Error deleting rule: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * POST /api/communication/rules/[id]/toggle — Enable/disable a rule.
   */
  static async toggle(req, res) {
    try {
      const existing = await prisma.automationRule.findFirst({
        where: { id: req.params.id, tenantId: req.tenantId },
      });
      if (!existing) {
        return responseHandler(res, "fail", null, "Rule not found.");
      }

      const rule = await prisma.automationRule.update({
        where: { id: req.params.id, tenantId: req.tenantId },
        data: { isEnabled: req.body.isEnabled !== undefined ? req.body.isEnabled : !existing.isEnabled },
      });

      logger.info(`Automation rule toggled: ${rule.id} -> ${rule.isEnabled ? "enabled" : "disabled"}`);
      return responseHandler(res, "success", rule, `Rule ${rule.isEnabled ? "enabled" : "disabled"} successfully.`);
    } catch (error) {
      logger.error(`Error toggling rule: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }
}

export default RulesController;