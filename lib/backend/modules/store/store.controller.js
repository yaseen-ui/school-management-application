import StoreService from "./store.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";
import { tableColumns } from "../../utils/columns.js";

class StoreController {
  // ─── Categories ──────────────────────────────────────────────────────────

  async createCategory(req, res) {
    try {
      const { tenantId } = req.user;
      const category = await StoreService.createCategory(req.body, tenantId);
      return responseHandler(res, "success", category, "Category created successfully.");
    } catch (error) {
      logger.error("Error creating category:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getCategoryById(req, res) {
    try {
      const { tenantId } = req.user;
      const category = await StoreService.getCategoryById(req.params.id, tenantId);
      if (!category) {
        return responseHandler(res, "error", null, "Category not found.");
      }
      return responseHandler(res, "success", category, "Category retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving category:", error);
      return responseHandler(res, "error", null, "Failed to retrieve category.");
    }
  }

  async getAllCategories(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const categories = await StoreService.getAllCategories(tenantId, filters);
      const result = {
        columns: tableColumns.storeCategories || [],
        rows: categories,
      };
      return responseHandler(res, "success", result, "Categories retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving categories:", error);
      return responseHandler(res, "error", null, "Failed to retrieve categories.");
    }
  }

  async updateCategory(req, res) {
    try {
      const { tenantId } = req.user;
      const category = await StoreService.updateCategory(req.params.id, req.body, tenantId);
      return responseHandler(res, "success", category, "Category updated successfully.");
    } catch (error) {
      logger.error("Error updating category:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deleteCategory(req, res) {
    try {
      const { tenantId } = req.user;
      await StoreService.deleteCategory(req.params.id, tenantId);
      return responseHandler(res, "success", null, "Category deleted successfully.");
    } catch (error) {
      logger.error("Error deleting category:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ─── Products ────────────────────────────────────────────────────────────

  async createProduct(req, res) {
    try {
      const { tenantId } = req.user;
      const product = await StoreService.createProduct(req.body, tenantId);
      return responseHandler(res, "success", product, "Product created successfully.");
    } catch (error) {
      logger.error("Error creating product:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getProductById(req, res) {
    try {
      const { tenantId } = req.user;
      const product = await StoreService.getProductById(req.params.id, tenantId);
      if (!product) {
        return responseHandler(res, "error", null, "Product not found.");
      }
      return responseHandler(res, "success", product, "Product retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving product:", error);
      return responseHandler(res, "error", null, "Failed to retrieve product.");
    }
  }

  async getAllProducts(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const products = await StoreService.getAllProducts(tenantId, filters);
      const result = {
        columns: tableColumns.storeProducts || [],
        rows: products,
      };
      return responseHandler(res, "success", result, "Products retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving products:", error);
      return responseHandler(res, "error", null, "Failed to retrieve products.");
    }
  }

  async updateProduct(req, res) {
    try {
      const { tenantId } = req.user;
      const product = await StoreService.updateProduct(req.params.id, req.body, tenantId);
      return responseHandler(res, "success", product, "Product updated successfully.");
    } catch (error) {
      logger.error("Error updating product:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deleteProduct(req, res) {
    try {
      const { tenantId } = req.user;
      await StoreService.deleteProduct(req.params.id, tenantId);
      return responseHandler(res, "success", null, "Product deleted successfully.");
    } catch (error) {
      logger.error("Error deleting product:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ─── Kits ────────────────────────────────────────────────────────────────

  async createKit(req, res) {
    try {
      const { tenantId } = req.user;
      const kit = await StoreService.createKit(req.body, tenantId);
      return responseHandler(res, "success", kit, "Kit created successfully.");
    } catch (error) {
      logger.error("Error creating kit:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getKitById(req, res) {
    try {
      const { tenantId } = req.user;
      const kit = await StoreService.getKitById(req.params.id, tenantId);
      if (!kit) {
        return responseHandler(res, "error", null, "Kit not found.");
      }
      return responseHandler(res, "success", kit, "Kit retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving kit:", error);
      return responseHandler(res, "error", null, "Failed to retrieve kit.");
    }
  }

  async getAllKits(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const kits = await StoreService.getAllKits(tenantId, filters);
      const result = {
        columns: tableColumns.storeKits || [],
        rows: kits,
      };
      return responseHandler(res, "success", result, "Kits retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving kits:", error);
      return responseHandler(res, "error", null, "Failed to retrieve kits.");
    }
  }

  async updateKit(req, res) {
    try {
      const { tenantId } = req.user;
      const kit = await StoreService.updateKit(req.params.id, req.body, tenantId);
      return responseHandler(res, "success", kit, "Kit updated successfully.");
    } catch (error) {
      logger.error("Error updating kit:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deleteKit(req, res) {
    try {
      const { tenantId } = req.user;
      await StoreService.deleteKit(req.params.id, tenantId);
      return responseHandler(res, "success", null, "Kit deleted successfully.");
    } catch (error) {
      logger.error("Error deleting kit:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ─── Kit Items ───────────────────────────────────────────────────────────

  async addKitItem(req, res) {
    try {
      const { tenantId } = req.user;
      const item = await StoreService.addKitItem(req.params.id, req.body, tenantId);
      return responseHandler(res, "success", item, "Kit item added successfully.");
    } catch (error) {
      logger.error("Error adding kit item:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async updateKitItem(req, res) {
    try {
      const { tenantId } = req.user;
      const item = await StoreService.updateKitItem(req.params.id, req.params.itemId, req.body, tenantId);
      return responseHandler(res, "success", item, "Kit item updated successfully.");
    } catch (error) {
      logger.error("Error updating kit item:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async deleteKitItem(req, res) {
    try {
      const { tenantId } = req.user;
      await StoreService.deleteKitItem(req.params.id, req.params.itemId, tenantId);
      return responseHandler(res, "success", null, "Kit item removed successfully.");
    } catch (error) {
      logger.error("Error removing kit item:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ─── Orders ──────────────────────────────────────────────────────────────

  async checkStock(req, res) {
    try {
      const { tenantId } = req.user;
      const result = await StoreService.checkStock(req.body, tenantId);
      return responseHandler(res, "success", result, "Stock check completed.");
    } catch (error) {
      logger.error("Error checking stock:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async createOrder(req, res) {
    try {
      const { tenantId } = req.user;
      const order = await StoreService.createOrder(req.body, tenantId);
      return responseHandler(res, "success", order, "Order created successfully.");
    } catch (error) {
      logger.error("Error creating order:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async getOrderById(req, res) {
    try {
      const { tenantId } = req.user;
      const order = await StoreService.getOrderById(req.params.id, tenantId);
      if (!order) {
        return responseHandler(res, "error", null, "Order not found.");
      }
      return responseHandler(res, "success", order, "Order retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving order:", error);
      return responseHandler(res, "error", null, "Failed to retrieve order.");
    }
  }

  async getAllOrders(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const orders = await StoreService.getAllOrders(tenantId, filters);
      const result = {
        columns: tableColumns.storeOrders || [],
        rows: orders,
      };
      return responseHandler(res, "success", result, "Orders retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving orders:", error);
      return responseHandler(res, "error", null, "Failed to retrieve orders.");
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { tenantId } = req.user;
      const order = await StoreService.updateOrderStatus(req.params.id, req.body, tenantId);
      return responseHandler(res, "success", order, "Order status updated successfully.");
    } catch (error) {
      logger.error("Error updating order status:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ─── Pending Items ───────────────────────────────────────────────────────

  async getAllPendingItems(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const items = await StoreService.getAllPendingItems(tenantId, filters);
      const result = {
        columns: tableColumns.storePendingItems || [],
        rows: items,
      };
      return responseHandler(res, "success", result, "Pending items retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving pending items:", error);
      return responseHandler(res, "error", null, "Failed to retrieve pending items.");
    }
  }

  async collectPendingItem(req, res) {
    try {
      const { tenantId } = req.user;
      const item = await StoreService.collectPendingItem(req.params.id, tenantId);
      return responseHandler(res, "success", item, "Pending item marked as collected.");
    } catch (error) {
      logger.error("Error collecting pending item:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ─── Dues ────────────────────────────────────────────────────────────────

  async getAllDues(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const dues = await StoreService.getAllDues(tenantId, filters);
      const result = {
        columns: tableColumns.storeDues || [],
        rows: dues,
      };
      return responseHandler(res, "success", result, "Dues retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving dues:", error);
      return responseHandler(res, "error", null, "Failed to retrieve dues.");
    }
  }

  async getDueById(req, res) {
    try {
      const { tenantId } = req.user;
      const due = await StoreService.getDueById(req.params.id, tenantId);
      if (!due) {
        return responseHandler(res, "error", null, "Due not found.");
      }
      return responseHandler(res, "success", due, "Due retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving due:", error);
      return responseHandler(res, "error", null, "Failed to retrieve due.");
    }
  }

  async createDuePayment(req, res) {
    try {
      const { tenantId } = req.user;
      const payment = await StoreService.createDuePayment(req.params.id, req.body, tenantId);
      return responseHandler(res, "success", payment, "Due payment recorded successfully.");
    } catch (error) {
      logger.error("Error creating due payment:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ─── Returns ─────────────────────────────────────────────────────────────

  async getAllReturns(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const returns = await StoreService.getAllReturns(tenantId, filters);
      const result = {
        columns: tableColumns.storeReturns || [],
        rows: returns,
      };
      return responseHandler(res, "success", result, "Returns retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving returns:", error);
      return responseHandler(res, "error", null, "Failed to retrieve returns.");
    }
  }

  async createReturn(req, res) {
    try {
      const { tenantId } = req.user;
      const storeReturn = await StoreService.createReturn(req.body, tenantId);
      return responseHandler(res, "success", storeReturn, "Return processed successfully.");
    } catch (error) {
      logger.error("Error creating return:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  // ─── Student Purchases ───────────────────────────────────────────────────

  async getStudentPurchases(req, res) {
    try {
      const { tenantId } = req.user;
      const orders = await StoreService.getStudentPurchases(req.params.enrollmentId, tenantId);
      return responseHandler(res, "success", orders, "Student purchases retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving student purchases:", error);
      return responseHandler(res, "error", null, "Failed to retrieve student purchases.");
    }
  }

  // ─── Backfill ────────────────────────────────────────────────────────────

  async backfillDues(req, res) {
    try {
      const { tenantId } = req.user;
      const result = await StoreService.backfillDues(tenantId);
      return responseHandler(res, "success", result, "Dues backfill completed successfully.");
    } catch (error) {
      logger.error("Error backfilling dues:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }
}

export default new StoreController();
