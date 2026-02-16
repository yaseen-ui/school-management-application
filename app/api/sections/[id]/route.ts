import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/sections/[id]

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const SectionController = (await import('@backend/modules/sections/sections.controller.js')).default
  return invokeBackendController(SectionController, 'getSectionById', req, params) // if exists, else adjust
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const SectionController = (await import('@backend/modules/sections/sections.controller.js')).default
  return invokeBackendController(SectionController, 'updateSection', req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const SectionController = (await import('@backend/modules/sections/sections.controller.js')).default
  return invokeBackendController(SectionController, 'deleteSection', req, params)
}