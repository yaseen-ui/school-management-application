import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

// Thin adapter for /api/roles/[id]

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'roles:read');
  const RoleController = (await import('@backend/modules/roles/roles.controller.js')).default
  return invokeBackendController(RoleController, 'getRoleById', req, params)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'roles:edit');
  const RoleController = (await import('@backend/modules/roles/roles.controller.js')).default
  return invokeBackendController(RoleController, 'updateRole', req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'roles:delete');
  const RoleController = (await import('@backend/modules/roles/roles.controller.js')).default
  return invokeBackendController(RoleController, 'deleteRole', req, params)
}