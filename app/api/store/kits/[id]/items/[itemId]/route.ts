import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string; itemId: string }> }) {
  const resolvedParams = await params
  const Controller = (await import("@/lib/backend/modules/store/store.controller.js")).default
  return invokeBackendController(Controller, "updateKitItem", req, resolvedParams)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string; itemId: string }> }) {
  const resolvedParams = await params
  const Controller = (await import("@/lib/backend/modules/store/store.controller.js")).default
  return invokeBackendController(Controller, "deleteKitItem", req, resolvedParams)
}
