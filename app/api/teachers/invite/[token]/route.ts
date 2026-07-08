import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// GET /api/teachers/invite/[token] — validate staff invite token (public)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const TeachersController = (await import('@backend/modules/teachers/teachers.controller.js')).default
  return invokeBackendController(TeachersController, 'validateInviteToken', req, params)
}