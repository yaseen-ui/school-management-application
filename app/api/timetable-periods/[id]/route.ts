import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

// Thin adapter for /api/timetable-periods/[id]

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'timetable-periods:read');
  const Controller = (await import('@/lib/backend/modules/timetable-periods/timetablePeriod.controller.js')).default
  return invokeBackendController(Controller, 'getById', req, params)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'timetable-periods:write');
  const Controller = (await import('@/lib/backend/modules/timetable-periods/timetablePeriod.controller.js')).default
  return invokeBackendController(Controller, 'update', req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'timetable-periods:write');
  const Controller = (await import('@/lib/backend/modules/timetable-periods/timetablePeriod.controller.js')).default
  return invokeBackendController(Controller, 'delete', req, params)
}
