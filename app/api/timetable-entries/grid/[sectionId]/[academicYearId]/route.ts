import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest, { params }: { params: Promise<{ sectionId: string; academicYearId: string }> }) {
  await Guard.action(req, 'timetable:read');
  const Controller = (await import("@/lib/backend/modules/timetable-entries/timetableEntry.controller.js")).default
  return invokeBackendController(Controller, "getGridForSection", req, params)
}
