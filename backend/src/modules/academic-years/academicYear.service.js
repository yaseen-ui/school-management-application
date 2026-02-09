import { prisma } from "../../lib/prisma.js";

// Mappers for input/output transformation
const mapIn = (data = {}) => ({
  name: data.name,
  startDate: data.startDate ? new Date(data.startDate) : undefined,
  endDate: data.endDate ? new Date(data.endDate) : undefined,
});

const mapUpdateIn = (data = {}) => {
  const out = {
    name: data.name,
    startDate: data.startDate ? new Date(data.startDate) : undefined,
    endDate: data.endDate ? new Date(data.endDate) : undefined,
  };
  Object.keys(out).forEach((k) => out[k] === undefined && delete out[k]);
  return out;
};

const mapOut = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    name: row.name,
    startDate: row.startDate,
    endDate: row.endDate,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
};

class AcademicYearService {
  /**
   * Create a new Academic Year in draft status
   */
  async createAcademicYear(data, tenantId) {
    if (!data?.name) {
      throw new Error("Academic year name is required.");
    }

    if (!data?.startDate || !data?.endDate) {
      throw new Error("Start date and end date are required.");
    }

    // Validate dates
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (startDate >= endDate) {
      throw new Error("Start date must be before end date.");
    }

    // Check for duplicate name per tenant
    const duplicate = await prisma.academicYear.findFirst({
      where: {
        tenantId,
        name: data.name,
      },
    });

    if (duplicate) {
      throw new Error(
        `Academic year with name '${data.name}' already exists for this tenant.`
      );
    }

    const created = await prisma.academicYear.create({
      data: {
        tenantId,
        name: data.name,
        startDate,
        endDate,
        status: "draft",
      },
    });

    return mapOut(created);
  }

  /**
   * Get all academic years for a tenant
   */
  async getAcademicYears(tenantId) {
    const years = await prisma.academicYear.findMany({
      where: { tenantId },
      orderBy: [{ createdAt: "desc" }],
    });
    return years.map(mapOut);
  }

  /**
   * Get active academic year for a tenant
   */
  async getActiveAcademicYear(tenantId) {
    const year = await prisma.academicYear.findFirst({
      where: {
        tenantId,
        status: "active",
      },
    });
    return mapOut(year);
  }

  /**
   * Get academic year by ID
   */
  async getAcademicYearById(id, tenantId) {
    const year = await prisma.academicYear.findFirst({
      where: {
        id,
        tenantId,
      },
    });
    return mapOut(year);
  }

  /**
   * Update academic year (only allowed if status is draft)
   */
  async updateAcademicYear(id, data, tenantId) {
    const existing = await prisma.academicYear.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new Error("Academic year not found or unauthorized.");
    }

    if (existing.status !== "draft") {
      throw new Error(
        `Cannot update academic year with status '${existing.status}'. Only draft academic years can be updated.`
      );
    }

    // If name is being changed, check for duplicate
    if (data.name && data.name !== existing.name) {
      const dup = await prisma.academicYear.findFirst({
        where: {
          tenantId,
          name: data.name,
          NOT: { id },
        },
      });
      if (dup) {
        throw new Error(
          `Academic year with name '${data.name}' already exists for this tenant.`
        );
      }
    }

    // Validate dates if provided
    const startDate = data.startDate ? new Date(data.startDate) : existing.startDate;
    const endDate = data.endDate ? new Date(data.endDate) : existing.endDate;

    if (startDate >= endDate) {
      throw new Error("Start date must be before end date.");
    }

    const updated = await prisma.academicYear.update({
      where: { id },
      data: mapUpdateIn(data),
    });

    return mapOut(updated);
  }

  /**
   * Activate an academic year
   * - Archives currently active academic year (if any)
   * - Activates the selected academic year
   * - Runs in a transaction
   */
  async activateAcademicYear(id, tenantId) {
    const targetYear = await prisma.academicYear.findFirst({
      where: { id, tenantId },
    });

    if (!targetYear) {
      throw new Error("Academic year not found or unauthorized.");
    }

    if (targetYear.status === "archived") {
      throw new Error("Cannot activate an archived academic year.");
    }

    if (targetYear.status === "active") {
      throw new Error("Academic year is already active.");
    }

    // Use transaction to ensure consistency
    const result = await prisma.$transaction(async (tx) => {
      // Archive currently active academic year (if any)
      const currentActive = await tx.academicYear.findFirst({
        where: {
          tenantId,
          status: "active",
        },
      });

      if (currentActive && currentActive.id !== id) {
        await tx.academicYear.update({
          where: { id: currentActive.id },
          data: { status: "archived" },
        });
      }

      // Activate the target academic year
      const activated = await tx.academicYear.update({
        where: { id },
        data: { status: "active" },
      });

      return activated;
    });

    return mapOut(result);
  }

  /**
   * Archive an academic year
   * - Cannot archive active academic year
   */
  async archiveAcademicYear(id, tenantId) {
    const year = await prisma.academicYear.findFirst({
      where: { id, tenantId },
    });

    if (!year) {
      throw new Error("Academic year not found or unauthorized.");
    }

    if (year.status === "active") {
      throw new Error(
        "Cannot archive the active academic year. Activate a different academic year first."
      );
    }

    if (year.status === "archived") {
      throw new Error("Academic year is already archived.");
    }

    const updated = await prisma.academicYear.update({
      where: { id },
      data: { status: "archived" },
    });

    return mapOut(updated);
  }
}

export default new AcademicYearService();
