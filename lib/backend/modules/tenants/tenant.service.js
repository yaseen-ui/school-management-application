// src/modules/tenants/tenant.service.js
import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcryptjs";



// Allowlist mapper: request (snake_case) -> Prisma fields
const mapIn = (data = {}) => {
  const out = {
    schoolName: data.school_name ?? data.schoolName,
    contactAddress: data.contact_address ?? data.contactAddress, // JSON
    contactPhone: data.contact_phone ?? data.contactPhone,
    contactEmail: data.contact_email ?? data.contactEmail,
    adminEmail: data.admin_email ?? data.adminEmail,
    subscriptionPlan: data.subscription_plan ?? data.subscriptionPlan,
    domain: data.domain,
    logo: data.logo,
    caption: data.caption,
  };
  Object.keys(out).forEach((k) => out[k] === undefined && delete out[k]);
  return out;
};

class TenantService {
  static async createTenant(data) {
    // Ignore any tenant_id provided by caller; Prisma will generate uuid
    const { tenant_id: _ignored, ...rest } = data || {};
    return prisma.tenant.create({ data: mapIn(rest) });
  }

  static async getAllTenants() {
    return prisma.tenant.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async getTenantById(tenantId) {
    return prisma.tenant.findUnique({ where: { id: tenantId } });
  }

  static async updateTenant(tenantId, data) {
    // Only mapped fields are updated; unknown keys are ignored
    return prisma.tenant.update({
      where: { id: tenantId },
      data: mapIn(data),
    });
  }

  static async deleteTenant(tenantId) {
    return prisma.tenant.delete({ where: { id: tenantId } });
  }

  static getTenantByDomain = async (domain) => {
    try {
      // domain is UNIQUE in the Prisma schema
      return await prisma.tenant.findUnique({ where: { domain } });
    } catch (error) {
      console.log(error);
      throw new Error("Database error while fetching tenant details");
    }
  };

  static async onboardTenant(data, generatedPassword) {

    return prisma.$transaction(async (tx) => {
  
      const tenant = await tx.tenant.create({
        data: mapIn(data)
      });

      const role = await tx.role.create({
        data: {
          tenantId: tenant.id,
          roleName: "school_super_admin",
          permissions: [
            "manage_users",
            "manage_roles",
            "manage_courses",
            "manage_tenants"
          ],
          description: "Admin role with full access to school management."
        },
      });

      let password = await bcrypt.hash(generatedPassword, 10);
  
      const user = await tx.user.create({
        data: {
          fullName: data.adminFullName ?? data.admin_full_name,
          email: data.adminEmail ?? data.admin_email,
          phone: data.adminPhone ?? data.admin_phone,
          password,
          userType: "tenant",
          tenantId: tenant.id,
          roleId: role.id,
        },
        select: {
          id: true, email: true, userType: true, tenantId: true,
          fullName: true, phone: true, roleId: true, otp: true,
          isFirstLogin: true, createdAt: true, updatedAt: true,
        },
      });

      return tenant;
    });
  }
  
}

export default TenantService;
