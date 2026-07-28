import TenantService from "./tenant.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";
import { sendSMS } from "../../utils/smsService.js";
import { tableColumns } from "../../utils/columns.js";
import { Guard } from "../../rbac/guards.js";


class TenantController {
  static async getCurrentTenant(req, res) {
    try {
      await Guard.action(req, "settings:read");
      const tenantId = req.user?.tenantId || req.tenantId;
      if (!req.user?.userId || !tenantId) {
        return responseHandler(res, "fail", null, "Authenticated institute context is required.");
      }

      const tenant = await TenantService.getTenantById(tenantId);
      if (!tenant) {
        return responseHandler(res, "fail", null, "Institute not found.");
      }

      return responseHandler(
        res,
        "success",
        tenant,
        "Institute settings retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving institute settings: ${error.message}`);
      return responseHandler(res, "fail", null, "Failed to retrieve institute settings.");
    }
  }

  static async updateCurrentTenant(req, res) {
    try {
      await Guard.action(req, "settings:write");
      const tenantId = req.user?.tenantId || req.tenantId;
      if (!req.user?.userId || !tenantId) {
        return responseHandler(res, "fail", null, "Authenticated institute context is required.");
      }

      // Institute users may update profile/contact details only. Subscription,
      // status, domain, and administrator ownership remain company-managed.
      const {
        schoolName,
        caption,
        logo,
        contactAddress,
        contactPhone,
        contactEmail,
      } = req.body || {};

      if (!schoolName?.trim() || !contactEmail?.trim()) {
        return responseHandler(res, "fail", null, "Institute name and contact email are required.");
      }

      const updated = await TenantService.updateTenant(tenantId, {
        schoolName: schoolName.trim(),
        caption: caption?.trim() || null,
        logo: logo?.trim() || null,
        contactAddress,
        contactPhone: contactPhone?.trim() || "",
        contactEmail: contactEmail.trim(),
      });

      return responseHandler(
        res,
        "success",
        updated,
        "Institute settings updated successfully."
      );
    } catch (error) {
      logger.error(`Error updating institute settings: ${error.message}`);
      return responseHandler(res, "fail", null, "Failed to update institute settings.");
    }
  }

  static async createTenant(req, res) {
    try {
      const { schoolName, adminPhone, adminEmail } = req.body;

      const generatedPassword = "tenant@123";
      const tenant = await TenantService.onboardTenant(req.body, generatedPassword);

      // SMS is best-effort: the tenant + admin user are already persisted.
      // A Twilio failure (bad creds, network) must not roll back the API response.
      const smsMessage = `Welcome to ${schoolName}! Your username is ${adminEmail} and your password is ${generatedPassword}. Please log in to your account.`;
      try {
        await sendSMS(adminPhone, smsMessage);
      } catch (smsError) {
        logger.error(`SMS delivery failed for tenant ${tenant.id}: ${smsError.message}`);
      }

      logger.info(`Tenant and admin user created successfully: ${tenant.id}`);
      return responseHandler(
        res,
        "success",
        { ...tenant, generatedPassword },
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
