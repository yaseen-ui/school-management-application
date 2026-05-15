import AcademicYearService from "./academicYear.service.js";
import responseHandler from "../../utils/responseHandler.js";
import logger from "../../utils/logger.js";
import { tableColumns } from "../../utils/columns.js";

class AcademicYearController {
  /**
   * Create a new Academic Year (in draft status)
   */
  static async createAcademicYear(req, res) {
    try {
      const tenantId = req.tenantId;
      const academicYear = await AcademicYearService.createAcademicYear(
        req.body,
        tenantId
      );
      return responseHandler(
        res,
        "success",
        academicYear,
        "Academic year created successfully."
      );
    } catch (error) {
      logger.error(`Error creating academic year: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * Get all academic years for tenant
   */
  static async getAcademicYears(req, res) {
    try {
      const tenantId = req.tenantId;
      const years = await AcademicYearService.getAcademicYears(tenantId);
      const result = {
        rows: years,
        columns: tableColumns.academicYears || [],
      };
      return responseHandler(
        res,
        "success",
        result,
        "Academic years retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving academic years: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * Get active academic year for tenant
   */
  static async getActiveAcademicYear(req, res) {
    try {
      const tenantId = req.tenantId;
      const year = await AcademicYearService.getActiveAcademicYear(tenantId);
      if (!year) {
        return responseHandler(
          res,
          "fail",
          null,
          "No active academic year found."
        );
      }
      return responseHandler(
        res,
        "success",
        year,
        "Active academic year retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving active academic year: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * Get academic year by ID
   */
  static async getAcademicYearById(req, res) {
    try {
      const tenantId = req.tenantId;
      const year = await AcademicYearService.getAcademicYearById(
        req.params.id,
        tenantId
      );
      if (!year) {
        return responseHandler(res, "fail", null, "Academic year not found.");
      }
      return responseHandler(
        res,
        "success",
        year,
        "Academic year retrieved successfully."
      );
    } catch (error) {
      logger.error(`Error retrieving academic year: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * Update academic year (only allowed if draft)
   */
  static async updateAcademicYear(req, res) {
    try {
      const tenantId = req.tenantId;
      const { id } = req.params;
      const updated = await AcademicYearService.updateAcademicYear(
        id,
        req.body,
        tenantId
      );
      logger.info(`Academic year updated: ID=${id}`);
      return responseHandler(
        res,
        "success",
        updated,
        "Academic year updated successfully."
      );
    } catch (error) {
      logger.error(`Error updating academic year: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * Activate academic year
   * - Archives currently active year
   * - Activates the selected year
   */
  static async activateAcademicYear(req, res) {
    try {
      const tenantId = req.tenantId;
      const { id } = req.params;
      const activated = await AcademicYearService.activateAcademicYear(
        id,
        tenantId
      );
      logger.info(`Academic year activated: ID=${id}`);
      return responseHandler(
        res,
        "success",
        activated,
        "Academic year activated successfully."
      );
    } catch (error) {
      logger.error(`Error activating academic year: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }

  /**
   * Archive academic year (only if not active)
   */
  static async archiveAcademicYear(req, res) {
    try {
      const tenantId = req.tenantId;
      const { id } = req.params;
      const archived = await AcademicYearService.archiveAcademicYear(
        id,
        tenantId
      );
      logger.info(`Academic year archived: ID=${id}`);
      return responseHandler(
        res,
        "success",
        archived,
        "Academic year archived successfully."
      );
    } catch (error) {
      logger.error(`Error archiving academic year: ${error.message}`);
      return responseHandler(res, "fail", null, error.message);
    }
  }
}

export default AcademicYearController;
