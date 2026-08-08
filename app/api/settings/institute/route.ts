import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest) {
  await Guard.action(req, 'settings:read');
  const TenantController = (await import("@backend/modules/tenants/tenant.controller.js")).default
  return invokeBackendController(TenantController, "getCurrentTenant", req)
}

export async function PUT(req: NextRequest) {
  await Guard.action(req, 'settings:write');
  const TenantController = (await import("@backend/modules/tenants/tenant.controller.js")).default
  return invokeBackendController(TenantController, "updateCurrentTenant", req)
}
