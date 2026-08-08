import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

// Thin adapter for /api/inventory/categories
// Inventory controller uses named ES exports (no default), so we pass the module itself.

export async function GET(req: NextRequest) {
  await Guard.action(req, 'store:read');
  const inventoryController = await import('@backend/modules/inventory-management/inventory.controller.js')
  return invokeBackendController(inventoryController, 'getCategories', req)
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'store:write');
  const inventoryController = await import('@backend/modules/inventory-management/inventory.controller.js')
  return invokeBackendController(inventoryController, 'createCategory', req)
}
