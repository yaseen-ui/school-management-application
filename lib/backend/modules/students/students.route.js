import express from "express";
import StudentController from "./students.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authenticateTenant from "../../middlewares/authenticateTenant.js";

const router = express.Router();

// Apply authentication middleware to protect routes
router.use(authenticate);
router.use(authenticateTenant);

// Student Routes
router.post("/", StudentController.createStudent);
router.get("/", StudentController.getAllStudents);
router.get("/:id", StudentController.getStudentById);
router.put("/:id", StudentController.updateStudent);
router.delete("/:id", StudentController.deleteStudent);

export default router;
