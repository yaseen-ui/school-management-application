import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/users/[id]

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const UserController = (await import('@backend/modules/user/user.controller.js')).default
  return invokeBackendController(UserController, 'getUserById', req, params)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const UserController = (await import('@backend/modules/user/user.controller.js')).default
  return invokeBackendController(UserController, 'updateUser', req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const UserController = (await import('@backend/modules/user/user.controller.js')).default
  return invokeBackendController(UserController, 'deleteUser', req, params)
}