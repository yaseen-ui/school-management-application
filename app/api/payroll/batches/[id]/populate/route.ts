import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const Controller = (await import("@/lib/backend/modules/payroll/payroll.controller.js")).default
  return invokeBackendController(Controller, "populatePayrollBatch", req, params)
}
