import { prisma } from "../../lib/prisma.js";

const sectionInclude = {
  grade: { select: { gradeName: true, courseId: true } },
  sectionSubjects: {
    include: {
      subject: true,
    },
  },
  room: {
    include: {
      floor: {
        include: {
          building: true,
        },
      },
    },
  },
  sectionInCharge: {
    select: {
      id: true,
      fullName: true,
      employeeCode: true,
    },
  },
};

class SectionsService {
  async createSection(data, tenantId) {
    const { gradeId, sectionName, roomId, sectionInChargeId } = data || {};

    if (!gradeId) {
      throw new Error("gradeId is required to create a section.");
    }

    const duplicate = await prisma.section.findFirst({
      where: { tenantId, gradeId, sectionName },
      select: { id: true },
    });
    if (duplicate) {
      const grade = await prisma.grade.findUnique({
        where: { id: gradeId },
        select: { gradeName: true },
      });
      throw new Error(
        `Section with the name '${sectionName}' already exists for grade '${grade ? grade.gradeName : "Unknown Grade"}'.`
      );
    }

    const created = await prisma.section.create({
      data: { tenantId, gradeId, sectionName, roomId: roomId || null, sectionInChargeId: sectionInChargeId || null },
    });

    return prisma.section.findFirst({
      where: { id: created.id, tenantId },
      include: sectionInclude,
    });
  }

  async getSections(tenantId, gradeId, courseId) {
    const where = { tenantId };
    if (gradeId) {
      where.gradeId = gradeId;
    } else if (courseId) {
      where.grade = { courseId };
    }

    return prisma.section.findMany({
      where,
      include: sectionInclude,
      orderBy: [{ createdAt: "desc" }],
    });
  }

  async getSectionById(sectionId, tenantId) {
    const section = await prisma.section.findFirst({
      where: { id: sectionId, tenantId },
      include: sectionInclude,
    });

    if (!section) {
      throw new Error("Section not found or unauthorized");
    }

    return section;
  }

  async updateSection(sectionId, data, tenantId) {
    const existing = await prisma.section.findFirst({
      where: { id: sectionId, tenantId },
      select: { id: true, sectionName: true, gradeId: true },
    });
    if (!existing) throw new Error("Section not found or unauthorized");

    const { sectionName, roomId, sectionInChargeId } = data || {};
    if (sectionName && sectionName !== existing.sectionName) {
      const dup = await prisma.section.findFirst({
        where: {
          tenantId,
          gradeId: existing.gradeId,
          sectionName,
          NOT: { id: sectionId },
        },
        select: { id: true },
      });
      if (dup) {
        throw new Error(
          `Section with the name '${sectionName}' already exists for this grade.`
        );
      }
    }

    const updates = {};
    if (sectionName !== undefined) updates.sectionName = sectionName;
    if (roomId !== undefined) updates.roomId = roomId || null;
    if (sectionInChargeId !== undefined) updates.sectionInChargeId = sectionInChargeId || null;

    await prisma.section.update({
      where: { id: sectionId },
      data: updates,
    });

    return prisma.section.findFirst({
      where: { id: sectionId, tenantId },
      include: sectionInclude,
    });
  }

  async deleteSection(sectionId, tenantId) {
    const existing = await prisma.section.findFirst({
      where: { id: sectionId, tenantId },
      select: { id: true },
    });
    if (!existing) throw new Error("Section not found or unauthorized");

    await prisma.section.delete({ where: { id: sectionId } });
    return { success: true };
  }

