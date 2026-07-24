/**
 * ChannelProvider — Abstract base class for all communication channel providers.
 * Each channel (in-app, email, sms, push) implements this contract.
 */
export class ChannelProvider {
  /**
   * Send a message through this channel.
   * @param {Object} recipient — { userId, email?, phone?, deviceToken? }
   * @param {Object} message — { title, body, actionButton?, metadata? }
   * @param {Object} metadata — { communicationId, tenantId, ... }
   * @returns {Promise<{ status: string, providerMessageId?: string, error?: string }>}
   */
  async send(recipient, message, metadata) {
    throw new Error("Not implemented");
  }

  /**
   * Query delivery status for a previously sent message.
   * @param {string} providerMessageId
   * @returns {Promise<{ status: string }>}
   */
  async getDeliveryStatus(providerMessageId) {
    throw new Error("Not implemented");
  }

  /**
   * Whether this channel is enabled for the current environment.
   * @returns {boolean}
   */
  isEnabled() {
    return true;
  }
}