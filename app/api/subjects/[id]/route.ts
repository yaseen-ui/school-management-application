import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

// Thin adapter for /api/subjects/[id]

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'subjects:read');
  const SubjectController = (await import('@backend/modules/subjects/subjects.controller.js')).default
  return invokeBackendController(SubjectController, 'getSubjectById', req, params)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'subjects:edit');
  const SubjectController = (await import('@backend/modules/subjects/subjects.controller.js')).default
  return invokeBackendController(SubjectController, 'updateSubject', req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'subjects:delete');
  const SubjectController = (await import('@backend/modules/subjects/subjects.controller.js')).default
  return invokeBackendController(SubjectController, 'deleteSubject', req, params)
}