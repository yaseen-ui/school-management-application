import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

// Thin adapter for /api/teacher-availability

export async function GET(req: NextRequest) {
  await Guard.action(req, 'teacher-availability:read');
  const Controller = (await import('@/lib/backend/modules/teacher-availability/teacherAvailability.controller.js')).default
  return invokeBackendController(Controller, 'getAll', req)
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'teacher-availability:write');
  const Controller = (await import('@/lib/backend/modules/teacher-availability/teacherAvailability.controller.js')).default
  return invokeBackendController(Controller, 'upsertBulk', req)
}
