import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

// POST /api/teachers/[id]/invite — send registration invite to staff (admin)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await Guard.action(req, 'teachers:write');
  const TeachersController = (await import('@backend/modules/teachers/teachers.controller.js')).default
  return invokeBackendController(TeachersController, 'sendInvite', req, params)
}