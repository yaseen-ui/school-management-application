import HolidaysService from "./holidays.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";

class HolidaysController {
  // ==================== HOLIDAY CATEGORIES ====================

  async createCategory(req, res) {
    try {
      const { tenantId } = req.user;
      const data = { ...req.body, createdById: req.user.userId };
      const result = await HolidaysService.createCategory(data, tenantId);
      return responseHandler(res, "success", result, "Category created successfully.");
    } catch (error) {
      logger.error("Error creating holiday category:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getAllCategories(req, res) {
    try {
      const { tenantId } = req.user;
      const categories = await HolidaysService.getAllCategories(tenantId);
      return responseHandler(res, "success", categories, "Categories retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving categories:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getCategoryById(req, res) {
    try {
      const { tenantId } = req.user;
      const category = await HolidaysService.getCategoryById(req.params.id, tenantId);
      if (!category) return responseHandler(res, "error", null, "Category not found.");
      return responseHandler(res, "success", category, "Category retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving category:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async updateCategory(req, res) {
    try {
      const { tenantId } = req.user;
      const updated = await HolidaysService.updateCategory(req.params.id, req.body, tenantId);
      if (!updated) return responseHandler(res, "error", null, "Category not found.");
      return responseHandler(res, "success", updated, "Category updated successfully.");
    } catch (error) {
      logger.error("Error updating category:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deleteCategory(req, res) {
    try {
      const { tenantId } = req.user;
      const deleted = await HolidaysService.deleteCategory(req.params.id, tenantId);
      if (!deleted) return responseHandler(res, "error", null, "Category not found.");
      return responseHandler(res, "success", null, "Category deleted successfully.");
    } catch (error) {
      logger.error("Error deleting category:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ==================== HOLIDAYS ====================

  async createHoliday(req, res) {
    try {
      const { tenantId, userId } = req.user;
      const data = { ...req.body, createdById: userId };
      const result = await HolidaysService.createHoliday(data, tenantId);
      return responseHandler(res, "success", result, "Holiday created successfully.");
    } catch (error) {
      logger.error("Error creating holiday:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getAllHolidays(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = {};
      if (req.query.academicYearId) filters.academicYearId = req.query.academicYearId;
      if (req.query.categoryId) filters.categoryId = req.query.categoryId;
      if (req.query.type) filters.type = req.query.type;
      if (req.query.isMandatory !== undefined) filters.isMandatory = req.query.isMandatory === "true";
      if (req.query.fromDate) filters.fromDate = req.query.fromDate;
      if (req.query.toDate) filters.toDate = req.query.toDate;
      const holidays = await HolidaysService.getAllHolidays(tenantId, filters);
      return responseHandler(res, "success", holidays, "Holidays retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving holidays:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getHolidayById(req, res) {
    try {
      const { tenantId } = req.user;
      const holiday = await HolidaysService.getHolidayById(req.params.id, tenantId);
      if (!holiday) return responseHandler(res, "error", null, "Holiday not found.");
      return responseHandler(res, "success", holiday, "Holiday retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving holiday:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async updateHoliday(req, res) {
    try {
      const { tenantId } = req.user;
      const updated = await HolidaysService.updateHoliday(req.params.id, req.body, tenantId);
      if (!updated) return responseHandler(res, "error", null, "Holiday not found.");
      return responseHandler(res, "success", updated, "Holiday updated successfully.");
    } catch (error) {
      logger.error("Error updating holiday:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deleteHoliday(req, res) {
    try {
      const { tenantId } = req.user;
      const deleted = await HolidaysService.deleteHoliday(req.params.id, tenantId);
      if (!deleted) return responseHandler(res, "error", null, "Holiday not found.");
      return responseHandler(res, "success", null, "Holiday deleted successfully.");
    } catch (error) {
      logger.error("Error deleting holiday:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ==================== HOLIDAY RULES ====================

  async createRule(req, res) {
    try {
      const { tenantId, userId } = req.user;
      const data = { ...req.body, createdById: userId };
      const result = await HolidaysService.createRule(data, tenantId);
      return responseHandler(res, "success", result, "Rule created successfully.");
    } catch (error) {
      logger.error("Error creating holiday rule:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getAllRules(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = {};
      if (req.query.academicYearId) filters.academicYearId = req.query.academicYearId;
      if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === "true";
      const rules = await HolidaysService.getAllRules(tenantId, filters);
      return responseHandler(res, "success", rules, "Rules retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving rules:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getRuleById(req, res) {
    try {
      const { tenantId } = req.user;
      const rule = await HolidaysService.getRuleById(req.params.id, tenantId);
      if (!rule) return responseHandler(res, "error", null, "Rule not found.");
      return responseHandler(res, "success", rule, "Rule retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving rule:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async updateRule(req, res) {
    try {
      const { tenantId } = req.user;
      const updated = await HolidaysService.updateRule(req.params.id, req.body, tenantId);
      if (!updated) return responseHandler(res, "error", null, "Rule not found.");
      return responseHandler(res, "success", updated, "Rule updated successfully.");
    } catch (error) {
      logger.error("Error updating rule:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deleteRule(req, res) {
    try {
      const { tenantId } = req.user;
      const deleted = await HolidaysService.deleteRule(req.params.id, tenantId);
      if (!deleted) return responseHandler(res, "error", null, "Rule not found.");
      return responseHandler(res, "success", null, "Rule deleted successfully.");
    } catch (error) {
      logger.error("Error deleting rule:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }
}

export default new HolidaysController();