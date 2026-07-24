import { ChannelProvider } from "./provider.interface.js";

/**
 * EmailProvider — Stub implementation gated behind COMM_EMAIL_ENABLED env variable.
 * When enabled, wire up SendGrid/Nodemailer in the send() method.
 */
export class EmailProvider extends ChannelProvider {
  #enabled = process.env.COMM_EMAIL_ENABLED === "true";

  isEnabled() {
    return this.#enabled;
  }

  async send(recipient, message, metadata) {
    if (!this.#enabled) {
      return { status: "skipped", reason: "Email channel disabled via env" };
    }

    if (!recipient.email) {
      return { status: "failed", reason: "Recipient has no email address" };
    }

    // TODO: Wire up SendGrid / Nodemailer here
    // const result = await sendgrid.send({
    //   to: recipient.email,
    //   subject: message.title,
    //   html: message.body,
    // });
    // return { status: "sent", providerMessageId: result.id };

    // Dev stub — simulate successful send
    return {
      status: "sent",
      providerMessageId: `dev-email-${metadata.communicationId}-${Date.now()}`,
    };
  }

  async getDeliveryStatus(providerMessageId) {
    if (!this.#enabled) return { status: "unknown" };

    // TODO: Query SendGrid webhook / events API
    return { status: "delivered" };
  }
}