import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma.js";
import { Prisma } from "@prisma/client";
import { generateOTP } from "../../utils/otpUtils.js";
import { sendSMS } from "../../utils/smsService.js";

const userSelect = {
  id: true,
  email: true,
  userType: true,
  tenantId: true,
  fullName: true,
  phone: true,
  roleId: true,
  otp: true,
  isFirstLogin: true,
  createdAt: true,
  updatedAt: true,
};

class UserService {
  static async createUser(data) {
    try {
      const { email, userType, tenantId, fullName, phone, roleId, otp, isFirstLogin } = data || {};
      const hashedPassword = await bcrypt.hash(data.password, 10);
      return await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          userType,
          tenantId: tenantId ?? null,
          fullName,
          phone,
          roleId,
          otp: otp ?? null,
          isFirstLogin,
        },
        select: userSelect,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new Error("A user with this email already exists.");
      }
      throw error;
    }
  }

  static async getAllUsers(tenantId) {
    try {
      const where = tenantId ? { tenantId } : {};
      return await prisma.user.findMany({
        where,
        select: userSelect,
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      throw new Error(`Failed to fetch users for tenant ID ${tenantId}: ${error.message}`);
    }
  }

  static async getUserById(userId, tenantId) {
    return prisma.user.findFirst({
      where: { id: userId, ...(tenantId ? { tenantId } : {}) },
      select: userSelect,
    });
  }

  static async updateUser(userId, data) {
    const { email, userType, tenantId, fullName, phone, roleId, otp, isFirstLogin } = data || {};
    const updates = { email, userType, fullName, phone, roleId, isFirstLogin };
    if (tenantId !== undefined) updates.tenantId = tenantId;
    if (otp !== undefined) updates.otp = otp;
    Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);

    return prisma.user.update({
      where: { id: userId },
      data: updates,
      select: userSelect,
    });
  }

  static async deleteUser(userId) {
    return prisma.user.delete({
      where: { id: userId },
      select: userSelect,
    });
  }

  static async createCompanyUser(data) {
    const { email, fullName, phone, roleId } = data || {};

    // Check if a company user with this email already exists
    const existing = await prisma.user.findFirst({
      where: { email, userType: "company", tenantId: null },
      select: { id: true },
    });
    if (existing) {
      throw new Error("A company user with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
      data: {
        email,
        fullName,
        phone,
        roleId,
        userType: "company",
        tenantId: null,
        password: hashedPassword,
      },
      select: userSelect,
    });
  }

  static async getAllCompanyUsers() {
    return prisma.user.findMany({
      where: { userType: "company" },
      select: userSelect,
      orderBy: { createdAt: "desc" },
    });
  }

  static async updatePassword(userId, oldPassword, newPassword) {
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

  static async forgetPassword(email, tenantId = null) {
    const user = tenantId
      ? await prisma.user.findUnique({
          where: { user_email_per_tenant: { tenantId, email } },
          select: { id: true, phone: true },
        })
      : await prisma.user.findFirst({
          where: { email, tenantId: null, userType: "company" },
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

  static async resetPasswordWithOTP(email, otp, newPassword, tenantId = null) {
    const user = tenantId
      ? await prisma.user.findUnique({
          where: { user_email_per_tenant: { tenantId, email } },
          select: { id: true, otp: true },
        })
      : await prisma.user.findFirst({
          where: { email, tenantId: null, userType: "company" },
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
