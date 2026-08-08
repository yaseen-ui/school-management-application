import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest) {
  await Guard.action(req, 'communication-notifications:read')
  const CommunicationController = (await import('@backend/modules/communication/communication.controller.js')).default
  return invokeBackendController(CommunicationController, 'getDeliveryReport', req)
}
