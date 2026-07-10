import { prisma } from "../../lib/prisma.js";
import LeaveService from "./leave.service.js";
import LeaveBalanceService from "./leave-balance.service.js";
import LeaveValidationService from "./leave-validation.service.js";
import LeaveDayCalculator from "./leave-day-calculator.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";

class LeaveController {
  // =================== Categories ===================

  async createCategory(req, res) {
    try {
      const { tenantId } = req.user;
      const category = await LeaveService.createCategory(req.body, tenantId);
      return responseHandler(res, "success", category, "Leave category created successfully.");
    } catch (error) {
      logger.error("Error creating leave category:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getCategories(req, res) {
    try {
      const { tenantId } = req.user;
      const { applicantType } = req.query;
      const categories = await LeaveService.getCategories(tenantId, applicantType);
      return responseHandler(res, "success", categories, "Categories retrieved successfully.");
    } catch (error) {
      logger.error("Error getting leave categories:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getCategoryById(req, res) {
    try {
      const { tenantId } = req.user;
      const category = await LeaveService.getCategoryById(req.params.id, tenantId);
      if (!category) return responseHandler(res, "error", null, "Category not found.");
      return responseHandler(res, "success", category, "Category retrieved successfully.");
    } catch (error) {
      logger.error("Error getting leave category:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async updateCategory(req, res) {
    try {
      const { tenantId } = req.user;
      const updated = await LeaveService.updateCategory(req.params.id, req.body, tenantId);
      if (!updated) return responseHandler(res, "error", null, "Category not found.");
      return responseHandler(res, "success", updated, "Category updated successfully.");
    } catch (error) {
      logger.error("Error updating leave category:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deleteCategory(req, res) {
    try {
      const { tenantId } = req.user;
      const deleted = await LeaveService.deleteCategory(req.params.id, tenantId);
      if (!deleted) return responseHandler(res, "error", null, "Category not found.");
      return responseHandler(res, "success", null, "Category deleted successfully.");
    } catch (error) {
      logger.error("Error deleting leave category:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // =================== Leave Requests ===================

  async createRequest(req, res) {
    try {
      const { tenantId, id: userId } = req.user;
      const data = req.body;

      // Authorize parent for student leave
      if (data.applicantType === "student" && data.studentId) {
        const parent = await this.getParentByUserId(userId, tenantId);
        if (parent) {
          await LeaveValidationService.authorizeParentForStudent(parent.id, data.studentId, tenantId);
        }
      }

      const validationErrors = await LeaveValidationService.validateRequest(data, tenantId);
      if (validationErrors.length > 0) {
        return responseHandler(res, "error", validationErrors, "Validation failed.");
      }

      const request = await LeaveService.createRequest({ ...data, createdById: userId }, tenantId);
      return responseHandler(res, "success", request, "Leave request created successfully.");
    } catch (error) {
      logger.error("Error creating leave request:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getAllRequests(req, res) {
    try {
      const { tenantId } = req.user;
      const requests = await LeaveService.getAllRequests(tenantId, req.query);
      return responseHandler(res, "success", requests, "Requests retrieved successfully.");
    } catch (error) {
      logger.error("Error getting leave requests:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getRequestById(req, res) {
    try {
      const { tenantId } = req.user;
      const request = await LeaveService.getRequestById(req.params.id, tenantId);
      if (!request) return responseHandler(res, "error", null, "Request not found.");
      return responseHandler(res, "success", request, "Request retrieved successfully.");
    } catch (error) {
      logger.error("Error getting leave request:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async updateRequest(req, res) {
    try {
      const { tenantId } = req.user;
      const updated = await LeaveService.updateRequest(req.params.id, req.body, tenantId);
      if (!updated) return responseHandler(res, "error", null, "Request not found.");
      return responseHandler(res, "success", updated, "Request updated successfully.");
    } catch (error) {
      logger.error("Error updating leave request:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async submitRequest(req, res) {
    try {
      const { tenantId, id: userId } = req.user;
      const request = await LeaveService.submitRequest(req.params.id, userId, tenantId);
      return responseHandler(res, "success", request, "Request submitted successfully.");
    } catch (error) {
      logger.error("Error submitting leave request:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async withdrawRequest(req, res) {
    try {
      const { tenantId, id: userId } = req.user;
      const { reason } = req.body;
      const request = await LeaveService.withdrawRequest(req.params.id, reason, userId, tenantId);
      return responseHandler(res, "success", request, "Request withdrawn successfully.");
    } catch (error) {
      logger.error("Error withdrawing leave request:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async approveRequest(req, res) {
    try {
      const { tenantId, id: userId } = req.user;
      const { level, remarks } = req.body;
      const result = await LeaveService.approveRequest(req.params.id, level || 1, userId, remarks, tenantId);
      return responseHandler(res, "success", result, "Request approved successfully.");
    } catch (error) {
      logger.error("Error approving leave request:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async rejectRequest(req, res) {
    try {
      const { tenantId, id: userId } = req.user;
      const { level, remarks } = req.body;
      const result = await LeaveService.rejectRequest(req.params.id, level || 1, userId, remarks, tenantId);
      return responseHandler(res, "success", result, "Request rejected successfully.");
    } catch (error) {
      logger.error("Error rejecting leave request:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async cancelRequest(req, res) {
    try {
      const { tenantId, id: userId } = req.user;
      const { reason } = req.body;
      const result = await LeaveService.cancelRequest(req.params.id, reason, userId, tenantId);
      return responseHandler(res, "success", result, "Request cancelled successfully.");
    } catch (error) {
      logger.error("Error cancelling leave request:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // =================== Balances ===================

  async getEmployeeBalances(req, res) {
    try {
      const { tenantId } = req.user;
      const { employeeId } = req.params;
      const { academicYearId } = req.query;
      const balances = await LeaveBalanceService.getEmployeeBalances(employeeId, tenantId, academicYearId);
      const enriched = balances.map((b) => ({
        ...b,
        available: LeaveBalanceService.getAvailableBalance(b),
      }));
      return responseHandler(res, "success", enriched, "Balances retrieved successfully.");
    } catch (error) {
      logger.error("Error getting employee balances:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getAllBalances(req, res) {
    try {
      const { tenantId } = req.user;
      const balances = await LeaveBalanceService.getLowBalanceEmployees(tenantId, req.query.academicYearId, 99);
      return responseHandler(res, "success", balances, "Balances retrieved successfully.");
    } catch (error) {
      logger.error("Error getting balances:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async adjustBalance(req, res) {
    try {
      const { tenantId, id: userId } = req.user;
      const { employeeId } = req.params;
      const { leaveCategoryId, academicYearId, amount, reason } = req.body;
      const balance = await LeaveBalanceService.getOrCreateBalance(
        employeeId, leaveCategoryId, academicYearId, tenantId
      );
      const updated = await LeaveBalanceService.manualAdjust(
        balance.id, amount, reason, userId, tenantId
      );
      return responseHandler(res, "success", updated, "Balance adjusted successfully.");
    } catch (error) {
      logger.error("Error adjusting balance:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // =================== Configuration ===================

  async getTenantConfig(req, res) {
    try {
      const { tenantId } = req.user;
      const config = await LeaveService.getTenantConfig(tenantId);
      return responseHandler(res, "success", config, "Configuration retrieved successfully.");
    } catch (error) {
      logger.error("Error getting tenant config:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async updateTenantConfig(req, res) {
    try {
      const { tenantId } = req.user;
      const config = await LeaveService.updateTenantConfig(tenantId, req.body);
      return responseHandler(res, "success", config, "Configuration updated successfully.");
    } catch (error) {
      logger.error("Error updating tenant config:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // =================== Reports ===================

  async getSummary(req, res) {
    try {
      const { tenantId } = req.user;
      const summary = await LeaveService.getSummary(tenantId, req.query.academicYearId);
      return responseHandler(res, "success", summary, "Summary retrieved successfully.");
    } catch (error) {
      logger.error("Error getting summary:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getCalendar(req, res) {
    try {
      const { tenantId } = req.user;
      const { dateFrom, dateTo } = req.query;
      const events = await LeaveService.getCalendar(tenantId, dateFrom, dateTo);
      return responseHandler(res, "success", events, "Calendar retrieved successfully.");
    } catch (error) {
      logger.error("Error getting calendar:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // =================== Approvals ===================

  async getPendingApprovals(req, res) {
    try {
      const { tenantId, id: userId } = req.user;
      const approvals = await LeaveService.getPendingApprovals(userId, tenantId);
      return responseHandler(res, "success", approvals, "Pending approvals retrieved successfully.");
    } catch (error) {
      logger.error("Error getting pending approvals:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // =================== Day Calculation ===================

  async calculateDays(req, res) {
    try {
      const { tenantId } = req.user;
      const result = await LeaveDayCalculator.calculateDays({
        ...req.body,
        tenantId,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
      });
      return responseHandler(res, "success", result, "Days calculated successfully.");
    } catch (error) {
      logger.error("Error calculating days:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // =================== Helper ===================

  async getParentByUserId(userId, tenantId) {
    try {
      return await prisma.parent.findFirst({
        where: { userId, tenantId },
      });
    } catch {
      return null;
    }
  }
}

export default new LeaveController();
