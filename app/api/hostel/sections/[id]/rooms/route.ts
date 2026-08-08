import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

// POST - Add room to section
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await Guard.action(req, 'hostel:manage');
  const HostelController = (await import('@backend/modules/hostel/hostel.controller.js')).default
  return invokeBackendController(HostelController, 'addRoomToSection', req)
}