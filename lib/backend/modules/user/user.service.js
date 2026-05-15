// src/modules/users/user.service.js
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma.js";
import { Prisma } from "@prisma/client";
import { generateOTP } from "../../utils/otpUtils.js";
import { sendSMS } from "../../utils/smsService.js";

// ---- mappers -------------------------------------------------
const mapIn = (data = {}) => {
  // Accept snake_case or camelCase, only allow expected fields
  const out = {
    email: data.email,
    password: data.password, // caller decides if plain or hashed (createUser hashes)
    userType: data.userType,
    tenantId: data.tenantId ?? null,
    fullName: data.fullName,
    phone: data.phone,
    roleId: data.roleId,
    otp: data.otp ?? null,
    isFirstLogin: data.isFirstLogin,
  };
  Object.keys(out).forEach((k) => out[k] === undefined && delete out[k]);
  return out;
};

const mapOut = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    userType: row.userType,
    tenantId: row.tenantId,
    fullName: row.fullName,
    phone: row.phone,
    roleId: row.roleId ?? null,
    otp: row.otp ?? null,
    isFirstLogin: row.isFirstLogin,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
};

const mapMany = (rows) => rows.map(mapOut);

// ---- service -------------------------------------------------
class UserService {
  static async createUser(data) {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const created = await prisma.user.create({
        data: { ...mapIn(data), password: hashedPassword },
        select: {
          id: true, email: true, userType: true, tenantId: true,
          fullName: true, phone: true, roleId: true, otp: true,
          isFirstLogin: true, createdAt: true, updatedAt: true
        },
      });
      return mapOut(created);
    } catch (error) {
      // Unique constraint (e.g., email)
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        const field = Array.isArray(error.meta?.target) ? error.meta.target[0] : "field";
        throw new Error(`A user with this ${field} already exists.`);
      }
      throw error;
    }
  }

  static async getAllUsers(tenantId) {
    try {
      const where = tenantId ? { tenantId } : {};
      const users = await prisma.user.findMany({
        where,
        select: {
          id: true, email: true, userType: true, tenantId: true,
          fullName: true, phone: true, roleId: true, otp: true,
          isFirstLogin: true, createdAt: true, updatedAt: true
        },
        orderBy: { createdAt: "desc" },
      });
      return mapMany(users);
    } catch (error) {
      throw new Error(`Failed to fetch users for tenant ID ${tenantId}: ${error.message}`);
    }
  }

  static async getUserById(userId, tenantId) {
    // Sequelize had findByPk with where; emulate with findFirst scoped by tenant
    const user = await prisma.user.findFirst({
      where: { id: userId, ...(tenantId ? { tenantId } : {}) },
      select: {
        id: true, email: true, userType: true, tenantId: true,
        fullName: true, phone: true, roleId: true, otp: true,
        isFirstLogin: true, createdAt: true, updatedAt: true
      },
    });
    return mapOut(user);
  }

  static async updateUser(userId, data) {
    // Keep parity: no auto-hash here; use updatePassword for password changes
    const updated = await prisma.user.update({
      where: { id: userId },
      data: mapIn(data),
      select: {
        id: true, email: true, userType: true, tenantId: true,
        fullName: true, phone: true, roleId: true, otp: true,
        isFirstLogin: true, createdAt: true, updatedAt: true
      },
    });
    return mapOut(updated);
  }

  static async deleteUser(userId) {
    const deleted = await prisma.user.delete({
      where: { id: userId },
      select: {
        id: true, email: true, userType: true, tenantId: true,
        fullName: true, phone: true, roleId: true, otp: true,
        isFirstLogin: true, createdAt: true, updatedAt: true
      },
    });
    return mapOut(deleted);
  }

  static async createCompanyUser(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const created = await prisma.user.create({
      data: {
        ...mapIn(data),
        userType: "company",
        tenantId: null,
        password: hashedPassword,
      },
      select: {
        id: true, email: true, userType: true, tenantId: true,
        fullName: true, phone: true, roleId: true, otp: true,
        isFirstLogin: true, createdAt: true, updatedAt: true
      },
    });
    return mapOut(created);
  }

  static async getAllCompanyUsers() {
    const rows = await prisma.user.findMany({
      where: { userType: "company" },
      select: {
        id: true, email: true, userType: true, tenantId: true,
        fullName: true, phone: true, roleId: true, otp: true,
        isFirstLogin: true, createdAt: true, updatedAt: true
      },
      orderBy: { createdAt: "desc" },
    });
    return mapMany(rows);
  }

  static async updatePassword(userId, oldPassword, newPassword) {
    // Fetch with password included
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true },
    });

    if (!user) throw new Error("User not found.");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error("Old password is incorrect.");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: "Password updated successfully." };
  }

  static async forgetPassword(email) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, phone: true },
    });
    if (!user) throw new Error("User not found.");

    const otp = generateOTP();

    await prisma.user.update({
      where: { id: user.id },
      data: { otp },
    });

    const message = `Your OTP for resetting your password is ${otp}. It is valid for 10 minutes.`;
    await sendSMS(user.phone, message);

    return { message: "OTP sent to your registered phone number." };
  }

  static async resetPasswordWithOTP(email, otp, newPassword) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, otp: true },
    });
    if (!user) throw new Error("User not found.");

    if (user.otp !== otp) throw new Error("Invalid OTP.");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, otp: null },
    });

    return { message: "Password reset successfully." };
  }
}

export default UserService;
