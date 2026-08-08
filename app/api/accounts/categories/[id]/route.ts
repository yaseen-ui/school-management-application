import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'accounts:read');
  const resolvedParams = await params
  const Controller = (await import("@/lib/backend/modules/accounts/accounts.controller.js")).default
  return invokeBackendController(Controller, "getCategoryById", req, resolvedParams)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'accounts:edit');
  const resolvedParams = await params
  const Controller = (await import("@/lib/backend/modules/accounts/accounts.controller.js")).default
  return invokeBackendController(Controller, "updateCategory", req, resolvedParams)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'accounts:edit');
  const resolvedParams = await params
  const Controller = (await import("@/lib/backend/modules/accounts/accounts.controller.js")).default
  return invokeBackendController(Controller, "deleteCategory", req, resolvedParams)
}
