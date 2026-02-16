import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Handler for /api/public/domain

export async function POST(req: NextRequest) {
  const TenantController = (await import('@backend/modules/tenants/tenant.controller.js')).default
  return invokeBackendController(TenantController, 'getTenantByDomain', req)
}
