import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest) {
  await Guard.action(req, 'attendance:read');
  const Controller = (await import("@/lib/backend/modules/attendance/attendance.controller.js")).default
  return invokeBackendController(Controller, 'getAllAttendanceSessions', req)
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'attendance:mark');
  const Controller = (await import("@/lib/backend/modules/attendance/attendance.controller.js")).default
  return invokeBackendController(Controller, 'createAttendanceSession', req)
}