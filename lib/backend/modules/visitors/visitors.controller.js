import VisitorsService from "./visitors.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";

class VisitorsController {
  // ==================== VISITOR PURPOSES ====================

  async createPurpose(req, res) {
    try {
      const { tenantId } = req.user;
      const data = { ...req.body, createdById: req.user.userId };
      const result = await VisitorsService.createPurpose(data, tenantId);
      return responseHandler(res, "success", result, "Purpose created successfully.");
    } catch (error) {
      logger.error("Error creating visitor purpose:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getAllPurposes(req, res) {
    try {
      const { tenantId } = req.user;
      const purposes = await VisitorsService.getAllPurposes(tenantId);
      return responseHandler(res, "success", purposes, "Purposes retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving purposes:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getPurposeById(req, res) {
    try {
      const { tenantId } = req.user;
      const purpose = await VisitorsService.getPurposeById(req.params.id, tenantId);
      if (!purpose) return responseHandler(res, "error", null, "Purpose not found.");
      return responseHandler(res, "success", purpose, "Purpose retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving purpose:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async updatePurpose(req, res) {
    try {
      const { tenantId } = req.user;
      const updated = await VisitorsService.updatePurpose(req.params.id, req.body, tenantId);
      if (!updated) return responseHandler(res, "error", null, "Purpose not found.");
      return responseHandler(res, "success", updated, "Purpose updated successfully.");
    } catch (error) {
      logger.error("Error updating purpose:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deletePurpose(req, res) {
    try {
      const { tenantId } = req.user;
      const deleted = await VisitorsService.deletePurpose(req.params.id, tenantId);
      if (!deleted) return responseHandler(res, "error", null, "Purpose not found.");
      return responseHandler(res, "success", null, "Purpose deleted successfully.");
    } catch (error) {
      logger.error("Error deleting purpose:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ==================== VISITORS ====================

  async createVisitor(req, res) {
    try {
      const { tenantId, userId } = req.user;
      const data = { ...req.body, createdById: userId };
      const result = await VisitorsService.createVisitor(data, tenantId);
      return responseHandler(res, "success", result, "Visitor registered successfully.");
    } catch (error) {
      logger.error("Error creating visitor:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getAllVisitors(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = {};
      if (req.query.visitorType) filters.visitorType = req.query.visitorType;
      if (req.query.approvalStatus) filters.approvalStatus = req.query.approvalStatus;
      if (req.query.status) filters.status = req.query.status;
      if (req.query.purposeId) filters.purposeId = req.query.purposeId;
      if (req.query.pointOfContactId) filters.pointOfContactId = req.query.pointOfContactId;
      const visitors = await VisitorsService.getAllVisitors(tenantId, filters);
      return responseHandler(res, "success", visitors, "Visitors retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving visitors:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getActiveVisitors(req, res) {
    try {
      const { tenantId } = req.user;
      const visitors = await VisitorsService.getActiveVisitors(tenantId);
      return responseHandler(res, "success", visitors, "Active visitors retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving active visitors:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getVisitorById(req, res) {
    try {
      const { tenantId } = req.user;
      const visitor = await VisitorsService.getVisitorById(req.params.id, tenantId);
      if (!visitor) return responseHandler(res, "error", null, "Visitor not found.");
      return responseHandler(res, "success", visitor, "Visitor retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving visitor:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async checkIn(req, res) {
    try {
      const { tenantId, userId } = req.user;
      const result = await VisitorsService.checkIn(req.params.id, tenantId, userId);
      return responseHandler(res, "success", result, "Visitor checked in successfully.");
    } catch (error) {
      logger.error("Error checking in visitor:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async checkOut(req, res) {
    try {
      const { tenantId, userId } = req.user;
      const result = await VisitorsService.checkOut(req.params.id, tenantId, userId);
      return responseHandler(res, "success", result, "Visitor checked out successfully.");
    } catch (error) {
      logger.error("Error checking out visitor:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async approve(req, res) {
    try {
      const { tenantId, userId } = req.user;
      const result = await VisitorsService.approve(req.params.id, tenantId, userId);
      return responseHandler(res, "success", result, "Visitor approved successfully.");
    } catch (error) {
      logger.error("Error approving visitor:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async reject(req, res) {
    try {
      const { tenantId, userId } = req.user;
      const { reason } = req.body;
      const result = await VisitorsService.reject(req.params.id, reason, tenantId, userId);
      return responseHandler(res, "success", result, "Visitor rejected.");
    } catch (error) {
      logger.error("Error rejecting visitor:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async cancel(req, res) {
    try {
      const { tenantId } = req.user;
      const result = await VisitorsService.cancel(req.params.id, tenantId);
      return responseHandler(res, "success", result, "Visitor cancelled.");
    } catch (error) {
      logger.error("Error cancelling visitor:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ==================== NOTIFICATIONS ====================

  async getNotifications(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = {};
      if (req.query.isRead !== undefined) filters.isRead = req.query.isRead === "true";
      if (req.query.type) filters.type = req.query.type;
      if (req.query.visitorId) filters.visitorId = req.query.visitorId;
      const notifications = await VisitorsService.getNotifications(tenantId, filters);
      return responseHandler(res, "success", notifications, "Notifications retrieved.");
    } catch (error) {
      logger.error("Error retrieving notifications:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async markNotificationRead(req, res) {
    try {
      const { tenantId } = req.user;
      const result = await VisitorsService.markNotificationRead(req.params.id, tenantId);
      if (!result) return responseHandler(res, "error", null, "Notification not found.");
      return responseHandler(res, "success", result, "Notification marked as read.");
    } catch (error) {
      logger.error("Error marking notification:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }
}

export default new VisitorsController();