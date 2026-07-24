import { prisma } from "../../lib/prisma.js";

/**
 * AudienceResolver — Resolves audience criteria into a list of { userId, ...userDetails } objects.
 *
 * Supports the following criteria fields (all optional, additive across fields):
 *   - targetUserIds: [{ userId }]            — Direct user targeting
 *   - targetRoles: [{ roleId }]              — All users with these roles
 *   - targetGroups: [{ groupId }]            — All users in these groups
 *   - targetGrades: [{ gradeId }]            — Students + Parents in these grades
 *   - targetSections: [{ sectionId }]        — Students + Parents in these sections
 *   - targetEmployeeTypes: ["teacher", ...]  — Employees of these types
 *   - targetAudience: ["student","parent","employee"] — Broad category filter
 *
 * If ALL criteria are null/empty, resolves to ALL active users in the tenant.
 */
export class AudienceResolver {
  /**
   * @param {Object} criteria — The audience criteria from a Communication/Publication record
   * @param {string} tenantId
   * @returns {Promise<Array<{ userId: string, email?: string, phone?: string }>>}
   */
  async resolve(criteria, tenantId) {
    if (!criteria || this.#isAllEmpty(criteria)) {
      return this.#resolveAllUsers(tenantId);
    }

    const userIdSets = [];

    // Direct user IDs
    if (criteria.targetUserIds?.length) {
      const ids = criteria.targetUserIds.map((u) => u.userId);
      const users = await prisma.user.findMany({
        where: { tenantId, id: { in: ids }, status: "active", deletedAt: null },
        select: { id: true, email: true, phone: true },
      });
      userIdSets.push(new Map(users.map((u) => [u.id, u])));
    }

    // Role-based
    if (criteria.targetRoles?.length) {
      const roleIds = criteria.targetRoles.map((r) => r.roleId);
      const userRoles = await prisma.userRole.findMany({
        where: { tenantId, roleId: { in: roleIds } },
        select: { userId: true, user: { select: { id: true, email: true, phone: true } } },
      });
      const map = new Map();
      for (const ur of userRoles) {
        if (ur.user) map.set(ur.user.id, ur.user);
      }
      userIdSets.push(map);
    }

    // Group-based
    if (criteria.targetGroups?.length) {
      const groupIds = criteria.targetGroups.map((g) => g.groupId);
      const roleGroups = await prisma.roleGroup.findMany({
        where: { tenantId, groupId: { in: groupIds } },
        select: { roleId: true },
      });
      const roleIds = [...new Set(roleGroups.map((rg) => rg.roleId))];
      if (roleIds.length > 0) {
        const userRoles = await prisma.userRole.findMany({
          where: { tenantId, roleId: { in: roleIds } },
          select: { userId: true, user: { select: { id: true, email: true, phone: true } } },
        });
        const map = new Map();
        for (const ur of userRoles) {
          if (ur.user) map.set(ur.user.id, ur.user);
        }
        userIdSets.push(map);
      }
    }

    // Grade-based → students + their parents
    if (criteria.targetGrades?.length || criteria.targetSections?.length) {
      const gradeIds = criteria.targetGrades?.map((g) => g.gradeId) || [];
      const sectionIds = criteria.targetSections?.map((s) => s.sectionId) || [];

      const enrollmentWhere = { tenantId, status: "active" };
      if (gradeIds.length) enrollmentWhere.gradeId = { in: gradeIds };
      if (sectionIds.length) enrollmentWhere.sectionId = { in: sectionIds };

      const enrollments = await prisma.studentEnrollment.findMany({
        where: enrollmentWhere,
        select: {
          student: {
            select: {
              parents: {
                select: { parent: { select: { userId: true } } },
              },
            },
          },
        },
      });

      const parentUserIds = new Set();

      for (const enr of enrollments) {
        for (const sp of enr.student?.parents || []) {
          if (sp.parent?.userId) parentUserIds.add(sp.parent.userId);
        }
      }

      if (parentUserIds.size > 0) {
        const parentUsers = await prisma.user.findMany({
          where: { tenantId, id: { in: [...parentUserIds] }, status: "active", deletedAt: null },
          select: { id: true, email: true, phone: true },
        });

        const map = new Map();
        for (const u of parentUsers) map.set(u.id, u);
        userIdSets.push(map);
      }
    }

    // Employee type-based
    if (criteria.targetEmployeeTypes?.length) {
      const teachers = await prisma.teacher.findMany({
        where: {
          tenantId,
          employeeType: { in: criteria.targetEmployeeTypes },
          status: "active",
          deletedAt: null,
          userId: { not: null },
        },
        select: { user: { select: { id: true, email: true, phone: true } } },
      });
      const map = new Map();
      for (const t of teachers) {
        if (t.user) map.set(t.user.id, t.user);
      }
      userIdSets.push(map);
    }

    // Broad audience filter
    if (criteria.targetAudience?.length) {
      const userMap = new Map();

      if (criteria.targetAudience.includes("parent")) {
        const parents = await prisma.parent.findMany({
          where: { tenantId, status: "active", deletedAt: null, userId: { not: null } },
          select: { user: { select: { id: true, email: true, phone: true } } },
        });
        for (const p of parents) {
          if (p.user) userMap.set(p.user.id, p.user);
        }
      }

      if (criteria.targetAudience.includes("employee")) {
        const employees = await prisma.teacher.findMany({
          where: {
            tenantId,
            status: "active",
            deletedAt: null,
            userId: { not: null },
          },
          select: { user: { select: { id: true, email: true, phone: true } } },
        });
        for (const e of employees) {
          if (e.user) userMap.set(e.user.id, e.user);
        }
      }

      if (userMap.size > 0) userIdSets.push(userMap);
    }

    // Merge all sets (union)
    const merged = new Map();
    for (const set of userIdSets) {
      for (const [id, user] of set) {
        merged.set(id, user);
      }
    }

    return [...merged.values()].map((u) => ({
      userId: u.id,
      email: u.email,
      phone: u.phone,
    }));
  }

  #isAllEmpty(criteria) {
    return (
      (!criteria.targetUserIds || criteria.targetUserIds.length === 0) &&
      (!criteria.targetRoles || criteria.targetRoles.length === 0) &&
      (!criteria.targetGroups || criteria.targetGroups.length === 0) &&
      (!criteria.targetGrades || criteria.targetGrades.length === 0) &&
      (!criteria.targetSections || criteria.targetSections.length === 0) &&
      (!criteria.targetEmployeeTypes || criteria.targetEmployeeTypes.length === 0) &&
      (!criteria.targetAudience || criteria.targetAudience.length === 0)
    );
  }

  async #resolveAllUsers(tenantId) {
    const users = await prisma.user.findMany({
      where: { tenantId, status: "active", deletedAt: null },
      select: { id: true, email: true, phone: true },
    });
    return users.map((u) => ({
      userId: u.id,
      email: u.email,
      phone: u.phone,
    }));
  }
}