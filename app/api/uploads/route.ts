import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/uploads (presigned etc)

export async function GET(req: NextRequest) {
  const UploadController = (await import('@backend/modules/uploads/uploads.controller.js'))
  return invokeBackendController(UploadController, 'getUploads', req) // adjust
}

export async function POST(req: NextRequest) {
  const UploadController = (await import('@backend/modules/uploads/uploads.controller.js'))
  return invokeBackendController(UploadController, 'upload', req)
}

export async function DELETE(req: NextRequest) {
  const UploadController = (await import('@backend/modules/uploads/uploads.controller.js'))
  return invokeBackendController(UploadController, 'deleteUpload', req)
}