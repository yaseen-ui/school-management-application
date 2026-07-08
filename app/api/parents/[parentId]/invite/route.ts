import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// POST /api/parents/[parentId]/invite — send registration invite to a parent (admin)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ parentId: string }> }
) {
  const ParentsController = (await import('@backend/modules/parents/parents.controller.js')).default
  return invokeBackendController(ParentsController, 'sendInvite', req, params)
}