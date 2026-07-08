import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// POST /api/parents/register — complete parent registration (public)
export async function POST(req: NextRequest) {
  const ParentsController = (await import('@backend/modules/parents/parents.controller.js')).default
  return invokeBackendController(ParentsController, 'registerParent', req)
}