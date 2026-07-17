import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest) {
  await Guard.action(req, 'users:read');
  const UserController = (await import('@backend/modules/user/user.controller.js')).default
  return invokeBackendController(UserController, 'getAllUsers', req)
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'users:write');
  const UserController = (await import('@backend/modules/user/user.controller.js')).default
  return invokeBackendController(UserController, 'createUser', req)
}