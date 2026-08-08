import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

// Thin adapter for /api/subjects/course/[courseId]

export async function GET(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  await Guard.action(req, 'subjects:read');
  const SubjectController = (await import('@backend/modules/subjects/subjects.controller.js')).default
  return invokeBackendController(SubjectController, 'getSubjectsByCourse', req, params)
}
