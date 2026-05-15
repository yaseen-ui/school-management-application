import express from "express";
import TeachersController from "./teachers.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authenticateTenant from "../../middlewares/authenticateTenant.js";

const router = express.Router();

// Apply authentication middleware to protect routes
router.use(authenticate);
router.use(authenticateTenant);

// ==================== TEACHER CRUD ====================
router.post("/", TeachersController.createTeacher);
router.get("/", TeachersController.getAllTeachers);
router.get("/:id", TeachersController.getTeacherById);
router.put("/:id", TeachersController.updateTeacher);
router.delete("/:id", TeachersController.deleteTeacher);

// ==================== QUALIFICATIONS ====================
// Add a new qualification for a teacher
router.post("/:teacherId/qualifications", TeachersController.addQualification);

// Get all qualifications for a teacher
router.get("/:teacherId/qualifications", TeachersController.getQualificationsByTeacher);

// Get a specific qualification
router.get("/:teacherId/qualifications/:qualificationId", TeachersController.getQualificationById);

// Update a specific qualification
router.put("/:teacherId/qualifications/:qualificationId", TeachersController.updateQualification);

// Delete a specific qualification
router.delete("/:teacherId/qualifications/:qualificationId", TeachersController.deleteQualification);

// ==================== EMPLOYMENT HISTORY ====================
// Add a new employment history record for a teacher
router.post("/:teacherId/employment-history", TeachersController.addEmploymentHistory);

// Get all employment history records for a teacher
router.get("/:teacherId/employment-history", TeachersController.getEmploymentHistoryByTeacher);

// Get a specific employment history record
router.get("/:teacherId/employment-history/:employmentHistoryId", TeachersController.getEmploymentHistoryById);

// Update a specific employment history record
router.put("/:teacherId/employment-history/:employmentHistoryId", TeachersController.updateEmploymentHistory);

// Delete a specific employment history record
router.delete("/:teacherId/employment-history/:employmentHistoryId", TeachersController.deleteEmploymentHistory);

export default router;
