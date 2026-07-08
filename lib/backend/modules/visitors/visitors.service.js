import { prisma } from "../../lib/prisma.js";

function mapVisitorPurposeOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    name: row.name,
    requiresApproval: row.requiresApproval,
    approvalFrom: row.approvalFrom,
    isActive: row.isActive,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function mapVisitorOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    visitorType: row.visitorType,
    parentId: row.parentId,
    parentName: row.parent?.fullName || null,
    visitorName: row.visitorName,
    visitorPhone: row.visitorPhone,
    visitorEmail: row.visitorEmail,
    purposeId: row.purposeId,
    purposeName: row.purpose?.name || null,
    description: row.description,
    pointOfContactId: row.pointOfContactId,
    pointOfContactName: row.pointOfContact?.fullName || null,
    approvalStatus: row.approvalStatus,
    approvedById: row.approvedById,
    approvedByName: row.approvedBy?.fullName || null,
    approvedAt: row.approvedAt,
    rejectionReason: row.rejectionReason,
    checkInTime: row.checkInTime,
    checkOutTime: row.checkOutTime,
    status: row.status,
    createdById: row.createdById,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function mapNotificationOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    visitorId: row.visitorId,
    sentToId: row.sentToId,
    type: row.type,
    message: row.message,
    isRead: row.isRead,
    readAt: row.readAt,
    createdAt: row.createdAt,
  };
}

class VisitorsService {
  // ==================== VISITOR PURPOSES ====================

  async createPurpose(data, tenantId) {
    if (!data?.name) throw new Error("Purpose name is required.");
    const existing = await prisma.visitorPurpose.findFirst({
      where: { tenantId, name: data.name },
    });
    if (existing) throw new Error("A purpose with this name already exists.");
    const row = await prisma.visitorPurpose.create({
      data: {
        tenantId,
        name: data.name,
        requiresApproval: data.requiresApproval ?? false,
        approvalFrom: data.approvalFrom ?? "admin",
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
        createdById: data.createdById,
      },
    });
    return mapVisitorPurposeOut(row);
  }

