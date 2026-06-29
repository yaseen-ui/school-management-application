import FeeService from "./fee.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";
import { tableColumns } from "../../utils/columns.js";

class FeeController {
  // ─── Fee Heads ───────────────────────────────────────────────────────────

  async createFeeHead(req, res) {
    try {
      const { tenantId } = req.user;
      const feeHead = await FeeService.createFeeHead(req.body, tenantId);
      return responseHandler(res, "success", feeHead, "Fee head created successfully.");
    } catch (error) {
      logger.error("Error creating fee head:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getFeeHeadById(req, res) {
    try {
      const { tenantId } = req.user;
      const feeHead = await FeeService.getFeeHeadById(req.params.id, tenantId);
      if (!feeHead) {
        return responseHandler(res, "error", null, "Fee head not found.");
      }
      return responseHandler(res, "success", feeHead, "Fee head retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving fee head:", error);
      return responseHandler(res, "error", null, "Failed to retrieve fee head.");
    }
  }

  async getAllFeeHeads(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const feeHeads = await FeeService.getAllFeeHeads(tenantId, filters);
      const result = {
        columns: tableColumns.feeHeads || [],
        rows: feeHeads,
      };
      return responseHandler(res, "success", result, "Fee heads retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving fee heads:", error);
      return responseHandler(res, "error", null, "Failed to retrieve fee heads.");
    }
  }

  async updateFeeHead(req, res) {
    try {
      const { tenantId } = req.user;
      const feeHead = await FeeService.updateFeeHead(req.params.id, req.body, tenantId);
      return responseHandler(res, "success", feeHead, "Fee head updated successfully.");
    } catch (error) {
      logger.error("Error updating fee head:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deleteFeeHead(req, res) {
    try {
      const { tenantId } = req.user;
      await FeeService.deleteFeeHead(req.params.id, tenantId);
      return responseHandler(res, "success", null, "Fee head deleted successfully.");
    } catch (error) {
      logger.error("Error deleting fee head:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ─── Section Fees ────────────────────────────────────────────────────────

  async createSectionFee(req, res) {
    try {
      const { tenantId } = req.user;
      const sectionFee = await FeeService.createSectionFee(req.body, tenantId);
      return responseHandler(res, "success", sectionFee, "Section fee created successfully.");
    } catch (error) {
      logger.error("Error creating section fee:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getSectionFeeById(req, res) {
    try {
      const { tenantId } = req.user;
      const sectionFee = await FeeService.getSectionFeeById(req.params.id, tenantId);
      if (!sectionFee) {
        return responseHandler(res, "error", null, "Section fee not found.");
      }
      return responseHandler(res, "success", sectionFee, "Section fee retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving section fee:", error);
      return responseHandler(res, "error", null, "Failed to retrieve section fee.");
    }
  }

  async getAllSectionFees(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const sectionFees = await FeeService.getAllSectionFees(tenantId, filters);
      const result = {
        columns: tableColumns.sectionFees || [],
        rows: sectionFees,
      };
      return responseHandler(res, "success", result, "Section fees retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving section fees:", error);
      return responseHandler(res, "error", null, "Failed to retrieve section fees.");
    }
  }

  async updateSectionFee(req, res) {
    try {
      const { tenantId } = req.user;
      const sectionFee = await FeeService.updateSectionFee(req.params.id, req.body, tenantId);
      return responseHandler(res, "success", sectionFee, "Section fee updated successfully.");
    } catch (error) {
      logger.error("Error updating section fee:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deleteSectionFee(req, res) {
    try {
      const { tenantId } = req.user;
      await FeeService.deleteSectionFee(req.params.id, tenantId);
      return responseHandler(res, "success", null, "Section fee deleted successfully.");
    } catch (error) {
      logger.error("Error deleting section fee:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ─── Fee Terms ───────────────────────────────────────────────────────────

  async createFeeTerm(req, res) {
    try {
      const { tenantId } = req.user;
      const term = await FeeService.createFeeTerm(req.body, tenantId);
      return responseHandler(res, "success", term, "Fee term created successfully.");
    } catch (error) {
      logger.error("Error creating fee term:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getFeeTermById(req, res) {
    try {
      const { tenantId } = req.user;
      const term = await FeeService.getFeeTermById(req.params.id, tenantId);
      if (!term) {
        return responseHandler(res, "error", null, "Fee term not found.");
      }
      return responseHandler(res, "success", term, "Fee term retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving fee term:", error);
      return responseHandler(res, "error", null, "Failed to retrieve fee term.");
    }
  }

  async getAllFeeTerms(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const terms = await FeeService.getAllFeeTerms(tenantId, filters);
      const result = {
        columns: tableColumns.feeTerms || [],
        rows: terms,
      };
      return responseHandler(res, "success", result, "Fee terms retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving fee terms:", error);
      return responseHandler(res, "error", null, "Failed to retrieve fee terms.");
    }
  }

  async updateFeeTerm(req, res) {
    try {
      const { tenantId } = req.user;
      const term = await FeeService.updateFeeTerm(req.params.id, req.body, tenantId);
      return responseHandler(res, "success", term, "Fee term updated successfully.");
    } catch (error) {
      logger.error("Error updating fee term:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deleteFeeTerm(req, res) {
    try {
      const { tenantId } = req.user;
      await FeeService.deleteFeeTerm(req.params.id, tenantId);
      return responseHandler(res, "success", null, "Fee term deleted successfully.");
    } catch (error) {
      logger.error("Error deleting fee term:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ─── Student Fees ────────────────────────────────────────────────────────

  async createStudentFee(req, res) {
    try {
      const { tenantId } = req.user;
      const studentFee = await FeeService.createStudentFee(req.body, tenantId);
      return responseHandler(res, "success", studentFee, "Student fee created successfully.");
    } catch (error) {
      logger.error("Error creating student fee:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getStudentFeeById(req, res) {
    try {
      const { tenantId } = req.user;
      const studentFee = await FeeService.getStudentFeeById(req.params.id, tenantId);
      if (!studentFee) {
        return responseHandler(res, "error", null, "Student fee not found.");
      }
      return responseHandler(res, "success", studentFee, "Student fee retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving student fee:", error);
      return responseHandler(res, "error", null, "Failed to retrieve student fee.");
    }
  }

  async getAllStudentFees(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const studentFees = await FeeService.getAllStudentFees(tenantId, filters);
      const result = {
        columns: tableColumns.studentFees || [],
        rows: studentFees,
      };
      return responseHandler(res, "success", result, "Student fees retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving student fees:", error);
      return responseHandler(res, "error", null, "Failed to retrieve student fees.");
    }
  }

  async updateStudentFee(req, res) {
    try {
      const { tenantId } = req.user;
      const studentFee = await FeeService.updateStudentFee(req.params.id, req.body, tenantId);
      return responseHandler(res, "success", studentFee, "Student fee updated successfully.");
    } catch (error) {
      logger.error("Error updating student fee:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deleteStudentFee(req, res) {
    try {
      const { tenantId } = req.user;
      await FeeService.deleteStudentFee(req.params.id, tenantId);
      return responseHandler(res, "success", null, "Student fee deleted successfully.");
    } catch (error) {
      logger.error("Error deleting student fee:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ─── Payments ────────────────────────────────────────────────────────────

  async createPayment(req, res) {
    try {
      const { tenantId } = req.user;
      const payment = await FeeService.createPayment(req.body, tenantId);
      return responseHandler(res, "success", payment, "Payment recorded successfully.");
    } catch (error) {
      logger.error("Error creating payment:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getPaymentById(req, res) {
    try {
      const { tenantId } = req.user;
      const payment = await FeeService.getPaymentById(req.params.id, tenantId);
      if (!payment) {
        return responseHandler(res, "error", null, "Payment not found.");
      }
      return responseHandler(res, "success", payment, "Payment retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving payment:", error);
      return responseHandler(res, "error", null, "Failed to retrieve payment.");
    }
  }

  async getAllPayments(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const payments = await FeeService.getAllPayments(tenantId, filters);
      const result = {
        columns: tableColumns.feePayments || [],
        rows: payments,
      };
      return responseHandler(res, "success", result, "Payments retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving payments:", error);
      return responseHandler(res, "error", null, "Failed to retrieve payments.");
    }
  }

  async updatePayment(req, res) {
    try {
      const { tenantId } = req.user;
      const payment = await FeeService.updatePayment(req.params.id, req.body, tenantId);
      return responseHandler(res, "success", payment, "Payment updated successfully.");
    } catch (error) {
      logger.error("Error updating payment:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deletePayment(req, res) {
    try {
      const { tenantId } = req.user;
      await FeeService.deletePayment(req.params.id, tenantId);
      return responseHandler(res, "success", null, "Payment deleted successfully.");
    } catch (error) {
      logger.error("Error deleting payment:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ─── Refunds ─────────────────────────────────────────────────────────────

  async createRefund(req, res) {
    try {
      const { tenantId } = req.user;
      const refund = await FeeService.createRefund(req.body, tenantId);
      return responseHandler(res, "success", refund, "Refund processed successfully.");
    } catch (error) {
      logger.error("Error creating refund:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getAllRefunds(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const refunds = await FeeService.getAllRefunds(tenantId, filters);
      const result = {
        columns: tableColumns.feeRefunds || [],
        rows: refunds,
      };
      return responseHandler(res, "success", result, "Refunds retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving refunds:", error);
      return responseHandler(res, "error", null, "Failed to retrieve refunds.");
    }
  }

  // ─── Summary ─────────────────────────────────────────────────────────────

  async getFeeSummary(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const summary = await FeeService.getFeeSummary(tenantId, filters);
      return responseHandler(res, "success", summary, "Fee summary retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving fee summary:", error);
      return responseHandler(res, "error", null, "Failed to retrieve fee summary.");
    }
  }
}

export default new FeeController();
