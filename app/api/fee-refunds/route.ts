import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest) {
  await Guard.action(req, 'fee-refunds:read');
  const FeeController = (await import('@backend/modules/fees/fee.controller.js')).default
  return invokeBackendController(FeeController, 'getAllFeeRefunds', req)
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'fee-refunds:process');
  const FeeController = (await import('@backend/modules/fees/fee.controller.js')).default
  return invokeBackendController(FeeController, 'createFeeRefund', req)
}