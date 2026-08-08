import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

// Thin adapter for /api/timetable-structures

export async function GET(req: NextRequest) {
  await Guard.action(req, 'timetable-structures:read');
  const Controller = (await import('@/lib/backend/modules/timetable-structures/timetableStructure.controller.js')).default
  return invokeBackendController(Controller, 'getAll', req)
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'timetable-structures:write');
  const Controller = (await import('@/lib/backend/modules/timetable-structures/timetableStructure.controller.js')).default
  return invokeBackendController(Controller, 'create', req)
}
