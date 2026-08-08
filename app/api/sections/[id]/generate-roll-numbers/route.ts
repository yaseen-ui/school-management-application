import { NextRequest } from "next/server";
import { invokeBackendController } from "@/lib/api/server-adapter";
import { Guard } from '@/lib/backend/rbac/guards.js'

// POST /api/sections/[id]/generate-roll-numbers
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await Guard.action(req, 'sections:write');
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