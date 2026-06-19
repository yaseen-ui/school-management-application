import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/section-subjects

export async function GET(req: NextRequest) {
  const Controller = (await import('@backend/modules/section-subjects/sectionSubject.controller.js')).default
  return invokeBackendController(Controller, 'getAll', req)
}

export async function POST(req: NextRequest) {
  const Controller = (await import('@backend/modules/section-subjects/sectionSubject.controller.js')).default
  return invokeBackendController(Controller, 'create', req)
}
