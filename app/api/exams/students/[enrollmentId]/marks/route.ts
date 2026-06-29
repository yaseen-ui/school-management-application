import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

export async function GET(req: NextRequest, { params }: { params: Promise<{ enrollmentId: string }> }) {
  const ExamController = (await import('@backend/modules/exams/exam.controller.js')).default
  return invokeBackendController(ExamController, 'getStudentMarks', req, params)
}
