import { NextRequest } from "next/server";
import { invokeBackendController } from "@/lib/api/server-adapter";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ctrl = (await import("@backend/modules/id-sequence/id-sequence.controller.js")).default;
  return invokeBackendController(ctrl, "getPatternById", req);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ctrl = (await import("@backend/modules/id-sequence/id-sequence.controller.js")).default;
  return invokeBackendController(ctrl, "updatePattern", req);
}