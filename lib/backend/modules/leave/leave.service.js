import { prisma } from "../../lib/prisma.js";
import LeaveDayCalculator from "./leave-day-calculator.service.js";
import LeaveBalanceService from "./leave-balance.service.js";
import LeaveValidationService from "./leave-validation.service.js";

class LeaveService {
  // =================== Leave Categories ===================

  async createCategory(data, tenantId) {
    return prisma.leaveCategory.create({
      data: { ...data, tenantId },
    });
  }

  async getCategories(tenantId, applicantType) {
    const where = { tenantId };
    if (applicantType) where.applicantType = applicantType;
    return prisma.leaveCategory.findMany({
      where,
      orderBy: { sortOrder: "asc" },
    });
  }

  async getCategoryById(id, tenantId) {
    return prisma.leaveCategory.findFirst({ where: { id, tenantId } });
  }

  async updateCategory(id, data, tenantId) {
    const existing = await prisma.leaveCategory.findFirst({ where: { id, tenantId } });
    if (!existing) return null;
    return prisma.leaveCategory.update({ where: { id }, data });
  }

  async deleteCategory(id, tenantId) {
    const existing = await prisma.leaveCategory.findFirst({ where: { id, tenantId } });
    if (!existing) return null;
    return prisma.leaveCategory.delete({ where: { id } });
  }

  // =================== Leave Requests ===================

  async createRequest(data, tenantId) {
    // Calculate days
    const { calculatedDays } = await LeaveDayCalculator.calculateDays({
      tenantId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      startFraction: data.startFraction || "full_day",
      endFraction: data.endFraction || "full_day",
      employeeId: data.employeeId,
      academicYearId: data.academicYearId,
    });

    const request = await prisma.leaveRequest.create({
      data: {
        tenantId,
        applicantType: data.applicantType,
        studentId: data.studentId || null,
        enrollmentId: data.enrollmentId || null,
        employeeId: data.employeeId || null,
        leaveCategoryId: data.leaveCategoryId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        startFraction: data.startFraction || "full_day",
        endFraction: data.endFraction || "full_day",
        reason: data.reason,
        status: data.status || "draft",
        calculatedDays,
        supportingDocumentUrl: data.supportingDocumentUrl || null,
      },
      include: {
        leaveCategory: true,
        student: { select: { id: true, firstName: true, lastName: true } },
        employee: { select: { id: true, fullName: true, employeeCode: true } },
      },
    });

    // Create audit log
    await prisma.leaveAuditLog.create({
      data: {
        tenantId,
        leaveRequestId: request.id,
        action: "created",
        actorId: data.createdById,
        remarks: "Leave request created",
      },
    });

    return request;
  }

  async getRequestById(id, tenantId) {
    return prisma.leaveRequest.findFirst({
      where: { id, tenantId },
      include: {
        leaveCategory: true,
        student: { select: { id: true, firstName: true, lastName: true, admissionNumber: true } },
        enrollment: {
          select: {
            id: true,
            rollNumber: true,
            grade: { select: { id: true, gradeName: true } },
            section: { select: { id: true, sectionName: true } },
          },
        },
        employee: { select: { id: true, fullName: true, employeeCode: true, employeeType: true } },
        approvals: {
          orderBy: { level: "asc" },
          include: {
            leaveRequest: { select: { id: true } },
          },
        },
        cancellations: true,
        auditLogs: { orderBy: { createdAt: "desc" } },
      },
    });
  }

