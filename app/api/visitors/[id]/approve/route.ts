import { NextRequest } from "next/server";
import { invokeBackendController } from "@/lib/api/server-adapter";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ctrl = (await import("@backend/modules/visitors/visitors.controller.js")).default;
  return invokeBackendController(ctrl, "approve", req, params);
}