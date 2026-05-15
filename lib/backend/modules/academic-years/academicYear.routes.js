import express from "express";
import AcademicYearController from "./academicYear.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authenticateTenant from "../../middlewares/authenticateTenant.js";

const router = express.Router();

// Apply middlewares to all routes in this router
router.use(authenticate);
router.use(authenticateTenant);

// CRUD routes
router.post("/", AcademicYearController.createAcademicYear);
router.get("/", AcademicYearController.getAcademicYears);
router.get("/active", AcademicYearController.getActiveAcademicYear);
router.get("/:id", AcademicYearController.getAcademicYearById);
router.put("/:id", AcademicYearController.updateAcademicYear);

// Special action routes (before :id to avoid route conflicts)
router.post("/:id/activate", AcademicYearController.activateAcademicYear);
router.post("/:id/archive", AcademicYearController.archiveAcademicYear);

export default router;
