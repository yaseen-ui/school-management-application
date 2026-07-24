import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

export async function GET(req: NextRequest, { params }: { params: Promise<{ publicationId: string }> }) {
  const PublicationController = (await import('@backend/modules/communication/publication.controller.js')).default
  return invokeBackendController(PublicationController, 'getRevisions', req, params)
}
