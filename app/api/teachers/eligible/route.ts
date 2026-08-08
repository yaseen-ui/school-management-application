import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

// Thin adapter for /api/teachers/eligible

export async function GET(req: NextRequest) {
  await Guard.action(req, 'teachers:read');
  const TeacherController = (await import('@backend/modules/teachers/teachers.controller.js')).default
  return invokeBackendController(TeacherController, 'getEligibleTeachers', req)
}
