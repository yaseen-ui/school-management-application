# WhatsApp V1 Setup Checklist

This project implements **Better V1** WhatsApp integration via **Meta Cloud API**.

## What was implemented

- `whatsapp` channel on `CommunicationChannel` enum
- `WhatsappProvider` with template registry, E.164 phones, tenant/env credentials, dry-run
- Parent/teacher phone fallback in audience resolution
- Concurrent dispatch (default 5)
- Webhook: `GET|POST /api/webhooks/whatsapp`
- Test send: `POST /api/communication/whatsapp/test`
- UI: channel toggle + Channels page card + test form

## Environment

```env
COMM_WHATSAPP_ENABLED=false
COMM_WHATSAPP_DRY_RUN=true
COMM_WHATSAPP_PHONE_NUMBER_ID=
COMM_WHATSAPP_API_KEY=
COMM_WHATSAPP_FROM_NUMBER=
COMM_WHATSAPP_WEBHOOK_VERIFY_TOKEN=your-random-token
COMM_WHATSAPP_APP_SECRET=          # optional signature verify
COMM_WHATSAPP_API_VERSION=v21.0
COMM_WHATSAPP_TEMPLATE_LANG=en
COMM_DEFAULT_COUNTRY_CODE=91
COMM_DISPATCH_CONCURRENCY=5
```

| Mode | Behavior |
|------|----------|
| `DRY_RUN=true` or missing credentials | Logs payload, stores `wa-dryrun-…` message id, **no Meta call** |
| `ENABLED=true` + credentials | Live Graph API template send |

## Meta templates to approve

Create these **Utility** templates in Meta (names must match):

### 1. `general_announcement` (en)

```
Dear {{1}}, *{{2}}*

{{3}}
```

### 2. `student_absent` (en)

```
Dear {{1}}, your ward {{2}} (Grade {{3}}-{{4}}) was marked *absent* on {{5}}. Contact the school office for details.
```

### 3. `fee_reminder` (en)

```
Dear {{1}}, this is a reminder that the {{2}} term fee of ₹{{3}} for {{4}} is due on {{5}}. Please pay at your earliest convenience.
```

Registry keys live in `lib/backend/modules/communication/providers/whatsapp-templates.js`.

## Webhook

1. Public URL: `https://<your-host>/api/webhooks/whatsapp`
2. Verify token = `COMM_WHATSAPP_WEBHOOK_VERIFY_TOKEN`
3. Subscribe to **messages** (includes status updates)
4. Optional: set `COMM_WHATSAPP_APP_SECRET` for signature validation

## Tenant config (optional)

On **Communications → Automation → Channels**, enable WhatsApp and save JSON:

```json
{
  "phoneNumberId": "123456789012345",
  "apiKey": "EAAJ…",
  "fromNumber": "+91XXXXXXXXXX"
}
```

Tenant config overrides env when present.

## Test flow

1. Keep `COMM_WHATSAPP_DRY_RUN=true` first
2. Enable WhatsApp on Channels page
3. Enter a phone → **Send test**
4. Confirm server log shows `[WhatsApp DRY-RUN] …`
5. Approve Meta templates, set credentials, set `COMM_WHATSAPP_ENABLED=true` and `DRY_RUN=false`
6. Test again; confirm phone receives template
7. Point webhook; confirm recipient status moves to delivered/failed

## Send from product

- Notifications compose UI: select **WhatsApp** channel
- Automation rules: include `whatsapp` in channels array
- Optional payload fields: `whatsappTemplate`, `templateData` (studentName, amount, dueDate, …)

## Not in V1

- Background job queue
- SMS fallback
- Two-way chat
- Media attachments
- Parent opt-in center
