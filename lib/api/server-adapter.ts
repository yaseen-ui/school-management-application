import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
// Thin adapter for Next.js App Router to invoke backend controllers/services
// (backend remains isolated in /backend; no business logic here)
// Mocks Express req/res for compatibility with existing controllers without changes.
//
// Also bridges the Express auth middleware semantics: decodes the Bearer JWT and
// populates req.user + req.tenantId so controllers that expect those (set by
// authenticate.js / authenticateTenant.js in the Express path) keep working.
//
// Company vs tenant (#13): company users never receive school tenant context and
// cannot call non-platform APIs (see company-boundary.js).

import {
  assertCompanyNotOnTenantApi,
  CompanyTenantForbiddenError,
  resolveTenantIdForUser,
} from '@/lib/backend/auth/company-boundary.js'

const prisma = new PrismaClient()

interface MockRes {
  statusCode: number
  data: any
  status(code: number): this
  json(body: any): void
}

interface DecodedJwt {
  userId: string
  userType: 'company' | 'tenant'
  tenantId: string | null
  roleIds?: string[]
  permVersion?: number
  iat?: number
  exp?: number
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const decodeBearerToken = (authHeader?: string): DecodedJwt | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  const token = authHeader.slice(7).trim()
  if (!token) return null
  try {
    const secret = process.env.JWT_SECRET || 'your_jwt_secret'
    return jwt.verify(token, secret) as DecodedJwt
  } catch {
    // Invalid/expired token — controllers will handle the missing req.user.
    return null
  }
}

/**
 * Resolve a tenant identifier (slug, name, or UUID) to the actual tenant UUID.
 * If the value is already a valid UUID, return it as-is.
 * Otherwise, look up the tenant by schoolName (case-insensitive).
 */
async function resolveTenantId(tenantHeader: string): Promise<string | null> {
  if (UUID_REGEX.test(tenantHeader)) {
    return tenantHeader
  }
  // Try to find tenant by schoolName (case-insensitive)
  const tenant = await prisma.tenant.findFirst({
    where: { schoolName: { equals: tenantHeader, mode: 'insensitive' } },
    select: { id: true },
  })
  if (tenant) return tenant.id
  // Fallback: return the first tenant (for single-tenant setups)
  // Note: company users never reach this with a header-selected school (#13).
  const firstTenant = await prisma.tenant.findFirst({ select: { id: true } })
  return firstTenant?.id ?? tenantHeader
}

const createMockReq = async (nextReq: NextRequest, params: any = {}, query: any = {}) => {
  const headers = Object.fromEntries(nextReq.headers)
  const user = decodeBearerToken(headers.authorization)

  // Company users: never take tenant from header (#13).
  // Tenant users: JWT tenantId wins over x-tenant-id (cannot hop schools via header).
  const headerTenantRaw = headers['x-tenant-id'] ?? null
  const logicalTenantKey = resolveTenantIdForUser(user, headerTenantRaw)

  // Resolve non-UUID tenant identifiers (e.g. school name) to actual UUID
  const tenantId = logicalTenantKey ? await resolveTenantId(logicalTenantKey) : null

  // Ensure req.user is never null — controllers destructure req.user.tenantId.
  // When no JWT is present, fall back to the x-tenant-id header value (public-ish
  // flows only; prefer authenticated requests).
  // Also map userId -> id for controllers that destructure { id } from req.user
  // (e.g. staff-attendance, leave, payroll).
  //
  // RBAC v2: JWT now carries roleIds[] + permVersion instead of old role object.
  const safeUser = user
    ? {
        ...user,
        id: user.userId,
        // Company: always null. Tenant: JWT-bound school only.
        tenantId: user.userType === 'company' ? null : tenantId,
        roleIds: user.roleIds ?? [],
        permVersion: user.permVersion ?? 0,
        role: (user as any).role ?? null,
      }
    : (tenantId
        ? {
            tenantId,
            userId: null,
            userType: 'tenant' as const,
            roleIds: [],
            permVersion: 0,
            role: null,
            id: null,
          }
        : null)

  // Block company users on non-platform APIs before controllers run.
  assertCompanyNotOnTenantApi(safeUser, nextReq.nextUrl?.pathname ?? nextReq.url)

  return {
    body: nextReq.method !== 'GET' && nextReq.method !== 'HEAD'
      ? await nextReq.json().catch(() => ({}))
      : {},
    params,
    query,
    headers,
    method: nextReq.method,
    url: nextReq.url,
    user: safeUser,
    // Company never carries school tenant context
    tenantId: user?.userType === 'company' ? null : tenantId,
  }
}

const createMockRes = (): [MockRes, Promise<any>] => {
  let resolve: (value: any) => void
  const promise = new Promise<any>((res) => { resolve = res })
  const mock: MockRes = {
    statusCode: 200,
    data: null,
    status(code: number) {
      this.statusCode = code
      return this
    },
    json(body: any) {
      this.data = body
      resolve({ status: this.statusCode, data: body })
    },
  }
  return [mock, promise]
}

// Helper to invoke controller method with mocks (business stays in /backend)
// Handles both static and class-instance methods.
// `routeParams` may be a plain object or a Promise (Next.js 15+ dynamic params).
export const invokeBackendController = async (
  controller: any,
  method: string,
  req: NextRequest,
  routeParams: Record<string, string> | Promise<Record<string, string>> = {}
) => {
  try {
    const resolvedParams = await routeParams
    const query = Object.fromEntries(req.nextUrl.searchParams)
    const mockReq = await createMockReq(req, resolvedParams, query)
    const [mockRes, responsePromise] = createMockRes()

    // Some controllers are classes (e.g. students/teachers); instantiate if needed
    const ctrl = typeof controller === 'function' && controller.prototype ? new controller() : controller
    await (ctrl[method] || controller[method])(mockReq, mockRes)
    const result = await responsePromise
    // The responseHandler already wraps data in { status, data, message } format.
    // Return the full response body so the frontend ApiResponse<T> contract is preserved.
    return NextResponse.json(result.data, { status: result.status })
  } catch (error) {
    const err = error as Error & { statusCode?: number; code?: string; name?: string }
    if (
      err instanceof CompanyTenantForbiddenError ||
      err?.name === 'CompanyTenantForbiddenError' ||
      err?.code === 'COMPANY_TENANT_FORBIDDEN'
    ) {
      return NextResponse.json(
        { status: 'fail', message: err.message, code: 'COMPANY_TENANT_FORBIDDEN' },
        { status: 403 }
      )
    }
    if (err?.statusCode === 403 || err?.statusCode === 401) {
      return NextResponse.json(
        { status: 'fail', message: err.message, code: err.code },
        { status: err.statusCode }
      )
    }
    return NextResponse.json({ status: 'fail', message: err.message }, { status: 500 })
  }
}
