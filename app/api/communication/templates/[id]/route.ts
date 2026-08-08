import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'communication-templates:manage')
  const TemplateController = (await import('@backend/modules/communication/template.controller.js')).default
  return invokeBackendController(TemplateController, 'getById', req, params)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'communication-templates:manage')
  const TemplateController = (await import('@backend/modules/communication/template.controller.js')).default
  return invokeBackendController(TemplateController, 'update', req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'communication-templates:manage')
  const TemplateController = (await import('@backend/modules/communication/template.controller.js')).default
  return invokeBackendController(TemplateController, 'delete', req, params)
}
