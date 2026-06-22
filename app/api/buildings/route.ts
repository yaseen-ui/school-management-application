import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

export async function GET(req: NextRequest) {
  const BuildingsController = (await import('@backend/modules/buildings/buildings.controller.js')).default
  return invokeBackendController(BuildingsController, 'getBuildings', req)
}

export async function POST(req: NextRequest) {
  const BuildingsController = (await import('@backend/modules/buildings/buildings.controller.js')).default
  return invokeBackendController(BuildingsController, 'createBuilding', req)
}
