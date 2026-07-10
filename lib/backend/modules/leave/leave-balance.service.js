import { prisma } from "../../lib/prisma.js";

class LeaveBalanceService {
  /**
   * Get or create balance for an employee, category, and academic year.
   */
  async getOrCreateBalance(employeeId, leaveCategoryId, academicYearId, tenantId) {
    let balance = await prisma.employeeLeaveBalance.findFirst({
      where: { tenantId, employeeId, leaveCategoryId, academicYearId },
    });

    if (!balance) {
      const category = await prisma.leaveCategory.findFirst({
        where: { id: leaveCategoryId, tenantId },
      });

      balance = await prisma.employeeLeaveBalance.create({
        data: {
          tenantId,
          employeeId,
          leaveCategoryId,
          academicYearId,
          allocated: category?.daysAllocated || 0,
          carriedForward: 0,
          manualAdjustment: 0,
          used: 0,
          pending: 0,
        },
      });

      // Record initial allocation transaction
      await prisma.leaveBalanceTransaction.create({
        data: {
          tenantId,
          balanceId: balance.id,
          changeType: "allocation",
          amount: category?.daysAllocated || 0,
          reason: "Initial allocation",
          referenceType: "manual_adjustment",
          previousBalance: 0,
          newBalance: category?.daysAllocated || 0,
        },
      });
    }

    return balance;
  }

  /**
   * Get all balances for an employee across academic years.
   */
  async getEmployeeBalances(employeeId, tenantId, academicYearId) {
    const where = { tenantId, employeeId };
    if (academicYearId) where.academicYearId = academicYearId;

    return prisma.employeeLeaveBalance.findMany({
      where,
      include: {
        leaveCategory: { select: { id: true, name: true, applicantType: true, isActive: true, isPaid: true, allowHalfDay: true } },
        academicYear: { select: { id: true, name: true } },
        transactions: { orderBy: { createdAt: "desc" }, take: 10 },
      },
      orderBy: { leaveCategory: { name: "asc" } },
    });
  }

  /**
   * Compute available balance.
   */
  getAvailableBalance(balance) {
    return (balance.allocated + balance.carriedForward + balance.manualAdjustment) - (balance.used + balance.pending);
  }

  /**
   * Deduct from pending when a leave is submitted.
   * Returns the updated balance.
   */
  async deductPending(balanceId, days, leaveRequestId, tenantId) {
    const balance = await prisma.employeeLeaveBalance.findFirst({
      where: { id: balanceId, tenantId },
    });
    if (!balance) throw new Error("Balance not found.");

    const previousPending = balance.pending;
    const newPending = previousPending + days;

    const updated = await prisma.employeeLeaveBalance.update({
      where: { id: balanceId },
      data: { pending: newPending },
    });

    await prisma.leaveBalanceTransaction.create({
      data: {
        tenantId,
        balanceId,
        changeType: "request_approved",
        amount: days,
        reason: `Leave request submitted`,
        referenceType: "leave_request",
        referenceId: leaveRequestId,
        previousBalance: previousPending,
        newBalance: newPending,
      },
    });

    return updated;
  }

  /**
   * Move from pending to used when leave is approved.
   */
  async confirmApproved(balanceId, days, leaveRequestId, tenantId) {
    const balance = await prisma.employeeLeaveBalance.findFirst({
      where: { id: balanceId, tenantId },
    });
    if (!balance) throw new Error("Balance not found.");

    const previousUsed = balance.used;
    const previousPending = balance.pending;
    const newUsed = previousUsed + days;
    const newPending = Math.max(0, previousPending - days);

    const updated = await prisma.employeeLeaveBalance.update({
      where: { id: balanceId },
      data: { used: newUsed, pending: newPending },
    });

    await prisma.leaveBalanceTransaction.create({
      data: {
        tenantId,
        balanceId,
        changeType: "request_approved",
        amount: days,
        reason: `Leave approved`,
        referenceType: "leave_request",
        referenceId: leaveRequestId,
        previousBalance: previousUsed,
        newBalance: newUsed,
      },
    });

    return updated;
  }

