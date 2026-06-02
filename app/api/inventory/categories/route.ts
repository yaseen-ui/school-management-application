import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/inventory/categories
// Inventory controller uses named ES exports (no default), so we pass the module itself.

export async function GET(req: NextRequest) {
  const inventoryController = await import('@backend/modules/inventory-management/inventory.controller.js')
  return invokeBackendController(inventoryController, 'getCategories', req)
}

export async function POST(req: NextRequest) {
  const inventoryController = await import('@backend/modules/inventory-management/inventory.controller.js')
  return invokeBackendController(inventoryController, 'createCategory', req)
}
