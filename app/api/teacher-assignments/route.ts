import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

// Thin adapter for /api/teacher-assignments

export async function GET(req: NextRequest) {
  await Guard.action(req, 'teacher-assignments:read');
  const Controller = (await import('@backend/modules/teacher-assignments/teacherAssignment.controller.js')).default
  return invokeBackendController(Controller, 'getAll', req)
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'teacher-assignments:write');
  const Controller = (await import('@backend/modules/teacher-assignments/teacherAssignment.controller.js')).default
  return invokeBackendController(Controller, 'create', req)
}
