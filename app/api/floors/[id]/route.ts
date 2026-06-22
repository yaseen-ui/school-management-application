import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const FloorsController = (await import('@backend/modules/floors/floors.controller.js')).default
  return invokeBackendController(FloorsController, 'getFloorById', req, params)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const FloorsController = (await import('@backend/modules/floors/floors.controller.js')).default
  return invokeBackendController(FloorsController, 'updateFloor', req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const FloorsController = (await import('@backend/modules/floors/floors.controller.js')).default
  return invokeBackendController(FloorsController, 'deleteFloor', req, params)
}
