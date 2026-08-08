import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

// Thin adapter for /api/tenants (collection)
// Imports backend controller via alias (stable, no relative paths)
// Invokes existing methods; no business logic here

export async function GET(req: NextRequest) {
  await Guard.action(req, 'tenants:read');
  const TenantController = (await import('@backend/modules/tenants/tenant.controller.js')).default
  return invokeBackendController(TenantController, 'getAllTenants', req)
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'tenants:write');
  const TenantController = (await import('@backend/modules/tenants/tenant.controller.js')).default
  return invokeBackendController(TenantController, 'createTenant', req)
}