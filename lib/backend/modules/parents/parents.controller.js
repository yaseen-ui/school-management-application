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
