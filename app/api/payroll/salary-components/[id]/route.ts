import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'salary-components:read');
  const Controller = (await import("@/lib/backend/modules/payroll/payroll.controller.js")).default
  return invokeBackendController(Controller, "getSalaryComponent", req, params)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'salary-components:write');
  const Controller = (await import("@/lib/backend/modules/payroll/payroll.controller.js")).default
  return invokeBackendController(Controller, "updateSalaryComponent", req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'salary-components:write');
  const Controller = (await import("@/lib/backend/modules/payroll/payroll.controller.js")).default
  return invokeBackendController(Controller, "deleteSalaryComponent", req, params)
}
