import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

// Thin adapter for /api/subjects (incl course sub)

export async function GET(req: NextRequest) {
  await Guard.action(req, 'subjects:read');
  const SubjectController = (await import('@backend/modules/subjects/subjects.controller.js')).default
  const params = Object.fromEntries(req.nextUrl.searchParams)
  if (params.courseId) {
    return invokeBackendController(SubjectController, 'getSubjectsByCourse', req, params)
  }
  return invokeBackendController(SubjectController, 'getSubjects', req)
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'subjects:write');
  const SubjectController = (await import('@backend/modules/subjects/subjects.controller.js')).default
  return invokeBackendController(SubjectController, 'createSubject', req)
}