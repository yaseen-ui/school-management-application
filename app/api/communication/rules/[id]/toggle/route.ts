import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'communication-automation:manage')
  const RulesController = (await import('@backend/modules/communication/rules.controller.js')).default
  return invokeBackendController(RulesController, 'toggle', req, params)
}
