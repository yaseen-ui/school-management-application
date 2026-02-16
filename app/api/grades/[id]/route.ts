import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/grades/[id]

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const GradeController = (await import('@backend/modules/grades/grades.controller.js')).default
  return invokeBackendController(GradeController, 'getGradeById', req, params)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const GradeController = (await import('@backend/modules/grades/grades.controller.js')).default
  return invokeBackendController(GradeController, 'updateGrade', req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const GradeController = (await import('@backend/modules/grades/grades.controller.js')).default
  return invokeBackendController(GradeController, 'deleteGrade', req, params)
}