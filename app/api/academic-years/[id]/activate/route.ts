import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/academic-years/[id]/activate

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const AcademicYearController = (await import('@backend/modules/academic-years/academicYear.controller.js')).default
  return invokeBackendController(AcademicYearController, 'activateAcademicYear', req, params)
}