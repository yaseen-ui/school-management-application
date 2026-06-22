import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

export async function GET(req: NextRequest) {
  const FloorsController = (await import('@backend/modules/floors/floors.controller.js')).default
  return invokeBackendController(FloorsController, 'getFloors', req)
}

export async function POST(req: NextRequest) {
  const FloorsController = (await import('@backend/modules/floors/floors.controller.js')).default
  return invokeBackendController(FloorsController, 'createFloor', req)
}
