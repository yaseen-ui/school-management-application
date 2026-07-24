import { prisma } from "../../lib/prisma.js";
import { AudienceResolver } from "./audience-resolver.js";
import { InAppProvider } from "./providers/in-app.provider.js";
import { EmailProvider } from "./providers/email.provider.js";
import { SmsProvider } from "./providers/sms.provider.js";
import { PushProvider } from "./providers/push.provider.js";

/**
 * CommunicationService — Central send pipeline for all communications.
 *
 * Single entry point: communicationService.send(payload, tenantId, actorId)
 * Handles: audience resolution → recipient row creation → channel dispatch → status tracking → audit.
 */
export class CommunicationService {
  constructor() {
    this.audienceResolver = new AudienceResolver();
    this.providers = {
      in_app: new InAppProvider(),
      email: new EmailProvider(),
      sms: new SmsProvider(),
      push: new PushProvider(),
    };
  }

  /**
   * Send a communication through the full pipeline.
   *
   * @param {Object} params
   * @param {string} params.type          — CommunicationType
   * @param {string} params.senderType    — "user" | "system"
   * @param {string} [params.senderId]    — userId (null for system)
   * @param {string} params.title
   * @param {string} params.message
   * @param {number} [params.priority=0]
   * @param {Object} [params.actionButton] — { label, link }
   * @param {Date}   [params.scheduledAt]
   * @param {Date}   [params.expiresAt]
   * @param {Object} [params.audience]     — audience criteria
   * @param {Array}  [params.channels]     — ["in_app", "email", "sms", "push"]
   * @param {string} [params.automationRuleId]
   * @param {string} [params.sourceModule]
   * @param {string} [params.sourceEvent]
   * @param {Object} [params.sourceReference]
   * @param {string} tenantId
   * @param {string} [actorId]             — who initiated this send
   * @returns {Object} summary { communicationId, totalRecipients, delivered, failed, skipped }
   */
  async send(params, tenantId, actorId) {
    const {
      type,
      senderType = "user",
      senderId = null,
      title,
      message,
      priority = 0,
      actionButton = null,
      scheduledAt = null,
      expiresAt = null,
      audience = null,
      channels = ["in_app"],
      automationRuleId = null,
      sourceModule = null,
      sourceEvent = null,
      sourceReference = null,
    } = params;

    if (!type || !title || !message) {
      throw new Error("type, title, and message are required");
    }

    // 1. Create the Communication record
    const communication = await prisma.communication.create({
      data: {
        tenantId,
        type,
        senderType,
        senderId,
        title,
        message,
        priority,
        actionButton,
        scheduledAt,
        expiresAt,
        status: scheduledAt ? "scheduled" : "sent",
        targetUserIds: audience?.targetUserIds || null,
        targetRoles: audience?.targetRoles || null,
        targetGroups: audience?.targetGroups || null,
        targetGrades: audience?.targetGrades || null,
        targetSections: audience?.targetSections || null,
        targetEmployeeTypes: audience?.targetEmployeeTypes || null,
        targetAudience: audience?.targetAudience || null,
        automationRuleId,
        sourceModule,
        sourceEvent,
        sourceReference,
        createdById: actorId || null,
      },
    });

    // 2. If scheduled, don't dispatch now
    if (scheduledAt) {
      return {
        communicationId: communication.id,
        status: "scheduled",
        scheduledAt,
        totalRecipients: 0,
      };
    }

    // 3. Resolve audience
    const resolvedUsers = await this.audienceResolver.resolve(audience, tenantId);

    // 4. Filter channels to only enabled providers
    const enabledChannels = channels.filter(
      (ch) => this.providers[ch]?.isEnabled()
    );

    // 5. Create recipient rows + dispatch
    let delivered = 0;
    let failed = 0;
    let skipped = 0;

    for (const user of resolvedUsers) {
      for (const channel of enabledChannels) {
        try {
          // Create recipient record
          const recipient = await prisma.communicationRecipient.create({
            data: {
              tenantId,
              communicationId: communication.id,
              userId: user.userId,
              channel,
              deliveryStatus: "pending",
            },
          });

          // Dispatch through provider
          const provider = this.providers[channel];
          const result = await provider.send(
            { ...user },
            { title, body: message, actionButton },
            { communicationId: communication.id, tenantId }
          );

          // Update recipient status
          await prisma.communicationRecipient.update({
            where: { id: recipient.id, tenantId },
            data: {
              deliveryStatus: this.#mapProviderStatus(result.status),
              providerMessageId: result.providerMessageId || null,
              lastError: result.reason || result.error || null,
              deliveredAt: result.status === "delivered" ? new Date() : null,
            },
          });

          if (result.status === "delivered" || result.status === "sent") {
            delivered++;
          } else if (result.status === "failed") {
            failed++;
          } else {
            skipped++;
          }
        } catch (err) {
          failed++;
          // Don't stop the pipeline for a single recipient failure
        }
      }
    }

    // 6. Audit
    await prisma.auditLog.create({
      data: {
        tenantId,
        actorId: actorId || senderId,
        action: "communication.sent",
        targetType: "communication",
        targetId: communication.id,
        details: {
          type,
          title,
          audienceResolvedCount: resolvedUsers.length,
          channels: enabledChannels,
          delivered,
          failed,
          skipped,
        },
        level: failed > 0 ? "warn" : "info",
      },
    });

    return {
      communicationId: communication.id,
      totalRecipients: resolvedUsers.length * enabledChannels.length,
      delivered,
      failed,
      skipped,
    };
  }

