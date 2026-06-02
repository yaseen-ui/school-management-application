import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/academic-years/active

export async function GET(req: NextRequest) {
  const AcademicYearController = (await import('@backend/modules/academic-years/academicYear.controller.js')).default
  return invokeBackendController(AcademicYearController, 'getActiveAcademicYear', req)
}
