/**
 * RBAC v2 — Guard Functions
 *
 * Provides simple, explicit guard functions that controllers call as their first lines.
 * Two guard types:
 *   1. Action guards — check if the user has a permission code
 *   2. Resource guards — check if the user can access a specific resource
 *
 * Guards throw ForbiddenError on denial, which controllers can catch or let propagate.
 * Every 403 denial is audited.
 *
 * Usage:
 *   import { Guard } from '@/lib/backend/rbac/guards.js';
 *   await Guard.action(req, 'students:delete');
 *   await Guard.resource(req, 'student', req.params.id);
 */

import jwt from 'jsonwebtoken';
import { hasPermission, resolveEffectivePermissions } from './engine.js';

/**
 * Decode JWT from a NextRequest-like object (raw or with user already populated).
 * Handles both:
 *   - NextRequest (headers.get('authorization'))
 *   - Express-like req (headers.authorization)
 */
function extractUser(req) {
  if (req?.user) return req.user;

  // Try to extract JWT from raw NextRequest
  const authHeader =
    typeof req?.headers?.get === 'function'
      ? req.headers.get('authorization')
      : req?.headers?.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7).trim();
  if (!token) return null;

  try {
    const secret = process.env.JWT_SECRET || 'your_jwt_secret';
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────
// ForbiddenError
// ─────────────────────────────────────────────────────────────────────

/**
 * Standard error for authorization failures.
 * Controllers can catch this or let it propagate to the error handler.
 */
class ForbiddenError extends Error {
  /**
   * @param {string} message - Human-readable message
   * @param {string} code - Machine-readable error code
   * @param {Object} [details] - Additional context for logging
   */
  constructor(message, code = 'FORBIDDEN', details = {}) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
    this.code = code;
    this.details = details;
  }
}

// ─────────────────────────────────────────────────────────────────────
// Audit helper (lightweight — full audit module is Phase 9)
// ─────────────────────────────────────────────────────────────────────

/**
 * Log an access denial. Uses the full AuditLogger when available (Phase 9),
 * falls back to console.warn for now.
 *
 * @param {Object} req - Request object
 * @param {Object} context - Denial context
 */
async function auditAccessDenied(req, context) {
  try {
    // Try to use the full audit logger if it exists (Phase 9)
    const { AuditLogger } = await import('./audit.js');
    await AuditLogger.logAccessDenied(req, context);
  } catch {
    // Phase 9 not yet implemented — fall back to warning log
    const actor = req?.user?.userId ?? 'unknown';
    console.warn(
      `[RBAC] Access denied | actor=${actor} | permission=${context.permissionCode} | resource=${context.resourceType ?? 'none'}/${context.resourceId ?? 'none'} | reason=${context.reason}`
    );
  }
}

// ─────────────────────────────────────────────────────────────────────
// Guard class
// ─────────────────────────────────────────────────────────────────────

class Guard {
  /**
   * Action-level guard: checks if the authenticated user has a specific
   * permission code. Throws ForbiddenError if not.
   *
   * Just returns silently on success — call it and forget it.
   *
   * @param {Object} req - Request object with req.user populated
   * @param {string} permissionCode - e.g., "students:delete", "attendance:mark"
   * @throws {ForbiddenError} If the user lacks the permission
   *
   * @example
   *   await Guard.action(req, 'students:read');
   *   // If we reach here, the user has permission. Continue...
   */
  static async action(req, permissionCode) {
    // Decode JWT from raw NextRequest if req.user isn't populated yet
    const user = extractUser(req);
    if (user) {
      // Attach resolved user back to req for downstream handlers
      req.user = user;
    }

    // No user at all
    if (!user) {
      await auditAccessDenied(req, {
        permissionCode,
        reason: 'unauthenticated',
      });
      throw new ForbiddenError(
        'Authentication is required to perform this action.',
        'UNAUTHENTICATED',
      );
    }

    // Company users bypass all permission checks
    if (user.userType === 'company' && !user.tenantId) {
      return;
    }

    // Resolve effective permissions for this request
    const effectivePermissions = await resolveEffectivePermissions(user);

    if (!hasPermission(effectivePermissions, permissionCode)) {
      await auditAccessDenied(req, {
        permissionCode,
        reason: 'insufficient_permissions',
      });
      throw new ForbiddenError(
        `Permission '${permissionCode}' is required to perform this action.`,
        'INSUFFICIENT_PERMISSIONS',
        { permissionCode },
      );
    }

    // Permission granted — silently return
  }

