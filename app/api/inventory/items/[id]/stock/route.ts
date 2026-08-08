import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

// Thin adapter for /api/inventory/items/[id]/stock

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await Guard.action(req, 'store:write');
  const inventoryController = await import('@backend/modules/inventory-management/inventory.controller.js')
  return invokeBackendController(inventoryController, 'adjustStock', req, params)
}
