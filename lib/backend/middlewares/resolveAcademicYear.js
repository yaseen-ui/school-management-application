import { prisma } from "../lib/prisma.js";
import responseHandler from "../utils/responseHandler.js";
import logger from "..//utils/logger.js";

/**
 * Middleware to resolve the active academic year for a tenant
 * Attaches the active academic year to request context
 *
 * Usage: Apply to routes that need academic year context (students, attendance, etc.)
 * This middleware does NOT accept academicYearId from frontend for runtime flows
 */
export const resolveAcademicYear = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;

    if (!tenantId) {
      logger.warn("resolveAcademicYear: tenantId not found in request context");
      return responseHandler(
        res,
        "fail",
        null,
        "Tenant context not found in request."
      );
    }

    // Fetch active academic year for tenant
    const activeYear = await prisma.academicYear.findFirst({
      where: {
        tenantId,
        status: "active",
      },
    });

    if (!activeYear) {
      logger.warn(
        `resolveAcademicYear: No active academic year for tenant ${tenantId}`
      );
      return responseHandler(
        res,
        "fail",
        null,
        "No active academic year found for this tenant. Please activate an academic year first."
      );
    }

    // Attach to request context
    req.academicYear = activeYear;
    req.academicYearId = activeYear.id;

    logger.debug(
      `Academic year resolved: ${activeYear.name} (${activeYear.id})`
    );
    next();
  } catch (error) {
    logger.error(
      `Error resolving academic year: ${error.message}`
    );
    return responseHandler(
      res,
      "fail",
      null,
      "Failed to resolve academic year."
    );
  }
};

export default resolveAcademicYear;
