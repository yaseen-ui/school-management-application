import { NextRequest } from "next/server";
import { invokeBackendController } from "@/lib/api/server-adapter";

export async function GET(req: NextRequest) {
  const ctrl = (await import("@backend/modules/staff-attendance/staffAttendance.controller.js")).default;
  return invokeBackendController(ctrl, "getReport", req);
}