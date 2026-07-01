import AccountsService from "./accounts.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";
import { tableColumns } from "../../utils/columns.js";

class AccountsController {
  // ─── Categories ──────────────────────────────────────────────────────────

  async createCategory(req, res) {
    try {
      const { tenantId } = req.user;
      const category = await AccountsService.createCategory(req.body, tenantId);
      return responseHandler(res, "success", category, "Category created successfully.");
    } catch (error) {
      logger.error("Error creating account category:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getCategoryById(req, res) {
    try {
      const { tenantId } = req.user;
      const category = await AccountsService.getCategoryById(req.params.id, tenantId);
      if (!category) {
        return responseHandler(res, "error", null, "Category not found.");
      }
      return responseHandler(res, "success", category, "Category retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving account category:", error);
      return responseHandler(res, "error", null, "Failed to retrieve category.");
    }
  }

  async getAllCategories(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const categories = await AccountsService.getAllCategories(tenantId, filters);
      const result = {
        columns: tableColumns.accountCategories || [],
        rows: categories,
      };
      return responseHandler(res, "success", result, "Categories retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving account categories:", error);
      return responseHandler(res, "error", null, "Failed to retrieve categories.");
    }
  }

  async updateCategory(req, res) {
    try {
      const { tenantId } = req.user;
      const category = await AccountsService.updateCategory(req.params.id, req.body, tenantId);
      return responseHandler(res, "success", category, "Category updated successfully.");
    } catch (error) {
      logger.error("Error updating account category:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deleteCategory(req, res) {
    try {
      const { tenantId } = req.user;
      await AccountsService.deleteCategory(req.params.id, tenantId);
      return responseHandler(res, "success", null, "Category deleted successfully.");
    } catch (error) {
      logger.error("Error deleting account category:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ─── Transactions ────────────────────────────────────────────────────────

  async createTransaction(req, res) {
    try {
      const { tenantId } = req.user;
      const transaction = await AccountsService.createTransaction(req.body, tenantId);
      return responseHandler(res, "success", transaction, "Transaction created successfully.");
    } catch (error) {
      logger.error("Error creating transaction:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getTransactionById(req, res) {
    try {
      const { tenantId } = req.user;
      const transaction = await AccountsService.getTransactionById(req.params.id, tenantId);
      if (!transaction) {
        return responseHandler(res, "error", null, "Transaction not found.");
      }
      return responseHandler(res, "success", transaction, "Transaction retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving transaction:", error);
      return responseHandler(res, "error", null, "Failed to retrieve transaction.");
    }
  }

  async getAllTransactions(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const transactions = await AccountsService.getAllTransactions(tenantId, filters);
      const result = {
        columns: tableColumns.accountTransactions || [],
        rows: transactions,
      };
      return responseHandler(res, "success", result, "Transactions retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving transactions:", error);
      return responseHandler(res, "error", null, "Failed to retrieve transactions.");
    }
  }

  async updateTransaction(req, res) {
    try {
      const { tenantId } = req.user;
      const transaction = await AccountsService.updateTransaction(req.params.id, req.body, tenantId);
      return responseHandler(res, "success", transaction, "Transaction updated successfully.");
    } catch (error) {
      logger.error("Error updating transaction:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async voidTransaction(req, res) {
    try {
      const { tenantId } = req.user;
      const transaction = await AccountsService.voidTransaction(req.params.id, req.body, tenantId);
      return responseHandler(res, "success", transaction, "Transaction voided successfully.");
    } catch (error) {
      logger.error("Error voiding transaction:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deleteTransaction(req, res) {
    try {
      const { tenantId } = req.user;
      await AccountsService.deleteTransaction(req.params.id, tenantId);
      return responseHandler(res, "success", null, "Transaction deleted successfully.");
    } catch (error) {
      logger.error("Error deleting transaction:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ─── Ledger Summary ──────────────────────────────────────────────────────

  async getLedgerSummary(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const summary = await AccountsService.getLedgerSummary(tenantId, filters);
      return responseHandler(res, "success", summary, "Ledger summary retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving ledger summary:", error);
      return responseHandler(res, "error", null, "Failed to retrieve ledger summary.");
    }
  }
}

export default new AccountsController();
