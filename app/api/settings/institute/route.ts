import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"

export async function GET(req: NextRequest) {
  const TenantController = (await import("@backend/modules/tenants/tenant.controller.js")).default
  return invokeBackendController(TenantController, "getCurrentTenant", req)
}

export async function PUT(req: NextRequest) {
  const TenantController = (await import("@backend/modules/tenants/tenant.controller.js")).default
  return invokeBackendController(TenantController, "updateCurrentTenant", req)
}
