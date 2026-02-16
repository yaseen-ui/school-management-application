import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/students

export async function GET(req: NextRequest) {
  const StudentController = (await import('@backend/modules/students/students.controller.js')).default // class
  return invokeBackendController(StudentController, 'getAllStudents', req)
}

export async function POST(req: NextRequest) {
  const StudentController = (await import('@backend/modules/students/students.controller.js')).default
  return invokeBackendController(StudentController, 'createStudent', req)
}