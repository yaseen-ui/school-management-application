import { NextRequest } from "next/server";
import { invokeBackendController } from "@/lib/api/server-adapter";
import { Guard } from '@/lib/backend/rbac/guards.js'

// GET /api/visitor-notifications — list notifications (filterable by isRead, type, visitorId)
export async function GET(req: NextRequest) {
  await Guard.action(req, 'visitors:read');
  const ctrl = (await import("@backend/modules/visitors/visitors.controller.js")).default;
  return invokeBackendController(ctrl, "getNotifications", req);
}