  async generateRollNumbers(sectionId, tenantId) {
    const section = await prisma.section.findFirst({
      where: { id: sectionId, tenantId },
      select: { id: true, sectionName: true },
    });
    if (!section) throw new Error("Section not found or unauthorized");

    // Find active academic year
    const activeYear = await prisma.academicYear.findFirst({
      where: { tenantId, status: "active" },
      select: { id: true, name: true },
    });
    if (!activeYear) throw new Error("No active academic year found. Please activate an academic year first.");

    // Find active enrollments for this section in the active academic year
    const enrollments = await prisma.studentEnrollment.findMany({
      where: {
        tenantId,
        sectionId,
        academicYearId: activeYear.id,
        status: "active",
      },
      include: {
        student: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: [{ student: { firstName: "asc" } }, { student: { lastName: "asc" } }],
    });

    if (enrollments.length === 0) {
      throw new Error("No active students found in this section for the active academic year.");
    }

    // Check if ALL enrollments already have roll numbers
    const allHaveRollNumbers = enrollments.every((e) => e.rollNumber !== null);
    if (allHaveRollNumbers) {
      throw new Error("Roll numbers have already been generated for this section. This action cannot be repeated.");
    }

    // Generate roll numbers sequentially starting from 1
    // Use a transaction to ensure atomicity
    await prisma.$transaction(
      enrollments.map((enrollment, index) =>
        prisma.studentEnrollment.update({
          where: { id: enrollment.id },
          data: { rollNumber: String(index + 1) },
        })
      )
    );

    return {
      success: true,
      count: enrollments.length,
      message: `Roll numbers generated for ${enrollments.length} students in ${section.sectionName}.`,
    };
  }

  async getRollNumbersStatus(sectionId, tenantId) {
    const section = await prisma.section.findFirst({
      where: { id: sectionId, tenantId },
      select: { id: true },
    });
    if (!section) throw new Error("Section not found or unauthorized");

    const activeYear = await prisma.academicYear.findFirst({
      where: { tenantId, status: "active" },
      select: { id: true },
    });

    if (!activeYear) {
      return { generated: false, totalStudents: 0, studentsWithRollNumbers: 0 };
    }

    const enrollments = await prisma.studentEnrollment.findMany({
      where: {
        tenantId,
        sectionId,
        academicYearId: activeYear.id,
        status: "active",
      },
      select: { rollNumber: true },
    });

    const totalStudents = enrollments.length;
    const studentsWithRollNumbers = enrollments.filter((e) => e.rollNumber !== null).length;

    return {
      generated: totalStudents > 0 && totalStudents === studentsWithRollNumbers,
      totalStudents,
      studentsWithRollNumbers,
    };
  }

  async getSectionsWithRollStatus(tenantId, gradeId, courseId) {
    const where = { tenantId };
    if (gradeId) {
      where.gradeId = gradeId;
    } else if (courseId) {
      where.grade = { courseId };
    }

    const sections = await prisma.section.findMany({
      where,
      include: sectionInclude,
      orderBy: [{ createdAt: "desc" }],
    });

    // Fetch active academic year
    const activeYear = await prisma.academicYear.findFirst({
      where: { tenantId, status: "active" },
      select: { id: true },
    });

    if (!activeYear) {
      return sections.map((s) => ({ ...s, rollNumbersGenerated: false }));
    }

    // Batch-fetch all enrollments for these sections
    const sectionIds = sections.map((s) => s.id);
    const enrollments = await prisma.studentEnrollment.findMany({
      where: {
        tenantId,
        sectionId: { in: sectionIds },
        academicYearId: activeYear.id,
        status: "active",
      },
      select: { sectionId: true, rollNumber: true },
    });

    // Group by sectionId
    const rollStatusBySection = {};
    for (const enrollment of enrollments) {
      if (!rollStatusBySection[enrollment.sectionId]) {
        rollStatusBySection[enrollment.sectionId] = { total: 0, withRoll: 0 };
      }
      rollStatusBySection[enrollment.sectionId].total++;
      if (enrollment.rollNumber !== null) {
        rollStatusBySection[enrollment.sectionId].withRoll++;
      }
    }

    return sections.map((s) => {
      const status = rollStatusBySection[s.id];
      const generated = status ? status.total > 0 && status.total === status.withRoll : false;
      return { ...s, rollNumbersGenerated: generated };
    });
  }
}

export default new SectionsService();
