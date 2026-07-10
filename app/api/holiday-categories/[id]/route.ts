import { NextRequest } from "next/server";
import { invokeBackendController } from "@/lib/api/server-adapter";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ctrl = (await import("@backend/modules/holidays/holidays.controller.js")).default;
  return invokeBackendController(ctrl, "getCategoryById", req, params);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ctrl = (await import("@backend/modules/holidays/holidays.controller.js")).default;
  return invokeBackendController(ctrl, "updateCategory", req, params);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ctrl = (await import("@backend/modules/holidays/holidays.controller.js")).default;
  return invokeBackendController(ctrl, "deleteCategory", req, params);
}