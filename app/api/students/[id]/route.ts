import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'students:read');
  const StudentController = (await import('@backend/modules/students/students.controller.js')).default
  return invokeBackendController(StudentController, 'getStudentById', req, params)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'students:edit');
  const StudentController = (await import('@backend/modules/students/students.controller.js')).default
  return invokeBackendController(StudentController, 'updateStudent', req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'students:delete');
  await Guard.resource(req, 'students:delete', 'student', (await params).id);
  const StudentController = (await import('@backend/modules/students/students.controller.js')).default
  return invokeBackendController(StudentController, 'deleteStudent', req, params)
}