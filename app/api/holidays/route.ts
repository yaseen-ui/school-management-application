import { NextRequest } from "next/server";
import { invokeBackendController } from "@/lib/api/server-adapter";
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest) {
  await Guard.action(req, 'holidays:read');
  const ctrl = (await import("@backend/modules/holidays/holidays.controller.js")).default;
  return invokeBackendController(ctrl, "getAllHolidays", req);
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'holidays:write');
  const ctrl = (await import("@backend/modules/holidays/holidays.controller.js")).default;
  return invokeBackendController(ctrl, "createHoliday", req);
}