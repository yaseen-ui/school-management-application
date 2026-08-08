/**
 * Phone utilities for WhatsApp / SMS delivery.
 * Focus: India-friendly E.164 normalization with configurable default country.
 */

const DEFAULT_COUNTRY_CODE = (process.env.COMM_DEFAULT_COUNTRY_CODE || "91").replace(/^\+/, "");

/**
 * Normalize a phone number to E.164 when possible.
 * @param {string|null|undefined} raw
 * @param {string} [defaultCountryCode]
 * @returns {string|null} E.164 number without spaces, or null if unusable
 */
export function normalizePhoneE164(raw, defaultCountryCode = DEFAULT_COUNTRY_CODE) {
  if (raw == null) return null;
  let s = String(raw).trim();
  if (!s) return null;

  // Keep leading +, strip other non-digits
  const hasPlus = s.startsWith("+");
  s = s.replace(/[^\d+]/g, "");
  if (hasPlus) {
    s = "+" + s.replace(/\D/g, "");
  } else {
    s = s.replace(/\D/g, "");
  }

  if (!s || s === "+") return null;

  // Already E.164-ish
  if (s.startsWith("+")) {
    const digits = s.slice(1);
    if (digits.length < 8 || digits.length > 15) return null;
    return `+${digits}`;
  }

  // 00 international prefix
  if (s.startsWith("00") && s.length > 4) {
    const digits = s.slice(2);
    if (digits.length < 8 || digits.length > 15) return null;
    return `+${digits}`;
  }

  // India: 10-digit mobile starting 6-9
  if (defaultCountryCode === "91") {
    if (s.length === 10 && /^[6-9]\d{9}$/.test(s)) {
      return `+91${s}`;
    }
    // 0XXXXXXXXXX
    if (s.length === 11 && s.startsWith("0") && /^0[6-9]\d{9}$/.test(s)) {
      return `+91${s.slice(1)}`;
    }
    // 91XXXXXXXXXX
    if (s.length === 12 && s.startsWith("91") && /^91[6-9]\d{9}$/.test(s)) {
      return `+${s}`;
    }
  }

  // Generic: prepend default country if looks like national number (8–12 digits)
  if (s.length >= 8 && s.length <= 12) {
    return `+${defaultCountryCode}${s.replace(/^0+/, "")}`;
  }

  if (s.length >= 8 && s.length <= 15) {
    return `+${s}`;
  }

  return null;
}

/**
 * Meta Cloud API expects digits only (country code + number, no +).
 * @param {string|null|undefined} raw
 * @returns {string|null}
 */
export function toWhatsAppAddress(raw) {
  const e164 = normalizePhoneE164(raw);
  if (!e164) return null;
  return e164.replace(/^\+/, "");
}
