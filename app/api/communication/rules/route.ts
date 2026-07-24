import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

export async function GET(req: NextRequest) {
  const RulesController = (await import('@backend/modules/communication/rules.controller.js')).default
  return invokeBackendController(RulesController, 'list', req)
}

export async function POST(req: NextRequest) {
  const RulesController = (await import('@backend/modules/communication/rules.controller.js')).default
  return invokeBackendController(RulesController, 'create', req)
}
