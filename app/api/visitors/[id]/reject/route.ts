import { NextRequest } from "next/server";
import { invokeBackendController } from "@/lib/api/server-adapter";
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'visitors:approve');
  const ctrl = (await import("@backend/modules/visitors/visitors.controller.js")).default;
  return invokeBackendController(ctrl, "reject", req, params);
}