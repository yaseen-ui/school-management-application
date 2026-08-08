import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest) {
  await Guard.action(req, 'communication-publications:read')
  const PublicationController = (await import('@backend/modules/communication/publication.controller.js')).default
  return invokeBackendController(PublicationController, 'list', req)
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'communication-publications:write')
  const PublicationController = (await import('@backend/modules/communication/publication.controller.js')).default
  return invokeBackendController(PublicationController, 'create', req)
}
