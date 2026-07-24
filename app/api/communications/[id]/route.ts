import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const CommunicationController = (await import('@backend/modules/communication/communication.controller.js')).default
  return invokeBackendController(CommunicationController, 'getById', req, params)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const CommunicationController = (await import('@backend/modules/communication/communication.controller.js')).default
  return invokeBackendController(CommunicationController, 'update', req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const CommunicationController = (await import('@backend/modules/communication/communication.controller.js')).default
  return invokeBackendController(CommunicationController, 'delete', req, params)
}