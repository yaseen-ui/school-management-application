import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'communication-publications:write')
  const PublicationController = (await import('@backend/modules/communication/publication.controller.js')).default
  return invokeBackendController(PublicationController, 'submit', req, params)
}
