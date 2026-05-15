import CourseService from "./courses.service.js";
import responseHandler from "../../utils/responseHandler.js";
import { tableColumns } from "../../utils/columns.js";

class CourseController {
  static async createCourse(req, res) {
    try {
      const tenantId = req.tenantId; // Get tenantId from headers
      const course = await CourseService.createCourse({
        ...req.body,
        tenantId,
      });
      return responseHandler(
        res,
        "success",
        course,
        "Course created successfully."
      );
    } catch (error) {
      return responseHandler(
        res,
        "fail",
        null,
        error.message || "Failed to create course."
      );
    }
  }

  static async getAllCourses(req, res) {
    try {
      const courses = await CourseService.getAllCourses(req.tenantId);
      const result = { rows: courses, columns: tableColumns.course };
      console.log(result);
      return responseHandler(
        res,
        "success",
        result,
        "Courses retrieved successfully."
      );
    } catch (error) {
      return responseHandler(res, "fail", null, "Failed to retrieve courses.");
    }
  }

  static async getCourseById(req, res) {
    try {
      const course = await CourseService.getCourseById(
        req.params.id,
        req.tenantId
      );
      if (!course) {
        return responseHandler(res, "fail", null, "Course not found.");
      }
      return responseHandler(
        res,
        "success",
        course,
        "Course retrieved successfully."
      );
    } catch (error) {
      return responseHandler(res, "fail", null, "Failed to retrieve course.");
    }
  }

  static async updateCourse(req, res) {
    try {
      const updated = await CourseService.updateCourse(
        req.params.id,
        req.body,
        req.tenantId
      );
      if (!updated[0]) {
        return responseHandler(res, "fail", null, "Course not found.");
      }
      return responseHandler(
        res,
        "success",
        null,
        "Course updated successfully."
      );
    } catch (error) {
      return responseHandler(res, "fail", null, "Failed to update course.");
    }
  }

  static async deleteCourse(req, res) {
    try {
      const deleted = await CourseService.deleteCourse(
        req.params.id,
        req.tenantId
      );
      if (!deleted) {
        return responseHandler(res, "fail", null, "Course not found.");
      }
      return responseHandler(
        res,
        "success",
        null,
        "Course deleted successfully."
      );
    } catch (error) {
      return responseHandler(res, "fail", null, "Failed to delete course.");
    }
  }
}

export default CourseController;
