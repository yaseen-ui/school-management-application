import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/subject-offerings

export async function GET(req: NextRequest) {
  const Controller = (await import('@backend/modules/subject-offerings/subjectOffering.controller.js')).default
  return invokeBackendController(Controller, 'getAll', req)
}

export async function POST(req: NextRequest) {
  const Controller = (await import('@backend/modules/subject-offerings/subjectOffering.controller.js')).default
  return invokeBackendController(Controller, 'create', req)
}
