import { NextRequest } from "next/server";
import { invokeBackendController } from "@/lib/api/server-adapter";
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'holidays:read');
  const ctrl = (await import("@backend/modules/holidays/holidays.controller.js")).default;
  return invokeBackendController(ctrl, "getRuleById", req, params);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'holidays:edit');
  const ctrl = (await import("@backend/modules/holidays/holidays.controller.js")).default;
  return invokeBackendController(ctrl, "updateRule", req, params);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'holidays:delete');
  const ctrl = (await import("@backend/modules/holidays/holidays.controller.js")).default;
  return invokeBackendController(ctrl, "deleteRule", req, params);
}