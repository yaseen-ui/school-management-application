import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'payroll:read');
  const Controller = (await import("@/lib/backend/modules/payroll/payroll.controller.js")).default
  return invokeBackendController(Controller, "getPayrollBatch", req, params)
}
