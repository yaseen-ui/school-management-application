import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/teachers/eligible

export async function GET(req: NextRequest) {
  const TeacherController = (await import('@backend/modules/teachers/teachers.controller.js')).default
  return invokeBackendController(TeacherController, 'getEligibleTeachers', req)
}
