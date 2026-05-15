import express from "express";
import * as inventoryController from "./inventory.controller.js";

import authenticate from "../../middlewares/authenticate.js";
import authenticateTenant from "../../middlewares/authenticateTenant.js";

const router = express.Router();

router.use(authenticate);
router.use(authenticateTenant);

router.post("/categories", inventoryController.createCategory);
router.get("/categories", inventoryController.getCategories);
router.post("/items", inventoryController.createItem);
router.get("/items", inventoryController.getItems);
router.put("/items/:id/stock", inventoryController.adjustStock);

export default router;
