import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/teachers/[id]/qualifications

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const TeacherController = (await import('@backend/modules/teachers/teachers.controller.js')).default
  return invokeBackendController(TeacherController, 'getQualificationsByTeacher', req, params)
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const TeacherController = (await import('@backend/modules/teachers/teachers.controller.js')).default
  return invokeBackendController(TeacherController, 'addQualification', req, params)
}