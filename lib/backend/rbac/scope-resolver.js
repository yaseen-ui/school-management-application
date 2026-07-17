/**
 * RBAC v2 — Scope Resolver
 *
 * Resolves resource-level access based on the user's role context.
 * Answers: "Which sections/students/subjects/transport routes can this user access?"
 *
 * Scope resolution logic by role context:
 *   - Super Admin / Principal  → unrestricted (null return = "all")
 *   - Class Teacher             → sections from TeacherAssignment where role = class_teacher
 *   - Subject Teacher           → sections + subjects from TeacherAssignment where role = subject_teacher
 *   - Parent                    → own linked children via StudentParent table
 *   - Driver                    → assigned vehicle → students on that vehicle
 *
 * Scopes are unioned across all roles. If a user is both Class Teacher of
 * Section A and Subject Teacher of Section B, they can access both sections.
 */

import { prisma } from '../lib/prisma.js';
import { hasPermission, resolveEffectivePermissions } from './engine.js';

// ─────────────────────────────────────────────────────────────────────
// Request-scoped cache
// ─────────────────────────────────────────────────────────────────────
const scopeCache = new Map();

function clearScopeCache() {
  scopeCache.clear();
}

function getCacheKey(user, resourceType) {
  return `${user.userId}:${user.permVersion ?? 0}:${resourceType}`;
}

// ─────────────────────────────────────────────────────────────────────
// Helpers: check if user has unrestricted (admin) scope
// ─────────────────────────────────────────────────────────────────────

/**
 * Returns true if the user has unrestricted access to the given module.
 * Users with admin:super or module:* permissions bypass scope checks.
 */
async function hasUnrestrictedAccess(user, module) {
  // Company users always unrestricted
  if (user.userType === 'company' && !user.tenantId) return true;

  const perms = await resolveEffectivePermissions(user);
  if (hasPermission(perms, 'admin:super')) return true;
  if (hasPermission(perms, `${module}:*`)) return true;

  return false;
}

// ─────────────────────────────────────────────────────────────────────
// Teacher helpers
// ─────────────────────────────────────────────────────────────────────

/**
 * Get the Teacher record ID for the current user.
 */
async function getTeacherId(user) {
  const teacher = await prisma.teacher.findUnique({
    where: { userId: user.userId },
    select: { id: true, employeeType: true },
  });
  return teacher;
}

/**
 * Get section IDs assigned to a class teacher.
 */
async function getClassTeacherSections(tenantId, teacherId) {
  const assignments = await prisma.teacherAssignment.findMany({
    where: {
      tenantId,
      teacherId,
      role: 'class_teacher',
    },
    select: {
      sectionSubject: {
        select: { sectionId: true },
      },
    },
  });

  return [...new Set(assignments.map((a) => a.sectionSubject.sectionId))];
}

/**
 * Get section IDs assigned to a subject teacher.
 */
async function getSubjectTeacherSections(tenantId, teacherId) {
  const assignments = await prisma.teacherAssignment.findMany({
    where: {
      tenantId,
      teacherId,
      role: 'subject_teacher',
    },
    select: {
      sectionSubject: {
        select: { sectionId: true },
      },
    },
  });

  return [...new Set(assignments.map((a) => a.sectionSubject.sectionId))];
}

/**
 * Get subject IDs assigned to a subject teacher.
 */
async function getSubjectTeacherSubjects(tenantId, teacherId) {
  const assignments = await prisma.teacherAssignment.findMany({
    where: {
      tenantId,
      teacherId,
      role: 'subject_teacher',
    },
    select: {
      sectionSubject: {
        select: { subjectId: true },
      },
    },
  });

  return [...new Set(assignments.map((a) => a.sectionSubject.subjectId))];
}

/**
 * Get all section IDs the teacher has access to (union of all teacher roles).
 */
async function getTeacherSections(tenantId, teacherId) {
  const assignments = await prisma.teacherAssignment.findMany({
    where: { tenantId, teacherId },
    select: {
      sectionSubject: {
        select: { sectionId: true },
      },
    },
  });

  return [...new Set(assignments.map((a) => a.sectionSubject.sectionId))];
}

