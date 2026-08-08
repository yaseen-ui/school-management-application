import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

// Thin adapter for /api/teacher-availability/[id]

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'teacher-availability:write');
  const Controller = (await import('@/lib/backend/modules/teacher-availability/teacherAvailability.controller.js')).default
  return invokeBackendController(Controller, 'delete', req, params)
}
