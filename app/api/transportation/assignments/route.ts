import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"

export async function GET(req: NextRequest) {
  const Controller = (await import("@/lib/backend/modules/transportation/transportation.controller.js")).default
  return invokeBackendController(Controller, "getAllTransportAssignments", req)
}

export async function POST(req: NextRequest) {
  const Controller = (await import("@/lib/backend/modules/transportation/transportation.controller.js")).default
  return invokeBackendController(Controller, "createTransportAssignment", req)
}
