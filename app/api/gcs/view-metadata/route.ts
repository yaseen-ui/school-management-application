import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/gcs/view-metadata

export async function GET(req: NextRequest) {
  const gcsController = await import('@backend/modules/gcs/gcs.controller.js')
  return invokeBackendController(gcsController, 'viewBucketMetadata', req)
}
