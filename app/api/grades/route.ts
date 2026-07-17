import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest) {
  await Guard.action(req, 'grades:read');
  const GradeController = (await import('@backend/modules/grades/grades.controller.js')).default
  return invokeBackendController(GradeController, 'getGrades', req)
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'grades:write');
  const GradeController = (await import('@backend/modules/grades/grades.controller.js')).default
  return invokeBackendController(GradeController, 'createGrade', req)
}