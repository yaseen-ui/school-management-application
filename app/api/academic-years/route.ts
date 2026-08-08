import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

// Thin adapter for /api/academic-years

export async function GET(req: NextRequest) {
  await Guard.action(req, 'academic-years:read');
  const AcademicYearController = (await import('@backend/modules/academic-years/academicYear.controller.js')).default
  return invokeBackendController(AcademicYearController, 'getAcademicYears', req)
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'academic-years:write');
  const AcademicYearController = (await import('@backend/modules/academic-years/academicYear.controller.js')).default
  return invokeBackendController(AcademicYearController, 'createAcademicYear', req)
}