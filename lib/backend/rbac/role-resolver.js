/**
 * RBAC v2 — Role Resolver
 *
 * Resolves a user's effective permissions and role information.
 * Cached per request using permVersion for cache busting.
 * Called by the guards and authorization API.
 *
 * Also provides version bumping: whenever roles/permissions change,
 * all affected users get their permVersion incremented, invalidating
 * any in-flight caches.
 */

import { prisma } from '../lib/prisma.js';

// ─────────────────────────────────────────────────────────────────────
// Request-scoped cache (same pattern as engine.js)
// ─────────────────────────────────────────────────────────────────────
const resolveCache = new Map();

/**
 * Clear the resolve cache. Call at end of request lifecycle.
 */
function clearResolveCache() {
  resolveCache.clear();
}

// ─────────────────────────────────────────────────────────────────────
// RoleResolver
// ─────────────────────────────────────────────────────────────────────

class RoleResolver {
  /**
   * Resolve a user's effective permissions and role information.
   *
   * Results are cached per-request using the user's permVersion,
   * so a role change mid-session is picked up on the next request.
   *
   * @param {Object} req - Request object with req.user populated
   * @returns {Promise<{
   *   roleIds: string[],
   *   roleNames: string[],
   *   permissions: Set<string>,
   *   groups: string[]
   * }>}
   */
  static async resolve(req) {
    const user = req?.user;
    if (!user || !user.userId) {
      return {
        roleIds: [],
        roleNames: [],
        permissions: new Set(),
        groups: [],
      };
    }

    const cacheKey = `${user.userId}:${user.permVersion ?? 0}`;

    if (resolveCache.has(cacheKey)) {
      return resolveCache.get(cacheKey);
    }

    // Company users get implicit super admin
    if (user.userType === 'company' && !user.tenantId) {
      const result = {
        roleIds: [],
        roleNames: ['Company Admin'],
        permissions: new Set(['admin:super']),
        groups: [],
      };
      resolveCache.set(cacheKey, result);
      return result;
    }

    const roleIds = user.roleIds ?? [];

    if (!roleIds.length) {
      const result = {
        roleIds: [],
        roleNames: [],
        permissions: new Set(),
        groups: [],
      };
      resolveCache.set(cacheKey, result);
      return result;
    }

    // Fetch roles with permissions and groups in a single query
    const roles = await prisma.role.findMany({
      where: {
        id: { in: roleIds },
        tenantId: user.tenantId,
      },
      select: {
        id: true,
        roleName: true,
        rolePermissions: {
          select: {
            permission: {
              select: { code: true },
            },
          },
        },
        roleGroups: {
          select: {
            group: {
              select: { groupName: true },
            },
          },
        },
      },
    });

    const roleNames = roles.map((r) => r.roleName);
    const resolvedRoleIds = roles.map((r) => r.id);

    // Union all permissions from all roles
    const permissions = new Set();
    for (const role of roles) {
      for (const rp of role.rolePermissions) {
        permissions.add(rp.permission.code);
      }
    }

    // Union all group names (deduplicated)
    const groupSet = new Set();
    for (const role of roles) {
      for (const rg of role.roleGroups) {
        groupSet.add(rg.group.groupName);
      }
    }
    const groups = [...groupSet];

    const result = {
      roleIds: resolvedRoleIds,
      roleNames,
      permissions,
      groups,
    };

    resolveCache.set(cacheKey, result);
    return result;
  }

  /**
   * Bump permVersion for all users affected by a role/permission change.
   *
   * Called whenever:
   *   - A role's permissions are modified
   *   - A role is assigned to / removed from a user
   *   - A permission is added to / removed from a role
   *
   * This invalidates all in-flight caches for affected users,
   * forcing fresh permission resolution on their next request.
   *
   * @param {string} tenantId
   * @param {string|string[]} roleIds - Single role ID or array of role IDs that changed
   * @returns {Promise<number>} Number of users whose version was bumped
   */
  static async bumpVersion(tenantId, roleIds) {
    const ids = Array.isArray(roleIds) ? roleIds : [roleIds];
    if (!ids.length) return 0;

    const result = await prisma.user.updateMany({
      where: {
        tenantId,
        userRoles: {
          some: {
            roleId: { in: ids },
          },
        },
      },
      data: {
        permVersion: {
          increment: 1,
        },
      },
    });

    // Also clear the local resolve cache for good measure
    resolveCache.clear();

    return result.count;
  }

  /**
   * Get the full authorization context for a user.
   * Used by the permissions API endpoint (Phase 7) and login response.
   *
   * Includes roles, permissions, groups, and user profile.
   *
   * @param {Object} req - Request object
   * @returns {Promise<Object>} Full auth context
   */
  static async getAuthContext(req) {
    const user = req?.user;
    if (!user) return null;

    const resolved = await RoleResolver.resolve(req);

    return {
      user: {
        userId: user.userId,
        email: user.email,
        fullName: user.fullName ?? null,
        tenantId: user.tenantId,
        userType: user.userType,
      },
      roles: resolved.roleIds.map((id, i) => ({
        id,
        name: resolved.roleNames[i],
      })),
      groups: resolved.groups,
      permissions: [...resolved.permissions],
    };
  }
}

// ─────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────
export { RoleResolver, clearResolveCache };