import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

// GET /api/parents/[parentId] — get single parent (admin)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ parentId: string }> }
) {
  await Guard.action(req, 'parents:read');
  const ParentsController = (await import('@backend/modules/parents/parents.controller.js')).default
  return invokeBackendController(ParentsController, 'getParentById', req, params)
}