  /**
   * Resource-level guard: checks if the authenticated user can access a
   * specific resource. Combines action-level permission check with
   * resource-level scope verification.
   *
   * Throws ForbiddenError if the user cannot access the resource.
   *
   * @param {Object} req - Request object with req.user populated
   * @param {string} permissionCode - Required permission, e.g., "students:read:section"
   * @param {string} resourceType - Type of resource: "section", "student", "subject", "enrollment", "transport"
   * @param {string} [resourceId] - UUID of the specific resource (optional if no specific resource is being targeted)
   * @param {Object} [options] - Additional options
   * @param {boolean} [options.allowOwnChild] - If true, allows access to own linked children (parent scope)
   * @throws {ForbiddenError} If access is denied
   *
   * @example
   *   // Check if user can read attendance for a specific section
   *   await Guard.resource(req, 'attendance:read:section', 'section', params.sectionId);
   *
   *   // Check if parent can view own child's results
   *   await Guard.resource(req, 'results:read:own', 'student', params.studentId, { allowOwnChild: true });
   */
  static async resource(req, permissionCode, resourceType, resourceId, options = {}) {
    // First, check the action-level permission
    await Guard.action(req, permissionCode);

    // If no specific resource is being targeted, the action check is sufficient
    if (!resourceType || !resourceId) {
      return;
    }

    const user = req?.user;

    // Company users bypass all resource checks
    if (user.userType === 'company' && !user.tenantId) {
      return;
    }

    // --- Scope-based resource access ---
    // Delegate to the scope resolver (Phase 5) when available.
    // Until then, we implement basic access patterns.

    let allowed = false;

    // Own-child check for parent scopes
    if (options.allowOwnChild && resourceType === 'student') {
      allowed = await checkOwnChildAccess(user, resourceId);
    }

    // Phase 5: Full scope resolution via ScopeResolver
    if (!allowed) {
      try {
        const { ScopeResolver } = await import('./scope-resolver.js');
        allowed = await ScopeResolver.canAccessResource(req, resourceType, resourceId);
      } catch {
        // ScopeResolver not available — fall through to basic check
      }
    }

    if (!allowed) {
      await auditAccessDenied(req, {
        permissionCode,
        resourceType,
        resourceId,
        reason: options.allowOwnChild ? 'not_own_child' : 'resource_access_denied',
      });
      throw new ForbiddenError(
        `You do not have access to this ${resourceType}.`,
        'RESOURCE_ACCESS_DENIED',
        { permissionCode, resourceType, resourceId },
      );
    }
  }
}

// ─────────────────────────────────────────────────────────────────────
// Own-child access check (Parent scope)
// ─────────────────────────────────────────────────────────────────────

/**
 * Verify that a student is linked to the requesting user as a parent.
 * Used for "own" scoped permissions.
 *
 * @param {Object} user - Decoded JWT user
 * @param {string} studentId - Student UUID to check
 * @returns {Promise<boolean>}
 */
async function checkOwnChildAccess(user, studentId) {
  try {
    const { prisma } = await import('../lib/prisma.js');

    // Find the parent record linked to this user
    const parent = await prisma.parent.findUnique({
      where: { userId: user.userId },
      select: { id: true },
    });

    if (!parent) return false;

    // Check if this student is linked to the parent
    const link = await prisma.studentParent.findFirst({
      where: {
        parentId: parent.id,
        studentId,
        tenantId: user.tenantId,
      },
      select: { id: true },
    });

    return !!link;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────
// Route Handler Wrappers (convenience utilities)
// ─────────────────────────────────────────────────────────────────────

/**
 * Wraps an API route handler with authentication + permission checks.
 * Combines auth middleware behavior with action guard in one line.
 *
 * These are optional convenience wrappers. The core `Guard.action()` and
 * `Guard.resource()` are the primary API.
 *
 * @example
 *   export const GET = withAction('students:read', async (req) => {
 *     // This only runs if the user has 'students:read'
 *     const students = await getStudents(req);
 *     return NextResponse.json({ data: students });
 *   });
 *
 * @param {string} permissionCode - Required permission
 * @param {Function} handler - Route handler function (req, context) => Response
 * @returns {Function} Wrapped handler
 */
function withAction(permissionCode, handler) {
  return async (req, context) => {
    await Guard.action(req, permissionCode);
    return handler(req, context);
  };
}

/**
 * Wraps an API route handler with authentication + action + resource checks.
 *
 * @example
 *   export const DELETE = withResource('students:delete', 'student', async (req) => {
 *     const { id } = req.params;
 *     await deleteStudent(req, id);
 *     return NextResponse.json({ success: true });
 *   });
 *
 * @param {string} permissionCode - Required permission
 * @param {string} resourceType - Type of resource
 * @param {Function} handler - Route handler function (req, context) => Response
 * @param {Object} [options] - Passed through to Guard.resource()
 * @returns {Function} Wrapped handler
 */
function withResource(permissionCode, resourceType, handler, options = {}) {
  return async (req, context) => {
    // Extract resource ID from params — works with both App Router and Pages Router
    const params = context?.params ?? req.params ?? {};
    const resourceId = params.id ?? params[`${resourceType}Id`];

    await Guard.resource(req, permissionCode, resourceType, resourceId, options);
    return handler(req, context);
  };
}

// ─────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────
export { Guard, ForbiddenError, withAction, withResource };