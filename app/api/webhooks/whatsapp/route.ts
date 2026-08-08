import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  applyWhatsAppStatusUpdates,
} from "@/lib/backend/modules/communication/providers/whatsapp.provider.js";

/**
 * Meta WhatsApp Cloud API webhooks.
 *
 * Setup:
 * 1. Meta App → WhatsApp → Configuration → Webhook
 * 2. Callback URL: https://<host>/api/webhooks/whatsapp
 * 3. Verify token: COMM_WHATSAPP_WEBHOOK_VERIFY_TOKEN
 * 4. Subscribe to `messages` field
 */

export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get("hub.mode");
  const token = req.nextUrl.searchParams.get("hub.verify_token");
  const challenge = req.nextUrl.searchParams.get("hub.challenge");

  const expected = process.env.COMM_WHATSAPP_WEBHOOK_VERIFY_TOKEN || "";

  if (mode === "subscribe" && expected && token === expected && challenge) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.json(
    { status: "fail", message: "Webhook verification failed" },
    { status: 403 }
  );
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    // Optional signature verification when app secret is configured
    const appSecret = process.env.COMM_WHATSAPP_APP_SECRET;
    if (appSecret) {
      const signature = req.headers.get("x-hub-signature-256") || "";
      const expected =
        "sha256=" +
        crypto.createHmac("sha256", appSecret).update(rawBody).digest("hex");
      const sigBuf = Buffer.from(signature);
      const expBuf = Buffer.from(expected);
      if (
        sigBuf.length !== expBuf.length ||
        !crypto.timingSafeEqual(sigBuf, expBuf)
      ) {
        return NextResponse.json(
          { status: "fail", message: "Invalid signature" },
          { status: 401 }
        );
      }
    }

    const body = rawBody ? JSON.parse(rawBody) : {};

    // Meta sends object: "whatsapp_business_account"
    if (body.object !== "whatsapp_business_account") {
      return NextResponse.json({ status: "ok", ignored: true });
    }

    const statuses: any[] = [];
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value || {};
        if (Array.isArray(value.statuses)) {
          statuses.push(...value.statuses);
        }
      }
    }

    let updated = 0;
    if (statuses.length > 0) {
      updated = await applyWhatsAppStatusUpdates(statuses);
    }

    // Always 200 quickly so Meta does not retry aggressively
    return NextResponse.json({ status: "ok", updated });
  } catch (err: any) {
    console.error("[WhatsApp webhook]", err?.message || err);
    // Still 200 to avoid infinite retries on poison payloads during rollouts
    return NextResponse.json({ status: "ok", error: err?.message || "parse_error" });
  }
}
