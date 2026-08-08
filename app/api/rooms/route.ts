import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest) {
  await Guard.action(req, 'infrastructure:read');
  const RoomsController = (await import('@backend/modules/rooms/rooms.controller.js')).default
  return invokeBackendController(RoomsController, 'getRooms', req)
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'infrastructure:write');
  const RoomsController = (await import('@backend/modules/rooms/rooms.controller.js')).default
  return invokeBackendController(RoomsController, 'createRoom', req)
}
