import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/auth/forget-password

export async function POST(req: NextRequest) {
  const UserController = (await import('@backend/modules/user/user.controller.js')).default
  return invokeBackendController(UserController, 'forgetPassword', req)
}
