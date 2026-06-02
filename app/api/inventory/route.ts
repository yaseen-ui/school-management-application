import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/inventory
// Inventory controller uses named ES exports (no default), so we pass the module itself.

export async function GET(req: NextRequest) {
  const inventoryController = await import('@backend/modules/inventory-management/inventory.controller.js')
  return invokeBackendController(inventoryController, 'getItems', req)
}

export async function POST(req: NextRequest) {
  const inventoryController = await import('@backend/modules/inventory-management/inventory.controller.js')
  return invokeBackendController(inventoryController, 'createItem', req)
}
