import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'infrastructure:read');
  const BuildingsController = (await import('@backend/modules/buildings/buildings.controller.js')).default
  return invokeBackendController(BuildingsController, 'getBuildingById', req, params)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'infrastructure:edit');
  const BuildingsController = (await import('@backend/modules/buildings/buildings.controller.js')).default
  return invokeBackendController(BuildingsController, 'updateBuilding', req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'infrastructure:delete');
  const BuildingsController = (await import('@backend/modules/buildings/buildings.controller.js')).default
  return invokeBackendController(BuildingsController, 'deleteBuilding', req, params)
}
