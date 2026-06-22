import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

export async function GET(req: NextRequest) {
  const RoomsController = (await import('@backend/modules/rooms/rooms.controller.js')).default
  return invokeBackendController(RoomsController, 'getRooms', req)
}

export async function POST(req: NextRequest) {
  const RoomsController = (await import('@backend/modules/rooms/rooms.controller.js')).default
  return invokeBackendController(RoomsController, 'createRoom', req)
}
