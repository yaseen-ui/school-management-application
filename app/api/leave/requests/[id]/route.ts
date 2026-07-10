import { NextRequest } from "next/server";
import { invokeBackendController } from "@/lib/api/server-adapter";
import LeaveController from "@/lib/backend/modules/leave/leave.controller";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return invokeBackendController(LeaveController, "getRequestById", req, params);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return invokeBackendController(LeaveController, "updateRequest", req, params);
}