import express from "express";
import GradesController from "./grades.controller.js";

import authenticate from "../../middlewares/authenticate.js";
import authenticateTenant from "../../middlewares/authenticateTenant.js";

const router = express.Router();

// Apply middlewares to all routes in this router
router.use(authenticate);
router.use(authenticateTenant);

router.post("/", GradesController.createGrade);
router.get("/", GradesController.getGrades);
router.get("/:id", GradesController.getGradeById);
router.put("/:id", GradesController.updateGrade);
router.delete("/:id", GradesController.deleteGrade);

export default router;
