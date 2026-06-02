import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/gcs
// GCS controller uses named ES exports (no default), so we pass the module itself.

export async function POST(req: NextRequest) {
  const gcsController = await import('@backend/modules/gcs/gcs.controller.js')
  return invokeBackendController(gcsController, 'updateCors', req)
}