  async getAllRequests(tenantId, filters = {}) {
    const where = { tenantId };
    if (filters.applicantType) where.applicantType = filters.applicantType;
    if (filters.status) where.status = filters.status;
    if (filters.studentId) where.studentId = filters.studentId;
    if (filters.employeeId) where.employeeId = filters.employeeId;
    if (filters.leaveCategoryId) where.leaveCategoryId = filters.leaveCategoryId;
    if (filters.dateFrom || filters.dateTo) {
      where.startDate = {};
      if (filters.dateFrom) where.startDate.gte = new Date(filters.dateFrom);
      if (filters.dateTo) where.startDate.lte = new Date(filters.dateTo);
    }

    return prisma.leaveRequest.findMany({
      where,
      include: {
        leaveCategory: { select: { id: true, name: true, applicantType: true } },
        student: { select: { id: true, firstName: true, lastName: true } },
        employee: { select: { id: true, fullName: true, employeeCode: true } },
        _count: { select: { approvals: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateRequest(id, data, tenantId) {
    const existing = await prisma.leaveRequest.findFirst({ where: { id, tenantId } });
    if (!existing) return null;

    // Only allow updates to draft requests
    if (existing.status !== "draft") {
      throw new Error("Only draft requests can be edited.");
    }

    return prisma.leaveRequest.update({
      where: { id },
      data,
    });
  }

  async submitRequest(id, submittedById, tenantId) {
    const request = await prisma.leaveRequest.findFirst({
      where: { id, tenantId },
      include: { leaveCategory: true },
    });
    if (!request) throw new Error("Leave request not found.");
    if (request.status !== "draft") throw new Error("Only draft requests can be submitted.");

    const category = request.leaveCategory;

    // Determine status based on approval requirement
    let newStatus = "approved"; // Default for no-approval-needed

    if (category.applicantType === "student") {
      const mode = category.studentApprovalMode;
      if (mode && mode !== "none") {
        newStatus = "pending";
      }
    } else if (category.applicantType === "employee") {
      if (category.requiresApproval) {
        newStatus = "pending";
      }
    } else if (!category.requiresApproval) {
      newStatus = "approved";
    }

    const updated = await prisma.leaveRequest.update({
      where: { id },
      data: {
        status: newStatus,
        submittedById,
        submittedAt: new Date(),
      },
    });

    // If approval is required, create approval entries
    if (newStatus === "pending") {
      await this.createApprovalChain(id, category, tenantId);
    }

    // If auto-approved (no approval needed), handle balance + attendance
    if (newStatus === "approved") {
      await this.handleApprovalEffects(request, tenantId);
    } else if (request.applicantType === "employee" && request.employeeId) {
      // Deduct from pending for employee leave
      const activeYear = await prisma.academicYear.findFirst({
        where: { tenantId, status: "active" },
      });
      if (activeYear && category.isPaid) {
        const balance = await LeaveBalanceService.getOrCreateBalance(
          request.employeeId,
          request.leaveCategoryId,
          activeYear.id,
          tenantId
        );
        await LeaveBalanceService.deductPending(
          balance.id,
          request.calculatedDays || 0,
          request.id,
          tenantId
        );
      }
    }

    await prisma.leaveAuditLog.create({
      data: {
        tenantId,
        leaveRequestId: id,
        action: "submitted",
        actorId: submittedById,
        remarks: `Status changed to ${newStatus}`,
      },
    });

    return updated;
  }

  async createApprovalChain(requestId, category, tenantId) {
    let approverRoles = [];

    if (category.applicantType === "student") {
      const mode = category.studentApprovalMode;
      if (mode === "section_incharge") approverRoles = ["section_incharge"];
      else if (mode === "admin") approverRoles = ["admin"];
      else if (mode === "section_incharge_then_admin") approverRoles = ["section_incharge", "admin"];
    } else if (category.applicantType === "employee") {
      // Default employee approval: reporting_manager or admin
      approverRoles = ["admin"];
    }

    for (let i = 0; i < approverRoles.length; i++) {
      await prisma.leaveApproval.create({
        data: {
          tenantId,
          leaveRequestId: requestId,
          level: i + 1,
          approverRole: approverRoles[i],
          status: "pending",
        },
      });
    }
  }

  async approveRequest(requestId, level, approverId, remarks, tenantId) {
    const approval = await prisma.leaveApproval.findFirst({
      where: { tenantId, leaveRequestId: requestId, level, status: "pending" },
    });
    if (!approval) throw new Error("No pending approval at this level.");

    const now = new Date();
    await prisma.leaveApproval.update({
      where: { id: approval.id },
      data: { status: "approved", approverId, remarks, decidedAt: now },
    });

    // Check if all levels are approved
    const allApprovals = await prisma.leaveApproval.findMany({
      where: { tenantId, leaveRequestId: requestId },
    });

    const allApproved = allApprovals.every((a) => a.status === "approved");
    const nextPending = allApprovals.find((a) => a.status === "pending");

    if (allApproved) {
      const request = await prisma.leaveRequest.findFirst({
        where: { id: requestId, tenantId },
        include: { leaveCategory: true },
      });
      if (!request) throw new Error("Request not found.");

      await prisma.leaveRequest.update({
        where: { id: requestId },
        data: { status: "approved" },
      });

      await this.handleApprovalEffects(request, tenantId);

      await prisma.leaveAuditLog.create({
        data: {
          tenantId,
          leaveRequestId: requestId,
          action: "approved",
          actorId: approverId,
          remarks: remarks || "All approvals completed",
        },
      });
    } else if (nextPending) {
      await prisma.leaveRequest.update({
        where: { id: requestId },
        data: { status: "partially_approved" },
      });
    }

    return { allApproved, nextPending };
  }

  async rejectRequest(requestId, level, approverId, remarks, tenantId) {
    const approval = await prisma.leaveApproval.findFirst({
      where: { tenantId, leaveRequestId: requestId, level, status: "pending" },
    });
    if (!approval) throw new Error("No pending approval at this level.");

    await prisma.leaveApproval.update({
      where: { id: approval.id },
      data: { status: "rejected", approverId, remarks, decidedAt: new Date() },
    });

    await prisma.leaveRequest.update({
      where: { id: requestId },
      data: { status: "rejected" },
    });

    // Restore balance if employee
    const request = await prisma.leaveRequest.findFirst({
      where: { id: requestId, tenantId },
      include: { leaveCategory: true },
    });

    if (request && request.applicantType === "employee" && request.employeeId && request.leaveCategory.isPaid) {
      const activeYear = await prisma.academicYear.findFirst({
        where: { tenantId, status: "active" },
      });
      if (activeYear) {
        const balance = await LeaveBalanceService.getOrCreateBalance(
          request.employeeId,
          request.leaveCategoryId,
          activeYear.id,
          tenantId
        );
        await LeaveBalanceService.restorePending(
          balance.id,
          request.calculatedDays || 0,
          request.id,
          tenantId
        );
      }
    }

    await prisma.leaveAuditLog.create({
      data: {
        tenantId,
        leaveRequestId: requestId,
        action: "rejected",
        actorId: approverId,
        remarks: remarks || "Request rejected",
      },
    });

    return true;
  }

  async withdrawRequest(requestId, reason, actorId, tenantId) {
    const request = await prisma.leaveRequest.findFirst({
      where: { id: requestId, tenantId },
      include: { leaveCategory: true },
    });
    if (!request) throw new Error("Request not found.");
    if (!["pending", "partially_approved"].includes(request.status)) {
      throw new Error("Only pending requests can be withdrawn.");
    }

    const updated = await prisma.leaveRequest.update({
      where: { id: requestId },
      data: {
        status: "withdrawn",
        withdrawnAt: new Date(),
        withdrawnReason: reason,
      },
    });

    // Restore balance
    if (request.applicantType === "employee" && request.employeeId && request.leaveCategory.isPaid) {
      const activeYear = await prisma.academicYear.findFirst({
        where: { tenantId, status: "active" },
      });
      if (activeYear) {
        const balance = await LeaveBalanceService.getOrCreateBalance(
          request.employeeId,
          request.leaveCategoryId,
          activeYear.id,
          tenantId
        );
        await LeaveBalanceService.restorePending(
          balance.id,
          request.calculatedDays || 0,
          request.id,
          tenantId
        );
      }
    }

    await prisma.leaveAuditLog.create({
      data: {
        tenantId,
        leaveRequestId: requestId,
        action: "withdrawn",
        actorId,
        remarks: reason || "Withdrawn by applicant",
      },
    });

    return updated;
  }

  async cancelRequest(requestId, reason, requestedById, tenantId) {
    const request = await prisma.leaveRequest.findFirst({
      where: { id: requestId, tenantId },
      include: { leaveCategory: true },
    });
    if (!request) throw new Error("Request not found.");
    if (request.status !== "approved") throw new Error("Only approved requests can be cancelled.");

    // Create cancellation record
    await prisma.leaveCancellation.create({
      data: {
        tenantId,
        leaveRequestId: requestId,
        requestedById,
        reason,
        status: "approved",
        decidedAt: new Date(),
      },
    });

    const updated = await prisma.leaveRequest.update({
      where: { id: requestId },
      data: { status: "cancelled" },
    });

    // Restore balance for employee
    if (request.applicantType === "employee" && request.employeeId && request.leaveCategory.isPaid) {
      const activeYear = await prisma.academicYear.findFirst({
        where: { tenantId, status: "active" },
      });
      if (activeYear) {
        const balance = await LeaveBalanceService.getOrCreateBalance(
          request.employeeId,
          request.leaveCategoryId,
          activeYear.id,
          tenantId
        );
        await LeaveBalanceService.restoreOnCancel(
          balance.id,
          request.calculatedDays || 0,
          request.id,
          tenantId
        );
      }
    }

    // Update attendance for student
    if (request.applicantType === "student" && request.studentId) {
      await this.revertAttendanceMarks(request, tenantId);
    }

    await prisma.leaveAuditLog.create({
      data: {
        tenantId,
        leaveRequestId: requestId,
        action: "cancelled",
        actorId: requestedById,
        remarks: reason || "Cancelled",
      },
    });

    return updated;
  }

  async handleApprovalEffects(request, tenantId) {
    // Employee balance: move pending to used
    if (request.applicantType === "employee" && request.employeeId) {
      const activeYear = await prisma.academicYear.findFirst({
        where: { tenantId, status: "active" },
      });
      if (activeYear && request.leaveCategory?.isPaid) {
        const balance = await LeaveBalanceService.getOrCreateBalance(
          request.employeeId,
          request.leaveCategoryId,
          activeYear.id,
          tenantId
        );
        await LeaveBalanceService.confirmApproved(
          balance.id,
          request.calculatedDays || 0,
          request.id,
          tenantId
        );
      }

      // Loss of pay tracking
      if (!request.leaveCategory?.isPaid) {
        await prisma.employeeLeaveLossOfPay.create({
          data: {
            tenantId,
            leaveRequestId: request.id,
            employeeId: request.employeeId,
            days: request.calculatedDays || 0,
            status: "pending",
          },
        });
      }
    }

    // Student attendance
    if (request.applicantType === "student" && request.enrollmentId) {
      await this.updateAttendanceMarks(request, tenantId);
    }
  }

  async updateAttendanceMarks(request, tenantId) {
    // Find all attendance marks for the student during leave dates
    // and update absent -> leave (don't touch present)
    const marks = await prisma.attendanceMark.findMany({
      where: {
        tenantId,
        enrollmentId: request.enrollmentId,
        status: "absent", // Only update absent marks
        session: {
          date: {
            gte: new Date(request.startDate),
            lte: new Date(request.endDate),
          },
        },
      },
    });

    for (const mark of marks) {
      await prisma.attendanceMark.update({
        where: { id: mark.id },
        data: {
          status: "leave",
          remarks: `Updated from leave request #${request.id}`,
        },
      });
    }
  }

  async revertAttendanceMarks(request, tenantId) {
    // Revert leave -> absent on cancellation
    const marks = await prisma.attendanceMark.findMany({
      where: {
        tenantId,
        enrollmentId: request.enrollmentId,
        status: "leave",
        session: {
          date: {
            gte: new Date(request.startDate),
            lte: new Date(request.endDate),
          },
        },
      },
    });

    for (const mark of marks) {
      await prisma.attendanceMark.update({
        where: { id: mark.id },
        data: {
          status: "absent",
          remarks: `Reverted from leave cancellation #${request.id}`,
        },
      });
    }
  }

  // =================== Tenant Configuration ===================

  async getTenantConfig(tenantId) {
    let config = await prisma.tenantLeaveConfiguration.findUnique({
      where: { tenantId },
    });
    if (!config) {
      config = await prisma.tenantLeaveConfiguration.create({
        data: {
          tenantId,
          workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        },
      });
    }
    return config;
  }

  async updateTenantConfig(tenantId, data) {
    return prisma.tenantLeaveConfiguration.upsert({
      where: { tenantId },
      update: data,
      create: { tenantId, ...data },
    });
  }

  // =================== Reports ===================

  async getCalendar(tenantId, dateFrom, dateTo) {
    return prisma.leaveRequest.findMany({
      where: {
        tenantId,
        status: { in: ["approved", "pending"] },
        startDate: { lte: new Date(dateTo || new Date()) },
        endDate: { gte: new Date(dateFrom || new Date()) },
      },
      include: {
        leaveCategory: { select: { id: true, name: true } },
        employee: { select: { id: true, fullName: true, employeeCode: true } },
        student: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async getSummary(tenantId, academicYearId) {
    const where = { tenantId };

    const [totalRequests, pendingRequests, approvedRequests, rejectedRequests] = await Promise.all([
      prisma.leaveRequest.count({ where }),
      prisma.leaveRequest.count({ where: { ...where, status: "pending" } }),
      prisma.leaveRequest.count({ where: { ...where, status: "approved" } }),
      prisma.leaveRequest.count({ where: { ...where, status: "rejected" } }),
    ]);

    return {
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
    };
  }

  // =================== Pending Approvals ===================

  async getPendingApprovals(approverId, tenantId) {
    return prisma.leaveApproval.findMany({
      where: {
        tenantId,
        approverId,
        status: "pending",
      },
      include: {
        leaveRequest: {
          include: {
            leaveCategory: true,
            employee: { select: { id: true, fullName: true, employeeCode: true } },
            student: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

export default new LeaveService();