import { prisma } from "../../lib/prisma.js";

function mapStudentIn(data = {}, tenantId) {
  const out = { tenantId };
  
  // Normalize dates if given as string
  if (data.dateOfBirth && typeof data.dateOfBirth === "string") {
    data.dateOfBirth = new Date(data.dateOfBirth);
  }
  if (data.dateOfIssueTC && typeof data.dateOfIssueTC === "string") {
    data.dateOfIssueTC = new Date(data.dateOfIssueTC);
  }
  
  return { ...out, ...data };
}

// shape response like your Sequelize include used to provide
function mapStudentOut(row) {
  if (!row) return null;

  const base = {
    id: row.id,
    tenantId: row.tenantId,

    firstName: row.firstName,
    middleName: row.middleName,
    lastName: row.lastName,
    dateOfBirth: row.dateOfBirth,
    gender: row.gender,

    aadhaarNumber: row.aadhaarNumber,
    casteCategory: row.casteCategory,
    subCaste: row.subCaste,
    religion: row.religion,
    motherTongue: row.motherTongue,
    bloodGroup: row.bloodGroup,
    nationality: row.nationality,
    identificationMarks: row.identificationMarks,

    classApplyingFor: row.classApplyingFor,
    mediumOfInstruction: row.mediumOfInstruction,
    previousSchoolName: row.previousSchoolName,
    previousClassAttended: row.previousClassAttended,
    transferCertificateNo: row.transferCertificateNo,
    dateOfIssueTC: row.dateOfIssueTC,
    modeOfTransport: row.modeOfTransport,

    fatherName: row.fatherName,
    fatherOccupation: row.fatherOccupation,
    fatherPhone: row.fatherPhone,
    fatherAadhaar: row.fatherAadhaar,
    motherName: row.motherName,
    motherOccupation: row.motherOccupation,
    motherPhone: row.motherPhone,
    motherAadhaar: row.motherAadhaar,
    guardianName: row.guardianName,
    guardianRelation: row.guardianRelation,
    guardianContact: row.guardianContact,

    feePaymentMode: row.feePaymentMode,
    bankAccountDetails: row.bankAccountDetails,
    midDayMealEligibility: row.midDayMealEligibility,

    permanentAddress: row.permanentAddress,
    state: row.state,
    pincode: row.pincode,

    gradeId: row.gradeId,
    sectionId: row.sectionId,

    studentPassportPhoto: row.studentPassportPhoto,
    motherPassportPhoto: row.motherPassportPhoto,
    fatherPassportPhoto: row.fatherPassportPhoto,
    guardianPassportPhoto: row.guardianPassportPhoto,
    studentAadharCopy: row.studentAadharCopy,
    parentsAadharCopy: row.parentsAadharCopy,
    casteCertificateCopy: row.casteCertificateCopy,
    birthCertificateCopy: row.birthCertificateCopy,
    tcCopy: row.tcCopy,
    conductCertificateCopy: row.conductCertificateCopy,
    previousYearsMarksheetCopy: row.previousYearsMarksheetCopy,
    incomeCertificateCopy: row.incomeCertificateCopy,

    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };

  // emulate your Sequelize include aliases/attributes
  const course = row.grade?.course
    ? {
        courseId: row.grade.course.id,
        name: row.grade.course.courseName,
      }
    : null;

  const grade = row.grade
    ? {
        gradeId: row.grade.id,
        name: row.grade.gradeName,
      }
    : null;

  const section = row.section
    ? {
        sectionId: row.section.id,
        name: row.section.sectionName,
      }
    : null;

  return {
    ...base,
    course,
    grade,
    section,
  };
}

