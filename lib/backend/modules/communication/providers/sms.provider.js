import { ChannelProvider } from "./provider.interface.js";

/**
 * SmsProvider — Stub implementation gated behind COMM_SMS_ENABLED env variable.
 * When enabled, wire up Twilio / MessageBird in the send() method.
 */
export class SmsProvider extends ChannelProvider {
  #enabled = process.env.COMM_SMS_ENABLED === "true";

  isEnabled() {
    return this.#enabled;
  }

  async send(recipient, message, metadata) {
    if (!this.#enabled) {
      return { status: "skipped", reason: "SMS channel disabled via env" };
    }

    if (!recipient.phone) {
      return { status: "failed", reason: "Recipient has no phone number" };
    }

    // TODO: Wire up Twilio / MessageBird here
    // const result = await twilio.messages.create({
    //   body: `${message.title}\n${message.body}`,
    //   to: recipient.phone,
    //   from: process.env.COMM_SMS_FROM_NUMBER,
    // });
    // return { status: "sent", providerMessageId: result.sid };

    // Dev stub — simulate successful send
    return {
      status: "sent",
      providerMessageId: `dev-sms-${metadata.communicationId}-${Date.now()}`,
    };
  }

  async getDeliveryStatus(providerMessageId) {
    if (!this.#enabled) return { status: "unknown" };

    // TODO: Query Twilio status callback / MessageBird webhook
    return { status: "delivered" };
  }
}