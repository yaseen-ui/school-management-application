import EnrollmentService from "./enrollment.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";

class EnrollmentController {
  async getAllEnrollments(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const enrollments = await EnrollmentService.getAllEnrollments(tenantId, filters);
      return responseHandler(res, "success", enrollments, "Enrollments retrieved successfully.");
    } catch (error) {
      logger.error("Error retrieving enrollments:", error);
      return responseHandler(res, "error", null, "Failed to retrieve enrollments.");
    }
  }
}

export default new EnrollmentController();
