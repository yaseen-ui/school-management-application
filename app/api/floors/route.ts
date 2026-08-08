import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest) {
  await Guard.action(req, 'infrastructure:read');
  const FloorsController = (await import('@backend/modules/floors/floors.controller.js')).default
  return invokeBackendController(FloorsController, 'getFloors', req)
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'infrastructure:write');
  const FloorsController = (await import('@backend/modules/floors/floors.controller.js')).default
  return invokeBackendController(FloorsController, 'createFloor', req)
}
