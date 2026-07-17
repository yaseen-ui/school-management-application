/**
 * RBAC v2 — Audit Logger
 *
 * Logs authorization events and critical business actions to the AuditLog table.
 * Designed for compliance, debugging, and security monitoring.
 *
 * What gets logged:
 *   - Role CRUD operations
 *   - Permission assignments/removals
 *   - User-role assignments/removals
 *   - Access denials (403)
 *   - Critical business actions (refunds, marks publishing, payroll, etc.)
 *
 * All methods are static async helpers — fire-and-forget compatible.
 */

import { prisma } from '../lib/prisma.js';

// ─────────────────────────────────────────────────────────────────────
// Audit levels
// ─────────────────────────────────────────────────────────────────────

const Level = {
  INFO: 'info',
  WARNING: 'warning',
  CRITICAL: 'critical',
};

// ─────────────────────────────────────────────────────────────────────
// Extract request metadata
// ─────────────────────────────────────────────────────────────────────

/**
 * Extract actor and request metadata from the Express-like req object.
 */
function extractActor(req) {
  if (!req || !req.user) {
    return {
      tenantId: req?.tenantId ?? null,
      actorId: null,
      actorEmail: null,
      ipAddress: null,
    };
  }

  return {
    tenantId: req.tenantId ?? req.user.tenantId ?? null,
    actorId: req.user.userId ?? null,
    actorEmail: req.user.email ?? null,
    ipAddress:
      req.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ??
      req.headers?.['x-real-ip'] ??
      null,
  };
}

// ─────────────────────────────────────────────────────────────────────
// AuditLogger
// ─────────────────────────────────────────────────────────────────────

class AuditLogger {
  /**
   * Log an event to the audit trail.
   *
   * @param {Object} req - Request object (can be null for system events)
   * @param {string} action - Event action, e.g., "role.created", "permission.denied"
   * @param {string} [targetType] - Target entity type, e.g., "Role", "User", "FeePayment"
   * @param {string} [targetId] - Target entity UUID
   * @param {Object} [details] - Flexible context payload
   * @param {string} [level] - "info" | "warning" | "critical" (default: "info")
   * @returns {Promise<Object|null>} The created audit log or null on failure
   */
  static async log(req, action, targetType = null, targetId = null, details = {}, level = Level.INFO) {
    try {
      const { tenantId, actorId, actorEmail, ipAddress } = extractActor(req);

      return await prisma.auditLog.create({
        data: {
          tenantId,
          actorId,
          actorEmail,
          action,
          targetType,
          targetId,
          details: details && Object.keys(details).length > 0 ? details : undefined,
          ipAddress,
          level,
        },
      });
    } catch (error) {
      // Audit logging must never break the main flow
      console.error(`[AuditLogger] Failed to log action="${action}":`, error.message);
      return null;
    }
  }

  /**
   * Log an access denial (403).
   * Called by guards.js when Guard.action() or Guard.resource() rejects.
   *
   * @param {Object} req
   * @param {Object} context - { permissionCode, resourceType, resourceId, reason }
   * @returns {Promise<Object|null>}
   */
  static async logAccessDenied(req, context = {}) {
    return AuditLogger.log(
      req,
      context.resourceType ? 'resource.denied' : 'permission.denied',
      context.resourceType ?? 'Permission',
      context.resourceId ?? null,
      {
        permissionCode: context.permissionCode,
        reason: context.reason ?? 'insufficient_permissions',
      },
      Level.WARNING,
    );
  }

  /**
   * Log a role-related change.
   *
   * @param {Object} req
   * @param {string} action - "role.created" | "role.updated" | "role.deleted" | "role.permissions_changed"
   * @param {string} roleId
   * @param {Object} [changes] - What changed (old/new values for diff tracking)
   * @returns {Promise<Object|null>}
   */
  static async logRoleChange(req, action, roleId, changes = {}) {
    const level =
      action === 'role.deleted' || action === 'role.permissions_changed'
        ? Level.WARNING
        : Level.INFO;

    return AuditLogger.log(req, action, 'Role', roleId, changes, level);
  }

  /**
   * Log a user-role assignment change.
   *
   * @param {Object} req
   * @param {string} action - "user.role_assigned" | "user.role_removed"
   * @param {string} userId
   * @param {string} roleId
   * @returns {Promise<Object|null>}
   */
  static async logUserRoleChange(req, action, userId, roleId) {
    return AuditLogger.log(req, action, 'User', userId, { roleId }, Level.INFO);
  }

  /**
   * Log a critical business action (high-risk operations).
   *
   * @param {Object} req
   * @param {string} action - e.g., "fee.refunded", "marks.published", "payroll.processed", "student.deleted"
   * @param {string} targetType
   * @param {string} targetId
   * @param {Object} [details]
   * @returns {Promise<Object|null>}
   */
  static async logCritical(req, action, targetType, targetId, details = {}) {
    return AuditLogger.log(req, action, targetType, targetId, details, Level.CRITICAL);
  }

  /**
   * Log a user creation event.
   *
   * @param {Object} req
   * @param {string} newUserId
   * @param {Object} [details]
   * @returns {Promise<Object|null>}
   */
  static async logUserCreated(req, newUserId, details = {}) {
    return AuditLogger.log(req, 'user.created', 'User', newUserId, details, Level.INFO);
  }

  /**
   * Log a tenant setting change.
   *
   * @param {Object} req
   * @param {string} tenantId
   * @param {Object} changes - What was changed
   * @returns {Promise<Object|null>}
   */
  static async logSettingsChange(req, tenantId, changes = {}) {
    return AuditLogger.log(req, 'settings.changed', 'Tenant', tenantId, changes, Level.WARNING);
  }

  /**
   * Query audit logs with filtering and pagination.
   * Useful for the audit log viewer page (future enhancement).
   *
   * @param {Object} filters
   * @param {string} [filters.tenantId]
   * @param {string} [filters.actorId]
   * @param {string} [filters.action]
   * @param {string} [filters.level]
   * @param {Date} [filters.startDate]
   * @param {Date} [filters.endDate]
   * @param {number} [filters.page=1]
   * @param {number} [filters.limit=50]
   * @returns {Promise<{ rows: Object[], total: number, page: number, limit: number }>}
   */
  static async query(filters = {}) {
    const {
      tenantId,
      actorId,
      action,
      level,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = filters;

    const where = {};

    if (tenantId) where.tenantId = tenantId;
    if (actorId) where.actorId = actorId;
    if (action) where.action = action;
    if (level) where.level = level;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [rows, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { rows, total, page, limit };
  }
}

// ─────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────
export { AuditLogger, Level };