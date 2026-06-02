import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/teachers/[id]/qualifications/[qualificationId]
// Note: the backend controller reads :teacherId and :qualificationId from req.params,
// so we forward the Next.js segment names verbatim.

type Params = Promise<{ id: string; qualificationId: string }>

const mapParams = async (params: Params) => {
  const { id, qualificationId } = await params
  return { teacherId: id, qualificationId }
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const TeacherController = (await import('@backend/modules/teachers/teachers.controller.js')).default
  return invokeBackendController(TeacherController, 'getQualificationById', req, mapParams(params))
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  const TeacherController = (await import('@backend/modules/teachers/teachers.controller.js')).default
  return invokeBackendController(TeacherController, 'updateQualification', req, mapParams(params))
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const TeacherController = (await import('@backend/modules/teachers/teachers.controller.js')).default
  return invokeBackendController(TeacherController, 'deleteQualification', req, mapParams(params))
}
