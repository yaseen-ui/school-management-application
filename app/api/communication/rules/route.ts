import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest) {
  await Guard.action(req, 'communication-automation:manage')
  const RulesController = (await import('@backend/modules/communication/rules.controller.js')).default
  return invokeBackendController(RulesController, 'list', req)
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'communication-automation:manage')
  const RulesController = (await import('@backend/modules/communication/rules.controller.js')).default
  return invokeBackendController(RulesController, 'create', req)
}
