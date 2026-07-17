import { prisma } from "../../lib/prisma.js";

class RoleService {
  // ── RBAC v2: Create role with permission codes ──
  static async createRole(req) {
    const { roleName, permissions, description, groupId } = req.body || req;
    const tenantId = req.tenantId ?? req.body?.tenantId;

    if (!tenantId || !roleName || permissions == null) {
      throw new Error("Missing required fields: tenantId, roleName, or permissions.");
    }

    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId }, select: { id: true } });
    if (!tenant) throw new Error("Invalid tenantId.");

    const existing = await prisma.role.findFirst({ where: { tenantId, roleName }, select: { id: true } });
    if (existing) throw new Error(`Role '${roleName}' already exists.`);

    // Create role
    const role = await prisma.role.create({
      data: { tenantId, roleName, description },
    });

    // Assign permissions (many-to-many via role_permissions)
    if (Array.isArray(permissions) && permissions.length > 0) {
      const permRecords = await prisma.permission.findMany({
        where: { code: { in: permissions } },
        select: { id: true, code: true },
      });

      for (const perm of permRecords) {
        await prisma.rolePermission.create({
          data: { roleId: role.id, permissionId: perm.id, tenantId },
        });
      }
    }

    // Assign to group if provided
    if (groupId) {
      const group = await prisma.group.findFirst({
        where: { id: groupId, tenantId },
        select: { id: true },
      });
      if (group) {
        await prisma.roleGroup.create({
          data: { roleId: role.id, groupId: group.id, tenantId },
        });
      }
    }

    // Bump version for affected users
    const { RoleResolver } = await import("../../rbac/role-resolver.js");
    await RoleResolver.bumpVersion(tenantId, role.id);

    return RoleService.getRoleById(role.id, tenantId);
  }

  // ── RBAC v2: Get all roles with groups, permissions, and user counts ──
  static async getAllRoles(req) {
    const tenantId = req.tenantId ?? req.query?.tenantId;

    const roles = await prisma.role.findMany({
      where: { tenantId },
      include: {
        rolePermissions: {
          select: {
            permission: { select: { code: true } },
          },
        },
        roleGroups: {
          select: {
            group: { select: { id: true, groupName: true } },
          },
        },
        _count: {
          select: { userRoles: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform to frontend-friendly format
    return roles.map((role) => ({
      id: role.id,
      roleName: role.roleName,
      description: role.description,
      tenantId,
      permissions: role.rolePermissions.map((rp) => rp.permission.code),
      groupId: role.roleGroups[0]?.group.id ?? null,
      groupName: role.roleGroups[0]?.group.groupName ?? null,
      userCount: role._count.userRoles,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    }));
  }

  // ── Get single role by ID ──
  static async getRoleById(roleId, tenantId) {
    const role = await prisma.role.findFirst({
      where: { id: roleId, tenantId },
      include: {
        rolePermissions: {
          select: { permission: { select: { code: true } } },
        },
        roleGroups: {
          select: { group: { select: { id: true, groupName: true } } },
        },
        _count: { select: { userRoles: true } },
      },
    });

    if (!role) return null;

    return {
      id: role.id,
      roleName: role.roleName,
      description: role.description,
      tenantId,
      permissions: role.rolePermissions.map((rp) => rp.permission.code),
      groupId: role.roleGroups[0]?.group.id ?? null,
      groupName: role.roleGroups[0]?.group.groupName ?? null,
      userCount: role._count.userRoles,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  // ── Update role ──
  static async updateRole(roleId, data, tenantId) {
    const { roleName, permissions, description, groupId } = data || {};

    if (roleName) {
      const dup = await prisma.role.findFirst({
        where: { tenantId, roleName, NOT: { id: roleId } },
        select: { id: true },
      });
      if (dup) throw new Error(`Role '${roleName}' already exists.`);
    }

    // Update basic fields
    const updates = { roleName, description };
    Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);

    if (Object.keys(updates).length > 0) {
      await prisma.role.update({ where: { id: roleId, tenantId }, data: updates });
    }

    // Update permissions: delete all, re-insert (simpler than diff)
    if (Array.isArray(permissions)) {
      await prisma.rolePermission.deleteMany({ where: { roleId, tenantId } });

      if (permissions.length > 0) {
        const permRecords = await prisma.permission.findMany({
          where: { code: { in: permissions } },
          select: { id: true },
        });
        for (const perm of permRecords) {
          await prisma.rolePermission.create({
            data: { roleId, permissionId: perm.id, tenantId },
          });
        }
      }
    }

    // Update group assignment
    if (groupId !== undefined) {
      await prisma.roleGroup.deleteMany({ where: { roleId, tenantId } });
      if (groupId) {
        const group = await prisma.group.findFirst({ where: { id: groupId, tenantId }, select: { id: true } });
        if (group) {
          await prisma.roleGroup.create({ data: { roleId, groupId: group.id, tenantId } });
        }
      }
    }

    // Bump version for affected users
    try {
      const { RoleResolver } = await import("../../rbac/role-resolver.js");
      await RoleResolver.bumpVersion(tenantId, roleId);
    } catch {}

    return RoleService.getRoleById(roleId, tenantId);
  }

  // ── Delete role ──
  static async deleteRole(roleId, tenantId) {
    // Check user count first
    const userCount = await prisma.userRole.count({ where: { roleId, tenantId } });
    if (userCount > 0) {
      throw new Error(`Cannot delete role: ${userCount} user(s) are assigned. Reassign them first.`);
    }

    await prisma.role.deleteMany({ where: { id: roleId, tenantId } });
    return { count: 1 };
  }
}

export default RoleService;