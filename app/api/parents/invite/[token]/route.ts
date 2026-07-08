import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// GET /api/parents/invite/[token] — validate invite token (public)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const ParentsController = (await import('@backend/modules/parents/parents.controller.js')).default
  return invokeBackendController(ParentsController, 'validateInviteToken', req, params)
}