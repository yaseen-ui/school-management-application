import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest) {
  await Guard.action(req, 'students:read');
  const StudentController = (await import('@backend/modules/students/students.controller.js')).default
  return invokeBackendController(StudentController, 'getAllStudents', req)
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'students:write');
  const StudentController = (await import('@backend/modules/students/students.controller.js')).default
  return invokeBackendController(StudentController, 'createStudent', req)
}