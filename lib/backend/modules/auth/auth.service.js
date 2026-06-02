// src/modules/auth/auth.service.js  (Prisma version)
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
      const userSelect = {
        id: true,
        email: true,
        password: true,
        userType: true,
        tenantId: true,
        role: {
          select: {
            id: true,
            roleName: true,
            permissions: true,
          },
        },
      };

      const user = tenantId
        ? await prisma.user.findUnique({
            where: { user_email_per_tenant: { tenantId, email } },
            select: userSelect,
          })
        : await prisma.user.findFirst({
            where: { email, tenantId: null, userType: "company" },
            select: userSelect,
          });

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

      // Keep JWT payload keys in camelCase
      const userInfo = {
        userId: user.id,
        userType: user.userType,
        tenantId: user.tenantId,
        role: user.role, // { id, roleName, permissions } or null
      };

      const token = jwt.sign(userInfo, process.env.JWT_SECRET, {
        expiresIn: "24400h",
      });

      // Sanitize user for response (no password)
      const sanitizedUser = {
        userId: user.id,
        email: user.email,
        userType: user.userType,
        tenantId: user.tenantId,
        role: user.role,
      };

      return { token, user: sanitizedUser };
    } catch (error) {
      console.error("Error during login:", error.message);
      throw error;
    }
  }
}

export default AuthService;
