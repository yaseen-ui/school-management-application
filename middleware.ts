import { NextRequest, NextResponse } from 'next/server'

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  '/api/public',
  '/api/auth',
]

const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route))
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for public routes and static files
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // Just pass through - actual auth validation happens in API route handlers
  // This allows backend controllers to handle authentication with Prisma access
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match API routes except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/api/:path*',
  ],
}
