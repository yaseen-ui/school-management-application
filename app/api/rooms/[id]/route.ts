import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const RoomsController = (await import('@backend/modules/rooms/rooms.controller.js')).default
  return invokeBackendController(RoomsController, 'getRoomById', req, params)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const RoomsController = (await import('@backend/modules/rooms/rooms.controller.js')).default
  return invokeBackendController(RoomsController, 'updateRoom', req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const RoomsController = (await import('@backend/modules/rooms/rooms.controller.js')).default
  return invokeBackendController(RoomsController, 'deleteRoom', req, params)
}
