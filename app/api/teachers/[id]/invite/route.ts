import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// POST /api/teachers/[id]/invite — send registration invite to staff (admin)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const TeachersController = (await import('@backend/modules/teachers/teachers.controller.js')).default
  return invokeBackendController(TeachersController, 'sendInvite', req, params)
}