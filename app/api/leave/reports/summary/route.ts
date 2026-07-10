import { NextRequest } from "next/server";
import import { NextRequest } from "next/server";
import { invokeBackendController } from "@/lib/api/server-adapter";
import LeaveController from "@/lib/backend/modules/leave/leeximport { invokeBackendController } from "leimport LeaveController from "@/lib/backend/modules/leave/leave.conba
export async function POST(req: NextRequest, { params }: { params: Promisser  return invokeBackendController(LeaveController, "cancelRequest", req, params);
}
