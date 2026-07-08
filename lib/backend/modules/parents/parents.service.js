import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcryptjs";

// Mapper for Parent output
function mapParentOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    userId: row.userId,
    fullName: row.fullName,
    phone: row.phone,
    email: row.email,
    relation: row.relation,
    aadhaarNumber: row.aadhaarNumber,
    occupation: row.occupation,
    isRegistered: row.isRegistered,
    status: row.status,
    students: row.students
      ? row.students.map((sp) => ({
          id: sp.student.id,
          firstName: sp.student.firstName,
          lastName: sp.student.lastName,
          admissionNumber: sp.student.admissionNumber,
          gradeName: sp.student.grade?.gradeName,
          sectionName: sp.student.section?.sectionName,
          isPrimary: sp.isPrimary,
        }))
      : [],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

// Mapper for invite token response (public)
function mapInviteOut(row) {
  if (!row) return null;

  // Determine which mandatory fields are missing for registration
  const missingFields = [];
  if (!row.email) missingFields.push("email");

  return {
    fullName: row.fullName,
    phone: row.phone || "",
    email: row.email || "",
    relation: row.relation,
    missingFields,
  };
}

export default {
  // ─── Admin: Send invitation ────────────────────────────────────────────────
  async sendInvite(parentId, tenantId) {
    const parent = await prisma.parent.findUnique({
      where: { id: parentId, tenantId },
    });

    if (!parent) {
      throw new Error("Parent not found.");
    }

    if (parent.isRegistered) {
      throw new Error("Parent is already registered.");
    }

    // Generate a secure registration token (UUID)
    const crypto = await import("crypto");
    const token = crypto.randomUUID();

    // Token expires in 72 hours
    const tokenExp = new Date(Date.now() + 72 * 60 * 60 * 1000);

    await prisma.parent.update({
      where: { id: parentId, tenantId },
      data: {
        registrationToken: token,
        registrationTokenExp: tokenExp,
      },
    });

    // TODO: Integrate with SMS/email service to send the invite link
    // For now, just return the token so it can be shared manually
    return {
      parentId: parent.id,
      parentName: parent.fullName,
      phone: parent.phone,
      email: parent.email,
      token,
      tokenExpiresAt: tokenExp,
      inviteLink: `${process.env.APP_URL || "http://localhost:3000"}/parent-register?token=${token}`,
    };
  },

  // ─── Public: Validate invite token ──────────────────────────────────────────
  async validateInviteToken(token) {
    if (!token) {
      throw new Error("Token is required.");
    }

    const parent = await prisma.parent.findFirst({
      where: { registrationToken: token },
    });

    if (!parent) {
      throw new Error("Invalid or expired registration link.");
    }

    if (parent.isRegistered) {
      throw new Error("This parent has already registered.");
    }

    if (
      parent.registrationTokenExp &&
      new Date() > parent.registrationTokenExp
    ) {
      throw new Error("Registration link has expired. Please request a new one.");
    }

    return mapInviteOut(parent);
  },

  // ─── Public: Complete registration ──────────────────────────────────────────
  async registerParent({ token, email, phone, password }) {
    if (!token) {
      throw new Error("Registration token is required.");
    }
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }

    const parent = await prisma.parent.findFirst({
      where: { registrationToken: token },
    });

    if (!parent) {
      throw new Error("Invalid or expired registration link.");
    }

    if (parent.isRegistered) {
      throw new Error("This parent has already registered.");
    }

    if (
      parent.registrationTokenExp &&
      new Date() > parent.registrationTokenExp
    ) {
      throw new Error("Registration link has expired. Please request a new one.");
    }

    // Use provided email or fall back to the email on the parent record
    const userEmail = email || parent.email;
    if (!userEmail) {
      throw new Error("Email is required to complete registration.");
    }

    // Use provided phone or fall back to the one on the parent record
    const userPhone = phone || parent.phone;

    // Check if a user with this email already exists for this tenant
    const existingUser = await prisma.user.findFirst({
      where: {
        tenantId: parent.tenantId,
        email: userEmail,
      },
    });

    if (existingUser) {
      throw new Error("An account with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user and link to parent in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          tenantId: parent.tenantId,
          fullName: parent.fullName,
          email: userEmail,
          phone: userPhone,
          password: hashedPassword,
          isFirstLogin: false,
        },
      });

      // Also update the parent record with any newly provided details
      const parentUpdateData = {
        userId: user.id,
        isRegistered: true,
        registrationToken: null,
        registrationTokenExp: null,
      };
      if (email && !parent.email) {
        parentUpdateData.email = email;
      }
      if (phone && !parent.phone) {
        parentUpdateData.phone = phone;
      }

      const updatedParent = await tx.parent.update({
        where: { id: parent.id, tenantId: parent.tenantId },
        data: parentUpdateData,
        include: {
          students: {
            include: {
              student: {
                include: {
                  grade: true,
                  section: true,
                },
              },
            },
          },
        },
      });

      return { user, parent: updatedParent };
    });

    return {
      message: "Registration successful. Please sign in with your email and password.",
      email: userEmail,
      parent: mapParentOut(result.parent),
    };
  },

  // ─── Admin: Get all parents (with registration status) ──────────────────────
  async getAllParents(tenantId) {
    const parents = await prisma.parent.findMany({
      where: { tenantId, deletedAt: null },
      include: {
        students: {
          include: {
            student: {
              include: {
                grade: true,
                section: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return parents.map(mapParentOut);
  },

  // ─── Admin: Get single parent ───────────────────────────────────────────────
  async getParentById(parentId, tenantId) {
    const parent = await prisma.parent.findFirst({
      where: { id: parentId, tenantId, deletedAt: null },
      include: {
        students: {
          include: {
            student: {
              include: {
                grade: true,
                section: true,
              },
            },
          },
        },
      },
    });

    return mapParentOut(parent);
  },
};