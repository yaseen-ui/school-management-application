import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'communication-publications:read')
  const PublicationController = (await import('@backend/modules/communication/publication.controller.js')).default
  return invokeBackendController(PublicationController, 'getById', req, params)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'communication-publications:write')
  const PublicationController = (await import('@backend/modules/communication/publication.controller.js')).default
  return invokeBackendController(PublicationController, 'update', req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'communication-publications:write')
  const PublicationController = (await import('@backend/modules/communication/publication.controller.js')).default
  return invokeBackendController(PublicationController, 'delete', req, params)
}
