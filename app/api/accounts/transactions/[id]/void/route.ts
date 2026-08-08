import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'transactions:write');
  const resolvedParams = await params
  const Controller = (await import("@/lib/backend/modules/accounts/accounts.controller.js")).default
  return invokeBackendController(Controller, "voidTransaction", req, resolvedParams)
}
