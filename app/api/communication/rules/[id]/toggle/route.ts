import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const RulesController = (await import('@backend/modules/communication/rules.controller.js')).default
  return invokeBackendController(RulesController, 'toggle', req, params)
}
