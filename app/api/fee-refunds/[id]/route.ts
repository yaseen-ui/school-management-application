import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const Controller = (await import("@/lib/backend/modules/fees/fee.controller.js")).default
  return invokeBackendController(Controller, "getRefundById", req, resolvedParams)
}
