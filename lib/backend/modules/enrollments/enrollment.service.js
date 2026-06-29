import { prisma } from "../../lib/prisma.js";

function mapEnrollmentOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    studentId: row.studentId,
    academicYearId: row.academicYearId,
    gradeId: row.gradeId,
    sectionId: row.sectionId,
    rollNumber: row.rollNumber,
    status: row.status,
    joinedAt: row.joinedAt,
    leftAt: row.leftAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    student: row.student
      ? {
          id: row.student.id,
          firstName: row.student.firstName,
          lastName: row.student.lastName,
        }
      : null,
    section: row.section
      ? {
          id: row.section.id,
          sectionName: row.section.sectionName,
        }
      : null,
    academicYear: row.academicYear
      ? {
          id: row.academicYear.id,
          name: row.academicYear.name,
        }
      : null,
    grade: row.grade
      ? {
          id: row.grade.id,
          gradeName: row.grade.gradeName,
        }
      : null,
  };
}

async function getAllEnrollments(tenantId, filters = {}) {
  const where = { tenantId };
  if (filters.sectionId) where.sectionId = filters.sectionId;
  if (filters.academicYearId) where.academicYearId = filters.academicYearId;
  if (filters.gradeId) where.gradeId = filters.gradeId;
  if (filters.status) where.status = filters.status;

  const enrollments = await prisma.studentEnrollment.findMany({
    where,
    include: {
      student: true,
      section: true,
      academicYear: true,
      grade: true,
    },
    orderBy: [{ rollNumber: "asc" }],
  });
  return enrollments.map(mapEnrollmentOut);
}

export default {
  getAllEnrollments,
};
