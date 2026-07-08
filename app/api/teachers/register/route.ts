import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// POST /api/teachers/register — complete staff registration (public)
export async function POST(req: NextRequest) {
  const TeachersController = (await import('@backend/modules/teachers/teachers.controller.js')).default
  return invokeBackendController(TeachersController, 'registerTeacher', req)
}