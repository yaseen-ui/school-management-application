import { NextRequest } from "next/server";
import { invokeBackendController } from "@/lib/api/server-adapter";
import LeaveController from "@/lib/backend/modules/leave/leave.controller";
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'leave:read');
  return invokeBackendController(LeaveController, "getRequestById", req, params);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'leave:apply');
  return invokeBackendController(LeaveController, "updateRequest", req, params);
}