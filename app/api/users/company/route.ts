import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Handler for /api/users/company

export async function POST(req: NextRequest) {
  const UserController = (await import('@backend/modules/user/user.controller.js')).default
  return invokeBackendController(UserController, 'createCompanyUser', req)
}

export async function GET(req: NextRequest) {
  const UserController = (await import('@backend/modules/user/user.controller.js')).default
  return invokeBackendController(UserController, 'getAllCompanyUsers', req)
}
