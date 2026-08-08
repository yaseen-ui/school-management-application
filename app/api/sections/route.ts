import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

// Thin adapter for /api/sections

export async function GET(req: NextRequest) {
  await Guard.action(req, 'sections:read');
  const SectionController = (await import('@backend/modules/sections/sections.controller.js')).default
  return invokeBackendController(SectionController, 'getSections', req)
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'sections:write');
  const SectionController = (await import('@backend/modules/sections/sections.controller.js')).default
  return invokeBackendController(SectionController, 'createSection', req)
}