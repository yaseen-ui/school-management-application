import { NextRequest } from "next/server";
import { invokeBackendController } from "@/lib/api/server-adapter";
import LeaveController from "@/lib/backend/modules/leave/leave.controller";
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'leave:approve');
  return invokeBackendController(LeaveController, "rejectRequest", req, params);
}