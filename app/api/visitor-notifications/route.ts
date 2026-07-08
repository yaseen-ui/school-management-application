import { NextRequest } from "next/server";
import { invokeBackendController } from "@/lib/api/server-adapter";

// GET /api/visitor-notifications — list notifications (filterable by isRead, type, visitorId)
export async function GET(req: NextRequest) {
  const ctrl = (await import("@backend/modules/visitors/visitors.controller.js")).default;
  return invokeBackendController(ctrl, "getNotifications", req);
}