import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

// Thin adapter for /api/teacher-availability/teacher/[teacherId]

export async function GET(req: NextRequest, { params }: { params: Promise<{ teacherId: string }> }) {
  await Guard.action(req, 'teacher-availability:read');
  const Controller = (await import('@/lib/backend/modules/teacher-availability/teacherAvailability.controller.js')).default
  return invokeBackendController(Controller, 'getByTeacher', req, params)
}
