import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

// Thin adapter for /api/gcs/view-metadata

export async function GET(req: NextRequest) {
  await Guard.action(req, 'dashboard:view');
  const gcsController = await import('@backend/modules/gcs/gcs.controller.js')
  return invokeBackendController(gcsController, 'viewBucketMetadata', req)
}
