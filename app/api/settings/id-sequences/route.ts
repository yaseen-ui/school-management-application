import { NextRequest } from "next/server";
import { invokeBackendController } from "@/lib/api/server-adapter";

export async function GET(req: NextRequest) {
  const ctrl = (await import("@backend/modules/id-sequence/id-sequence.controller.js")).default;
  return invokeBackendController(ctrl, "getAllPatterns", req);
}

export async function POST(req: NextRequest) {
  const ctrl = (await import("@backend/modules/id-sequence/id-sequence.controller.js")).default;
  return invokeBackendController(ctrl, "upsertPattern", req);
}