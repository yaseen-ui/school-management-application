import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

// Thin adapter for /api/sections/[id]

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'sections:read');
  const SectionController = (await import('@backend/modules/sections/sections.controller.js')).default
  return invokeBackendController(SectionController, 'getSectionById', req, params) // if exists, else adjust
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'sections:edit');
  const SectionController = (await import('@backend/modules/sections/sections.controller.js')).default
  return invokeBackendController(SectionController, 'updateSection', req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'sections:delete');
  const SectionController = (await import('@backend/modules/sections/sections.controller.js')).default
  return invokeBackendController(SectionController, 'deleteSection', req, params)
}