import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

// DELETE - Remove room from section
export async function DELETE(req: NextRequest, { params }: { params: { id: string; roomId: string } }) {
  await Guard.action(req, 'hostel:manage');
  const HostelController = (await import('@backend/modules/hostel/hostel.controller.js')).default
  return invokeBackendController(HostelController, 'removeRoomFromSection', req)
}