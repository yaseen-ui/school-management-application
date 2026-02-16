import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/academic-years/[id]

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const AcademicYearController = (await import('@backend/modules/academic-years/academicYear.controller.js')).default
  return invokeBackendController(AcademicYearController, 'getAcademicYearById', req, params)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const AcademicYearController = (await import('@backend/modules/academic-years/academicYear.controller.js')).default
  return invokeBackendController(AcademicYearController, 'updateAcademicYear', req, params)
}