  /**
   * Get communications sent by a user or by the system.
   */
  async getHistory({ tenantId, senderId, type, status, limit = 50, offset = 0 }) {
    const where = { tenantId };
    if (senderId) where.senderId = senderId;
    if (type) where.type = type;
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.communication.findMany({
        where,
        include: {
          _count: { select: { recipients: true } },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.communication.count({ where }),
    ]);

    return { items, total, limit, offset };
  }

  /**
   * Get inbox (received communications) for a user.
   */
  async getInbox({ tenantId, userId, isRead, limit = 50, offset = 0 }) {
    const where = {
      tenantId,
      userId,
      channel: "in_app",
    };
    if (isRead !== undefined) {
      where.viewedAt = isRead ? { not: null } : null;
    }

    const [items, total] = await Promise.all([
      prisma.communicationRecipient.findMany({
        where,
        include: {
          communication: {
            select: {
              id: true,
              type: true,
              senderType: true,
              senderId: true,
              title: true,
              message: true,
              priority: true,
              actionButton: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.communicationRecipient.count({ where }),
    ]);

    return { items, total, limit, offset };
  }

  /**
   * Mark a communication as viewed / acknowledged by a recipient.
   */
  async acknowledge({ communicationId, userId, tenantId, action = "viewed" }) {
    const recipient = await prisma.communicationRecipient.findFirst({
      where: {
        tenantId,
        communicationId,
        userId,
        channel: "in_app",
      },
    });

    if (!recipient) {
      throw new Error("Recipient record not found");
    }

    const updateData = {};
    if (action === "viewed" && !recipient.viewedAt) {
      updateData.viewedAt = new Date();
      updateData.deliveryStatus = "viewed";
    }
    if (action === "acknowledged") {
      updateData.acknowledgedAt = new Date();
      updateData.deliveryStatus = "acknowledged";
    }

    return prisma.communicationRecipient.update({
      where: { id: recipient.id, tenantId },
      data: updateData,
    });
  }

  /**
   * Get delivery report for a communication.
   */
  async getDeliveryReport({ communicationId, tenantId }) {
    const communication = await prisma.communication.findFirst({
      where: { id: communicationId, tenantId },
      select: { id: true, title: true, type: true, status: true },
    });

    if (!communication) throw new Error("Communication not found");

    const recipients = await prisma.communicationRecipient.findMany({
      where: { tenantId, communicationId },
      include: {
        user: { select: { id: true, fullName: true, email: true, phone: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const summary = {
      total: recipients.length,
      pending: recipients.filter((r) => r.deliveryStatus === "pending").length,
      sent: recipients.filter((r) => r.deliveryStatus === "sent").length,
      delivered: recipients.filter((r) => r.deliveryStatus === "delivered").length,
      failed: recipients.filter((r) => r.deliveryStatus === "failed").length,
      viewed: recipients.filter((r) => r.deliveryStatus === "viewed").length,
      acknowledged: recipients.filter((r) => r.deliveryStatus === "acknowledged").length,
    };

    return { communication, summary, recipients };
  }

  #mapProviderStatus(providerStatus) {
    switch (providerStatus) {
      case "delivered":
        return "delivered";
      case "sent":
        return "sent";
      case "failed":
        return "failed";
      case "skipped":
        return "pending"; // skipped channels stay as pending
      default:
        return "pending";
    }
  }
}

// Singleton instance
export const communicationService = new CommunicationService();