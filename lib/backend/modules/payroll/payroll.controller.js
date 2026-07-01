import * as payrollService from "./payroll.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";

class PayrollController {
  // ─── Salary Components (Module 1: CRUD) ─────────────────────────────────

  async listSalaryComponents(req, res) {
    try {
      const { tenantId } = req.user;
      const components = await payrollService.listSalaryComponents(tenantId);
      return responseHandler(res, "success", components, "Salary components retrieved successfully.");
    } catch (error) {
      logger.error("Error listing salary components:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getSalaryComponent(req, res) {
    try {
      const { tenantId } = req.user;
      const component = await payrollService.getSalaryComponent(tenantId, req.params.id);
      if (!component) return responseHandler(res, "error", null, "Salary component not found.");
      return responseHandler(res, "success", component, "Salary component retrieved successfully.");
    } catch (error) {
      logger.error("Error getting salary component:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async createSalaryComponent(req, res) {
    try {
      const { tenantId } = req.user;
      const userId = req.user.id;
      const component = await payrollService.createSalaryComponent(tenantId, req.body, userId);
      return responseHandler(res, "success", component, "Salary component created successfully.");
    } catch (error) {
      logger.error("Error creating salary component:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async updateSalaryComponent(req, res) {
    try {
      const { tenantId } = req.user;
      const userId = req.user.id;
      const component = await payrollService.updateSalaryComponent(tenantId, req.params.id, req.body, userId);
      return responseHandler(res, "success", component, "Salary component updated successfully.");
    } catch (error) {
      logger.error("Error updating salary component:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deleteSalaryComponent(req, res) {
    try {
      const { tenantId } = req.user;
      await payrollService.deleteSalaryComponent(tenantId, req.params.id);
      return responseHandler(res, "success", null, "Salary component deleted successfully.");
    } catch (error) {
      logger.error("Error deleting salary component:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ─── Employee Compensation (Module 2) ───────────────────────────────────

  async listEmployeeCompensations(req, res) {
    try {
      const { tenantId } = req.user;
      const compensations = await payrollService.listEmployeeCompensations(tenantId);
      return responseHandler(res, "success", compensations, "Compensations retrieved successfully.");
    } catch (error) {
      logger.error("Error listing compensations:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getEmployeeCompensation(req, res) {
    try {
      const { tenantId } = req.user;
      const compensation = await payrollService.getEmployeeCompensation(tenantId, req.params.employeeId);
      if (!compensation) return responseHandler(res, "error", null, "Compensation not found.");
      return responseHandler(res, "success", compensation, "Compensation retrieved successfully.");
    } catch (error) {
      logger.error("Error getting compensation:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async upsertEmployeeCompensation(req, res) {
    try {
      const { tenantId } = req.user;
      const userId = req.user.id;
      const compensation = await payrollService.upsertEmployeeCompensation(tenantId, req.params.employeeId, req.body, userId);
      return responseHandler(res, "success", compensation, "Compensation saved successfully.");
    } catch (error) {
      logger.error("Error saving compensation:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getCompensationHistory(req, res) {
    try {
      const { tenantId } = req.user;
      const history = await payrollService.getCompensationHistory(tenantId, req.params.employeeId);
      return responseHandler(res, "success", history, "History retrieved successfully.");
    } catch (error) {
      logger.error("Error getting compensation history:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ─── Payroll Processing (Module 3) ──────────────────────────────────────

  async listPayrollBatches(req, res) {
    try {
      const { tenantId } = req.user;
      const batches = await payrollService.listPayrollBatches(tenantId);
      return responseHandler(res, "success", batches, "Batches retrieved successfully.");
    } catch (error) {
      logger.error("Error listing batches:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getPayrollBatch(req, res) {
    try {
      const { tenantId } = req.user;
      const batch = await payrollService.getPayrollBatch(tenantId, req.params.id);
      if (!batch) return responseHandler(res, "error", null, "Batch not found.");
      return responseHandler(res, "success", batch, "Batch retrieved successfully.");
    } catch (error) {
      logger.error("Error getting batch:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async createOrGetPayrollBatch(req, res) {
    try {
      const { tenantId } = req.user;
      const userId = req.user.id;
      const { month, year } = req.body;
      const batch = await payrollService.createOrGetPayrollBatch(tenantId, month, year, userId);
      return responseHandler(res, "success", batch, "Batch created/retrieved successfully.");
    } catch (error) {
      logger.error("Error creating batch:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async populatePayrollBatch(req, res) {
    try {
      const { tenantId } = req.user;
      const userId = req.user.id;
      const batch = await payrollService.populatePayrollBatch(tenantId, req.params.id, userId);
      return responseHandler(res, "success", batch, "Batch populated successfully.");
    } catch (error) {
      logger.error("Error populating batch:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async updatePayrollRecord(req, res) {
    try {
      const { tenantId } = req.user;
      const record = await payrollService.updatePayrollRecord(tenantId, req.params.id, req.body);
      return responseHandler(res, "success", record, "Record updated successfully.");
    } catch (error) {
      logger.error("Error updating record:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async bulkUpdatePayrollRecords(req, res) {
    try {
      const { tenantId } = req.user;
      const { batchId } = req.params;
      const { records } = req.body;
      const updated = await payrollService.bulkUpdatePayrollRecords(tenantId, batchId, records);
      return responseHandler(res, "success", updated, "Records updated successfully.");
    } catch (error) {
      logger.error("Error bulk updating records:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async submitPayrollBatch(req, res) {
    try {
      const { tenantId } = req.user;
      const userId = req.user.id;
      const batch = await payrollService.submitPayrollBatch(tenantId, req.params.id, userId);
      return responseHandler(res, "success", batch, "Batch submitted successfully.");
    } catch (error) {
      logger.error("Error submitting batch:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }
}

export default PayrollController;
