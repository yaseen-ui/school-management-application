import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"

export async function GET(req: NextRequest, { params }: { params: Promise<{ employeeId: string }> }) {
  const Controller = (await import("@/lib/backend/modules/payroll/payroll.controller.js")).default
  return invokeBackendController(Controller, "getEmployeeCompensation", req, params)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ employeeId: string }> }) {
  const Controller = (await import("@/lib/backend/modules/payroll/payroll.controller.js")).default
  return invokeBackendController(Controller, "upsertEmployeeCompensation", req, params)
}
