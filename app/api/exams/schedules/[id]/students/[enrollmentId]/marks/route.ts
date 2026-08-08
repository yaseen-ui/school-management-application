import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string; enrollmentId: string }> }) {
  await Guard.action(req, 'marks:entry');
  const ExamController = (await import('@backend/modules/exams/exam.controller.js')).default
  const resolvedParams = await params
  return invokeBackendController(ExamController, 'upsertStudentScheduleMarks', req, {
    scheduleId: resolvedParams.id,
    enrollmentId: resolvedParams.enrollmentId,
  })
}
