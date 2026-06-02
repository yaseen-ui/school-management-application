import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/gcs/update-cors

export async function PATCH(req: NextRequest) {
  const gcsController = await import('@backend/modules/gcs/gcs.controller.js')
  return invokeBackendController(gcsController, 'updateCors', req)
}
