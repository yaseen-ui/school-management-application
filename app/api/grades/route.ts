import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/grades

export async function GET(req: NextRequest) {
  const GradeController = (await import('@backend/modules/grades/grades.controller.js')).default
  return invokeBackendController(GradeController, 'getGrades', req)
}

export async function POST(req: NextRequest) {
  const GradeController = (await import('@backend/modules/grades/grades.controller.js')).default
  return invokeBackendController(GradeController, 'createGrade', req)
}