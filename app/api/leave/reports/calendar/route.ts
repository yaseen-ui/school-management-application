import { NextRequest } from "next/server";
import { invokeBackendController } from "@/lib/api/server-adapter";
import LeaveController from "@/lib/backend/modules/leave/leave.controller";

export async function GET(req: NextRequest) {
  return invokeBackendController(LeaveController, "getCalendar", req);
}
