import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ExamController = (await import('@backend/modules/exams/exam.controller.js')).default
  const resolvedParams = await params
  return invokeBackendController(ExamController, 'getMarks', req, { paperId: resolvedParams.id })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ExamController = (await import('@backend/modules/exams/exam.controller.js')).default
  const resolvedParams = await params
  return invokeBackendController(ExamController, 'upsertMarks', req, { paperId: resolvedParams.id })
}
