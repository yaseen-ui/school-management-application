import { ChannelProvider } from "./provider.interface.js";
import { toWhatsAppAddress } from "./phone.js";
import {
  buildTemplatePayload,
  resolveTemplateKey,
  listWhatsAppTemplates,
} from "./whatsapp-templates.js";
import { prisma } from "../../../lib/prisma.js";
import logger from "../../../utils/logger.js";

const GRAPH_API_VERSION = process.env.COMM_WHATSAPP_API_VERSION || "v21.0";
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

/**
 * Resolve WhatsApp credentials: tenant ChannelConfiguration → env fallback.
 * @param {string|null} tenantId
 */
export async function resolveWhatsAppCredentials(tenantId) {
  let tenantConfig = null;
  let tenantEnabled = null;

  if (tenantId) {
    try {
      const row = await prisma.channelConfiguration.findFirst({
        where: { tenantId, channel: "whatsapp" },
      });
      if (row) {
        tenantEnabled = row.isEnabled;
        tenantConfig = row.config && typeof row.config === "object" ? row.config : {};
      }
    } catch (err) {
      // Enum may not exist until migration; ignore during boot
      logger.warn?.(`WhatsApp channel config lookup failed: ${err.message}`);
    }
  }

  const envEnabled = process.env.COMM_WHATSAPP_ENABLED === "true";
  const dryRun =
    process.env.COMM_WHATSAPP_DRY_RUN === "true" ||
    process.env.COMM_WHATSAPP_ENABLED !== "true";

  const phoneNumberId =
    tenantConfig?.phoneNumberId ||
    tenantConfig?.phone_number_id ||
    process.env.COMM_WHATSAPP_PHONE_NUMBER_ID ||
    null;

  const accessToken =
    tenantConfig?.apiKey ||
    tenantConfig?.accessToken ||
    tenantConfig?.access_token ||
    process.env.COMM_WHATSAPP_API_KEY ||
    null;

  const fromNumber =
    tenantConfig?.fromNumber ||
    tenantConfig?.from_number ||
    process.env.COMM_WHATSAPP_FROM_NUMBER ||
    null;

  // Master env switch OR tenant enabled (tenant can enable if env allows)
  // If env is false, still allow dry-run path when tenant enables for testing logs.
  const channelEnabled =
    envEnabled || tenantEnabled === true || process.env.COMM_WHATSAPP_DRY_RUN === "true";

  return {
    channelEnabled,
    envEnabled,
    tenantEnabled,
    dryRun: dryRun || !accessToken || !phoneNumberId,
    phoneNumberId,
    accessToken,
    fromNumber,
    tenantConfig,
  };
}

/**
 * WhatsappProvider — Meta WhatsApp Cloud API channel.
 *
 * Uses approved message templates for business-initiated sends.
 * Delivery status is updated asynchronously via webhook.
 */
export class WhatsappProvider extends ChannelProvider {
  /**
   * Master availability: allow channel in UI/pipeline when env or dry-run is on.
   * Per-tenant enablement is enforced inside send().
   */
  isEnabled() {
    return (
      process.env.COMM_WHATSAPP_ENABLED === "true" ||
      process.env.COMM_WHATSAPP_DRY_RUN === "true"
    );
  }

