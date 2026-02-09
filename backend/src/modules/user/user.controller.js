import UserService from "./user.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";

class UserController {
  static async createUser(req, res) {
    try {
      const user = await UserService.createUser({
        ...req.body,
        tenantId: req.tenantId,
      });
      logger.info(`User created: ${JSON.stringify(user)}`);
      return responseHandler(
        res,
        "success",
        user,
        "User created successfully."
      );
    } catch (error) {
      logger.error(`Error creating user: ${error.message}`);
      return responseHandler(
        res,
        "fail",
        null,
        error.message || "Failed to create user."
      );
    }
  }

  static async getAllUsers(req, res) {
    try {
      const tenantId = req.tenantId;
      if (!tenantId) {
        logger.warn("Tenant ID is missing in the request.");
        return responseHandler(res, "fail", null, "Unauthorized access.");
      }

      const users = await UserService.getAllUsers(tenantId);
      if (!users || users.length === 0) {
        logger.info(`No users found for tenant ID: ${tenantId}`);
        return responseHandler(res, "success", [], "No users found.");
      }

      return responseHandler(
        res,
        "success",
        users,
        "Users retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving users: ${error.message}`);
      return responseHandler(res, "fail", null, "Failed to retrieve users.");
    }
  }

  static async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id, req.tenantId);
      if (!user) {
        logger.warn(`User not found: ${req.params.id}`);
        return responseHandler(res, "fail", null, "User not found.");
      }
      return responseHandler(
        res,
        "success",
        user,
        "User retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving user: ${error.message}`);
      return responseHandler(res, "fail", null, "Failed to retrieve user.");
    }
  }

  static async updateUser(req, res) {
    try {
      const updated = await UserService.updateUser(req.params.id, req.body);
      if (!updated[0]) {
        logger.warn(`User not found for update: ${req.params.id}`);
        return responseHandler(res, "fail", null, "User not found.");
      }
      return responseHandler(
        res,
        "success",
        null,
        "User updated successfully."
      );
    } catch (error) {
      logger.error(`Error updating user: ${error.message}`);
      return responseHandler(res, "fail", null, "Failed to update user.");
    }
  }

  static async deleteUser(req, res) {
    try {
      const deleted = await UserService.deleteUser(req.params.id);
      if (!deleted) {
        logger.warn(`User not found for deletion: ${req.params.id}`);
        return responseHandler(res, "fail", null, "User not found.");
      }
      return responseHandler(
        res,
        "success",
        null,
        "User deleted successfully."
      );
    } catch (error) {
      logger.error(`Error deleting user: ${error.message}`);
      return responseHandler(res, "fail", null, "Failed to delete user.");
    }
  }

  static async createCompanyUser(req, res) {
    try {
      const user = await UserService.createCompanyUser(req.body);
      logger.info(`Company user created: ${JSON.stringify(user)}`);
      return responseHandler(
        res,
        "success",
        user,
        "Company user created successfully."
      );
    } catch (error) {
      logger.error(`Error creating company user: ${error.message}`);
      return responseHandler(
        res,
        "fail",
        null,
        error.message || "Failed to create company user."
      );
    }
  }

  static async getAllCompanyUsers(req, res) {
    try {
      const users = await UserService.getAllCompanyUsers();
      return responseHandler(
        res,
        "success",
        users,
        "Company users retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving company users: ${error.message}`);
      return responseHandler(
        res,
        "fail",
        null,
        "Failed to retrieve company users."
      );
    }
  }

  static async updatePassword(req, res) {
    try {
      const userId = req.user.userId; // Extract userId from JWT token
      const { oldPassword, newPassword } = req.body;
      debugger;
      const response = await UserService.updatePassword(
        userId,
        oldPassword,
        newPassword
      );
      return responseHandler(res, "success", null, response.message);
    } catch (error) {
      logger.error(`Error updating password: ${error}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async forgetPassword(req, res) {
    try {
      const { email } = req.body;
      const response = await UserService.forgetPassword(email);
      return responseHandler(res, "success", null, response.message);
    } catch (error) {
      logger.error(`Error in forget password: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  static async resetPasswordWithOTP(req, res) {
    try {
      const { email, otp, newPassword } = req.body;
      const response = await UserService.resetPasswordWithOTP(
        email,
        otp,
        newPassword
      );
      return responseHandler(res, "success", null, response.message);
    } catch (error) {
      logger.error(`Error in reset password with OTP: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }
}

export default UserController;
