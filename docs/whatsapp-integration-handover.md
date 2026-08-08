# 📱 WhatsApp Integration — Handover Document

## Overview

Add WhatsApp as a communication channel alongside the existing **In-App**, **Email**, **SMS**, and **Push** channels. The integration uses **Meta's WhatsApp Cloud API** (free tier: 1,000 conversations/month), which is the most cost-effective path for school-scale notifications.

---

## Current Communication Architecture

The communication module already supports 4 channels via a clean provider pattern:

```
lib/backend/modules/communication/providers/
├── provider.interface.js       # Base class: send(), isEnabled(), getDeliveryStatus()
├── in-app.provider.js          # Always enabled, writes to DB
├── email.provider.js           # Stub, gated behind COMM_EMAIL_ENABLED
├── sms.provider.js             # Stub, gated behind COMM_SMS_ENABLED
└── push.provider.js            # Stub, gated behind COMM_PUSH_ENABLED
```

Each provider implements:

| Method | Purpose |
|---|---|
| `isEnabled()` | Checks env var to gate the channel |
| `send(recipient, message, metadata)` | Sends the actual message; returns `{ status, providerMessageId?, reason? }` |
| `getDeliveryStatus(providerMessageId)` | Queries external provider for delivery status |

---

## Meta Cloud API — Prerequisites

### Step 1: Meta Developer Setup

