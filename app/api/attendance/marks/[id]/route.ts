import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const Controller = (await import("@/lib/backend/modules/attendance/attendance.controller.js")).default
  return invokeBackendController(Controller, "deleteMark", req, params)
}
