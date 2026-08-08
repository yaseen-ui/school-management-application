import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest) {
  await Guard.action(req, 'students:read');
  const Controller = (await import("@/lib/backend/modules/enrollments/enrollment.controller.js")).default
  return invokeBackendController(Controller, "getAllEnrollments", req)
}
