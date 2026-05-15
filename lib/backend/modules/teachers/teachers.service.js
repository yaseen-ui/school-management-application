import { prisma } from "../../lib/prisma.js";

// Mapper for Teacher base data
function mapTeacherIn(data = {}, tenantId) {
  const out = { tenantId };

  // Handle optional fields
  if (data.fullName !== undefined) out.fullName = data.fullName;
  if (data.email !== undefined) out.email = data.email;
  if (data.phone !== undefined) out.phone = data.phone;
  if (data.gender !== undefined) out.gender = data.gender;
  if (data.employeeCode !== undefined) out.employeeCode = data.employeeCode;
  if (data.userId !== undefined) out.userId = data.userId;
  if (data.profilePhotoUrl !== undefined) out.profilePhotoUrl = data.profilePhotoUrl;
  if (data.yearsOfExperience !== undefined) out.yearsOfExperience = data.yearsOfExperience;

  return out;
}

// Mapper for Teacher output
function mapTeacherOut(row) {
  if (!row) return null;

  return {
    id: row.id,
    tenantId: row.tenantId,
    userId: row.userId,
    fullName: row.fullName,
    email: row.email,
    phone: row.phone,
    gender: row.gender,
    employeeCode: row.employeeCode,
    profilePhotoUrl: row.profilePhotoUrl,
    yearsOfExperience: row.yearsOfExperience,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    qualifications: row.qualifications ? row.qualifications.map(mapQualificationOut) : [],
    employmentHistory: row.employmentHistory ? row.employmentHistory.map(mapEmploymentHistoryOut) : [],
  };
}

// Mapper for Teacher with user info
function mapTeacherWithUserOut(row) {
  if (!row) return null;

  const base = mapTeacherOut(row);
  return {
    ...base,
    user: row.user ? {
      id: row.user.id,
      fullName: row.user.fullName,
      email: row.user.email,
    } : null,
  };
}

// Mapper for TeacherQualification
function mapQualificationIn(data = {}, tenantId, teacherId) {
  const out = { tenantId, teacherId };

  if (data.qualificationName !== undefined) out.qualificationName = data.qualificationName;
  if (data.specialization !== undefined) out.specialization = data.specialization;
  if (data.institution !== undefined) out.institution = data.institution;
  if (data.score !== undefined) out.score = data.score;
  if (data.yearOfPassing !== undefined) out.yearOfPassing = data.yearOfPassing;
  if (data.documentUrl !== undefined) out.documentUrl = data.documentUrl;

  return out;
}

