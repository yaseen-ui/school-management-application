import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcryptjs";

// Pull every linked tenant-admin user (school_super_admin) onto each tenant response
// so callers can see admin contact info without a second query.
// A tenant can have multiple users sharing this role (see Role @@unique + User.roleId
// many-to-one), so we return them all and let the consumer decide how to render.
const tenantInclude = {
  users: {
    where: { role: { roleName: "school_super_admin" } },
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

      const role = await tx.role.create({
        data: {
          tenantId: tenant.id,
          roleName: "school_super_admin",
          permissions: [
            "manage_users",
            "manage_roles",
            "manage_courses",
            "manage_tenants",
          ],
          description: "Admin role with full access to school management.",
        },
      });

      // generatedPassword arrives as plain text from the controller (used for SMS);
      // we hash it here so only the bcrypt digest is persisted.
      const password = await bcrypt.hash(generatedPassword, 10);

      await tx.user.create({
        data: {
          fullName: data.adminFullName,
          email: data.adminEmail,
          phone: data.adminPhone,
          password,
          userType: "tenant",
          tenantId: tenant.id,
          roleId: role.id,
        },
      });

      return tenant.id;
    });

    // Re-fetch outside the transaction so the response includes the admin user.
    return prisma.tenant.findUnique({
      where: { id: tenantId },
      include: tenantInclude,
    });
  }
}

export default TenantService;
