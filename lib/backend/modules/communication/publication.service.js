import { prisma } from "../../lib/prisma.js";
import logger from "../../utils/logger.js";

/**
 * PublicationService — CRUD operations and approval workflow for publications.
 *
 * Handles: create, update, delete, submit, approve, reject, publish, archive, withdraw, revisions.
 */
class PublicationService {
  /**
   * Create a new publication (draft).
   */
  async create(data, tenantId, userId) {
    const publication = await prisma.publication.create({
      data: {
        tenantId,
        type: data.type,
        title: data.title,
        content: data.content || "",
        circularNumber: data.circularNumber,
        attachments: data.attachments || null,
        targetUserIds: data.targetUserIds || null,
        targetRoles: data.targetRoles || null,
        targetGroups: data.targetGroups || null,
        targetGrades: data.targetGrades || null,
        targetSections: data.targetSections || null,
        targetEmployeeTypes: data.targetEmployeeTypes || null,
        targetAudience: data.targetAudience || null,
        publishDate: data.publishDate ? new Date(data.publishDate) : null,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        priority: data.priority || 0,
        isPinned: data.isPinned || false,
        requireAcknowledgement: data.requireAcknowledgement || false,
        sendNotification: data.sendNotification || false,
        status: "draft",
        createdById: userId,
      },
    });

    // Create initial revision (rev 0)
    await prisma.publicationRevision.create({
      data: {
        tenantId,
        publicationId: publication.id,
        revision: 0,
        title: publication.title,
        content: publication.content,
        changedById: userId,
        changeSummary: "Initial draft created",
      },
    });

    logger.info(`Publication created: ${publication.id}`);
    return publication;
  }

  /**
   * Get a single publication by ID.
   */
  async getById(id, tenantId) {
    const publication = await prisma.publication.findFirst({
      where: { id, tenantId },
      include: {
        submittedBy: { select: { id: true, fullName: true } },
        approvedBy: { select: { id: true, fullName: true } },
        rejectedBy: { select: { id: true, fullName: true } },
      },
    });

    if (!publication) {
      throw new Error("Publication not found.");
    }

    return publication;
  }

  /**
   * List publications with filtering.
   */
  async list({ tenantId, type, status, limit = 50, offset = 0 }) {
    const where = { tenantId };
    if (type) where.type = type;
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.publication.findMany({
        where,
        include: {
          submittedBy: { select: { id: true, fullName: true } },
          approvedBy: { select: { id: true, fullName: true } },
          _count: { select: { revisions: true } },
        },
        orderBy: { updatedAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.publication.count({ where }),
    ]);

    return { items, total, limit, offset };
  }

  /**
   * Get published publications (for public/board view).
   */
  async getPublished({ tenantId, type, limit = 50, offset = 0 }) {
    const where = {
      tenantId,
      status: "published",
      OR: [{ expiryDate: null }, { expiryDate: { gte: new Date() } }],
    };
    if (type) where.type = type;

    const [items, total] = await Promise.all([
      prisma.publication.findMany({
        where,
        orderBy: [{ isPinned: "desc" }, { publishDate: "desc" }],
        take: limit,
        skip: offset,
      }),
      prisma.publication.count({ where }),
    ]);

    return { items, total, limit, offset };
  }

  /**
   * Update a draft publication (creates a new revision).
   */
  async update(id, data, tenantId, userId) {
    const existing = await prisma.publication.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new Error("Publication not found.");
    }

    if (!["draft", "pending_approval"].includes(existing.status)) {
      throw new Error(`Cannot update a publication with status: ${existing.status}`);
    }

    const newRevision = existing.revision + 1;

    const publication = await prisma.publication.update({
      where: { id, tenantId },
      data: {
        type: data.type,
        title: data.title,
        content: data.content,
        circularNumber: data.circularNumber,
        attachments: data.attachments,
        targetUserIds: data.targetUserIds,
        targetRoles: data.targetRoles,
        targetGroups: data.targetGroups,
        targetGrades: data.targetGrades,
        targetSections: data.targetSections,
        targetEmployeeTypes: data.targetEmployeeTypes,
        targetAudience: data.targetAudience,
        publishDate: data.publishDate ? new Date(data.publishDate) : undefined,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
        priority: data.priority,
        isPinned: data.isPinned,
        requireAcknowledgement: data.requireAcknowledgement,
        sendNotification: data.sendNotification,
        revision: newRevision,
        updatedById: userId,
      },
    });

    // Record revision
    await prisma.publicationRevision.create({
      data: {
        tenantId,
        publicationId: publication.id,
        revision: newRevision,
        title: publication.title,
        content: publication.content,
        changedById: userId,
        changeSummary: data.changeSummary || `Updated to revision ${newRevision}`,
      },
    });

    logger.info(`Publication updated: ${publication.id} (rev ${newRevision})`);
    return publication;
  }

