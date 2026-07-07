import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const Controller = (await import("@/lib/backend/modules/transportation/transportation.controller.js")).default
  return invokeBackendController(Controller, "getTransportAssignmentById", req, resolvedParams)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const Controller = (await import("@/lib/backend/modules/transportation/transportation.controller.js")).default
  return invokeBackendController(Controller, "updateTransportAssignment", req, resolvedParams)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const Controller = (await import("@/lib/backend/modules/transportation/transportation.controller.js")).default
  return invokeBackendController(Controller, "deleteTransportAssignment", req, resolvedParams)
}
