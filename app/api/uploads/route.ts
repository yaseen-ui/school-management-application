import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/uploads
// Uploads controller uses named ES exports (no default), so we pass the module itself.

export async function POST(req: NextRequest) {
  const uploadController = await import('@backend/modules/uploads/uploads.controller.js')
  return invokeBackendController(uploadController, 'storeFileMetadata', req)
}
