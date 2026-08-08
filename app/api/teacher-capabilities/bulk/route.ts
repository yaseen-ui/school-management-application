import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function POST(req: NextRequest) {
  await Guard.action(req, 'teacher-capabilities:write');
  const Controller = (await import("@/lib/backend/modules/teacher-capabilities/teacherCapability.controller.js")).default
  return invokeBackendController(Controller, "createBulk", req)
}
