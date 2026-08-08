import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest) {
  await Guard.action(req, 'compensation:read');
  const Controller = (await import("@/lib/backend/modules/payroll/payroll.controller.js")).default
  return invokeBackendController(Controller, "listEmployeeCompensations", req)
}
