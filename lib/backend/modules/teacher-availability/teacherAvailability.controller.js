import TeacherAvailabilityService from "./teacherAvailability.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";

class TeacherAvailabilityController {
  async getByTeacher(req, res) {
    try {
      const { tenantId } = req.user;
      const { teacherId } = req.params;
      const slots = await TeacherAvailabilityService.getByTeacher(teacherId, tenantId);
      return responseHandler(
        res,
        "success",
        slots,
        "Teacher availability retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving teacher availability:", error);
      return responseHandler(
        res,
        "error",
        null,
        "Failed to retrieve teacher availability."
      );
    }
  }

  async getAll(req, res) {
    try {
      const { tenantId } = req.user;
      const filters = req.query || {};
      const slots = await TeacherAvailabilityService.getAll(tenantId, filters);
      return responseHandler(
        res,
        "success",
        slots,
        "Teacher availabilities retrieved successfully."
      );
    } catch (error) {
      logger.error("Error retrieving teacher availabilities:", error);
      return responseHandler(
        res,
        "error",
        null,
        "Failed to retrieve teacher availabilities."
      );
    }
  }

  async upsertBulk(req, res) {
    try {
      const { tenantId } = req.user;
      const { teacherId, slots } = req.body;

      if (!teacherId) {
        return responseHandler(res, "error", null, "teacherId is required.");
      }
      if (!slots || !Array.isArray(slots)) {
        return responseHandler(res, "error", null, "slots must be an array.");
      }

      const result = await TeacherAvailabilityService.upsertBulk(teacherId, slots, tenantId);
      return responseHandler(
        res,
        "success",
        result,
        "Teacher availability updated successfully."
      );
    } catch (error) {
      logger.error("Error upserting teacher availability:", error);
      return responseHandler(res, "error", null, error.message);
    }
  }

  async delete(req, res) {
    try {
      const { tenantId } = req.user;
      const deleted = await TeacherAvailabilityService.delete(req.params.id, tenantId);
      if (!deleted) {
        return responseHandler(res, "error", null, "Teacher availability slot not found.");
      }
      return responseHandler(
        res,
        "success",
        null,
        "Teacher availability slot deleted successfully."
      );
    } catch (error) {
      logger.error("Error deleting teacher availability slot:", error);
      return responseHandler(
        res,
        "error",
        null,
        "Failed to delete teacher availability slot."
      );
    }
  }
}

export default new TeacherAvailabilityController();
