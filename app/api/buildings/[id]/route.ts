import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const BuildingsController = (await import('@backend/modules/buildings/buildings.controller.js')).default
  return invokeBackendController(BuildingsController, 'getBuildingById', req, params)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const BuildingsController = (await import('@backend/modules/buildings/buildings.controller.js')).default
  return invokeBackendController(BuildingsController, 'updateBuilding', req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const BuildingsController = (await import('@backend/modules/buildings/buildings.controller.js')).default
  return invokeBackendController(BuildingsController, 'deleteBuilding', req, params)
}
