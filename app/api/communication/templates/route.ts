import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest) {
  await Guard.action(req, 'communication-templates:manage')
  const TemplateController = (await import('@backend/modules/communication/template.controller.js')).default
  return invokeBackendController(TemplateController, 'list', req)
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'communication-templates:manage')
  const TemplateController = (await import('@backend/modules/communication/template.controller.js')).default
  return invokeBackendController(TemplateController, 'create', req)
}
