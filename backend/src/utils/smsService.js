import twilio from "twilio";
import logger from "./logger.js";

export const sendSMS = async (phoneNumber, message) => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID; // Twilio Account SID
    const authToken = process.env.TWILIO_AUTH_TOKEN; // Twilio Auth Token
    const fromNumber = process.env.TWILIO_PHONE_NUMBER; // Twilio Phone Number

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error(
        "Twilio environment variables (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER) are not set."
      );
    }

    const client = twilio(accountSid, authToken);

    // Ensure phoneNumber is in the correct format
    const numbers = Array.isArray(phoneNumber) ? phoneNumber : [phoneNumber];

    const promises = numbers.map((to) =>
      client.messages.create({
        body: message,
        from: fromNumber,
        to,
      })
    );

    const responses = await Promise.all(promises);

    // Log structured responses
    responses.forEach((response) => {
      logger.info("SMS sent successfully", {
        to: response.to,
        sid: response.sid,
        status: response.status,
      });
    });

    return responses.map((response) => response.sid);
  } catch (error) {
    logger.error(
      `Error sending SMS: ${error.status || "Unknown status"} - ${
        error.message || "Unknown error"
      }`
    );
    throw new Error("Failed to send SMS via Twilio.");
  }
};

export default sendSMS;
