/**
 * Company vs tenant boundary (issue #13).
 *
 * Product rule:
 *   - Company users = platform only (tenants, company users, auth, etc.)
 *   - Company users must NEVER receive a school tenant context
 *   - Company users must NEVER call tenant school APIs
 *
 * Tenant isolation for school staff/parents is separate (JWT tenantId + RBAC).
 */

/** API path prefixes company users may call (Next.js App Router). */
const PLATFORM_API_PREFIXES = [
  '/api/auth',
  '/api/public',
  '/api/webhooks',
  '/api/tenants',
  '/api/users/company',
  // Company-level file ops (no school data)
  '/api/gcs',
  '/api/uploads',
];

class CompanyTenantForbiddenError extends Error {
  /**
   * @param {string} [message]
   */
  constructor(message = 'Company users cannot access tenant school APIs. Use the platform (tenants / company users) only.') {
    super(message);
    this.name = 'CompanyTenantForbiddenError';
    this.statusCode = 403;
    this.code = 'COMPANY_TENANT_FORBIDDEN';
  }
}

/**
 * @param {string | null | undefined} pathname
 * @returns {boolean}
 */
function isPlatformApiPath(pathname) {
  if (!pathname) return false;
  const path = String(pathname).split('?')[0];
  // Ensure we compare against /api/... even if a full URL sneaks in
  let normalized = path;
  try {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      normalized = new URL(path).pathname;
    }
  } catch {
    // keep as-is
  }
  return PLATFORM_API_PREFIXES.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`)
  );
}

/**
 * @param {{ userType?: string } | null | undefined} user
 * @returns {boolean}
 */
function isCompanyUser(user) {
  return user?.userType === 'company';
}

/**
 * Extract pathname from NextRequest / Express-like req.
 * @param {any} req
 * @returns {string | null}
 */
function getRequestPathname(req) {
  if (!req) return null;
  if (typeof req.nextUrl?.pathname === 'string') return req.nextUrl.pathname;
  if (typeof req.url === 'string') {
    try {
      if (req.url.startsWith('http://') || req.url.startsWith('https://')) {
        return new URL(req.url).pathname;
      }
      // relative path
      return req.url.split('?')[0] || null;
    } catch {
      return req.url.split('?')[0] || null;
    }
  }
  return null;
}

/**
 * Throw if a company user hits a non-platform API.
 * @param {{ userType?: string } | null | undefined} user
 * @param {string | null | undefined} pathname
 */
function assertCompanyNotOnTenantApi(user, pathname) {
  if (!isCompanyUser(user)) return;
  if (isPlatformApiPath(pathname)) return;
  throw new CompanyTenantForbiddenError();
}

/**
 * Resolve tenant id for the request given authenticated user + optional header.
 * Company users always get null (header ignored).
 *
 * Tenant users: JWT tenantId wins over header (cannot switch school via header).
 *
 * @param {{ userType?: string, tenantId?: string | null } | null | undefined} user
 * @param {string | null | undefined} headerTenantId
 * @returns {string | null}
 */
function resolveTenantIdForUser(user, headerTenantId) {
  if (isCompanyUser(user)) {
    return null;
  }
  if (user?.tenantId) {
    return user.tenantId;
  }
  return headerTenantId ?? null;
}

export {
  PLATFORM_API_PREFIXES,
  CompanyTenantForbiddenError,
  isPlatformApiPath,
  isCompanyUser,
  getRequestPathname,
  assertCompanyNotOnTenantApi,
  resolveTenantIdForUser,
};