// ─────────────────────────────────────────────────────────────────────
// Parent helpers
// ─────────────────────────────────────────────────────────────────────

/**
 * Get the Parent record ID for the current user.
 */
async function getParentId(user) {
  const parent = await prisma.parent.findUnique({
    where: { userId: user.userId },
    select: { id: true },
  });
  return parent?.id ?? null;
}

/**
 * Get all student IDs linked to a parent.
 */
async function getParentStudentIds(tenantId, parentId) {
  const links = await prisma.studentParent.findMany({
    where: { tenantId, parentId },
    select: { studentId: true },
  });
  return links.map((l) => l.studentId);
}

// ─────────────────────────────────────────────────────────────────────
// Driver helpers
// ─────────────────────────────────────────────────────────────────────

/**
 * Get vehicle IDs assigned to a driver.
 */
async function getDriverVehicleIds(tenantId, driverId) {
  const assignments = await prisma.vehicleDriverAssignment.findMany({
    where: {
      tenantId,
      driverId,
      status: 'active',
    },
    select: { vehicleId: true },
  });
  return assignments.map((a) => a.vehicleId);
}

/**
 * Get student IDs assigned to specific vehicles.
 */
async function getVehicleStudentIds(tenantId, vehicleIds) {
  if (!vehicleIds.length) return [];

  const assignments = await prisma.studentTransportAssignment.findMany({
    where: {
      tenantId,
      vehicleId: { in: vehicleIds },
    },
    select: { studentId: true },
  });

  return [...new Set(assignments.map((a) => a.studentId))];
}

// ─────────────────────────────────────────────────────────────────────
// ScopeResolver
// ─────────────────────────────────────────────────────────────────────

class ScopeResolver {
  /**
   * Get all section IDs the user can access.
   *
   * Returns null if unrestricted (admin/super admin) — means "all sections".
   * Returns a Set of section IDs for scoped users.
   *
   * @param {Object} req - Request object
   * @returns {Promise<Set<string>|null>} null = unrestricted, Set = allowed IDs
   */
  static async getAllowedSections(req) {
    const user = req?.user;
    if (!user || !user.userId) return new Set();

    const cacheKey = getCacheKey(user, 'sections');
    if (scopeCache.has(cacheKey)) return scopeCache.get(cacheKey);

    // Unrestricted users get null (all sections)
    if (await hasUnrestrictedAccess(user, 'students')) {
      scopeCache.set(cacheKey, null);
      return null;
    }

    const teacher = await getTeacherId(user);
    if (!teacher) {
      scopeCache.set(cacheKey, new Set());
      return new Set();
    }

    // Union sections across all teacher roles
    const sectionIds = await getTeacherSections(user.tenantId, teacher.id);
    const result = new Set(sectionIds);
    scopeCache.set(cacheKey, result);
    return result;
  }

  /**
   * Get all student IDs the user can access.
   *
   * For admins: returns null (all students).
   * For class/subject teachers: students in their assigned sections.
   * For parents: their own linked children.
   * For drivers: students on their assigned vehicles.
   *
   * @param {Object} req - Request object
   * @returns {Promise<Set<string>|null>} null = unrestricted, Set = allowed student IDs
   */
  static async getAllowedStudents(req) {
    const user = req?.user;
    if (!user || !user.userId) return new Set();

    const cacheKey = getCacheKey(user, 'students');
    if (scopeCache.has(cacheKey)) return scopeCache.get(cacheKey);

    // Unrestricted users
    if (await hasUnrestrictedAccess(user, 'students')) {
      scopeCache.set(cacheKey, null);
      return null;
    }

    const teacher = await getTeacherId(user);
    const studentIds = new Set();

    if (teacher) {
      // Class teacher / subject teacher: students in assigned sections
      const sectionIds = await getTeacherSections(user.tenantId, teacher.id);
      if (sectionIds.length > 0) {
        const enrollments = await prisma.studentEnrollment.findMany({
          where: {
            tenantId: user.tenantId,
            sectionId: { in: sectionIds },
            status: 'active',
          },
          select: { studentId: true },
        });
        for (const e of enrollments) {
          studentIds.add(e.studentId);
        }
      }

      // Driver: students on assigned vehicles
      if (teacher.employeeType === 'driver') {
        const vehicleIds = await getDriverVehicleIds(user.tenantId, teacher.id);
        if (vehicleIds.length > 0) {
          const vehicleStudentIds = await getVehicleStudentIds(user.tenantId, vehicleIds);
          for (const sid of vehicleStudentIds) {
            studentIds.add(sid);
          }
        }
      }
    }

    // Parent: own children
    const parentId = await getParentId(user);
    if (parentId) {
      const childIds = await getParentStudentIds(user.tenantId, parentId);
      for (const cid of childIds) {
        studentIds.add(cid);
      }
    }

    const result = studentIds.size > 0 ? studentIds : new Set();
    scopeCache.set(cacheKey, result);
    return result;
  }

