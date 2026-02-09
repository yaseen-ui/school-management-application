import express from "express";
import RoleController from "./roles.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authenticateTenant from "../../middlewares/authenticateTenant.js";

const router = express.Router();

// Apply middlewares to all routes in this router
router.use(authenticate);
router.use(authenticateTenant);

// Define role routes
router.post("/", RoleController.createRole);
router.get("/", RoleController.getAllRoles);
router.get("/:id", RoleController.getRoleById);
router.put("/:id", RoleController.updateRole);
router.delete("/:id", RoleController.deleteRole);

export default router;
