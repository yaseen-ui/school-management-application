import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/teacher-availability

export async function GET(req: NextRequest) {
  const Controller = (await import('@/lib/backend/modules/teacher-availability/teacherAvailability.controller.js')).default
  return invokeBackendController(Controller, 'getAll', req)
}

export async function POST(req: NextRequest) {
  const Controller = (await import('@/lib/backend/modules/teacher-availability/teacherAvailability.controller.js')).default
  return invokeBackendController(Controller, 'upsertBulk', req)
}
