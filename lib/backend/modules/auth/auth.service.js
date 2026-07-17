// src/modules/auth/auth.service.js  (Prisma version — RBAC v2)
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { prisma } from "../../lib/prisma.js";

dotenv.config();

class AuthService {
  static async login(email, password, tenantId = null) {
    try {
      // User.email is unique per tenant (see schema @@unique([tenantId, email])).
      // - Tenant subdomain login: x-tenant-id header is set, look up via composite key.
      // - Company login (admin host): no header, find the company-scoped row (tenantId IS NULL).
      //
      // RBAC v2: Fetch userRoles (many-to-many) instead of old role (one-to-one).
      const userSelect = {
        id: true,
        email: true,
        password: true,
        userType: true,
        tenantId: true,
        fullName: true,
        permVersion: true,
        userRoles: {
          select: {
            roleId: true,
            role: {
              select: { id: true, roleName: true },
            },
          },
        },
      };

      let user = null;

      if (tenantId) {
        // First try tenant-scoped lookup
        user = await prisma.user.findUnique({
          where: { user_email_per_tenant: { tenantId, email } },
          select: userSelect,
        });
        // If no tenant user found, fall back to company-level user
        // (e.g., admin logging in from a tenant subdomain with x-tenant-id set)
        if (!user) {
          user = await prisma.user.findFirst({
            where: { email, tenantId: null, userType: "company" },
            select: userSelect,
          });
        }
      } else {
        user = await prisma.user.findFirst({
          where: { email, tenantId: null, userType: "company" },
          select: userSelect,
        });
      }

      if (!user) {
        throw new Error("Invalid email or password.");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid email or password.");
      }

      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
      }

      // RBAC v2: JWT carries lightweight identity only.
      // Permissions are resolved server-side on every request.
      const roleIds = user.userRoles?.map((ur) => ur.roleId) ?? [];

      const tokenPayload = {
        userId: user.id,
        email: user.email,                    // Lightweight identity
        userType: user.userType,
        tenantId: user.tenantId,
        roleIds,
        permVersion: user.permVersion ?? 0,
      };

      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
        expiresIn: "24400h",
      });

      // Return full authorization context for frontend
      const roles = user.userRoles?.map((ur) => ({
        id: ur.roleId,
        name: ur.role?.roleName ?? 'Unknown',
      })) ?? [];

      const sanitizedUser = {
        userId: user.id,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType,
        tenantId: user.tenantId,
        roles,                                 // NEW: multiple roles
        permVersion: user.permVersion ?? 0,    // NEW
      };

      return { token, user: sanitizedUser };
    } catch (error) {
      console.error("Error during login:", error.message);
      throw error;
    }
  }
}

export default AuthService;
