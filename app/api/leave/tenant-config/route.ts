import { NextRequest } from "next/server";
import { invokeBackendController } from "@/lib/api/server-adapter";
import LeaveController from "@/lib/backend/modules/leave/leave.controller";
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest) {
  await Guard.action(req, 'leave:read');
  return invokeBackendController(LeaveController, "getTenantConfig", req);
}

export async function PUT(req: NextRequest) {
  await Guard.action(req, 'leave:manage');
  return invokeBackendController(LeaveController, "updateTenantConfig", req);
}