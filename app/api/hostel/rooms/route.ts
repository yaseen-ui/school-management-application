import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest) {
  await Guard.action(req, 'hostel:read');
  const HostelController = (await import('@backend/modules/hostel/hostel.controller.js')).default
  return invokeBackendController(HostelController, 'getRooms', req)
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'hostel:manage');
  const HostelController = (await import('@backend/modules/hostel/hostel.controller.js')).default
  return invokeBackendController(HostelController, 'createRoom', req)
}