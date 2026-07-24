import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

export async function GET(req: NextRequest) {
  const TemplateController = (await import('@backend/modules/communication/template.controller.js')).default
  return invokeBackendController(TemplateController, 'list', req)
}

export async function POST(req: NextRequest) {
  const TemplateController = (await import('@backend/modules/communication/template.controller.js')).default
  return invokeBackendController(TemplateController, 'create', req)
}