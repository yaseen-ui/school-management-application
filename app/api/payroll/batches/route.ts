import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest) {
  await Guard.action(req, 'payroll:read');
  const Controller = (await import("@/lib/backend/modules/payroll/payroll.controller.js")).default
  return invokeBackendController(Controller, "listPayrollBatches", req)
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'payroll:process');
  const Controller = (await import("@/lib/backend/modules/payroll/payroll.controller.js")).default
  return invokeBackendController(Controller, "createOrGetPayrollBatch", req)
}
