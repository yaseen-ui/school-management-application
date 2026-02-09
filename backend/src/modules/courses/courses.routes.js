import express from "express";
import CourseController from "./courses.controller.js";
import authenticateTenant from "../../middlewares/authenticateTenant.js";
import authenticate from "../../middlewares/authenticate.js";

const router = express.Router();

// Apply middlewares to all routes in this router
router.use(authenticate);
router.use(authenticateTenant);

router.post("/", CourseController.createCourse);
router.get("/", CourseController.getAllCourses);
router.get("/:id", CourseController.getCourseById);
router.put("/:id", CourseController.updateCourse);
router.delete("/:id", CourseController.deleteCourse);

export default router;
