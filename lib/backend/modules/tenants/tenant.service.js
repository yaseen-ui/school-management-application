import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcryptjs";
import { seedDefaultRoles } from "../../rbac/seed-roles.js";

// Pull every linked tenant-admin user (School Admin role) onto each tenant response
// so callers can see admin contact info without a second query.
// RBAC v2: Uses userRoles (many-to-many) to find users with the "School Admin" role.
const tenantInclude = {
  users: {
    where: {
      userRoles: { some: { role: { roleName: "School Admin" } } },
    },
    select: { id: true, fullName: true, email: true, phone: true },
    orderBy: { createdAt: "asc" },
  },
};

class TenantService {
  static async createTenant(data) {
    const {
      schoolName,
      contactAddress,
      contactPhone,
      contactEmail,
      subscriptionPlan,
      domain,
      logo,
      caption,
    } = data || {};

    return prisma.tenant.create({
      data: {
        schoolName,
        contactAddress,
        contactPhone,
        contactEmail,
        subscriptionPlan,
        domain,
        logo,
        caption,
      },
      include: tenantInclude,
    });
  }

  static async getAllTenants() {
    return prisma.tenant.findMany({
      orderBy: { createdAt: "desc" },
      include: tenantInclude,
    });
  }

  static async getTenantById(tenantId) {
    return prisma.tenant.findUnique({
      where: { id: tenantId },
      include: tenantInclude,
    });
  }

  static async updateTenant(tenantId, data) {
    const {
      schoolName,
      contactAddress,
      contactPhone,
      contactEmail,
      subscriptionPlan,
      domain,
      logo,
      caption,
    } = data || {};

    const updates = {
      schoolName,
      contactAddress,
      contactPhone,
      contactEmail,
      subscriptionPlan,
      domain,
      logo,
      caption,
    };
    Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);

    return prisma.tenant.update({
      where: { id: tenantId },
      data: updates,
      include: tenantInclude,
    });
  }

  static async deleteTenant(tenantId) {
    return prisma.tenant.delete({ where: { id: tenantId } });
  }

  static getTenantByDomain = async (domain) => {
    try {
      return await prisma.tenant.findUnique({ where: { domain } });
    } catch (error) {
      console.log(error);
      throw new Error("Database error while fetching tenant details");
    }
  };

  static async onboardTenant(data, generatedPassword) {
    const tenantId = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          schoolName: data.schoolName,
          contactAddress: data.contactAddress,
          contactPhone: data.contactPhone,
          contactEmail: data.contactEmail,
          subscriptionPlan: data.subscriptionPlan,
          domain: data.domain,
          logo: data.logo,
          caption: data.caption,
        },
      });

      // generatedPassword arrives as plain text from the controller (used for SMS);
      // we hash it here so only the bcrypt digest is persisted.
      const password = await bcrypt.hash(generatedPassword, 10);

      // Create the initial admin user. Role assignment happens after seeding
      // (seedDefaultRoles runs outside the transaction because it uses raw SQL).
      await tx.user.create({
        data: {
          fullName: data.adminFullName,
          email: data.adminEmail,
          phone: data.adminPhone,
          password,
          userType: "tenant",
          tenantId: tenant.id,
        },
      });

      return tenant.id;
    });

    // Seed default roles, permissions, and groups for the new tenant.
    // This is done outside the transaction because the seeder uses raw SQL
    // ($executeRawUnsafe) which doesn't participate in interactive transactions.
    // The tenant and user are already committed, so this is safe.
    try {
      await seedDefaultRoles(tenantId);

      // Assign the "School Admin" role to the newly created admin user.
      const adminUser = await prisma.user.findFirst({
        where: { tenantId, email: data.adminEmail },
        select: { id: true },
      });

      const adminRole = await prisma.role.findUnique({
        where: { uniqueRoleNamePerTenant: { tenantId, roleName: "School Admin" } },
        select: { id: true },
      });

      if (adminUser && adminRole) {
        await prisma.userRole.create({
          data: {
            userId: adminUser.id,
            roleId: adminRole.id,
            tenantId,
          },
        });
      }
    } catch (error) {
      console.error(`[TenantService] Failed to seed roles for tenant ${tenantId}:`, error.message);
      // Don't fail the whole operation — tenant is created, roles can be seeded manually
    }

    // Re-fetch outside the transaction so the response includes the admin user.
    return prisma.tenant.findUnique({
      where: { id: tenantId },
      include: tenantInclude,
    });
  }
}

export default TenantService;
