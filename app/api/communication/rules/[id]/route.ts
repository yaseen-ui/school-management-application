import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'communication-automation:manage')
  const RulesController = (await import('@backend/modules/communication/rules.controller.js')).default
  return invokeBackendController(RulesController, 'getById', req, params)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'communication-automation:manage')
  const RulesController = (await import('@backend/modules/communication/rules.controller.js')).default
  return invokeBackendController(RulesController, 'update', req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'communication-automation:manage')
  const RulesController = (await import('@backend/modules/communication/rules.controller.js')).default
  return invokeBackendController(RulesController, 'delete', req, params)
}
