import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

// Thin adapter for /api/teacher-capabilities

export async function GET(req: NextRequest) {
  await Guard.action(req, 'teacher-capabilities:read');
  const Controller = (await import('@backend/modules/teacher-capabilities/teacherCapability.controller.js')).default
  return invokeBackendController(Controller, 'getAll', req)
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'teacher-capabilities:write');
  const Controller = (await import('@backend/modules/teacher-capabilities/teacherCapability.controller.js')).default
  return invokeBackendController(Controller, 'create', req)
}
