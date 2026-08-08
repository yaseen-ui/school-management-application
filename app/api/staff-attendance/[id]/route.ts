import { NextRequest } from "next/server";
import { invokeBackendController } from "@/lib/api/server-adapter";
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'staff-attendance:read');
  const ctrl = (await import("@backend/modules/staff-attendance/staffAttendance.controller.js")).default;
  return invokeBackendController(ctrl, "getById", req, params);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'staff-attendance:mark');
  const ctrl = (await import("@backend/modules/staff-attendance/staffAttendance.controller.js")).default;
  return invokeBackendController(ctrl, "update", req, params);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'staff-attendance:mark');
  const ctrl = (await import("@backend/modules/staff-attendance/staffAttendance.controller.js")).default;
  return invokeBackendController(ctrl, "delete", req, params);
}