import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: RouteContext) {
  const Controller = (await import("@/lib/backend/modules/attendance/attendance.controller.js")).default
  return invokeBackendController(Controller, "getTypeById", req, params)
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const Controller = (await import("@/lib/backend/modules/attendance/attendance.controller.js")).default
  return invokeBackendController(Controller, "updateType", req, params)
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const Controller = (await import("@/lib/backend/modules/attendance/attendance.controller.js")).default
  return invokeBackendController(Controller, "deleteType", req, params)
}
