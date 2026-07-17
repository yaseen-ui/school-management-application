import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest) {
  await Guard.action(req, 'teachers:read');
  const TeacherController = (await import('@backend/modules/teachers/teachers.controller.js')).default
  return invokeBackendController(TeacherController, 'getAllTeachers', req)
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'teachers:write');
  const TeacherController = (await import('@backend/modules/teachers/teachers.controller.js')).default
  return invokeBackendController(TeacherController, 'createTeacher', req)
}