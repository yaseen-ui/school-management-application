import { NextRequest } from "next/server";
import { invokeBackendController } from "@/lib/api/server-adapter";
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest) {
  await Guard.action(req, 'staff-attendance:read');
  const ctrl = (await import("@backend/modules/staff-attendance/staffAttendance.controller.js")).default;
  return invokeBackendController(ctrl, "getMyToday", req);
}