import { NextRequest, NextResponse } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"

// GET /api/parent/leave — get leave requests for parent's children
export async function GET(req: NextRequest) {
  try {
    const ParentsController = (await import("@backend/modules/parents/parents.controller.js")).default
    return invokeBackendController(ParentsController, "getMyChildrenLeave", req)
  } catch (e) {
    return NextResponse.json({ status: "fail", message: String(e) }, { status: 500 })
  }
}

// POST /api/parent/leave — submit a leave request for a child
export async function POST(req: NextRequest) {
  try {
    const ParentsController = (await import("@backend/modules/parents/parents.controller.js")).default
    return invokeBackendController(ParentsController, "submitLeaveForChild", req)
  } catch (e) {
    return NextResponse.json({ status: "fail", message: String(e) }, { status: 500 })
  }
}