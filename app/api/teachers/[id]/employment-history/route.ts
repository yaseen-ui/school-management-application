import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/teachers/[id]/employment-history

type Params = Promise<{ id: string }>

const mapParams = async (params: Params) => {
  const { id } = await params
  return { teacherId: id }
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const TeacherController = (await import('@backend/modules/teachers/teachers.controller.js')).default
  return invokeBackendController(TeacherController, 'getEmploymentHistoryByTeacher', req, mapParams(params))
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const TeacherController = (await import('@backend/modules/teachers/teachers.controller.js')).default
  return invokeBackendController(TeacherController, 'addEmploymentHistory', req, mapParams(params))
}
