import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await Guard.action(req, 'hostel:read');
  const HostelController = (await import('@backend/modules/hostel/hostel.controller.js')).default
  return invokeBackendController(HostelController, 'getBlockById', req)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await Guard.action(req, 'hostel:manage');
  const HostelController = (await import('@backend/modules/hostel/hostel.controller.js')).default
  return invokeBackendController(HostelController, 'updateBlock', req)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await Guard.action(req, 'hostel:manage');
  const HostelController = (await import('@backend/modules/hostel/hostel.controller.js')).default
  return invokeBackendController(HostelController, 'deleteBlock', req)
}