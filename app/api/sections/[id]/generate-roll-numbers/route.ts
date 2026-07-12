import { NextRequest } from "next/server";
import { invokeBackendController } from "@/lib/api/server-adapter";

// POST /api/sections/[id]/generate-roll-numbers
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const SectionController = (
    await import("@backend/modules/sections/sections.controller.js")
  ).default;
  return invokeBackendController(
    SectionController,
    "generateRollNumbers",
    req,
    params
  );
}