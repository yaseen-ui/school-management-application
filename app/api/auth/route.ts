import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/auth
// Invokes backend auth/user controllers via alias

export async function POST(req: NextRequest) {
  // Dispatch based on body or path logic if needed (e.g. login vs forget); here simple for common
  const body = await req.json().catch(() => ({}))
  const TenantController = (await import('@backend/modules/tenants/tenant.controller.js')).default // for domain if
  const AuthController = (await import('@backend/modules/auth/auth.controller.js')).default
  const UserController = (await import('@backend/modules/user/user.controller.js')).default
  if (body.domain) {
    return invokeBackendController(TenantController, 'getTenantByDomain', req)
  } else if (body.email && body.password) {
    return invokeBackendController(AuthController, 'login', req)
  } else if (body.email && !body.otp) {
    return invokeBackendController(UserController, 'forgetPassword', req)
  } else if (body.otp) {
    return invokeBackendController(UserController, 'resetPasswordWithOTP', req)
  }
  return NextResponse.json({ status: 'fail', message: 'Invalid auth request' }, { status: 400 })
}