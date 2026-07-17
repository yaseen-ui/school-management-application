/**
 * RBAC v2 — Core Authorization Engine
 *
 * Answers "can user X perform action Y on resource Z?"
 *
 * Permission model:
 *   - admin:super     → full system access (wildcard)
 *   - module:*        → all actions within a module
 *   - module:action   → exact match
 *   - module:action:scope → scoped permission (grants base module:action too)
 *
 * Scoped permission logic:
 *   Having "attendance:mark:section" implies you can mark SOME attendance
 *   (matches base "attendance:mark"). Scope checking for specific resources
 *   is handled by ScopeResolver (Phase 5).
 *
 * Caching:
 *   Request-scoped cache keyed on userId:permVersion.
 *   Cleared between requests (no global state leaked).
 */

import { prisma } from '../lib/prisma.js';

// ─────────────────────────────────────────────────────────────────────
// Permission Cache (request-scoped, keyed by userId:permVersion)
// ─────────────────────────────────────────────────────────────────────
const requestCache = new Map();

/**
 * Resolve a user's effective permissions from the database.
 * Results are cached per-request using the user's permVersion.
 *
 * @param {Object} user - Decoded JWT user object { userId, tenantId, roleIds, permVersion }
 * @returns {Promise<Set<string>>} Set of permission code strings
 */
async function resolveEffectivePermissions(user) {
  if (!user || !user.userId || !user.tenantId) {
    return new Set();
  }

  const cacheKey = `${user.userId}:${user.permVersion ?? 0}`;

  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey);
  }

  const roleIds = user.roleIds ?? [];

  // Company users (no tenantId) have implicit admin:super
  if (user.userType === 'company' && !user.tenantId) {
    const perms = new Set(['admin:super']);
    requestCache.set(cacheKey, perms);
    return perms;
  }

  if (!roleIds.length) {
    return new Set();
  }

  const permissions = await prisma.rolePermission.findMany({
    where: {
      tenantId: user.tenantId,
      roleId: { in: roleIds },
    },
    include: {
      permission: {
        select: { code: true },
      },
    },
  });

  const permSet = new Set(permissions.map((rp) => rp.permission.code));

  requestCache.set(cacheKey, permSet);
  return permSet;
}

/**
 * Clear the request cache. Call at the end of each request lifecycle.
 */
function clearRequestCache() {
  requestCache.clear();
}

// ─────────────────────────────────────────────────────────────────────
// Permission Matching
// ─────────────────────────────────────────────────────────────────────

/**
 * Check if a user's effective permission set grants a specific code.
 *
 * Matching strategy (in order):
 *   1. admin:super in set → always allow
 *   2. Exact match of the full code
 *   3. Module wildcard: module:* (e.g., "students:*")
 *   4. Scope downgrade: having "module:action:scope" grants "module:action"
 *
 * @param {Set<string>} effectivePermissions - Resolved permission set
 * @param {string} code - Permission code to check, e.g., "students:read"
 * @returns {boolean}
 */
function hasPermission(effectivePermissions, code) {
  if (!effectivePermissions || effectivePermissions.size === 0) return false;
  if (!code) return false;

  // 1. Super admin wildcard: admin:super grants everything
  if (effectivePermissions.has('admin:super')) return true;

  // 2. Exact match of the full permission code
  if (effectivePermissions.has(code)) return true;

  // Parse the requested code
  const parts = code.split(':');
  const module = parts[0];
  const action = parts.length >= 2 ? parts[1] : null;

  // 3. Module wildcard: "students:*" grants "students:read", "students:write", etc.
  if (effectivePermissions.has(`${module}:*`)) return true;

  // 4. Scoped permission grants base action:
  //    User has "attendance:mark:section" → should grant "attendance:mark"
  //    User has "students:read:own" → should grant "students:read"
  //    Check if any permission in the set starts with "module:action:"
  if (action) {
    const basePrefix = `${module}:${action}:`;
    for (const perm of effectivePermissions) {
      if (perm.startsWith(basePrefix)) return true;
    }
  }

  return false;
}

/**
 * Check if a user has any of the given permission codes.
 *
 * @param {Set<string>} effectivePermissions
 * @param {string[]} codes
 * @returns {boolean}
 */
function hasAnyPermission(effectivePermissions, codes) {
  if (!codes || codes.length === 0) return false;
  return codes.some((code) => hasPermission(effectivePermissions, code));
}

