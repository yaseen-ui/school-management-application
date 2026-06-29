import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"

export async function GET(req: NextRequest) {
  const Controller = (await import("@/lib/backend/modules/enrollments/enrollment.controller.js")).default
  return invokeBackendController(Controller, "getAllEnrollments", req)
}
