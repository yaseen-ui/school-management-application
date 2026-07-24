import ParentsService from "./parents.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";

class ParentsController {
  // ─── Admin: Send invite to a parent ──────────────────────────────────────────
  async sendInvite(req, res) {
    try {
      const { tenantId } = req.user;
      const parentId = req.params.parentId;
      const result = await ParentsService.sendInvite(parentId, tenantId);
      return responseHandler(
        res,
        "success",
        result,
        "Invite sent successfully."
      );
    } catch (error) {
      logger.error("Error sending parent invite:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ─── Public: Validate invite token ──────────────────────────────────────────
  async validateInviteToken(req, res) {
    try {
      const token = req.params.token;
      const result = await ParentsService.validateInviteToken(token);
      return responseHandler(
        res,
        "success",
        result,
        "Token is valid."
      );
    } catch (error) {
      logger.error("Error validating invite token:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ─── Public: Complete parent registration ───────────────────────────────────
  async registerParent(req, res) {
    try {
      const { token, email, phone, password } = req.body;
      const result = await ParentsService.registerParent({
        token,
        email,
        phone,
        password,
      });
      return responseHandler(
        res,
        "success",
        result,
        result.message
      );
    } catch (error) {
      logger.error("Error registering parent:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ─── Parent: Get children attendance ─────────────────────────────────────
  async getMyChildrenAttendance(req, res) {
    try {
      const { id: userId, tenantId } = req.user
      const { month, year } = req.query
      const result = await ParentsService.getMyChildrenAttendance(userId, tenantId, {
        month: parseInt(month) || new Date().getMonth() + 1,
        year: parseInt(year) || new Date().getFullYear(),
      })
      return responseHandler(res, "success", result, "Children attendance retrieved.")
    } catch (error) {
      logger.error("Error retrieving children attendance:", error)
      return responseHandler(res, "error", null, error.message)
    }
  }

  // ─── Parent: Get children store orders ──────────────────────────────────
  async getMyChildrenStoreOrders(req, res) {
    try {
      const { id: userId, tenantId } = req.user
      const result = await ParentsService.getMyChildrenStoreOrders(userId, tenantId)
      return responseHandler(res, "success", result, "Children store orders retrieved.")
    } catch (error) {
      logger.error("Error retrieving children store orders:", error)
      return responseHandler(res, "error", null, error.message)
    }
  }

  // ─── Parent: Get children leave requests ────────────────────────────────
  async getMyChildrenLeave(req, res) {
    try {
      const { id: userId, tenantId } = req.user
      const result = await ParentsService.getMyChildrenLeave(userId, tenantId)
      return responseHandler(res, "success", result, "Children leave requests retrieved.")
    } catch (error) {
      logger.error("Error retrieving children leave:", error)
      return responseHandler(res, "error", null, error.message)
    }
  }

  // ─── Parent: Submit leave for child ─────────────────────────────────────
  async submitLeaveForChild(req, res) {
    try {
      const { id: userId, tenantId } = req.user
      const result = await ParentsService.submitLeaveForChild(userId, tenantId, req.body)
      return responseHandler(res, "success", result, "Leave request submitted.")
    } catch (error) {
      logger.error("Error submitting leave for child:", error)
      return responseHandler(res, "error", null, error.message)
    }
  }

  // ─── Parent: Get children fee details ───────────────────────────────────
  async getMyChildrenFees(req, res) {
    try {
      const { id: userId, tenantId } = req.user
      const result = await ParentsService.getMyChildrenFees(userId, tenantId)
      return responseHandler(res, "success", result, "Children fees retrieved.")
    } catch (error) {
      logger.error("Error retrieving children fees:", error)
      return responseHandler(res, "error", null, error.message)
    }
  }

  // ─── Parent: Get children exam results ──────────────────────────────────
  async getMyChildrenResults(req, res) {
    try {
      const { id: userId, tenantId } = req.user
      const { examId } = req.query
      const result = await ParentsService.getMyChildrenResults(userId, tenantId, { examId: examId || null })
      return responseHandler(res, "success", result, "Children results retrieved.")
    } catch (error) {
      logger.error("Error retrieving children results:", error)
      return responseHandler(res, "error", null, error.message)
    }
  }

  // ─── Parent: Get own profile with children ─────────────────────────────────
  async getMyProfile(req, res) {
    try {
      const { id: userId, tenantId } = req.user;
      const result = await ParentsService.getMyProfile(userId, tenantId);
      if (!result) {
        return responseHandler(res, "error", null, "Parent profile not found.");
      }
      return responseHandler(
        res,
        "success",
        result,
        "Parent profile retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving parent profile:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ─── Admin: Get all parents ──────────────────────────────────────────────────
  async getAllParents(req, res) {
    try {
      const { tenantId } = req.user;
      const parents = await ParentsService.getAllParents(tenantId);
      return responseHandler(
        res,
        "success",
        parents,
        "Parents retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving parents:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ─── Admin: Get single parent ───────────────────────────────────────────────
  async getParentById(req, res) {
    try {
      const { tenantId } = req.user;
      const parent = await ParentsService.getParentById(
        req.params.parentId,
        tenantId
      );
      if (!parent) {
        return responseHandler(res, "error", null, "Parent not found.");
      }
      return responseHandler(
        res,
        "success",
        parent,
        "Parent retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving parent:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }
}

export default ParentsController;
