import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"

export async function POST(req: NextRequest) {
  const Controller = (await import("@/lib/backend/modules/teacher-capabilities/teacherCapability.controller.js")).default
  return invokeBackendController(Controller, "createBulk", req)
}
