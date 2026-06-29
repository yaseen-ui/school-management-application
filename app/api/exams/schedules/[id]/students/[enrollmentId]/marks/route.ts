import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string; enrollmentId: string }> }) {
  const ExamController = (await import('@backend/modules/exams/exam.controller.js')).default
  const resolvedParams = await params
  return invokeBackendController(ExamController, 'upsertStudentScheduleMarks', req, {
    scheduleId: resolvedParams.id,
    enrollmentId: resolvedParams.enrollmentId,
  })
}
