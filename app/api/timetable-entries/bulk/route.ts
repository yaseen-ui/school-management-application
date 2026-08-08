import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function POST(req: NextRequest) {
  await Guard.action(req, 'timetable:write');
  const Controller = (await import("@/lib/backend/modules/timetable-entries/timetableEntry.controller.js")).default
  return invokeBackendController(Controller, "bulkCreate", req)
}
