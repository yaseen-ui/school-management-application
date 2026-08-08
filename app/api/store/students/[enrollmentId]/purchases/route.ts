import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest, { params }: { params: Promise<{ enrollmentId: string }> }) {
  await Guard.action(req, 'store:read');
  const resolvedParams = await params
  const Controller = (await import("@/lib/backend/modules/store/store.controller.js")).default
  return invokeBackendController(Controller, "getStudentPurchases", req, resolvedParams)
}
