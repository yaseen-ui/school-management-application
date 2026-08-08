import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'exam-schedules:read');
  // params.id is the scheduleId
  const ExamController = (await import('@backend/modules/exams/exam.controller.js')).default
  // We need to pass scheduleId as a param; the controller expects req.params.scheduleId
  // We'll wrap params to include scheduleId
  const resolvedParams = await params
  return invokeBackendController(ExamController, 'getPapers', req, { scheduleId: resolvedParams.id })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'exam-schedules:edit');
  const ExamController = (await import('@backend/modules/exams/exam.controller.js')).default
  const resolvedParams = await params
  return invokeBackendController(ExamController, 'upsertPapers', req, { scheduleId: resolvedParams.id })
}