/**
 * Check if a user has all of the given permission codes.
 *
 * @param {Set<string>} effectivePermissions
 * @param {string[]} codes
 * @returns {boolean}
 */
function hasAllPermissions(effectivePermissions, codes) {
  if (!codes || codes.length === 0) return true;
  return codes.every((code) => hasPermission(effectivePermissions, code));
}

// ─────────────────────────────────────────────────────────────────────
// Access Control (async — needs DB for resource-level checks)
// ─────────────────────────────────────────────────────────────────────

/**
 * Check if the authenticated user can access a specific resource.
 * Delegates scope resolution to the ScopeResolver (Phase 5).
 * For now, performs action-level check only.
 *
 * @param {Object} req - Request object with req.user populated
 * @param {string} permissionCode - Required permission code
 * @param {string} [resourceType] - Optional resource type for scope check
 * @param {string} [resourceId] - Optional resource ID
 * @returns {Promise<boolean>}
 */
async function canAccess(req, permissionCode, resourceType, resourceId) {
  const user = req?.user;
  if (!user) return false;

  // Company users always pass
  if (user.userType === 'company' && !user.tenantId) return true;

  const perms = await resolveEffectivePermissions(user);
  if (!hasPermission(perms, permissionCode)) return false;

  // Resource-level scoping via ScopeResolver (Phase 5)
  if (!resourceType || !resourceId) return true;

  try {
    const { ScopeResolver } = await import('./scope-resolver.js');
    return await ScopeResolver.canAccessResource(req, resourceType, resourceId);
  } catch {
    // ScopeResolver not available — fall through to allow (action check passed)
    return true;
  }
}

/**
 * Get all resource IDs of a given type the user can access.
 * Delegates to ScopeResolver (Phase 5).
 *
 * @param {Object} req
 * @param {string} resourceType - "section", "student", "subject", "transport"
 * @returns {Promise<Set<string>>}
 */
async function getAllowedResourceIds(req, resourceType) {
  try {
    const { ScopeResolver } = await import('./scope-resolver.js');

    // Map resourceType to the correct ScopeResolver method
    switch (resourceType) {
      case 'section':
        return await ScopeResolver.getAllowedSections(req);
      case 'student':
        return await ScopeResolver.getAllowedStudents(req);
      case 'subject':
        return await ScopeResolver.getAllowedSubjects(req);
      case 'enrollment':
        return await ScopeResolver.getAllowedEnrollments(req);
      case 'transport':
        return await ScopeResolver.getAllowedTransport(req);
      default:
        return new Set();
    }
  } catch {
    return new Set();
  }
}

// ─────────────────────────────────────────────────────────────────────
// Convenience: resolve + check in one call
// ─────────────────────────────────────────────────────────────────────

/**
 * Resolve permissions for a user and check a permission code.
 * Combines resolve + hasPermission in a single call.
 *
 * @param {Object} req - Request with req.user
 * @param {string} code - Permission code
 * @returns {Promise<boolean>}
 */
async function userHasPermission(req, code) {
  const user = req?.user;
  if (!user) return false;
  const perms = await resolveEffectivePermissions(user);
  return hasPermission(perms, code);
}

/**
 * Resolve permissions and check any of the given codes.
 *
 * @param {Object} req
 * @param {string[]} codes
 * @returns {Promise<boolean>}
 */
async function userHasAnyPermission(req, codes) {
  const user = req?.user;
  if (!user) return false;
  const perms = await resolveEffectivePermissions(user);
  return hasAnyPermission(perms, codes);
}

/**
 * Resolve permissions and check all of the given codes.
 *
 * @param {Object} req
 * @param {string[]} codes
 * @returns {Promise<boolean>}
 */
async function userHasAllPermissions(req, codes) {
  const user = req?.user;
  if (!user) return false;
  const perms = await resolveEffectivePermissions(user);
  return hasAllPermissions(perms, codes);
}

// ─────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────
export {
  // Core permission matching (synchronous, works on resolved permission sets)
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,

  // Permission resolution (async, hits DB with caching)
  resolveEffectivePermissions,
  clearRequestCache,

  // High-level access checks (async)
  canAccess,
  getAllowedResourceIds,

  // Convenience
  userHasPermission,
  userHasAnyPermission,
  userHasAllPermissions,
};