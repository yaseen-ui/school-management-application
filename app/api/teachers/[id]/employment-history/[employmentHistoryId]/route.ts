import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/teachers/[id]/employment-history/[employmentHistoryId]

type Params = Promise<{ id: string; employmentHistoryId: string }>

const mapParams = async (params: Params) => {
  const { id, employmentHistoryId } = await params
  return { teacherId: id, employmentHistoryId }
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const TeacherController = (await import('@backend/modules/teachers/teachers.controller.js')).default
  return invokeBackendController(TeacherController, 'getEmploymentHistoryById', req, mapParams(params))
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  const TeacherController = (await import('@backend/modules/teachers/teachers.controller.js')).default
  return invokeBackendController(TeacherController, 'updateEmploymentHistory', req, mapParams(params))
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const TeacherController = (await import('@backend/modules/teachers/teachers.controller.js')).default
  return invokeBackendController(TeacherController, 'deleteEmploymentHistory', req, mapParams(params))
}
