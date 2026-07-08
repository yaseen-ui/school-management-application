import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// GET  /api/parents — list all parents (admin)
export async function GET(req: NextRequest) {
  try {
    const ParentsController = (await import('@backend/modules/parents/parents.controller.js')).default
    return invokeBackendController(ParentsController, 'getAllParents', req)
  } catch (e) {
    return NextResponse.json({ status: 'fail', message: String(e) }, { status: 500 })
  }
}