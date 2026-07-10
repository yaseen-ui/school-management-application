import { NextRequest } from "next/server";
import { invokeBacimport { NextRequest } from "next/server";
import { invokeBackendCoolimport { invokeBackendController } from "veimport LeaveController from "@/lib/backend/modules/leave/leave.conms
export async function POST(req: NextRequest, { params }: { params: Promisr(L  return invokeBackendController(LeaveController, "withdrawRequest", req, params);
}
ENDOFFILE]/}
