import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest, { params }: { params: Promise<{ publicationId: string }> }) {
  await Guard.action(req, 'communication-publications:read')
  const PublicationController = (await import('@backend/modules/communication/publication.controller.js')).default
  return invokeBackendController(PublicationController, 'getRevisions', req, params)
}
