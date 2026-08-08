import { NextRequest } from "next/server";
import { invokeBackendController } from "@/lib/api/server-adapter";
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'settings:read');
  const ctrl = (await import("@backend/modules/id-sequence/id-sequence.controller.js")).default;
  return invokeBackendController(ctrl, "getPatternById", req);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'settings:write');
  const ctrl = (await import("@backend/modules/id-sequence/id-sequence.controller.js")).default;
  return invokeBackendController(ctrl, "updatePattern", req);
}