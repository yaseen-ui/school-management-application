import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/gcs

export async function POST(req: NextRequest) {
  const GcsController = (await import('@backend/modules/gcs/gcs.controller.js'))
  return invokeBackendController(GcsController, 'uploadToGCS', req) // adjust
}