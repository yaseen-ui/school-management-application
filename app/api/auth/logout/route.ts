import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

export async function POST(req: NextRequest) {
  const AuthController = (await import('@backend/modules/auth/auth.controller.js')).default
  return invokeBackendController(AuthController, 'logout', req)
}