  /**
   * Get all subject IDs the user can access.
   *
   * For admins: returns null (all subjects).
   * For subject teachers: subjects from their assignments.
   * For class teachers: subjects in their assigned sections.
   *
   * @param {Object} req - Request object
   * @returns {Promise<Set<string>|null>} null = unrestricted, Set = allowed subject IDs
   */
  static async getAllowedSubjects(req) {
    const user = req?.user;
    if (!user || !user.userId) return new Set();

    const cacheKey = getCacheKey(user, 'subjects');
    if (scopeCache.has(cacheKey)) return scopeCache.get(cacheKey);

    if (await hasUnrestrictedAccess(user, 'subjects')) {
      scopeCache.set(cacheKey, null);
      return null;
    }

    const teacher = await getTeacherId(user);
    if (!teacher) {
      scopeCache.set(cacheKey, new Set());
      return new Set();
    }

    const subjectIds = await getSubjectTeacherSubjects(user.tenantId, teacher.id);
    const result = new Set(subjectIds);
    scopeCache.set(cacheKey, result);
    return result;
  }

  /**
   * Get all enrollment IDs the user can access.
   *
   * For admins: returns null (all enrollments).
   * For teachers: enrollments in their assigned sections.
   * For parents: enrollments of their linked children.
   *
   * @param {Object} req - Request object
   * @returns {Promise<Set<string>|null>}
   */
  static async getAllowedEnrollments(req) {
    const user = req?.user;
    if (!user || !user.userId) return new Set();

    const cacheKey = getCacheKey(user, 'enrollments');
    if (scopeCache.has(cacheKey)) return scopeCache.get(cacheKey);

    if (await hasUnrestrictedAccess(user, 'students')) {
      scopeCache.set(cacheKey, null);
      return null;
    }

    const enrollmentIds = new Set();

    // Teacher: enrollments in assigned sections
    const teacher = await getTeacherId(user);
    if (teacher) {
      const sectionIds = await getTeacherSections(user.tenantId, teacher.id);
      if (sectionIds.length > 0) {
        const enrollments = await prisma.studentEnrollment.findMany({
          where: {
            tenantId: user.tenantId,
            sectionId: { in: sectionIds },
            status: 'active',
          },
          select: { id: true },
        });
        for (const e of enrollments) {
          enrollmentIds.add(e.id);
        }
      }
    }

    // Parent: enrollments of own children
    const parentId = await getParentId(user);
    if (parentId) {
      const childIds = await getParentStudentIds(user.tenantId, parentId);
      if (childIds.length > 0) {
        const enrollments = await prisma.studentEnrollment.findMany({
          where: {
            tenantId: user.tenantId,
            studentId: { in: childIds },
            status: 'active',
          },
          select: { id: true },
        });
        for (const e of enrollments) {
          enrollmentIds.add(e.id);
        }
      }
    }

    const result = enrollmentIds.size > 0 ? enrollmentIds : new Set();
    scopeCache.set(cacheKey, result);
    return result;
  }

