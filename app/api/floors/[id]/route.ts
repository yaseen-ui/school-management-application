import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'infrastructure:read');
  const FloorsController = (await import('@backend/modules/floors/floors.controller.js')).default
  return invokeBackendController(FloorsController, 'getFloorById', req, params)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'infrastructure:edit');
  const FloorsController = (await import('@backend/modules/floors/floors.controller.js')).default
  return invokeBackendController(FloorsController, 'updateFloor', req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'infrastructure:delete');
  const FloorsController = (await import('@backend/modules/floors/floors.controller.js')).default
  return invokeBackendController(FloorsController, 'deleteFloor', req, params)
}
