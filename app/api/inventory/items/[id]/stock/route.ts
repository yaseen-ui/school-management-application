import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/inventory/items/[id]/stock

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const inventoryController = await import('@backend/modules/inventory-management/inventory.controller.js')
  return invokeBackendController(inventoryController, 'adjustStock', req, params)
}
