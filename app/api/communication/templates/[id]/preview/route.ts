import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const TemplateController = (await import('@backend/modules/communication/template.controller.js')).default
  return invokeBackendController(TemplateController, 'preview', req, params)
}
