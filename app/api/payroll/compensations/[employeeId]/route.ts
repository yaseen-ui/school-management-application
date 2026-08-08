import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest, { params }: { params: Promise<{ employeeId: string }> }) {
  await Guard.action(req, 'compensation:read');
  const Controller = (await import("@/lib/backend/modules/payroll/payroll.controller.js")).default
  return invokeBackendController(Controller, "getEmployeeCompensation", req, params)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ employeeId: string }> }) {
  await Guard.action(req, 'compensation:write');
  const Controller = (await import("@/lib/backend/modules/payroll/payroll.controller.js")).default
  return invokeBackendController(Controller, "upsertEmployeeCompensation", req, params)
}
