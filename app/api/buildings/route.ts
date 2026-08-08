import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest) {
  await Guard.action(req, 'infrastructure:read');
  const BuildingsController = (await import('@backend/modules/buildings/buildings.controller.js')).default
  return invokeBackendController(BuildingsController, 'getBuildings', req)
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'infrastructure:write');
  const BuildingsController = (await import('@backend/modules/buildings/buildings.controller.js')).default
  return invokeBackendController(BuildingsController, 'createBuilding', req)
}
