import { prisma } from "../../lib/prisma.js";
import idSequenceService from "../id-sequence/id-sequence.service.js";

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
  async createStudent(data, tenantId, academicYearId = null) {
    let activeYear = null;
    
    if (!academicYearId) {
      activeYear = await prisma.academicYear.findFirst({
        where: { tenantId, status: "active" },
      });

      if (!activeYear) {
        throw new Error("No active academic year found for this tenant. Please activate an academic year first.");
      }

      academicYearId = activeYear.id;
    }

    // Parent-specific form fields that should not be written to Student table
    const parentOnlyFields = [
      "fatherEmail", "motherEmail", "guardianEmail",
      "isFatherPrimary", "isMotherPrimary", "isGuardianPrimary",
    ];

    const studentData = { ...data };
    for (const key of parentOnlyFields) {
      delete studentData[key];
    }

    // Auto-generate admission number if a pattern is configured and no number is provided
    if (!studentData.admissionNumber) {
      try {
        studentData.admissionNumber = await idSequenceService.generateNextId(
          tenantId,
          "admission",
          academicYearId,
          null // entityId set after creation
        );
      } catch (err) {
        console.warn("Failed to auto-generate admission number:", err.message);
        // Continue without auto-generated number — admin can set manually
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const toCreate = mapStudentIn(studentData, tenantId);
      const created = await tx.student.create({
        data: toCreate,
        include: {
          grade: {
            select: { id: true, gradeName: true, course: { select: { id: true, courseName: true } } },
          },
          section: { select: { id: true, sectionName: true } },
        },
      });

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

      // ─── Create & link parents ──────────────────────────────────────────
      const parentDefs = [
        {
          name: data.fatherName?.trim(),
          phone: data.fatherPhone?.trim(),
          email: data.fatherEmail?.trim(),
          relation: "Father",
          isPrimary: data.isFatherPrimary === true || data.isFatherPrimary === "true",
        },
        {
          name: data.motherName?.trim(),
          phone: data.motherPhone?.trim(),
          email: data.motherEmail?.trim(),
          relation: "Mother",
          isPrimary: data.isMotherPrimary === true || data.isMotherPrimary === "true",
        },
        {
          name: data.guardianName?.trim(),
          phone: data.guardianContact?.trim(),
          email: data.guardianEmail?.trim(),
          relation: data.guardianRelation?.trim() || "Guardian",
          isPrimary: data.isGuardianPrimary === true || data.isGuardianPrimary === "true",
        },
      ];

      // If no primary was explicitly set, default first available parent as primary
      const anyExplicitPrimary = parentDefs.some((p) => p.isPrimary);
      let fallbackPrimaryAssigned = false;

      for (const def of parentDefs) {
        if (!def.name) continue;

        // Upsert parent: find by tenantId + fullName, create if not found
        const existingParent = await tx.parent.findFirst({
          where: { tenantId, fullName: def.name },
        });

        let parent;
        if (existingParent) {
          // Update phone/email if newly provided and existing is empty
          const updateData = {};
          if (def.phone && !existingParent.phone) updateData.phone = def.phone;
          if (def.email && !existingParent.email) updateData.email = def.email;
          if (Object.keys(updateData).length > 0) {
            parent = await tx.parent.update({
              where: { id: existingParent.id },
              data: updateData,
            });
          } else {
            parent = existingParent;
          }
        } else {
          parent = await tx.parent.create({
            data: {
              tenantId,
              fullName: def.name,
              phone: def.phone || null,
              email: def.email || null,
              relation: def.relation,
            },
          });
        }

        // Determine isPrimary
        let isPrimary = def.isPrimary;
        if (!anyExplicitPrimary && !fallbackPrimaryAssigned) {
          isPrimary = true;
          fallbackPrimaryAssigned = true;
        }

        // Check if StudentParent link already exists
        const existingLink = await tx.studentParent.findFirst({
          where: { tenantId, studentId: created.id, parentId: parent.id },
        });

        if (!existingLink) {
          await tx.studentParent.create({
            data: {
              tenantId,
              studentId: created.id,
              parentId: parent.id,
              isPrimary,
            },
          });
        }
      }

      return created;
    });

    return mapStudentOut(result);
  }

  async updateStudent(id, data, tenantId) {
    const existing = await prisma.student.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return null;

    const toUpdate = {};
    
    // Fields that do NOT exist as columns in the Student table
    // (system fields, relations, virtual / upload-only fields, UI-only compound fields)
    const excludedFields = [
      'tenantId', 'id', 'createdAt', 'updatedAt', 'gradeId', 'sectionId',
      'grade', 'section', 'tenant', 'enrollments', 'parents',
      'studentPassportPhoto', 'motherPassportPhoto', 'fatherPassportPhoto',
      'guardianPassportPhoto', 'studentAadharCopy', 'parentsAadharCopy',
      'casteCertificateCopy', 'birthCertificateCopy', 'tcCopy',
      'conductCertificateCopy', 'studentIDCardPhoto',
      'contactAddressStreet', 'contactAddressCity', 'contactAddressState', 'contactAddressZip',
      'academicYearId', 'courseId', 'courseName', 'gradeName', 'sectionName',
      'course', 'admissionNumber',
      // Parent-specific fields (handled separately, not Student columns)
      'fatherEmail', 'motherEmail', 'guardianEmail',
      'isFatherPrimary', 'isMotherPrimary', 'isGuardianPrimary',
    ];
    
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

    // ─── Upsert parent records if parent fields are provided ──────────
    const hasParentData = data.fatherName?.trim() || data.motherName?.trim() || data.guardianName?.trim();
    if (hasParentData) {
      const parentDefs = [
        {
          name: data.fatherName?.trim(),
          phone: data.fatherPhone?.trim(),
          email: data.fatherEmail?.trim(),
          relation: "Father",
          isPrimary: data.isFatherPrimary === true || data.isFatherPrimary === "true",
        },
        {
          name: data.motherName?.trim(),
          phone: data.motherPhone?.trim(),
          email: data.motherEmail?.trim(),
          relation: "Mother",
          isPrimary: data.isMotherPrimary === true || data.isMotherPrimary === "true",
        },
        {
          name: data.guardianName?.trim(),
          phone: data.guardianContact?.trim(),
          email: data.guardianEmail?.trim(),
          relation: data.guardianRelation?.trim() || "Guardian",
          isPrimary: data.isGuardianPrimary === true || data.isGuardianPrimary === "true",
        },
      ];

      const anyExplicitPrimary = parentDefs.some((p) => p.isPrimary);
      let fallbackPrimaryAssigned = false;

      // Check if student already has any parent links
      const existingLinks = await prisma.studentParent.findFirst({
        where: { tenantId, studentId: id, isPrimary: true },
      });
      if (existingLinks) {
        fallbackPrimaryAssigned = true; // already has a primary, don't override
      }

      for (const def of parentDefs) {
        if (!def.name) continue;

        // Upsert parent
        const existingParent = await prisma.parent.findFirst({
          where: { tenantId, fullName: def.name },
        });

        let parent;
        if (existingParent) {
          const updateData = {};
          if (def.phone && !existingParent.phone) updateData.phone = def.phone;
          if (def.email && !existingParent.email) updateData.email = def.email;
          if (Object.keys(updateData).length > 0) {
            parent = await prisma.parent.update({
              where: { id: existingParent.id },
              data: updateData,
            });
          } else {
            parent = existingParent;
          }
        } else {
          parent = await prisma.parent.create({
            data: {
              tenantId,
              fullName: def.name,
              phone: def.phone || null,
              email: def.email || null,
              relation: def.relation,
            },
          });
        }

        // Determine isPrimary
        let isPrimary = def.isPrimary;
        if (!anyExplicitPrimary && !fallbackPrimaryAssigned) {
          isPrimary = true;
          fallbackPrimaryAssigned = true;
        }

        // Check if StudentParent link already exists
        const existingLink = await prisma.studentParent.findFirst({
          where: { tenantId, studentId: id, parentId: parent.id },
        });

        if (!existingLink) {
          await prisma.studentParent.create({
            data: {
              tenantId,
              studentId: id,
              parentId: parent.id,
              isPrimary,
            },
          });
        } else if (def.isPrimary && !existingLink.isPrimary) {
          // Update existing link to mark as primary if user explicitly chose it
          await prisma.studentParent.update({
            where: { id: existingLink.id },
            data: { isPrimary: true },
          });
        }
      }
    }

    return mapStudentOut(updated);
  }

  async deleteStudent(id, tenantId) {
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