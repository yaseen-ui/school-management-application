import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/teachers

export async function GET(req: NextRequest) {
  const TeacherController = (await import('@backend/modules/teachers/teachers.controller.js')).default // class
  return invokeBackendController(TeacherController, 'getAllTeachers', req)
}

export async function POST(req: NextRequest) {
  const TeacherController = (await import('@backend/modules/teachers/teachers.controller.js')).default
  return invokeBackendController(TeacherController, 'createTeacher', req)
}