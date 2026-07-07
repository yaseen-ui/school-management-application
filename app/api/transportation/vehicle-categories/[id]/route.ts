import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const Controller = (await import("@/lib/backend/modules/transportation/transportation.controller.js")).default
  return invokeBackendController(Controller, "getVehicleCategoryById", req, resolvedParams)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const Controller = (await import("@/lib/backend/modules/transportation/transportation.controller.js")).default
  return invokeBackendController(Controller, "updateVehicleCategory", req, resolvedParams)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const Controller = (await import("@/lib/backend/modules/transportation/transportation.controller.js")).default
  return invokeBackendController(Controller, "deleteVehicleCategory", req, resolvedParams)
}
