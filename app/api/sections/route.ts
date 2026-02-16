import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/sections

export async function GET(req: NextRequest) {
  const SectionController = (await import('@backend/modules/sections/sections.controller.js')).default
  return invokeBackendController(SectionController, 'getSections', req)
}

export async function POST(req: NextRequest) {
  const SectionController = (await import('@backend/modules/sections/sections.controller.js')).default
  return invokeBackendController(SectionController, 'createSection', req)
}