import { NextRequest } from "next/server";
import { invokeBackendController } from "@/lib/api/server-adapter";
import LeaveController from "@/lib/backend/modules/leave/leave.controller";

export async function GET(req: NextRequest) {
  return invokeBackendController(LeaveController, "getTenantConfig", req);
}

export async function PUT(req: NextRequest) {
  return invokeBackendController(LeaveController, "updateTenantConfig", req);
}