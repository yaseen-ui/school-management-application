import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// POST - Add room to section
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const HostelController = (await import('@backend/modules/hostel/hostel.controller.js')).default
  return invokeBackendController(HostelController, 'addRoomToSection', req)
}