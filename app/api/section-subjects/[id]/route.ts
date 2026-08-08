import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

// Thin adapter for /api/section-subjects/[id]

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'section-subjects:read');
  const Controller = (await import('@backend/modules/section-subjects/sectionSubject.controller.js')).default
  return invokeBackendController(Controller, 'getById', req, params)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'section-subjects:write');
  const Controller = (await import('@backend/modules/section-subjects/sectionSubject.controller.js')).default
  return invokeBackendController(Controller, 'update', req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'section-subjects:delete');
  const Controller = (await import('@backend/modules/section-subjects/sectionSubject.controller.js')).default
  return invokeBackendController(Controller, 'delete', req, params)
}