  /**
   * Get transport resource IDs (vehicle IDs) the user can access.
   *
   * For admins: returns null (all vehicles/routes).
   * For drivers: their assigned vehicles.
   *
   * @param {Object} req - Request object
   * @returns {Promise<Set<string>|null>}
   */
  static async getAllowedTransport(req) {
    const user = req?.user;
    if (!user || !user.userId) return new Set();

    const cacheKey = getCacheKey(user, 'transport');
    if (scopeCache.has(cacheKey)) return scopeCache.get(cacheKey);

    if (await hasUnrestrictedAccess(user, 'transport')) {
      scopeCache.set(cacheKey, null);
      return null;
    }

    const teacher = await getTeacherId(user);
    if (!teacher) {
      scopeCache.set(cacheKey, new Set());
      return new Set();
    }

    if (teacher.employeeType === 'driver') {
      const vehicleIds = await getDriverVehicleIds(user.tenantId, teacher.id);
      const result = new Set(vehicleIds);
      scopeCache.set(cacheKey, result);
      return result;
    }

    scopeCache.set(cacheKey, new Set());
    return new Set();
  }

  /**
   * Check if a specific student is the requesting user's own child.
   *
   * @param {Object} req - Request object
   * @param {string} studentId
   * @returns {Promise<boolean>}
   */
  static async isOwnChild(req, studentId) {
    const user = req?.user;
    if (!user || !user.userId) return false;

    const parentId = await getParentId(user);
    if (!parentId) return false;

    const link = await prisma.studentParent.findFirst({
      where: {
        parentId,
        studentId,
        tenantId: user.tenantId,
      },
      select: { id: true },
    });

    return !!link;
  }

  /**
   * Check if the user can access a specific resource.
   * Used by Guard.resource() for resource-level enforcement.
   *
   * @param {Object} req - Request object
   * @param {string} resourceType - "section", "student", "subject", "enrollment", "transport"
   * @param {string} resourceId - UUID of the resource
   * @returns {Promise<boolean>}
   */
  static async canAccessResource(req, resourceType, resourceId) {
    if (!resourceType || !resourceId) return true;

    const user = req?.user;
    if (!user) return false;
    if (user.userType === 'company' && !user.tenantId) return true;

    let allowedIds;

    switch (resourceType) {
      case 'section':
        allowedIds = await ScopeResolver.getAllowedSections(req);
        break;
      case 'student':
        // For student resources, also check own-child
        allowedIds = await ScopeResolver.getAllowedStudents(req);
        if (allowedIds && !allowedIds.has(resourceId)) {
          // Check if parent scope allows it
          const isOwn = await ScopeResolver.isOwnChild(req, resourceId);
          if (isOwn) return true;
        }
        break;
      case 'subject':
        allowedIds = await ScopeResolver.getAllowedSubjects(req);
        break;
      case 'enrollment':
        allowedIds = await ScopeResolver.getAllowedEnrollments(req);
        break;
      case 'transport':
        allowedIds = await ScopeResolver.getAllowedTransport(req);
        break;
      default:
        // Unknown resource types default to allowed (action check already passed)
        return true;
    }

    // null means unrestricted access
    if (allowedIds === null) return true;

    // Empty set means no access
    if (!allowedIds || allowedIds.size === 0) return false;

    return allowedIds.has(resourceId);
  }

  /**
   * Get the full scope context for a user.
   * Used by the permissions API endpoint (Phase 7) to send scopes to the frontend.
   *
   * @param {Object} req - Request object
   * @returns {Promise<Object>} Scoped resource IDs
   */
  static async getScopeContext(req) {
    const [sections, students, subjects, enrollments, transport] = await Promise.all([
      ScopeResolver.getAllowedSections(req),
      ScopeResolver.getAllowedStudents(req),
      ScopeResolver.getAllowedSubjects(req),
      ScopeResolver.getAllowedEnrollments(req),
      ScopeResolver.getAllowedTransport(req),
    ]);

    return {
      sections: sections === null ? null : [...sections],
      students: students === null ? null : [...students],
      subjects: subjects === null ? null : [...subjects],
      enrollments: enrollments === null ? null : [...enrollments],
      transport: transport === null ? null : [...transport],
    };
  }
}

// ─────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────
export { ScopeResolver, clearScopeCache };