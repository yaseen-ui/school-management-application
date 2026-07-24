import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

export async function GET(req: NextRequest) {
  const CommunicationController = (await import('@backend/modules/communication/communication.controller.js')).default
  return invokeBackendController(CommunicationController, 'getDeliveryReport', req)
}