import { NextRequest, NextResponse } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"
import { Guard } from "@/lib/backend/rbac/guards.js"

/**
 * GET /api/student-dashboard/[enrollmentId]?examScheduleId=
 * Parent (own child) or staff with students:read.
 * Company users blocked by server-adapter company-boundary.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ enrollmentId: string }> }
) {
  try {
    // Edge: parent-portal:access OR students:read
    // Fine-grained parent link / staff check is in the service.
    try {
      await Guard.action(req, "parent-portal:access")
    } catch {
      await Guard.action(req, "students:read")
    }

    const StudentDashboardController = (
      await import(
        "@/lib/backend/modules/student-dashboard/student-dashboard.controller.js"
      )
    ).default

    return invokeBackendController(
      StudentDashboardController,
      "getDashboard",
      req,
      params
    )
  } catch (error: any) {
    if (
      error?.name === "CompanyTenantForbiddenError" ||
      error?.code === "COMPANY_TENANT_FORBIDDEN"
    ) {
      return NextResponse.json(
        { status: "fail", message: error.message, code: error.code },
        { status: 403 }
      )
    }
    if (
      error?.statusCode === 403 ||
      error?.statusCode === 401 ||
      error?.name === "ForbiddenError"
    ) {
      return NextResponse.json(
        { status: "fail", message: error.message, code: error.code },
        { status: error.statusCode || 403 }
      )
    }
    return NextResponse.json(
      { status: "fail", message: error?.message || "Failed to load dashboard" },
      { status: 500 }
    )
  }
}
