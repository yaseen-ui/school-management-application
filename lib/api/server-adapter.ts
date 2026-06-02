import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
// Thin adapter for Next.js App Router to invoke backend controllers/services
// (backend remains isolated in /backend; no business logic here)
// Mocks Express req/res for compatibility with existing controllers without changes.
//
// Also bridges the Express auth middleware semantics: decodes the Bearer JWT and
// populates req.user + req.tenantId so controllers that expect those (set by
// authenticate.js / authenticateTenant.js in the Express path) keep working.

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
  role: unknown
  iat?: number
  exp?: number
}

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

const createMockReq = async (nextReq: NextRequest, params: any = {}, query: any = {}) => {
  const headers = Object.fromEntries(nextReq.headers)
  const user = decodeBearerToken(headers.authorization)
  // Tenant context preference: JWT (trustworthy) > x-tenant-id header (company users
  // who operate across tenants). Tenant users CANNOT escape their own tenant via the
  // header because the JWT value takes precedence.
  const tenantId = user?.tenantId ?? headers['x-tenant-id'] ?? null

  return {
    body: nextReq.method !== 'GET' ? await nextReq.json().catch(() => ({})) : {},
    params,
    query,
    headers,
    method: nextReq.method,
    url: nextReq.url,
    user,
    tenantId,
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
  const resolvedParams = await routeParams
  const query = Object.fromEntries(req.nextUrl.searchParams)
  const mockReq = await createMockReq(req, resolvedParams, query)
  const [mockRes, responsePromise] = createMockRes()

  try {
    // Some controllers are classes (e.g. students/teachers); instantiate if needed
    const ctrl = typeof controller === 'function' && controller.prototype ? new controller() : controller
    await (ctrl[method] || controller[method])(mockReq, mockRes)
    const result = await responsePromise
    return NextResponse.json(result.data, { status: result.status })
  } catch (error) {
    return NextResponse.json({ status: 'fail', message: (error as Error).message }, { status: 500 })
  }
}