function mapQualificationOut(row) {
  if (!row) return null;

  return {
    id: row.id,
    tenantId: row.tenantId,
    teacherId: row.teacherId,
    qualificationName: row.qualificationName,
    specialization: row.specialization,
    institution: row.institution,
    score: row.score,
    yearOfPassing: row.yearOfPassing,
    documentUrl: row.documentUrl,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

// Mapper for TeacherEmploymentHistory
function mapEmploymentHistoryIn(data = {}, tenantId, teacherId) {
  const out = { tenantId, teacherId };

  if (data.organizationName !== undefined) out.organizationName = data.organizationName;
  if (data.role !== undefined) out.role = data.role;
  if (data.startDate !== undefined) {
    out.startDate = data.startDate ? new Date(data.startDate) : null;
  }
  if (data.endDate !== undefined) {
    out.endDate = data.endDate ? new Date(data.endDate) : null;
  }
  if (data.reasonForLeaving !== undefined) out.reasonForLeaving = data.reasonForLeaving;
  if (data.experienceYears !== undefined) out.experienceYears = data.experienceYears;

  return out;
}

function mapEmploymentHistoryOut(row) {
  if (!row) return null;

  return {
    id: row.id,
    tenantId: row.tenantId,
    teacherId: row.teacherId,
    organizationName: row.organizationName,
    role: row.role,
    startDate: row.startDate,
    endDate: row.endDate,
    reasonForLeaving: row.reasonForLeaving,
    experienceYears: row.experienceYears,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

class TeachersService {
  // ==================== TEACHER CRUD ====================

  async createTeacher(data, tenantId) {
    if (!data?.fullName) {
      throw new Error("fullName is required to create a teacher.");
    }

    // Check for duplicate employeeCode if provided
    if (data.employeeCode) {
      const existing = await prisma.teacher.findFirst({
        where: {
          tenantId,
          employeeCode: data.employeeCode,
        },
      });
      if (existing) {
        throw new Error(`Teacher with employeeCode '${data.employeeCode}' already exists in this tenant.`);
      }
    }

    const toCreate = mapTeacherIn(data, tenantId);
    const created = await prisma.teacher.create({
      data: toCreate,
      include: {
        qualifications: true,
        employmentHistory: true,
        user: { select: { id: true, fullName: true, email: true } },
      },
    });

    return mapTeacherWithUserOut(created);
  }

  async getTeacherById(id, tenantId) {
    const row = await prisma.teacher.findFirst({
      where: { id, tenantId },
      include: {
        qualifications: true,
        employmentHistory: true,
        user: { select: { id: true, fullName: true, email: true } },
      },
    });
    return mapTeacherWithUserOut(row);
  }

  async getAllTeachers(tenantId) {
    const rows = await prisma.teacher.findMany({
      where: { tenantId },
      include: {
        qualifications: true,
        employmentHistory: true,
        user: { select: { id: true, fullName: true, email: true } },
      },
      orderBy: [{ createdAt: "desc" }],
    });
    return rows.map(mapTeacherWithUserOut);
  }

  async updateTeacher(id, data, tenantId) {
    // Verify teacher exists
    const existing = await prisma.teacher.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return null;

    // Check for duplicate employeeCode if being updated
    if (data.employeeCode && data.employeeCode !== existing.employeeCode) {
      const duplicate = await prisma.teacher.findFirst({
        where: {
          tenantId,
          employeeCode: data.employeeCode,
          id: { not: id },
        },
      });
      if (duplicate) {
        throw new Error(`Teacher with employeeCode '${data.employeeCode}' already exists.`);
      }
    }

    const toUpdate = mapTeacherIn(data, tenantId);
    delete toUpdate.tenantId; // Don't update tenantId

    await prisma.teacher.update({
      where: { id },
      data: toUpdate,
    });

    return this.getTeacherById(id, tenantId);
  }

  async deleteTeacher(id, tenantId) {
    const existing = await prisma.teacher.findFirst({
      where: { id, tenantId },
      include: {
        qualifications: true,
        employmentHistory: true,
        user: { select: { id: true, fullName: true, email: true } },
      },
    });
    if (!existing) return null;

    await prisma.teacher.delete({
      where: { id },
    });

    return mapTeacherWithUserOut(existing);
  }

  // ==================== QUALIFICATIONS ====================

  async addQualification(teacherId, data, tenantId) {
    // Verify teacher exists
    const teacher = await prisma.teacher.findFirst({
      where: { id: teacherId, tenantId },
    });
    if (!teacher) {
      throw new Error("Teacher not found.");
    }

    if (!data?.qualificationName) {
      throw new Error("qualificationName is required.");
    }

    const toCreate = mapQualificationIn(data, tenantId, teacherId);
    const created = await prisma.teacherQualification.create({
      data: toCreate,
    });

    return mapQualificationOut(created);
  }

  async getQualificationById(id, tenantId) {
    const row = await prisma.teacherQualification.findFirst({
      where: { id, tenantId },
    });
    return mapQualificationOut(row);
  }

  async getQualificationsByTeacher(teacherId, tenantId) {
    const rows = await prisma.teacherQualification.findMany({
      where: { teacherId, tenantId },
      orderBy: [{ createdAt: "desc" }],
    });
    return rows.map(mapQualificationOut);
  }

  async updateQualification(id, data, tenantId) {
    const existing = await prisma.teacherQualification.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return null;

    const toUpdate = mapQualificationIn(data, tenantId, existing.teacherId);
    delete toUpdate.tenantId;
    delete toUpdate.teacherId;

    Object.keys(toUpdate).forEach((k) => toUpdate[k] === undefined && delete toUpdate[k]);

    await prisma.teacherQualification.update({
      where: { id },
      data: toUpdate,
    });

    return this.getQualificationById(id, tenantId);
  }

  async deleteQualification(id, tenantId) {
    const existing = await prisma.teacherQualification.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return null;

    await prisma.teacherQualification.delete({
      where: { id },
    });

    return mapQualificationOut(existing);
  }

  // ==================== EMPLOYMENT HISTORY ====================

  async addEmploymentHistory(teacherId, data, tenantId) {
    // Verify teacher exists
    const teacher = await prisma.teacher.findFirst({
      where: { id: teacherId, tenantId },
    });
    if (!teacher) {
      throw new Error("Teacher not found.");
    }

    if (!data?.organizationName || !data?.role) {
      throw new Error("organizationName and role are required.");
    }

    const toCreate = mapEmploymentHistoryIn(data, tenantId, teacherId);
    const created = await prisma.teacherEmploymentHistory.create({
      data: toCreate,
    });

    return mapEmploymentHistoryOut(created);
  }

  async getEmploymentHistoryById(id, tenantId) {
    const row = await prisma.teacherEmploymentHistory.findFirst({
      where: { id, tenantId },
    });
    return mapEmploymentHistoryOut(row);
  }

  async getEmploymentHistoryByTeacher(teacherId, tenantId) {
    const rows = await prisma.teacherEmploymentHistory.findMany({
      where: { teacherId, tenantId },
      orderBy: [{ createdAt: "desc" }],
    });
    return rows.map(mapEmploymentHistoryOut);
  }

  async updateEmploymentHistory(id, data, tenantId) {
    const existing = await prisma.teacherEmploymentHistory.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return null;

    const toUpdate = mapEmploymentHistoryIn(data, tenantId, existing.teacherId);
    delete toUpdate.tenantId;
    delete toUpdate.teacherId;

    Object.keys(toUpdate).forEach((k) => toUpdate[k] === undefined && delete toUpdate[k]);

    await prisma.teacherEmploymentHistory.update({
      where: { id },
      data: toUpdate,
    });

    return this.getEmploymentHistoryById(id, tenantId);
  }

  async deleteEmploymentHistory(id, tenantId) {
    const existing = await prisma.teacherEmploymentHistory.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return null;

    await prisma.teacherEmploymentHistory.delete({
      where: { id },
    });

    return mapEmploymentHistoryOut(existing);
  }
}

export default new TeachersService();
