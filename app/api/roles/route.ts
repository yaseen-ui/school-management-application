import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest) {
  await Guard.action(req, 'roles:read');
  const RolesController = (await import('@backend/modules/roles/roles.controller.js')).default
  return invokeBackendController(RolesController, 'getAllRoles', req)
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'roles:write');
  const RolesController = (await import('@backend/modules/roles/roles.controller.js')).default
  return invokeBackendController(RolesController, 'createRole', req)
}