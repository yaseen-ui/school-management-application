import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'store:write');
  const resolvedParams = await params
  const Controller = (await import("@/lib/backend/modules/store/store.controller.js")).default
  return invokeBackendController(Controller, "addKitItem", req, resolvedParams)
}