class StudentService {
  /**
   * Create a new student and automatically enroll in the active academic year
   * 
   * This method:
   * 1. Creates the Student record (current snapshot of grade/section)
   * 2. Fetches the active academic year
   * 3. Automatically creates a StudentEnrollment for the active academic year
   * 
   * academicYearId is resolved via middleware, not provided from frontend
   */
  async createStudent(data, tenantId, academicYearId = null) {
    // Determine the active academic year to use for enrollment
    let activeYear = null;
    
    if (!academicYearId) {
      // Fetch active academic year if not provided
      activeYear = await prisma.academicYear.findFirst({
        where: {
          tenantId,
          status: "active",
        },
      });

      if (!activeYear) {
        throw new Error(
          "No active academic year found for this tenant. Please activate an academic year first."
        );
      }

      academicYearId = activeYear.id;
    }

    // Create student and enrollment in a transaction to ensure consistency
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the Student record
      const toCreate = mapStudentIn(data, tenantId);
      const created = await tx.student.create({
        data: toCreate,
        include: {
          grade: {
            select: {
              id: true,
              gradeName: true,
              course: { select: { id: true, courseName: true } },
            },
          },
          section: { select: { id: true, sectionName: true } },
        },
      });

      // 2. Create StudentEnrollment for the active academic year
      await tx.studentEnrollment.create({
        data: {
          tenantId,
          studentId: created.id,
          academicYearId,
          gradeId: created.gradeId,
          sectionId: created.sectionId,
          status: "active",
        },
      });

      return created;
    });

    return mapStudentOut(result);
  }

  async updateStudent(id, data, tenantId) {
    // Verify student exists
    const existing = await prisma.student.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return null;

    // Normalize dates if given as string, but exclude tenantId and relation fields from update
    const toUpdate = {};
    
    // Fields to exclude from update (system fields and relation fields)
    const excludedFields = ['tenantId', 'id', 'createdAt', 'updatedAt', 'gradeId', 'sectionId', 'grade', 'section', 'tenant', 'enrollments', 'parents'];
    
    if (data.dateOfBirth && typeof data.dateOfBirth === "string") {
      toUpdate.dateOfBirth = new Date(data.dateOfBirth);
    } else if (data.dateOfBirth) {
      toUpdate.dateOfBirth = data.dateOfBirth;
    }
    
    if (data.dateOfIssueTC && typeof data.dateOfIssueTC === "string") {
      toUpdate.dateOfIssueTC = new Date(data.dateOfIssueTC);
    } else if (data.dateOfIssueTC) {
      toUpdate.dateOfIssueTC = data.dateOfIssueTC;
    }
    
    // Copy all other fields except excluded ones
    Object.keys(data).forEach(key => {
      if (!excludedFields.includes(key)) {
        toUpdate[key] = data[key];
      }
    });

    const updated = await prisma.student.update({
      where: { id },
      data: toUpdate,
      include: {
        grade: { select: { id: true, gradeName: true, course: { select: { id: true, courseName: true } } } },
        section: { select: { id: true, sectionName: true } },
      },
    });
    return mapStudentOut(updated);
  }

  async deleteStudent(id, tenantId) {
    // fetch then delete (to return the deleted record like your current code)
    const existing = await prisma.student.findFirst({
      where: { id, tenantId },
      include: {
        grade: { select: { id: true, gradeName: true, course: { select: { id: true, courseName: true } } } },
        section: { select: { id: true, sectionName: true } },
      },
    });
    if (!existing) return null;

    await prisma.student.delete({ where: { id } });
    return mapStudentOut(existing);
  }

  async getStudentById(id, tenantId) {
    const row = await prisma.student.findFirst({
      where: { id, tenantId },
      include: {
        // No student.course FK in your migration; derive via grade.course
        grade: { select: { id: true, gradeName: true, course: { select: { id: true, courseName: true } } } },
        section: { select: { id: true, sectionName: true } },
      },
    });
    return mapStudentOut(row);
  }

  async getAllStudents(tenantId) {
    const rows = await prisma.student.findMany({
      where: { tenantId },
      include: {
        grade: { select: { id: true, gradeName: true, course: { select: { id: true, courseName: true } } } },
        section: { select: { id: true, sectionName: true } },
      },
      orderBy: [{ createdAt: "desc" }],
    });
    return rows.map(mapStudentOut);
  }
}

export default new StudentService();
