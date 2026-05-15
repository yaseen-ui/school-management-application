import express from "express";
import SectionsController from "./sections.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authenticateTenant from "../../middlewares/authenticateTenant.js";

const router = express.Router();

// Apply middlewares to all routes in this router
router.use(authenticate);
router.use(authenticateTenant);

router.post("/", SectionsController.createSection);
router.get("/", SectionsController.getSections);
router.put("/:id", SectionsController.updateSection);
router.delete("/:id", SectionsController.deleteSection);

export default router;