  /**
   * @param {Object} recipient — { userId, phone?, fullName?, email? }
   * @param {Object} message — { title, body, actionButton? }
   * @param {Object} metadata — { communicationId, tenantId, sourceModule, sourceEvent, whatsappTemplate, ... }
   */
  async send(recipient, message, metadata = {}) {
    const tenantId = metadata.tenantId || null;
    const creds = await resolveWhatsAppCredentials(tenantId);

    if (!creds.channelEnabled) {
      return { status: "skipped", reason: "WhatsApp channel disabled" };
    }

    // Tenant explicitly disabled
    if (creds.tenantEnabled === false && process.env.COMM_WHATSAPP_ENABLED !== "true") {
      return { status: "skipped", reason: "WhatsApp disabled for this tenant" };
    }

    const waAddress = toWhatsAppAddress(recipient.phone);
    if (!waAddress) {
      return {
        status: "failed",
        reason: "Recipient has no valid phone number for WhatsApp (E.164)",
      };
    }

    const templateKey = resolveTemplateKey({
      ...metadata,
      communicationType: metadata.communicationType || metadata.type,
    });
    const template = buildTemplatePayload(templateKey, {
      message: {
        title: message.title,
        body: message.body || message.message,
        actionButton: message.actionButton,
      },
      metadata,
      recipient,
    });

    const payload = {
      messaging_product: "whatsapp",
      to: waAddress,
      type: "template",
      template,
    };

    // Dry-run: no credentials or explicit dry-run — log and simulate
    if (creds.dryRun) {
      const mockId = `wa-dryrun-${metadata.communicationId || "x"}-${Date.now()}`;
      logger.info(
        `[WhatsApp DRY-RUN] to=${waAddress} template=${template.name} id=${mockId} payload=${JSON.stringify(payload)}`
      );
      return {
        status: "sent",
        providerMessageId: mockId,
        reason: !creds.accessToken || !creds.phoneNumberId
          ? "dry-run: credentials missing (logged only)"
          : "dry-run: COMM_WHATSAPP_DRY_RUN or COMM_WHATSAPP_ENABLED not fully configured",
        dryRun: true,
        templateKey,
      };
    }

    try {
      const url = `${GRAPH_BASE}/${creds.phoneNumberId}/messages`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${creds.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.error) {
        const reason =
          result?.error?.message ||
          result?.error?.error_user_msg ||
          `Meta API error HTTP ${response.status}`;
        logger.error(`[WhatsApp] send failed to=${waAddress}: ${reason}`);
        return {
          status: "failed",
          reason,
          templateKey,
          metaError: result.error || null,
        };
      }

      const providerMessageId = result.messages?.[0]?.id || null;
      logger.info(
        `[WhatsApp] sent to=${waAddress} template=${template.name} msgId=${providerMessageId}`
      );

      return {
        status: "sent",
        providerMessageId,
        templateKey,
      };
    } catch (err) {
      logger.error(`[WhatsApp] exception: ${err.message}`);
      return { status: "failed", reason: err.message || "WhatsApp send failed" };
    }
  }

  async getDeliveryStatus(providerMessageId) {
    // Status is webhook-driven; no reliable pull API for message status.
    if (!providerMessageId) return { status: "unknown" };
    if (String(providerMessageId).startsWith("wa-dryrun-")) {
      return { status: "delivered" };
    }
    return { status: "unknown" };
  }

  static listTemplates() {
    return listWhatsAppTemplates();
  }
}

/**
 * Send a one-off test template message (admin tools).
 */
export async function sendWhatsAppTestMessage({
  tenantId,
  phone,
  templateKey = "general_announcement",
  recipientName = "Test User",
  title = "WhatsApp Test",
  body = "This is a test message from EduManage.",
}) {
  const provider = new WhatsappProvider();
  return provider.send(
    { phone, fullName: recipientName },
    { title, body },
    {
      tenantId,
      communicationId: "test",
      whatsappTemplate: templateKey,
      recipientName,
      sourceModule: "admin",
      sourceEvent: "whatsapp_test",
    }
  );
}

/**
 * Apply Meta webhook status update to CommunicationRecipient rows.
 * @param {Array} statuses — Meta statuses array items
 */
export async function applyWhatsAppStatusUpdates(statuses = []) {
  let updated = 0;
  for (const item of statuses) {
    const providerMessageId = item.id;
    if (!providerMessageId) continue;

    const status = mapMetaStatus(item.status);
    if (!status) continue;

    const errorMessage =
      item.errors?.[0]?.message ||
      item.errors?.[0]?.title ||
      null;

    try {
      /** @type {Record<string, any>} */
      const data = { deliveryStatus: status };
      if (status === "failed" && errorMessage) {
        data.lastError = errorMessage;
      }
      if (status === "delivered" || status === "viewed") {
        data.deliveredAt = new Date();
      }

      const result = await prisma.communicationRecipient.updateMany({
        where: { providerMessageId, channel: "whatsapp" },
        data,
      });
      updated += result.count;
    } catch (err) {
      logger.error(
        `[WhatsApp webhook] failed to update ${providerMessageId}: ${err.message}`
      );
    }
  }
  return updated;
}

function mapMetaStatus(metaStatus) {
  switch ((metaStatus || "").toLowerCase()) {
    case "sent":
      return "sent";
    case "delivered":
      return "delivered";
    case "read":
      return "viewed";
    case "failed":
      return "failed";
    default:
      return null;
  }
}
