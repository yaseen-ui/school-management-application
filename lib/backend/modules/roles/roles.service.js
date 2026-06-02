import { prisma } from "../../lib/prisma.js";

class RoleService {
  static async createRole(req) {
    try {
      const { roleName, permissions, description } = req || {};
      const tenantId = req?.tenantId;

      if (!tenantId || !roleName || permissions == null) {
        throw new Error(
          "Missing required fields: tenantId, roleName, or permissions."
        );
      }

      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { id: true },
      });
      if (!tenant) {
        throw new Error("Invalid tenantId. No such tenant exists.");
      }

      const existing = await prisma.role.findFirst({
        where: { tenantId, roleName },
        select: { id: true },
      });
      if (existing) {
        throw new Error(`Role name '${roleName}' already exists for the tenant.`);
      }

      return await prisma.role.create({
        data: {
          tenantId,
          roleName,
          permissions,
          description,
        },
      });
    } catch (error) {
      console.error(`Error creating role: ${error.message}`);
      throw error;
    }
  }

  static async getAllRoles(req) {
    return prisma.role.findMany({
      where: { tenantId: req.tenantId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getRoleById(roleId, tenantId) {
    return prisma.role.findFirst({
      where: { id: roleId, tenantId },
    });
  }

  static async updateRole(roleId, data, tenantId) {
    const { roleName, permissions, description } = data || {};

    if (roleName) {
      const dup = await prisma.role.findFirst({
        where: {
          tenantId,
          roleName,
          NOT: { id: roleId },
        },
        select: { id: true },
      });
      if (dup) {
        throw new Error(`Role name '${roleName}' already exists for the tenant.`);
      }
    }

    const updates = { roleName, permissions, description };
    Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);

    const result = await prisma.role.updateMany({
      where: { id: roleId, tenantId },
      data: updates,
    });

    if (result.count === 1) {
      return prisma.role.findFirst({
        where: { id: roleId, tenantId },
      });
    }
    return { count: result.count };
  }

  static async deleteRole(roleId, tenantId) {
    const result = await prisma.role.deleteMany({
      where: { id: roleId, tenantId },
    });
    return { count: result.count };
  }
}

export default RoleService;
