import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const TemplateController = (await import('@backend/modules/communication/template.controller.js')).default
  return invokeBackendController(TemplateController, 'getById', req, params)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const TemplateController = (await import('@backend/modules/communication/template.controller.js')).default
  return invokeBackendController(TemplateController, 'update', req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const TemplateController = (await import('@backend/modules/communication/template.controller.js')).default
  return invokeBackendController(TemplateController, 'delete', req, params)
}
