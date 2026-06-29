import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

export async function GET(req: NextRequest) {
  const ExamController = (await import('@backend/modules/exams/exam.controller.js')).default
  return invokeBackendController(ExamController, 'getSchedules', req)
}

export async function POST(req: NextRequest) {
  const ExamController = (await import('@backend/modules/exams/exam.controller.js')).default
  return invokeBackendController(ExamController, 'createSchedule', req)
}
