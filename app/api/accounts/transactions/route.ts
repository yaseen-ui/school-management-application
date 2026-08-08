import { NextRequest } from "next/server"
import { invokeBackendController } from "@/lib/api/server-adapter"
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest) {
  await Guard.action(req, 'transactions:read');
  const Controller = (await import("@/lib/backend/modules/accounts/accounts.controller.js")).default
  return invokeBackendController(Controller, "getAllTransactions", req)
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'transactions:write');
  const Controller = (await import("@/lib/backend/modules/accounts/accounts.controller.js")).default
  return invokeBackendController(Controller, "createTransaction", req)
}
