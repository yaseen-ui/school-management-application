import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

// Thin adapter for /api/academic-years/[id]/archive

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'academic-years:edit');
  const AcademicYearController = (await import('@backend/modules/academic-years/academicYear.controller.js')).default
  return invokeBackendController(AcademicYearController, 'archiveAcademicYear', req, params)
}