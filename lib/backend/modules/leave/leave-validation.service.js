import { prisma } from "../../lib/prisma.js";
import LeaveDayCalculator from "./leave-day-calculator.service.js";
import LeaveBalanceService from "./leave-balance.service.js";

class LeaveValidationService {
  /**
   * Validate that a leave request can be created/submitted.
   */
  async validateRequest(data, tenantId) {
    const errors = [];

    // Check end date >= start date
    if (new Date(data.endDate) < new Date(data.startDate)) {
      errors.push("End date cannot be before start date.");
    }

    // Check category exists and is active
    const category = await prisma.leaveCategory.findFirst({
      where: { id: data.leaveCategoryId, tenantId, isActive: true },
    });
    if (!category) {
      errors.push("Leave category not found or is inactive.");
      return errors;
    }

    // Check applicant type matches category
    if (category.applicantType !== data.applicantType) {
      errors.push("Leave category does not match applicant type.");
    }

    // Validate half-day permission
    if (
      (data.startFraction !== "full_day" || data.endFraction !== "full_day") &&
      !category.allowHalfDay
    ) {
      errors.push("Half-day leave is not permitted for this category.");
    }

    // Check for overlapping requests
    const overlap = await this.checkOverlapping(
      data,
      tenantId,
      category.applicantType
    );
    if (overlap) {
      errors.push("An overlapping leave request already exists for the selected dates.");
    }

    // Student-specific validations
    if (data.applicantType === "student") {
      if (data.studentId) {
        const student = await prisma.student.findFirst({
          where: { id: data.studentId, tenantId },
        });
        if (!student) {
          errors.push("Student not found.");
        }
      }

      // Check document requirement for student
      if (category.requireDocuments && !data.supportingDocumentUrl) {
        errors.push("Supporting document is required for this leave category.");
      }
    }

    // Employee-specific validations
    if (data.applicantType === "employee") {
      if (data.employeeId) {
        const employee = await prisma.teacher.findFirst({
          where: { id: data.employeeId, tenantId, status: "active" },
        });
        if (!employee) {
          errors.push("Employee not found or is inactive.");
        }

        // Check document requirement
        if (category.requireDocuments) {
          const days = await this.getCalculatedDays(data, tenantId);
          if (
            category.requireDocsAfterDays == null ||
            days >= category.requireDocsAfterDays
          ) {
            if (!data.supportingDocumentUrl) {
              errors.push("Supporting document is required for this leave duration.");
            }
          }
        }

        // Check balance (only if not loss-of-pay and not allowing negative)
        if (category.isPaid && !category.allowNegativeBalance && data.academicYearId) {
          const balance = await LeaveBalanceService.getOrCreateBalance(
            data.employeeId,
            data.leaveCategoryId,
            data.academicYearId,
            tenantId
          );
          const days = await this.getCalculatedDays(data, tenantId);
          const available = LeaveBalanceService.getAvailableBalance(balance);
          if (available < days) {
            errors.push(`Insufficient leave balance. Available: ${available} days, Requested: ${days} days.`);
          }
        }
      }
    }

    return errors;
  }

  async getCalculatedDays(data, tenantId) {
    const result = await LeaveDayCalculator.calculateDays({
      tenantId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      startFraction: data.startFraction || "full_day",
      endFraction: data.endFraction || "full_day",
      employeeId: data.employeeId,
      academicYearId: data.academicYearId,
    });
    return result.calculatedDays;
  }

  /**
   * Check for overlapping leave requests.
   */
  async checkOverlapping(data, tenantId, applicantType) {
    const where = {
      tenantId,
      status: { in: ["pending", "partially_approved", "approved"] },
      startDate: { lte: new Date(data.endDate) },
      endDate: { gte: new Date(data.startDate) },
    };

    if (applicantType === "student" && data.studentId) {
      where.studentId = data.studentId;
    } else if (applicantType === "employee" && data.employeeId) {
      where.employeeId = data.employeeId;
    } else {
      return null;
    }

    // Exclude current request if updating
    if (data.id) {
      where.id = { not: data.id };
    }

    return prisma.leaveRequest.findFirst({ where });
  }

  /**
   * Authorize parent access to student.
   */
  async authorizeParentForStudent(parentId, studentId, tenantId) {
    const link = await prisma.studentParent.findFirst({
      where: { tenantId, parentId, studentId },
    });
    if (!link) {
      throw new Error("You are not authorized to apply leave for this student.");
    }
    return true;
  }
}

export default new LeaveValidationService();