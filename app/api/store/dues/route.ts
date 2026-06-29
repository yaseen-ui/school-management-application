import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"

export async function GET(req: NextRequest) {
  const Controller = (await import("@/lib/backend/modules/store/store.controller.js")).default
  return invokeBackendController(Controller, "getAllDues", req)
}
