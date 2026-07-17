/**
 * RBAC v2 — Authorization API for Frontend
 *
 * GET /api/auth/permissions
 *
 * Returns the full authorization context for the authenticated user:
 *   - User profile (userId, email, fullName, tenantId, userType)
 *   - Assigned roles (id + name)
 *   - Group memberships
 *   - Effective permission codes (union of all role permissions)
 *   - Resource scopes (allowed section/student/subject/enrollment/transport IDs)
 *
 * This endpoint is called once on app mount (after login or page refresh).
 * The response is stored in a Zustand PermissionStore for all UI decisions.
 *
 * Only requires a valid JWT — every authenticated user needs their own permissions.
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { RoleResolver } from '@/lib/backend/rbac/role-resolver.js';
import { ScopeResolver } from '@/lib/backend/rbac/scope-resolver.js';
import { clearResolveCache } from '@/lib/backend/rbac/role-resolver.js';
import { clearScopeCache } from '@/lib/backend/rbac/scope-resolver.js';

interface DecodedJwt {
  userId: string;
  userType: 'company' | 'tenant';
  tenantId: string | null;
  roleIds?: string[];
  permVersion?: number;
  email?: string;
  iat?: number;
  exp?: number;
}

export async function GET(req: NextRequest) {
  // ── 1. Decode JWT ─────────────────────────────────────────────
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { status: 'fail', message: 'Authentication required. Please provide a valid token.' },
      { status: 401 },
    );
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return NextResponse.json(
      { status: 'fail', message: 'Authentication required. Please provide a valid token.' },
      { status: 401 },
    );
  }

  let decoded: DecodedJwt;
  try {
    const secret = process.env.JWT_SECRET || 'your_jwt_secret';
    decoded = jwt.verify(token, secret) as DecodedJwt;
  } catch {
    return NextResponse.json(
      { status: 'fail', message: 'Invalid or expired token. Please log in again.' },
      { status: 401 },
    );
  }

  if (!decoded.userId) {
    return NextResponse.json(
      { status: 'fail', message: 'Invalid token: missing user identity.' },
      { status: 401 },
    );
  }

  // ── 2. Build mock request object for resolvers ──────────────────
  const mockReq = {
    user: {
      userId: decoded.userId,
      userType: decoded.userType,
      tenantId: decoded.tenantId,
      roleIds: decoded.roleIds ?? [],
      permVersion: decoded.permVersion ?? 0,
      email: decoded.email ?? null,
    },
    headers: Object.fromEntries(req.headers),
    tenantId: decoded.tenantId,
  };

  // ── 3. Resolve authorization context ───────────────────────────
  let authContext: any = null;
  let scopes: any = null;

  try {
    authContext = await RoleResolver.getAuthContext(mockReq);

    // Only resolve scopes for tenant users (company users see everything)
    if (decoded.userType === 'tenant' && decoded.tenantId) {
      scopes = await ScopeResolver.getScopeContext(mockReq);
    } else {
      // Company users get null scopes (unrestricted)
      scopes = {
        sections: null,
        students: null,
        subjects: null,
        enrollments: null,
        transport: null,
      };
    }
  } catch (error) {
    console.error('[RBAC] Failed to resolve authorization context:', error);
    return NextResponse.json(
      { status: 'fail', message: 'Failed to resolve permissions. Please try again.' },
      { status: 500 },
    );
  }

  // ── 4. Clean up request-scoped caches ──────────────────────────
  clearResolveCache();
  clearScopeCache();

  // ── 5. Return full authorization context ───────────────────────
  return NextResponse.json(
    {
      status: 'success',
      data: {
        ...authContext,
        scopes,
      },
      message: 'Permissions loaded successfully.',
    },
    { status: 200 },
  );
}