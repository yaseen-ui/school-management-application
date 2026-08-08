import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await Guard.action(req, 'hostel:allocate');
  const HostelController = (await import('@backend/modules/hostel/hostel.controller.js')).default
  return invokeBackendController(HostelController, 'updateAllocation', req)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await Guard.action(req, 'hostel:allocate');
  const HostelController = (await import('@backend/modules/hostel/hostel.controller.js')).default
  return invokeBackendController(HostelController, 'deleteAllocation', req)
}