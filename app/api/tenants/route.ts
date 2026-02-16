import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/tenants (collection)
// Imports backend controller via alias (stable, no relative paths)
// Invokes existing methods; no business logic here

export async function GET(req: NextRequest) {
  const TenantController = (await import('@backend/modules/tenants/tenant.controller.js')).default
  return invokeBackendController(TenantController, 'getAllTenants', req)
}

export async function POST(req: NextRequest) {
  const TenantController = (await import('@backend/modules/tenants/tenant.controller.js')).default
  return invokeBackendController(TenantController, 'createTenant', req)
}