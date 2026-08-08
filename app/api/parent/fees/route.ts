import { NextRequest, NextResponse } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"
import { Guard } from '@/lib/backend/rbac/guards.js'

// GET /api/parent/fees — get fee details for parent's children
export async function GET(req: NextRequest) {
  await Guard.action(req, 'parent-portal:access');
  try {
    const ParentsController = (await import("@backend/modules/parents/parents.controller.js")).default
    return invokeBackendController(ParentsController, "getMyChildrenFees", req)
  } catch (e) {
    return NextResponse.json({ status: "fail", message: String(e) }, { status: 500 })
  }
}