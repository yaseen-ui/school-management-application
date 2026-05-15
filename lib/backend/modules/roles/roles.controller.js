import RoleService from "./roles.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";

class RoleController {
  static async createRole(req, res) {
    try {
      const role = await RoleService.createRole({
        ...req.body,
        tenantId: req.tenantId,
      });
      logger.info(`Role created: ${JSON.stringify(role)}`);
      return responseHandler(
        res,
        "success",
        role,
        "Role created successfully."
      );
    } catch (error) {
      logger.error(`Error creating role: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getAllRoles(req, res) {
    try {
      const roles = await RoleService.getAllRoles(req);
      return responseHandler(
        res,
        "success",
        roles,
        "Roles retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving roles: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async getRoleById(req, res) {
    try {
      const { id } = req.params;
      const role = await RoleService.getRoleById(id, req.tenantId);
      if (!role) {
        return responseHandler(res, "fail", null, "Role not found.");
      }
      return responseHandler(
        res,
        "success",
        role,
        "Role retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving role: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async updateRole(req, res) {
    try {
      const { id } = req.params;
      const updated = await RoleService.updateRole(id, req.body, req.tenantId);
      if (!updated[0]) {
        return responseHandler(res, "fail", null, "Role not found.");
      }
      return responseHandler(
        res,
        "success",
        null,
        "Role updated successfully."
      );
    } catch (error) {
      logger.error(`Error updating role: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async deleteRole(req, res) {
    try {
      const { id } = req.params;
      const deleted = await RoleService.deleteRole(id, req.tenantId);
      if (!deleted) {
        return responseHandler(res, "fail", null, "Role not found.");
      }
      return responseHandler(
        res,
        "success",
        null,
        "Role deleted successfully."
      );
    } catch (error) {
      logger.error(`Error deleting role: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }
}

export default RoleController;
