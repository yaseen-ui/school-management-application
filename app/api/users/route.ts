import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/users (collection + company)

export async function GET(req: NextRequest) {
  const UserController = (await import('@backend/modules/user/user.controller.js')).default
  // company query handled in controller
  return invokeBackendController(UserController, 'getAllUsers', req)
}

export async function POST(req: NextRequest) {
  const UserController = (await import('@backend/modules/user/user.controller.js')).default
  const body = await req.json().catch(() => ({}))
  const method = body.company ? 'createCompanyUser' : 'createUser'
  return invokeBackendController(UserController, method, req)
}