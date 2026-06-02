import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/uploads/[tenantId]/[category]/[entityId]
// Uploads controller uses named ES exports (no default), so we pass the module itself.

export async function GET(req: NextRequest, { params }: { params: Promise<{ tenantId: string; category: string; entityId: string }> }) {
  const uploadController = await import('@backend/modules/uploads/uploads.controller.js')
  return invokeBackendController(uploadController, 'getFiles', req, params)
}
