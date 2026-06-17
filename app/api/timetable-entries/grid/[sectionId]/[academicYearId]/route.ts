import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"

export async function GET(req: NextRequest, { params }: { params: Promise<{ sectionId: string; academicYearId: string }> }) {
  const Controller = (await import("@/lib/backend/modules/timetable-entries/timetableEntry.controller.js")).default
  return invokeBackendController(Controller, "getGridForSection", req, params)
}
