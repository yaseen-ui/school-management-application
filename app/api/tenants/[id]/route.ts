import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/tenants/[id]
// Uses path params; invokes backend controller via alias

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const TenantController = (await import('@backend/modules/tenants/tenant.controller.js')).default
  return invokeBackendController(TenantController, 'getTenantById', req, params)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const TenantController = (await import('@backend/modules/tenants/tenant.controller.js')).default
  return invokeBackendController(TenantController, 'updateTenant', req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const TenantController = (await import('@backend/modules/tenants/tenant.controller.js')).default
  return invokeBackendController(TenantController, 'deleteTenant', req, params)
}