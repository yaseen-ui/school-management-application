import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/teacher-capabilities/[id]

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const Controller = (await import('@backend/modules/teacher-capabilities/teacherCapability.controller.js')).default
  return invokeBackendController(Controller, 'getById', req, params)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const Controller = (await import('@backend/modules/teacher-capabilities/teacherCapability.controller.js')).default
  return invokeBackendController(Controller, 'update', req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const Controller = (await import('@backend/modules/teacher-capabilities/teacherCapability.controller.js')).default
  return invokeBackendController(Controller, 'delete', req, params)
}
