import * as inventoryService from "./inventory.service.js";
import responseHandler from "../../utils/responseHandler.js";

export const createCategory = async (req, res) => {
  try {
    const tenantId = req.user.tenantId; // Assuming tenantId is in req.user
    const category = await inventoryService.createCategory(req.body, tenantId);
    responseHandler(res, "success", category, "Category created successfully.");
  } catch (error) {
    responseHandler(res, "error", null, error.message);
  }
};

export const getCategories = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const categories = await inventoryService.getCategories(tenantId);
    responseHandler(
      res,
      "success",
      categories,
      "Categories fetched successfully."
    );
  } catch (error) {
    responseHandler(res, "error", null, error.message);
  }
};

export const createItem = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const item = await inventoryService.createItem(req.body, tenantId);
    responseHandler(res, "success", item, "Item created successfully.");
  } catch (error) {
    responseHandler(res, "error", null, error.message);
  }
};

export const getItems = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const items = await inventoryService.getItems(tenantId);
    responseHandler(res, "success", items, "Items fetched successfully.");
  } catch (error) {
    responseHandler(res, "error", null, error.message);
  }
};

export const adjustStock = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const adjustment = await inventoryService.adjustStock(
      req.params.id,
      req.body,
      tenantId
    );
    responseHandler(res, "success", adjustment, "Stock adjusted successfully.");
  } catch (error) {
    responseHandler(res, "error", null, error.message);
  }
};
