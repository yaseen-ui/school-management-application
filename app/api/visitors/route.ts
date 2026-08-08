import { NextRequest } from "next/server";
import { invokeBackendController } from "@/lib/api/server-adapter";
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest) {
  await Guard.action(req, 'visitors:read');
  const ctrl = (await import("@backend/modules/visitors/visitors.controller.js")).default;
  return invokeBackendController(ctrl, "getAllVisitors", req);
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'visitors:write');
  const ctrl = (await import("@backend/modules/visitors/visitors.controller.js")).default;
  return invokeBackendController(ctrl, "createVisitor", req);
}