  /**
   * Delete a draft publication.
   */
  async delete(id, tenantId) {
    const existing = await prisma.publication.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new Error("Publication not found.");
    }

    if (!["draft", "rejected", "expired", "archived", "withdrawn"].includes(existing.status)) {
      throw new Error(`Cannot delete a publication with status: ${existing.status}`);
    }

    await prisma.publication.delete({ where: { id, tenantId } });
    logger.info(`Publication deleted: ${id}`);
    return { deleted: true };
  }

  /**
   * Submit a publication for approval.
   */
  async submit(id, tenantId, userId) {
    const existing = await prisma.publication.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new Error("Publication not found.");
    }

    if (existing.status !== "draft") {
      throw new Error("Only draft publications can be submitted for approval.");
    }

    const publication = await prisma.publication.update({
      where: { id, tenantId },
      data: {
        status: "pending_approval",
        submittedAt: new Date(),
        submittedById: userId,
        updatedById: userId,
      },
    });

    logger.info(`Publication submitted for approval: ${publication.id}`);
    return publication;
  }

  /**
   * Approve a publication.
   */
  async approve(id, { remarks }, tenantId, userId) {
    const existing = await prisma.publication.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new Error("Publication not found.");
    }

    if (existing.status !== "pending_approval") {
      throw new Error("Only publications pending approval can be approved.");
    }

    const publication = await prisma.publication.update({
      where: { id, tenantId },
      data: {
        status: "approved",
        approvedAt: new Date(),
        approvedById: userId,
        approvalRemarks: remarks || null,
        updatedById: userId,
      },
    });

    logger.info(`Publication approved: ${publication.id}`);
    return publication;
  }

  /**
   * Reject a publication.
   */
  async reject(id, { reason }, tenantId, userId) {
    const existing = await prisma.publication.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new Error("Publication not found.");
    }

    if (existing.status !== "pending_approval") {
      throw new Error("Only publications pending approval can be rejected.");
    }

    const publication = await prisma.publication.update({
      where: { id, tenantId },
      data: {
        status: "rejected",
        rejectedAt: new Date(),
        rejectedById: userId,
        rejectionReason: reason || null,
        updatedById: userId,
      },
    });

    logger.info(`Publication rejected: ${publication.id}`);
    return publication;
  }

  /**
   * Publish an approved publication.
   */
  async publish(id, tenantId, userId) {
    const existing = await prisma.publication.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new Error("Publication not found.");
    }

    if (existing.status !== "approved") {
      throw new Error("Only approved publications can be published.");
    }

    const publication = await prisma.publication.update({
      where: { id, tenantId },
      data: {
        status: "published",
        publishedAt: new Date(),
        publishDate: existing.publishDate || new Date(),
        updatedById: userId,
      },
    });

    logger.info(`Publication published: ${publication.id}`);

    // TODO (Phase 2/4): If sendNotification is true, trigger communicationService.send()

    return publication;
  }

  /**
   * Archive a published or expired publication.
   */
  async archive(id, tenantId, userId) {
    const existing = await prisma.publication.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new Error("Publication not found.");
    }

    if (!["published", "expired"].includes(existing.status)) {
      throw new Error("Only published or expired publications can be archived.");
    }

    const publication = await prisma.publication.update({
      where: { id, tenantId },
      data: {
        status: "archived",
        archivedAt: new Date(),
        updatedById: userId,
      },
    });

    logger.info(`Publication archived: ${publication.id}`);
    return publication;
  }

  /**
   * Withdraw a submitted or approved publication.
   */
  async withdraw(id, tenantId, userId) {
    const existing = await prisma.publication.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new Error("Publication not found.");
    }

    if (!["pending_approval", "approved"].includes(existing.status)) {
      throw new Error("Only pending or approved publications can be withdrawn.");
    }

    const publication = await prisma.publication.update({
      where: { id, tenantId },
      data: {
        status: "withdrawn",
        withdrawnAt: new Date(),
        updatedById: userId,
      },
    });

    logger.info(`Publication withdrawn: ${publication.id}`);
    return publication;
  }

  /**
   * Get revision history for a publication.
   */
  async getRevisions(publicationId, tenantId) {
    const publication = await prisma.publication.findFirst({
      where: { id: publicationId, tenantId },
    });

    if (!publication) {
      throw new Error("Publication not found.");
    }

    const revisions = await prisma.publicationRevision.findMany({
      where: { tenantId, publicationId },
      include: {
        changedBy: { select: { id: true, fullName: true } },
      },
      orderBy: { revision: "desc" },
    });

    return { publication: { id: publication.id, title: publication.title }, revisions };
  }
}

// Singleton instance
const publicationService = new PublicationService();
export default publicationService;