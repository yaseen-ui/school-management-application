import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/teachers/[id]

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const TeacherController = (await import('@backend/modules/teachers/teachers.controller.js')).default
  return invokeBackendController(TeacherController, 'getTeacherById', req, params)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const TeacherController = (await import('@backend/modules/teachers/teachers.controller.js')).default
  return invokeBackendController(TeacherController, 'updateTeacher', req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const TeacherController = (await import('@backend/modules/teachers/teachers.controller.js')).default
  return invokeBackendController(TeacherController, 'deleteTeacher', req, params)
}