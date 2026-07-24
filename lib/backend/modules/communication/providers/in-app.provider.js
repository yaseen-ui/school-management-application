import { ChannelProvider } from "./provider.interface.js";

/**
 * InAppProvider — Always-enabled provider that writes directly to the database.
 * No external dependencies. Delivery is instant (marked as "delivered" on write).
 */
export class InAppProvider extends ChannelProvider {
  isEnabled() {
    return true; // always available — no external dependency
  }

  async send(recipient, message, metadata) {
    // The actual recipient-row creation happens in CommunicationService.
    // This provider only confirms that in-app delivery is instantaneous.
    return {
      status: "delivered",
      providerMessageId: null, // in-app doesn't need external tracking
    };
  }

  async getDeliveryStatus(_providerMessageId) {
    return { status: "delivered" };
  }
}