import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/inventory

export async function GET(req: NextRequest) {
  const InventoryController = (await import('@backend/modules/inventory-management/inventory.controller.js'))
  return invokeBackendController(InventoryController, 'getAllInventory', req) // adjust method if needed
}

export async function POST(req: NextRequest) {
  const InventoryController = (await import('@backend/modules/inventory-management/inventory.controller.js'))
  return invokeBackendController(InventoryController, 'createInventory', req)
}