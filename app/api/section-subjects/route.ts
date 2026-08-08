import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

// Thin adapter for /api/section-subjects

export async function GET(req: NextRequest) {
  await Guard.action(req, 'section-subjects:read');
  const Controller = (await import('@backend/modules/section-subjects/sectionSubject.controller.js')).default
  return invokeBackendController(Controller, 'getAll', req)
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'section-subjects:write');
  const Controller = (await import('@backend/modules/section-subjects/sectionSubject.controller.js')).default
  return invokeBackendController(Controller, 'create', req)
}
