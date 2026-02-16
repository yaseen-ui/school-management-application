import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/students/[id]

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const StudentController = (await import('@backend/modules/students/students.controller.js')).default
  return invokeBackendController(StudentController, 'getStudentById', req, params)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const StudentController = (await import('@backend/modules/students/students.controller.js')).default
  return invokeBackendController(StudentController, 'updateStudent', req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const StudentController = (await import('@backend/modules/students/students.controller.js')).default
  return invokeBackendController(StudentController, 'deleteStudent', req, params)
}