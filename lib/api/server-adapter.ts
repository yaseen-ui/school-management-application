import { NextRequest, NextResponse } from 'next/server'
// Thin adapter for Next.js App Router to invoke backend controllers/services
// (backend remains isolated in /backend; no business logic here)
// Mocks Express req/res for compatibility with existing controllers without changes

interface MockRes {
  statusCode: number
  data: any
  status(code: number): this
  json(body: any): void
}

const createMockReq = async (nextReq: NextRequest, params: any = {}, query: any = {}) => {
  return {
    // Mock for backend controllers (req.body, req.params etc from NextRequest)
    body: nextReq.method !== 'GET' ? await nextReq.json().catch(() => ({})) : {},
    params,
    query,
    headers: Object.fromEntries(nextReq.headers),
    method: nextReq.method,
    url: nextReq.url,
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
// Handles both static and class-instance methods
export const invokeBackendController = async (
  controller: any,
  method: string,
  req: NextRequest,
  routeParams: Record<string, string> = {}
) => {
  const query = Object.fromEntries(req.nextUrl.searchParams)
  const mockReq = await createMockReq(req, routeParams, query)
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