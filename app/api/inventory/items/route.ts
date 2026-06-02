import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/inventory/items

export async function GET(req: NextRequest) {
  const inventoryController = await import('@backend/modules/inventory-management/inventory.controller.js')
  return invokeBackendController(inventoryController, 'getItems', req)
}

export async function POST(req: NextRequest) {
  const inventoryController = await import('@backend/modules/inventory-management/inventory.controller.js')
  return invokeBackendController(inventoryController, 'createItem', req)
}
