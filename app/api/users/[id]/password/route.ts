import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/users/[id]/password

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const UserController = (await import('@backend/modules/user/user.controller.js')).default
  return invokeBackendController(UserController, 'updatePassword', req, params)
}