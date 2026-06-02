import { prisma } from "../../lib/prisma.js";

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

    return prisma.academicYear.create({
      data: {
        tenantId,
        name: data.name,
        startDate,
        endDate,
        status: "draft",
      },
    });
  }

  /**
   * Get all academic years for a tenant
   */
  async getAcademicYears(tenantId) {
    return prisma.academicYear.findMany({
      where: { tenantId },
      orderBy: [{ createdAt: "desc" }],
    });
  }

  /**
   * Get active academic year for a tenant
   */
  async getActiveAcademicYear(tenantId) {
    return prisma.academicYear.findFirst({
      where: { tenantId, status: "active" },
    });
  }

  /**
   * Get academic year by ID
   */
  async getAcademicYearById(id, tenantId) {
    return prisma.academicYear.findFirst({
      where: { id, tenantId },
    });
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

    const updates = {};
    if (data.name !== undefined) updates.name = data.name;
    if (data.startDate !== undefined) updates.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) updates.endDate = new Date(data.endDate);

    return prisma.academicYear.update({
      where: { id },
      data: updates,
    });
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
    return prisma.$transaction(async (tx) => {
      // Archive currently active academic year (if any)
      const currentActive = await tx.academicYear.findFirst({
        where: { tenantId, status: "active" },
      });

      if (currentActive && currentActive.id !== id) {
        await tx.academicYear.update({
          where: { id: currentActive.id },
          data: { status: "archived" },
        });
      }

      return tx.academicYear.update({
        where: { id },
        data: { status: "active" },
      });
    });
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

    return prisma.academicYear.update({
      where: { id },
      data: { status: "archived" },
    });
  }
}

export default new AcademicYearService();
