import express from "express";
import TenantController from "./tenant.controller.js";
import authenticateCompany from "../../middlewares/authenticateCompany.js";
import authenticate from "../../middlewares/authenticate.js";

const router = express.Router();

// Exclude authentication for this route explicitly
router.post("/domain/:domainId", TenantController.getTenantByDomain);

// Apply authentication to all routes **below** this line
router.use(authenticate);
router.use(authenticateCompany);

// Authenticated routes
router.post("/", TenantController.createTenant);
router.get("/", TenantController.getAllTenants);
router.get("/:id", TenantController.getTenantById);
router.put("/:id", TenantController.updateTenant);
router.delete("/:id", TenantController.deleteTenant);

export default router;
