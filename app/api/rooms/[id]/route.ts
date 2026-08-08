import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'infrastructure:read');
  const RoomsController = (await import('@backend/modules/rooms/rooms.controller.js')).default
  return invokeBackendController(RoomsController, 'getRoomById', req, params)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'infrastructure:edit');
  const RoomsController = (await import('@backend/modules/rooms/rooms.controller.js')).default
  return invokeBackendController(RoomsController, 'updateRoom', req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'infrastructure:delete');
  const RoomsController = (await import('@backend/modules/rooms/rooms.controller.js')).default
  return invokeBackendController(RoomsController, 'deleteRoom', req, params)
}
