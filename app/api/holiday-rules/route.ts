import { NextRequest } from "next/server";
import { invokeBackendController } from "@/lib/api/server-adapter";

export async function GET(req: NextRequest) {
  const ctrl = (await import("@backend/modules/holidays/holidays.controller.js")).default;
  return invokeBackendController(ctrl, "getAllRules", req);
}

export async function POST(req: NextRequest) {
  const ctrl = (await import("@backend/modules/holidays/holidays.controller.js")).default;
  return invokeBackendController(ctrl, "createRule", req);
}