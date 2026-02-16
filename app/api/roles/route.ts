import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/roles (collection)

export async function GET(req: NextRequest) {
  const RoleController = (await import('@backend/modules/roles/roles.controller.js')).default
  return invokeBackendController(RoleController, 'getAllRoles', req)
}

export async function POST(req: NextRequest) {
  const RoleController = (await import('@backend/modules/roles/roles.controller.js')).default
  return invokeBackendController(RoleController, 'createRole', req)
}