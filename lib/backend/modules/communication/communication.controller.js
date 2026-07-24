import { communicationService } from "./communication.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";

/**
 * CommunicationController — Request handlers for the communications API.
 */
class CommunicationController {
  /**
   * POST /api/communications — Create and optionally send a communication.
   */
  static async send(req, res) {
    try {
      const result = await communicationService.send(
        req.body,
        req.tenantId,
        req.userId
      );
      logger.info(`Communication sent: ${result.communicationId}`);
      return responseHandler(
        res,
        "success",
        result,
        "Communication processed successfully."
      );
    } catch (error) {
      logger.error(`Error sending communication: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * GET /api/communications — List sent communications history.
   */
  static async getHistory(req, res) {
    try {
      const { senderId, type, status, limit, offset } = req.query;
      const result = await communicationService.getHistory({
        tenantId: req.tenantId,
        senderId,
        type,
        status,
        limit: limit ? parseInt(limit) : 50,
        offset: offset ? parseInt(offset) : 0,
      });
      return responseHandler(
        res,
        "success",
        result,
        "Communications retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving communications: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * GET /api/communications/[id] — Get a single communication by ID.
   */
  static async getById(req, res) {
    try {
      const { prisma } = await import("../../lib/prisma.js");
      const communication = await prisma.communication.findFirst({
        where: { id: req.params.id, tenantId: req.tenantId },
        include: { _count: { select: { recipients: true } } },
      });
      if (!communication) {
        return responseHandler(res, "fail", null, "Communication not found.");
      }
      return responseHandler(
        res,
        "success",
        communication,
        "Communication retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving communication: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * PATCH /api/communications/[id] — Update a draft/scheduled communication.
   */
  static async update(req, res) {
    try {
      const { prisma } = await import("../../lib/prisma.js");
      const existing = await prisma.communication.findFirst({
        where: { id: req.params.id, tenantId: req.tenantId },
      });
      if (!existing) {
        return responseHandler(res, "fail", null, "Communication not found.");
      }
      if (existing.status !== "draft" && existing.status !== "scheduled") {
        return responseHandler(
          res,
          "fail",
          null,
          "Only draft or scheduled communications can be updated."
        );
      }
      const communication = await prisma.communication.update({
        where: { id: req.params.id, tenantId: req.tenantId },
        data: {
          title: req.body.title,
          message: req.body.message,
          priority: req.body.priority,
          actionButton: req.body.actionButton,
          scheduledAt: req.body.scheduledAt ? new Date(req.body.scheduledAt) : undefined,
          expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : undefined,
          targetUserIds: req.body.targetUserIds,
          targetRoles: req.body.targetRoles,
          targetGroups: req.body.targetGroups,
          targetGrades: req.body.targetGrades,
          targetSections: req.body.targetSections,
          targetEmployeeTypes: req.body.targetEmployeeTypes,
          targetAudience: req.body.targetAudience,
          updatedById: req.userId,
        },
      });
      logger.info(`Communication updated: ${communication.id}`);
      return responseHandler(
        res,
        "success",
        communication,
        "Communication updated successfully."
      );
    } catch (error) {
      logger.error(`Error updating communication: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * DELETE /api/communications/[id] — Cancel/delete a draft communication.
   */
  static async delete(req, res) {
    try {
      const { prisma } = await import("../../lib/prisma.js");
      const existing = await prisma.communication.findFirst({
        where: { id: req.params.id, tenantId: req.tenantId },
      });
      if (!existing) {
        return responseHandler(res, "fail", null, "Communication not found.");
      }
      if (existing.status === "sent") {
        // Don't delete sent communications — cancel instead
        await prisma.communication.update({
          where: { id: req.params.id, tenantId: req.tenantId },
          data: { status: "cancelled", updatedById: req.userId },
        });
      } else {
        await prisma.communication.delete({
          where: { id: req.params.id, tenantId: req.tenantId },
        });
      }
      logger.info(`Communication deleted/cancelled: ${req.params.id}`);
      return responseHandler(
        res,
        "success",
        null,
        "Communication deleted/cancelled successfully."
      );
    } catch (error) {
      logger.error(`Error deleting communication: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * GET /api/communications/inbox — Get inbox for current user.
   */
  static async getInbox(req, res) {
    try {
      const { isRead, limit, offset } = req.query;
      const result = await communicationService.getInbox({
        tenantId: req.tenantId,
        userId: req.userId,
        isRead: isRead !== undefined ? isRead === "true" : undefined,
        limit: limit ? parseInt(limit) : 50,
        offset: offset ? parseInt(offset) : 0,
      });
      return responseHandler(
        res,
        "success",
        result,
        "Inbox retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving inbox: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * GET /api/communications/recipients — Get delivery report for a communication.
   */
  static async getDeliveryReport(req, res) {
    try {
      const { communicationId } = req.query;
      if (!communicationId) {
        return responseHandler(
          res,
          "fail",
          null,
          "communicationId query parameter is required."
        );
      }
      const result = await communicationService.getDeliveryReport({
        communicationId,
        tenantId: req.tenantId,
      });
      return responseHandler(
        res,
        "success",
        result,
        "Delivery report retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving delivery report: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * POST /api/communications/acknowledge — Mark a communication as viewed/acknowledged.
   */
  static async acknowledge(req, res) {
    try {
      const { communicationId, action } = req.body;
      if (!communicationId) {
        return responseHandler(
          res,
          "fail",
          null,
          "communicationId is required."
        );
      }
      const result = await communicationService.acknowledge({
        communicationId,
        userId: req.userId,
        tenantId: req.tenantId,
        action: action || "viewed",
      });
      return responseHandler(
        res,
        "success",
        result,
        `Communication ${action || "viewed"} successfully.`
      );
    } catch (error) {
      logger.error(`Error acknowledging communication: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }
}

export default CommunicationController;