import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ExamController = (await import('@backend/modules/exams/exam.controller.js')).default
  return invokeBackendController(ExamController, 'getPaperById', req, params)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ExamController = (await import('@backend/modules/exams/exam.controller.js')).default
  return invokeBackendController(ExamController, 'updatePaper', req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ExamController = (await import('@backend/modules/exams/exam.controller.js')).default
  return invokeBackendController(ExamController, 'deletePaper', req, params)
}