  async getAllPurposes(tenantId) {
    const rows = await prisma.visitorPurpose.findMany({
      where: { tenantId },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return rows.map(mapVisitorPurposeOut);
  }

  async getPurposeById(id, tenantId) {
    const row = await prisma.visitorPurpose.findFirst({ where: { id, tenantId } });
    return mapVisitorPurposeOut(row);
  }

  async updatePurpose(id, data, tenantId) {
    const existing = await prisma.visitorPurpose.findFirst({ where: { id, tenantId } });
    if (!existing) return null;
    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.requiresApproval !== undefined) updateData.requiresApproval = data.requiresApproval;
    if (data.approvalFrom !== undefined) updateData.approvalFrom = data.approvalFrom;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
    await prisma.visitorPurpose.update({ where: { id }, data: updateData });
    return this.getPurposeById(id, tenantId);
  }

  async deletePurpose(id, tenantId) {
    const existing = await prisma.visitorPurpose.findFirst({ where: { id, tenantId } });
    if (!existing) return null;
    const visitorCount = await prisma.visitor.count({ where: { purposeId: id, tenantId } });
    if (visitorCount > 0) throw new Error("Cannot delete purpose that has existing visitors.");
    await prisma.visitorPurpose.delete({ where: { id } });
    return mapVisitorPurposeOut(existing);
  }

  // ==================== VISITORS ====================

  async createVisitor(data, tenantId) {
    if (!data.purposeId) throw new Error("Purpose is required.");
    const purpose = await prisma.visitorPurpose.findFirst({
      where: { id: data.purposeId, tenantId },
    });
    if (!purpose) throw new Error("Purpose not found.");

    const createData = {
      tenantId,
      visitorType: data.visitorType || "non_registered",
      parentId: data.parentId || null,
      visitorName: data.visitorName || null,
      visitorPhone: data.visitorPhone || null,
      visitorEmail: data.visitorEmail || null,
      purposeId: data.purposeId,
      description: data.description || null,
      pointOfContactId: data.pointOfContactId || null,
      approvalStatus: purpose.requiresApproval ? "pending" : "not_required",
      status: "scheduled",
      createdById: data.createdById || null,
    };

    const row = await prisma.visitor.create({
      data: createData,
      include: {
        parent: { select: { fullName: true } },
        purpose: { select: { name: true } },
        pointOfContact: { select: { fullName: true } },
        approvedBy: { select: { fullName: true } },
      },
    });

    // Create notification if approval is required
    if (purpose.requiresApproval) {
      const message = `Visitor ${data.visitorName || data.parentId ? "(parent)" : ""} requires approval for purpose: ${purpose.name}`;
      await prisma.visitorNotification.create({
        data: {
          tenantId,
          visitorId: row.id,
          type: "approval_request",
          message,
        },
      });
    } else {
      // Notify reception
      await prisma.visitorNotification.create({
        data: {
          tenantId,
          visitorId: row.id,
          type: "reception",
          message: `New visitor registered for: ${purpose.name}`,
        },
      });
    }

    return mapVisitorOut(row);
  }

  async getAllVisitors(tenantId, filters = {}) {
    const where = { tenantId };
    if (filters.visitorType) where.visitorType = filters.visitorType;
    if (filters.approvalStatus) where.approvalStatus = filters.approvalStatus;
    if (filters.status) where.status = filters.status;
    if (filters.purposeId) where.purposeId = filters.purposeId;
    if (filters.pointOfContactId) where.pointOfContactId = filters.pointOfContactId;

    const rows = await prisma.visitor.findMany({
      where,
      include: {
        parent: { select: { fullName: true } },
        purpose: { select: { name: true } },
        pointOfContact: { select: { fullName: true } },
        approvedBy: { select: { fullName: true } },
      },
      orderBy: [{ createdAt: "desc" }],
    });
    return rows.map(mapVisitorOut);
  }

  async getActiveVisitors(tenantId) {
    const rows = await prisma.visitor.findMany({
      where: { tenantId, status: { in: ["scheduled", "checked_in"] } },
      include: {
        parent: { select: { fullName: true } },
        purpose: { select: { name: true } },
        pointOfContact: { select: { fullName: true } },
        approvedBy: { select: { fullName: true } },
      },
      orderBy: [{ createdAt: "desc" }],
    });
    return rows.map(mapVisitorOut);
  }

  async getVisitorById(id, tenantId) {
    const row = await prisma.visitor.findFirst({
      where: { id, tenantId },
      include: {
        parent: { select: { fullName: true } },
        purpose: { select: { name: true } },
        pointOfContact: { select: { fullName: true } },
        approvedBy: { select: { fullName: true } },
        notifications: true,
      },
    });
    if (!row) return null;
    const out = mapVisitorOut(row);
    out.notifications = row.notifications.map(mapNotificationOut);
    return out;
  }

  async checkIn(id, tenantId, userId) {
    const visitor = await prisma.visitor.findFirst({ where: { id, tenantId } });
    if (!visitor) throw new Error("Visitor not found.");
    if (visitor.status !== "scheduled" && visitor.status !== "checked_out") {
      throw new Error("Visitor is not in a check-in-able state.");
    }
    await prisma.visitor.update({
      where: { id },
      data: { checkInTime: new Date(), status: "checked_in" },
    });
    return this.getVisitorById(id, tenantId);
  }

  async checkOut(id, tenantId, userId) {
    const visitor = await prisma.visitor.findFirst({ where: { id, tenantId } });
    if (!visitor) throw new Error("Visitor not found.");
    if (visitor.status !== "checked_in") {
      throw new Error("Visitor has not checked in yet.");
    }
    await prisma.visitor.update({
      where: { id },
      data: { checkOutTime: new Date(), status: "checked_out" },
    });
    return this.getVisitorById(id, tenantId);
  }

  async approve(id, tenantId, userId) {
    const visitor = await prisma.visitor.findFirst({ where: { id, tenantId } });
    if (!visitor) throw new Error("Visitor not found.");
    if (visitor.approvalStatus !== "pending") {
      throw new Error("Visitor is not pending approval.");
    }
    const row = await prisma.visitor.update({
      where: { id },
      data: { approvalStatus: "approved", approvedById: userId, approvedAt: new Date() },
      include: {
        parent: { select: { fullName: true } },
        purpose: { select: { name: true } },
        pointOfContact: { select: { fullName: true } },
        approvedBy: { select: { fullName: true } },
      },
    });
    // Notify reception
    await prisma.visitorNotification.create({
      data: {
        tenantId,
        visitorId: id,
        type: "reception",
        message: "Visitor approved. Please allow entry.",
      },
    });
    return mapVisitorOut(row);
  }

  async reject(id, reason, tenantId, userId) {
    const visitor = await prisma.visitor.findFirst({ where: { id, tenantId } });
    if (!visitor) throw new Error("Visitor not found.");
    if (visitor.approvalStatus !== "pending") {
      throw new Error("Visitor is not pending approval.");
    }
    const row = await prisma.visitor.update({
      where: { id },
      data: {
        approvalStatus: "rejected",
        approvedById: userId,
        approvedAt: new Date(),
        rejectionReason: reason || null,
      },
      include: {
        parent: { select: { fullName: true } },
        purpose: { select: { name: true } },
        pointOfContact: { select: { fullName: true } },
        approvedBy: { select: { fullName: true } },
      },
    });
    // Notify reception of rejection
    await prisma.visitorNotification.create({
      data: {
        tenantId,
        visitorId: id,
        type: "reception",
        message: `Visitor rejected. Reason: ${reason || "Not specified"}`,
      },
    });
    return mapVisitorOut(row);
  }

  async cancel(id, tenantId) {
    const visitor = await prisma.visitor.findFirst({ where: { id, tenantId } });
    if (!visitor) throw new Error("Visitor not found.");
    await prisma.visitor.update({
      where: { id },
      data: { status: "cancelled" },
    });
    return this.getVisitorById(id, tenantId);
  }

  // ==================== NOTIFICATIONS ====================

  async getNotifications(tenantId, filters = {}) {
    const where = { tenantId };
    if (filters.isRead !== undefined) where.isRead = filters.isRead;
    if (filters.type) where.type = filters.type;
    if (filters.visitorId) where.visitorId = filters.visitorId;

    const rows = await prisma.visitorNotification.findMany({
      where,
      include: {
        sentTo: { select: { fullName: true } },
      },
      orderBy: [{ createdAt: "desc" }],
    });
    return rows.map(mapNotificationOut);
  }

  async markNotificationRead(id, tenantId) {
    const existing = await prisma.visitorNotification.findFirst({ where: { id, tenantId } });
    if (!existing) return null;
    await prisma.visitorNotification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
    const row = await prisma.visitorNotification.findFirst({ where: { id, tenantId } });
    return mapNotificationOut(row);
  }
}

export default new VisitorsService();