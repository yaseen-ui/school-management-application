import { ChannelProvider } from "./provider.interface.js";

/**
 * PushProvider — Stub implementation gated behind COMM_PUSH_ENABLED env variable.
 * When enabled, wire up Firebase Cloud Messaging (FCM) / APNs in the send() method.
 */
export class PushProvider extends ChannelProvider {
  #enabled = process.env.COMM_PUSH_ENABLED === "true";

  isEnabled() {
    return this.#enabled;
  }

  async send(recipient, message, metadata) {
    if (!this.#enabled) {
      return { status: "skipped", reason: "Push channel disabled via env" };
    }

    if (!recipient.deviceToken) {
      return { status: "failed", reason: "Recipient has no device token registered" };
    }

    // TODO: Wire up Firebase FCM / APNs here
    // const result = await fcm.send({
    //   token: recipient.deviceToken,
    //   notification: { title: message.title, body: message.body },
    //   data: { communicationId: metadata.communicationId, actionButton: message.actionButton },
    // });
    // return { status: "sent", providerMessageId: result.messageId };

    // Dev stub — simulate successful send
    return {
      status: "sent",
      providerMessageId: `dev-push-${metadata.communicationId}-${Date.now()}`,
    };
  }

  async getDeliveryStatus(providerMessageId) {
    if (!this.#enabled) return { status: "unknown" };

    // TODO: Query FCM delivery receipts
    return { status: "delivered" };
  }
}