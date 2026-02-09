import TenantService from "./tenant.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";
import { sendSMS } from "../../utils/smsService.js";
import { tableColumns } from "../../utils/columns.js";


class TenantController {
  static async createTenant(req, res) {
    try {
      const { school_name, admin_full_name, admin_phone, admin_email } =
        req.body;

      // const generatedPassword = generateRandomPassword(8); // Generate a 8-character password
      const generatedPassword = "tenant@123"; // Generate a 8-character password
      const tenant = await TenantService.onboardTenant(req.body, generatedPassword);

      const smsMessage = `Welcome to ${school_name}! Your username is ${admin_email} and your password is ${generatedPassword}. Please log in to your account.`;
      await sendSMS(admin_phone, smsMessage);

      logger.info(
        `Tenant and admin user created successfully: ${tenant.id}`
      );
      return responseHandler(
        res,
        "success",
        tenant,
        "Tenant and school_super_admin created successfully."
      );

    } catch (error) {
      logger.error(`Error creating tenant: ${error.message}`);
      return responseHandler(
        res,
        "fail",
        null,
        error.message || "Failed to create tenant."
      );
    }
  }

  static async getAllTenants(req, res) {
    try {
      const tenants = await TenantService.getAllTenants();
      const data = { rows: tenants, columns: tableColumns.tenants };
      return responseHandler(
        res,
        "success",
        data,
        "Tenants retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving tenants: ${error.message}`);
      return responseHandler(res, "fail", null, "Failed to retrieve tenants.");
    }
  }

  static async getTenantById(req, res) {
    try {
      const tenant = await TenantService.getTenantById(req.params.id);
      if (!tenant) {
        logger.warn(`Tenant not found: ${req.params.id}`);
        return responseHandler(res, "fail", null, "Tenant not found.");
      }
      return responseHandler(
        res,
        "success",
        tenant,
        "Tenant retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving tenant: ${error.message}`);
      return responseHandler(res, "fail", null, "Failed to retrieve tenant.");
    }
  }

  static async updateTenant(req, res) {
    try {
      const updates = req.body;
      const updated = await TenantService.updateTenant(req.params.id, updates);
      if (!updated) {
        logger.warn(`Tenant not found for update: ${req.params.id}`);
        return responseHandler(res, "fail", null, "Tenant not found.");
      }
      return responseHandler(
        res,
        "success",
        null,
        "Tenant updated successfully."
      );
    } catch (error) {
      logger.error(`Error updating tenant: ${error.message}`);
      return responseHandler(res, "fail", null, "Failed to update tenant.");
    }
  }

  static async deleteTenant(req, res) {
    try {
      const deleted = await TenantService.deleteTenant(req.params.id);
      if (!deleted) {
        logger.warn(`Tenant not found for deletion: ${req.params.id}`);
        return responseHandler(res, "fail", null, "Tenant not found.");
      }
      return responseHandler(
        res,
        "success",
        null,
        "Tenant deleted successfully."
      );
    } catch (error) {
      logger.error(`Error deleting tenant: ${error.message}`);
      return responseHandler(res, "fail", null, "Failed to delete tenant.");
    }
  }

  static getTenantByDomain = async (req, res) => {
    try {
      const { domain } = req.body;

      const tenant = await TenantService.getTenantByDomain(domain);

      if (!tenant) {
        return res
          .status(404)
          .json({ success: false, message: "Tenant not found" });
      }

      return res.status(200).json({ success: true, data: tenant });
    } catch (error) {
      logger.error("Error in getTenantByDomain controller:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };
}

export default TenantController;
