import { NextRequest } from "next/server";
import { invokeBackendController } from "@/lib/api/server-adapter";
import LeaveController from "@/lib/backend/modules/leave/leave.controller";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return invokeBackendController(LeaveController, "withdrawRequest", req, params);
}
