// src/modules/roles/role.service.js
import { prisma } from "../../lib/prisma.js";

const mapIn = (data = {}) => ({
  tenantId: data.tenantId ?? data.tenant_id,
  roleName: data.roleName ?? data.role_name,
  permissions: data.permissions, // JSON
});

const mapUpdateIn = (data = {}) => {
  const out = {
    roleName: data.roleName ?? data.role_name,
    permissions: data.permissions,
  };
  Object.keys(out).forEach((k) => out[k] === undefined && delete out[k]);
  return out;
};

class RoleService {
  static async createRole(req) {
    try {
      const { roleName, role_name, permissions } = req;
      const tenantId = req.tenantId || req.tenant_id;

      if (!tenantId || !roleName && !role_name || permissions == null) {
        throw new Error(
          "Missing required fields: tenantId, roleName, or permissions."
        );
      }

      // Tenant must exist
      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { id: true },
      });
      if (!tenant) {
        throw new Error("Invalid tenantId. No such tenant exists.");
      }

      // Friendly duplicate check (schema already has unique (tenantId, roleName))
      const existing = await prisma.role.findFirst({
        where: { tenantId: tenantId, roleName: roleName || role_name },
        select: { id: true },
      });
      if (existing) {
        throw new Error(`Role name '${roleName || role_name}' already exists for the tenant.`);
      }

      // Create
      const created = await prisma.role.create({
        data: {
          tenantId: tenantId,
          roleName: roleName || role_name,
          permissions, // JSON
        },
      });
      return created;
    } catch (error) {
      console.error(`Error creating role: ${error.message}`);
      throw error;
    }
  }

  static async getAllRoles(req) {
    return prisma.role.findMany({
      where: { tenantId: req.tenantId || req.tenant_id },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getRoleById(roleId, tenantId) {
    // Scope by tenant as intended
    return prisma.role.findFirst({
      where: { id: roleId, tenantId: tenantId },
    });
  }

  static async updateRole(roleId, data, tenantId) {
    // If renaming, guard unique per tenant
    if (data.roleName || data.role_name) {
      const nextName = data.roleName ?? data.role_name;
      const dup = await prisma.role.findFirst({
        where: {
          tenantId: tenantId,
          roleName: nextName,
          NOT: { id: roleId },
        },
        select: { id: true },
      });
      if (dup) {
        throw new Error(`Role name '${nextName}' already exists for the tenant.`);
      }
    }

    const result = await prisma.role.updateMany({
      where: { id: roleId, tenantId: tenantId },
      data: mapUpdateIn(data),
    });

    if (result.count === 1) {
      return prisma.role.findFirst({
        where: { id: roleId, tenantId: tenantId },
      });
    }
    return { count: result.count }; // nothing updated (not found / unauthorized)
  }

  static async deleteRole(roleId, tenantId) {
    const result = await prisma.role.deleteMany({
      where: { id: roleId, tenantId: tenantId },
    });
    return { count: result.count };
  }
}

export default RoleService;
