import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const Controller = (await import("@/lib/backend/modules/store/store.controller.js")).default
  return invokeBackendController(Controller, "updateOrderStatus", req, resolvedParams)
}
