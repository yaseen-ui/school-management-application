import studentDashboardService from "./student-dashboard.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";

class StudentDashboardController {
  static async getDashboard(req, res) {
    try {
      const tenantId = req.tenantId || req.user?.tenantId;
      const enrollmentId = req.params?.enrollmentId;
      const examScheduleId = req.query?.examScheduleId || null;

      const data = await studentDashboardService.getDashboard(
        enrollmentId,
        tenantId,
        req.user,
        { examScheduleId }
      );

      return responseHandler(res, "success", data, "Student dashboard loaded.");
    } catch (error) {
      logger.error(`Student dashboard error: ${error.message}`);
      const status = error.statusCode || 500;
      // Preserve auth/not-found status codes (responseHandler always maps fail → 400)
      if (status === 401 || status === 403 || status === 404) {
        return res.status(status).json({
          status: "fail",
          data: null,
          message: error.message,
          code: error.code || undefined,
        });
      }
      return responseHandler(res, "fail", null, error.message);
    }
  }
}

export default StudentDashboardController;
