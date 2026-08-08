import { NextRequest } from "next/server";
import { invokeBackendController } from "@/lib/api/server-adapter";
import { Guard } from "@/lib/backend/rbac/guards.js";
import {
  sendWhatsAppTestMessage,
  WhatsappProvider,
} from "@/lib/backend/modules/communication/providers/whatsapp.provider.js";

/**
 * POST /api/communication/whatsapp/test
 * Body: { phone, templateKey?, recipientName?, title?, body? }
 *
 * Sends a single test WhatsApp template message for the current tenant.
 */
export async function POST(req: NextRequest) {
  await Guard.action(req, "communication-channels:manage");
  return invokeBackendController(
    {
      test: async (mockReq: any, res: any) => {
        const { default: responseHandler } = await import(
          "@/lib/backend/utils/responseHandler.js"
        );
        try {
          if (!mockReq.user?.userId && !mockReq.user?.id) {
            return responseHandler(res, "fail", null, "Unauthorized");
          }

          const tenantId = mockReq.tenantId || mockReq.user?.tenantId;
          if (!tenantId) {
            return responseHandler(res, "fail", null, "Tenant context required");
          }

          const phone = mockReq.body?.phone;
          if (!phone) {
            return responseHandler(res, "fail", null, "phone is required");
          }

          const result = await sendWhatsAppTestMessage({
            tenantId,
            phone,
            templateKey: mockReq.body?.templateKey || "general_announcement",
            recipientName: mockReq.body?.recipientName || "Test User",
            title: mockReq.body?.title || "WhatsApp Test",
            body:
              mockReq.body?.body ||
              "This is a test message from the school management system.",
          });

          return responseHandler(
            res,
            result.status === "failed" ? "fail" : "success",
            {
              ...result,
              templates: WhatsappProvider.listTemplates(),
            },
            result.status === "failed"
              ? result.reason || "WhatsApp test failed"
              : result.dryRun
                ? "Dry-run success (message logged, not sent to Meta)"
                : "WhatsApp test message sent"
          );
        } catch (error: any) {
          return responseHandler(res, "fail", null, error.message);
        }
      },
    },
    "test",
    req
  );
}

export async function GET(req: NextRequest) {
  await Guard.action(req, "communication-channels:manage");
  return invokeBackendController(
    {
      list: async (_mockReq: any, res: any) => {
        const { default: responseHandler } = await import(
          "@/lib/backend/utils/responseHandler.js"
        );
        return responseHandler(
          res,
          "success",
          { templates: WhatsappProvider.listTemplates() },
          "WhatsApp templates"
        );
      },
    },
    "list",
    req
  );
}