  /**
   * Restore pending when a leave is withdrawn.
   */
  async restorePending(balanceId, days, leaveRequestId, tenantId) {
    const balance = await prisma.employeeLeaveBalance.findFirst({
      where: { id: balanceId, tenantId },
    });
    if (!balance) throw new Error("Balance not found.");

    const previousPending = balance.pending;
    const newPending = Math.max(0, previousPending - days);

    const updated = await prisma.employeeLeaveBalance.update({
      where: { id: balanceId },
      data: { pending: newPending },
    });

    await prisma.leaveBalanceTransaction.create({
      data: {
        tenantId,
        balanceId,
        changeType: "request_withdrawn",
        amount: -days,
        reason: `Leave withdrawn`,
        referenceType: "leave_request",
        referenceId: leaveRequestId,
        previousBalance: previousPending,
        newBalance: newPending,
      },
    });

    return updated;
  }

  /**
   * Restore used when an approved leave is cancelled.
   */
  async restoreOnCancel(balanceId, days, leaveRequestId, tenantId) {
    const balance = await prisma.employeeLeaveBalance.findFirst({
      where: { id: balanceId, tenantId },
    });
    if (!balance) throw new Error("Balance not found.");

    const previousUsed = balance.used;
    const newUsed = Math.max(0, previousUsed - days);

    const updated = await prisma.employeeLeaveBalance.update({
      where: { id: balanceId },
      data: { used: newUsed },
    });

    await prisma.leaveBalanceTransaction.create({
      data: {
        tenantId,
        balanceId,
        changeType: "request_cancelled",
        amount: -days,
        reason: `Leave cancelled`,
        referenceType: "leave_request",
        referenceId: leaveRequestId,
        previousBalance: previousUsed,
        newBalance: newUsed,
      },
    });

    return updated;
  }

  /**
   * Manual balance adjustment (positive or negative).
   */
  async manualAdjust(balanceId, amount, reason, actorId, tenantId) {
    if (!amount || amount === 0) throw new Error("Adjustment amount must be non-zero.");

    const balance = await prisma.employeeLeaveBalance.findFirst({
      where: { id: balanceId, tenantId },
    });
    if (!balance) throw new Error("Balance not found.");

    const previousAdjustment = balance.manualAdjustment;
    const newAdjustment = previousAdjustment + amount;

    const updated = await prisma.employeeLeaveBalance.update({
      where: { id: balanceId },
      data: { manualAdjustment: newAdjustment },
    });

    await prisma.leaveBalanceTransaction.create({
      data: {
        tenantId,
        balanceId,
        changeType: "manual_adjustment",
        amount,
        reason: reason || "Manual adjustment",
        referenceType: "manual_adjustment",
        previousBalance: previousAdjustment,
        newBalance: newAdjustment,
        actorId,
      },
    });

    return updated;
  }

  /**
   * Get balance transaction history.
   */
  async getTransactionHistory(balanceId, tenantId) {
    return prisma.leaveBalanceTransaction.findMany({
      where: { balanceId, tenantId },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Get low balance alerts for employees.
   */
  async getLowBalanceEmployees(tenantId, academicYearId, threshold = 2) {
    const balances = await prisma.employeeLeaveBalance.findMany({
      where: {
        tenantId,
        ...(academicYearId ? { academicYearId } : {}),
      },
      include: {
        employee: { select: { id: true, fullName: true, employeeCode: true } },
        leaveCategory: { select: { id: true, name: true } },
        academicYear: { select: { id: true, name: true } },
      },
    });

    return balances
      .map((b) => ({
        ...b,
        available: this.getAvailableBalance(b),
      }))
      .filter((b) => b.available <= threshold)
      .sort((a, b) => a.available - b.available);
  }
}

export default new LeaveBalanceService();