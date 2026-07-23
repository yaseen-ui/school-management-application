import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const HostelController = (await import('@backend/modules/hostel/hostel.controller.js')).default
  return invokeBackendController(HostelController, 'getFloorById', req)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const HostelController = (await import('@backend/modules/hostel/hostel.controller.js')).default
  return invokeBackendController(HostelController, 'updateFloor', req)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const HostelController = (await import('@backend/modules/hostel/hostel.controller.js')).default
  return invokeBackendController(HostelController, 'deleteFloor', req)
}