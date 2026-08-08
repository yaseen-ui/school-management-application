import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'transport:read');
  const resolvedParams = await params
  const Controller = (await import("@/lib/backend/modules/transportation/transportation.controller.js")).default
  return invokeBackendController(Controller, "getPickupPointById", req, resolvedParams)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'transport:write');
  const resolvedParams = await params
  const Controller = (await import("@/lib/backend/modules/transportation/transportation.controller.js")).default
  return invokeBackendController(Controller, "updatePickupPoint", req, resolvedParams)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'transport:write');
  const resolvedParams = await params
  const Controller = (await import("@/lib/backend/modules/transportation/transportation.controller.js")).default
  return invokeBackendController(Controller, "deletePickupPoint", req, resolvedParams)
}