| # | Action | Where |
|---|---|---|
| 1 | Create a **Facebook Business Account** (if you don't have one) | [business.facebook.com](https://business.facebook.com) |
| 2 | Create a **Meta Developer App** | [developers.facebook.com](https://developers.facebook.com) → My Apps → Create App |
| 3 | Add **WhatsApp** product to the app | App Dashboard → Add Product → WhatsApp |
| 4 | Note the **Phone Number ID** assigned to your registered number | WhatsApp → API Setup → Phone Number ID |
| 5 | Generate a **Permanent Access Token** | WhatsApp → API Setup → Generate Token (or create a System User token) |

### Step 2: Phone Number

- **Must be a clean number** — not already registered on regular WhatsApp or WhatsApp Business app
- A virtual number from Twilio ($1/month) or a prepaid SIM works
- Once connected to the Cloud API, you **cannot** use WhatsApp Business app on that number

### Step 3: Message Templates

Meta requires all **business-initiated** messages to use approved templates:

1. Go to WhatsApp → Message Templates in your Meta App
2. Create templates with placeholders (e.g., `{{1}}`, `{{2}}`)
3. Submit for Meta review (~24-48 hours)

**Example templates for school use:**

```
Template Name: student_absent
Category: Utility
Language: English
Body: "Dear {{1}}, your ward {{2}} (Grade {{3}}-{{4}}) was marked *absent* on {{5}}. 
       Contact the school office for details."
```

```
Template Name: fee_reminder
Category: Utility
Language: English
Body: "Dear {{1}}, this is a reminder that the {{2}} term fee of ₹{{3}} 
       for {{4}} is due on {{5}}. Please pay at your earliest convenience."
```

```
Template Name: general_announcement
Category: Utility
Language: English
Body: "Dear {{1}}, *{{2}}*\n\n{{3}}"
```

---

## Code Implementation — 7 Files to Change

### 1. Prisma Schema — Add `whatsapp` to enum

**File:** `prisma/schema.prisma` (line 327-332)

```prisma
enum CommunicationChannel {
  in_app
  email
  sms
  push
  whatsapp  // ← NEW
}
```

Then run:
```bash
pnpm prisma migrate dev --name add_whatsapp_channel
```

### 2. New Provider File

**File:** `lib/backend/modules/communication/providers/whatsapp.provider.js`

```js
import { ChannelProvider } from "./provider.interface.js";

export class WhatsappProvider extends ChannelProvider {
  #enabled = process.env.COMM_WHATSAPP_ENABLED === "true";

  isEnabled() {
    return this.#enabled;
  }

  async send(recipient, message, metadata) {
    if (!this.#enabled) {
      return { status: "skipped", reason: "WhatsApp channel disabled via env" };
    }

    if (!recipient.phone) {
      return { status: "failed", reason: "Recipient has no phone number" };
    }

    const phoneNumberId = process.env.COMM_WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.COMM_WHATSAPP_API_KEY;

    if (!phoneNumberId || !accessToken) {
      return { status: "failed", reason: "WhatsApp credentials not configured" };
    }

    try {
      const body = {
        messaging_product: "whatsapp",
        to: recipient.phone,
        type: "template",
        template: {
          name: "general_announcement", // or dynamically from message.templateName
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: message.title },
                { type: "text", text: message.body }
              ]
            }
          ]
        }
      };

      const response = await fetch(
        `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();

      if (result.error) {
        return { status: "failed", reason: result.error.message };
      }

      return {
        status: "sent",
        providerMessageId: result.messages?.[0]?.id || null,
      };
    } catch (err) {
      return { status: "failed", reason: err.message };
    }
  }

  async getDeliveryStatus(providerMessageId) {
    // Meta Cloud API webhook callbacks handle delivery status
    // For now, assume delivered if sent successfully
    return { status: "delivered" };
  }
}
```

### 3. Register Provider in CommunicationService

**File:** `lib/backend/modules/communication/communication.service.js` (lines 17-23)

```js
this.providers = {
  in_app: new InAppProvider(),
  email: new EmailProvider(),
  sms: new SmsProvider(),
  push: new PushProvider(),
  whatsapp: new WhatsappProvider(),  // ← NEW
};
```

Also add the import at top:
```js
import { WhatsappProvider } from "./providers/whatsapp.provider.js";
```

### 4. Frontend Types — Add `whatsapp` to type union

**File:** `lib/api/communication.ts` (line 10)

```ts
export type CommunicationChannel = "in_app" | "email" | "sms" | "push" | "whatsapp";
```

### 5. Channel Toggle Group — Add WhatsApp button

**File:** `components/communication/channel-toggle-group.tsx`

Add import:
```tsx
import { Mail, MessageSquare, Bell, Smartphone, MessageCircle } from "lucide-react"
```

Add to `channels` array (line 15-20):
```tsx
const channels = [
  { value: "in_app", label: "In-App", icon: Bell },
  { value: "email", label: "Email", icon: Mail },
  { value: "sms", label: "SMS", icon: MessageSquare },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },  // ← NEW
  { value: "push", label: "Push", icon: Smartphone },
]
```

### 6. Channel Config Page — Add WhatsApp card

**File:** `app/(dashboard)/communications/automation/channels/page.tsx`

Add import:
```tsx
import { RefreshCw, Mail, MessageSquare, Bell, Smartphone, MessageCircle } from "lucide-react"
```

Add to `channelMeta` (line 16-45):
```tsx
whatsapp: {
  label: "WhatsApp",
  icon: MessageCircle,
  description: "Send notifications via WhatsApp. Requires Meta Cloud API configuration.",
  providerPlaceholder: "meta",
  configPlaceholder: '{\n  "phoneNumberId": "123456789",\n  "apiKey": "EAAJIx..."\n}',
},
```

Add to the initialization loop (line 67):
```tsx
;(["in_app", "email", "sms", "push", "whatsapp"] as CommunicationChannel[]).forEach((ch) => {
```

### 7. Environment Variables

**File:** `.env.example` (and `.env`)

```env
# WhatsApp Cloud API (Meta)
COMM_WHATSAPP_ENABLED=false
COMM_WHATSAPP_PHONE_NUMBER_ID=
COMM_WHATSAPP_API_KEY=
COMM_WHATSAPP_FROM_NUMBER=
```

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `COMM_WHATSAPP_ENABLED` | Yes | Set to `"true"` to enable WhatsApp channel |
| `COMM_WHATSAPP_PHONE_NUMBER_ID` | Yes | From Meta Developer Dashboard → WhatsApp → API Setup |
| `COMM_WHATSAPP_API_KEY` | Yes | Permanent Access Token from Meta (or System User token) |
| `COMM_WHATSAPP_FROM_NUMBER` | No | The WhatsApp number used for sending (for logging/reference) |

---

## Pricing (Meta Cloud API)

| Tier | Cost |
|---|---|
| Free tier | First **1,000 conversations/month** free |
| After 1,000 | ~₹0.04–0.13 per conversation (India rates; Utility category is cheapest) |

A "conversation" = a 24-hour messaging window. For one-way notifications, it's 1 conversation per recipient per 24 hours.

**Example:** 5,000 parents × 2 notifications/month = 10,000 conversations ≈ ₹400–₹1,300/month.

---

## Testing Flow

1. Set up Meta App + WABA + approved templates
2. Add env variables to `.env`
3. Enable WhatsApp toggle in Admin → Communications → Automation → Channels
4. Send a test notification with WhatsApp channel selected
5. Check Meta's Webhook Dashboard for delivery status
6. Receiving phone must have a WhatsApp account (any number)

---

## Current Status

| Item | Status |
|---|---|
| Prisma schema change | ✅ Done (`whatsapp` enum + migration) |
| WhatsApp provider | ✅ Done (templates, E.164, dry-run, tenant config) |
| Frontend UI (toggle + config) | ✅ Done (+ test send on Channels page) |
| Webhook for delivery receipts | ✅ Done (`/api/webhooks/whatsapp`) |
| Meta setup (WABA, tokens) | ⏳ Needs Meta account setup |
| Message templates | ⏳ Needs Meta submission + approval |

See also: [whatsapp-v1-setup.md](./whatsapp-v1-setup.md) for the full V1 setup checklist.

---

## Useful Links

- [Meta Cloud API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Meta Cloud API Reference](https://developers.facebook.com/docs/whatsapp/cloud-api/reference)
- [Message Template Guidelines](https://developers.facebook.com/docs/whatsapp/message-templates/guidelines)
- [Pricing Details](https://developers.facebook.com/docs/whatsapp/pricing)
- [Webhook Setup for Status Callbacks](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/components)