import express from "express";
import TenantController from "../tenants/tenant.controller.js";

const router = express.Router();

router.post("/domain", TenantController.getTenantByDomain);

export default router;
