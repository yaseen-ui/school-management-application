import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// DELETE - Remove room from section
export async function DELETE(req: NextRequest, { params }: { params: { id: string; roomId: string } }) {
  const HostelController = (await import('@backend/modules/hostel/hostel.controller.js')).default
  return invokeBackendController(HostelController, 'removeRoomFromSection', req)
}