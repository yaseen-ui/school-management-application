import { prisma } from "../../lib/prisma.js";
import * as XLSX from "xlsx";
import sectionsService from "../sections/sections.service.js";

// ─── Constants ───────────────────────────────────────────────────────────────

const VALID_GENDERS = ["Male", "Female", "Other"];

// Fields that are mandatory in every row
const MANDATORY_FIELDS = [
  "firstName",
  "lastName",
  "dateOfBirth",
  "gender",
  "admissionNumber",
];

// Fields that map to Student table directly
const STUDENT_FIELDS = [
  "admissionNumber",
  "pen",
  "apaarId",
  "firstName",
  "middleName",
  "lastName",
  "dateOfBirth",
  "gender",
  "aadhaarNumber",
  "casteCategory",
  "subCaste",
  "religion",
  "motherTongue",
  "bloodGroup",
  "nationality",
  "identificationMarks",
  "fatherName",
  "fatherOccupation",
  "fatherPhone",
  "fatherAadhaar",
  "motherName",
  "motherOccupation",
  "motherPhone",
  "motherAadhaar",
  "guardianName",
  "guardianRelation",
  "guardianContact",
  "guardianOccupation",
  "guardianAadhaar",
  "classApplyingFor",
  "mediumOfInstruction",
  "previousSchoolName",
  "previousClassAttended",
  "transferCertificateNo",
  "dateOfIssueTC",
  "modeOfTransport",
  "permanentAddress",
  "state",
  "pincode",
  "feePaymentMode",
  "bankAccountDetails",
  "midDayMealEligibility",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Normalize a phone number for deduplication:
 * - Strip spaces, hyphens, parentheses
 * - Keep leading + and digits
 */
function normalizePhone(phone) {
  if (!phone || typeof phone !== "string") return null;
  const cleaned = phone.replace(/[\s\-\(\)]/g, "").trim();
  if (!cleaned) return null;
  return cleaned;
}

/**
 * Parse a date value from Excel which can be:
 * - A JS Date (if cell is formatted as date)
 * - A number (Excel serial date)
 * - A string in various formats
 */
function parseDate(value) {
  if (!value && value !== 0) return null;

  // Already a Date
  if (value instanceof Date) return value;

  // Excel serial date number
  if (typeof value === "number") {
    // XLSX's SSF parse_date_code approach
    const date = XLSX.SSF.parse_date_code(value);
    if (date) {
      return new Date(date.y, date.m - 1, date.d);
    }
    return null;
  }

  // String — try common formats
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;

    // DD/MM/YYYY or DD-MM-YYYY
    const dmyMatch = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (dmyMatch) {
      const [, d, m, y] = dmyMatch;
      const parsed = new Date(Number(y), Number(m) - 1, Number(d));
      if (!isNaN(parsed.getTime())) return parsed;
    }

    // YYYY-MM-DD or YYYY/MM/DD
    const ymdMatch = trimmed.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
    if (ymdMatch) {
      const [, y, m, d] = ymdMatch;
      const parsed = new Date(Number(y), Number(m) - 1, Number(d));
      if (!isNaN(parsed.getTime())) return parsed;
    }

    // Try built-in parse
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) return parsed;

    return null;
  }

  return null;
}

/**
 * Convert a value to a boolean (for midDayMealEligibility etc.)
 */
function parseBoolean(value) {
  if (value === true || value === "true" || value === "TRUE" || value === "yes" || value === "Yes" || value === "YES" || value === 1 || value === "1") return true;
  if (value === false || value === "false" || value === "FALSE" || value === "no" || value === "No" || value === "NO" || value === 0 || value === "0") return false;
  return null;
}

// ─── Excel Parsing ──────────────────────────────────────────────────────────

/**
 * Parse an uploaded Excel buffer into an array of row objects.
 * @param {Buffer} buffer - The file buffer
 * @param {string} mimetype - MIME type (helps determine format)
 * @returns {Array<Object>} Array of row objects with header keys
 */
export function parseExcelBuffer(buffer) {
  const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error("No sheet found in the uploaded file.");
  }

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  if (!rows || rows.length === 0) {
    throw new Error("The uploaded file contains no data rows.");
  }

  return rows;
}

// ─── Validation ──────────────────────────────────────────────────────────────

/**
 * Validate all rows and return a list of errors.
 * Does NOT write to the database.
 *
 * @param {Array<Object>} rows - Parsed rows from Excel
 * @param {Object} context - { tenantId, academicYearId, gradeId, sectionId }
 * @returns {{ errors: Array, validRows: Array, summary: Object }}
 */
export async function validateImportRows(rows, context) {
  const { tenantId, academicYearId, gradeId, sectionId } = context;
  const errors = [];
  const validRows = [];

  // Pre-fetch existing admission numbers and parent phones for this tenant
  const [existingAdmissionNumbers, existingParents] = await Promise.all([
    prisma.student
      .findMany({
        where: { tenantId, admissionNumber: { not: null } },
        select: { admissionNumber: true },
      })
      .then((r) => new Set(r.map((s) => s.admissionNumber))),
    prisma.parent.findMany({
      where: { tenantId, phone: { not: null } },
      select: { id: true, phone: true, fullName: true },
    }),
  ]);

  // Build phone → parent lookup map
  const parentByPhone = {};
  for (const p of existingParents) {
    const norm = normalizePhone(p.phone);
    if (norm) {
      parentByPhone[norm] = p;
    }
  }

  // Track admission numbers within this batch to catch intra-batch duplicates
  const batchAdmissionNumbers = new Set();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // Excel rows are 1-indexed, header is row 1

    // ── Check mandatory fields ──────────────────────────────────────────
    for (const field of MANDATORY_FIELDS) {
      const val = row[field];
      if (val === "" || val === null || val === undefined) {
        errors.push({
          row: rowNum,
          field,
          value: "",
          error: `${field} is required.`,
        });
      }
    }

    // ── Validate gender ─────────────────────────────────────────────────
    const gender = row["gender"];
    if (gender && !VALID_GENDERS.includes(gender)) {
      errors.push({
        row: rowNum,
        field: "gender",
        value: gender,
        error: `Invalid gender "${gender}". Must be one of: ${VALID_GENDERS.join(", ")}`,
      });
    }

    // ── Validate dateOfBirth ────────────────────────────────────────────
    const dobRaw = row["dateOfBirth"];
    if (dobRaw && dobRaw !== "") {
      const dob = parseDate(dobRaw);
      if (!dob) {
        errors.push({
          row: rowNum,
          field: "dateOfBirth",
          value: String(dobRaw),
          error: "Invalid date format. Use DD/MM/YYYY or YYYY-MM-DD.",
        });
      } else if (dob > new Date()) {
        errors.push({
          row: rowNum,
          field: "dateOfBirth",
          value: String(dobRaw),
          error: "Date of birth cannot be in the future.",
        });
      }
    }

    // ── Validate dateOfIssueTC if provided ──────────────────────────────
    const tcDateRaw = row["dateOfIssueTC"];
    if (tcDateRaw && tcDateRaw !== "") {
      const tcDate = parseDate(tcDateRaw);
      if (!tcDate) {
        errors.push({
          row: rowNum,
          field: "dateOfIssueTC",
          value: String(tcDateRaw),
          error: "Invalid date format. Use DD/MM/YYYY or YYYY-MM-DD.",
        });
      }
    }

    // ── Validate admissionNumber uniqueness ─────────────────────────────
    const admissionNumber = row["admissionNumber"];
    if (admissionNumber && admissionNumber !== "") {
      if (existingAdmissionNumbers.has(admissionNumber)) {
        errors.push({
          row: rowNum,
          field: "admissionNumber",
          value: admissionNumber,
          error: `Admission number "${admissionNumber}" already exists for another student in this school.`,
        });
      } else if (batchAdmissionNumbers.has(admissionNumber)) {
        errors.push({
          row: rowNum,
          field: "admissionNumber",
          value: admissionNumber,
          error: `Duplicate admission number "${admissionNumber}" within the uploaded file (also found in another row).`,
        });
      } else {
        batchAdmissionNumbers.add(admissionNumber);
      }
    }

    // ── Validate midDayMealEligibility if provided ──────────────────────
    const mdmRaw = row["midDayMealEligibility"];
    if (mdmRaw !== "" && mdmRaw !== undefined && mdmRaw !== null) {
      const boolVal = parseBoolean(mdmRaw);
      if (boolVal === null) {
        // If it looks like it belongs to another column (column misalignment), skip validation
        const looksLikeMisaligned = ["Online", "Cash", "Bus", "Van"].includes(String(mdmRaw));
        if (!looksLikeMisaligned) {
          errors.push({
            row: rowNum,
            field: "midDayMealEligibility",
            value: String(mdmRaw),
            error: "Invalid value. Use true/false, yes/no, or 1/0.",
          });
        }
      }
    }
  }

  // If there are errors, don't bother building validRows — return them all
  if (errors.length > 0) {
    return {
      errors,
      validRows: [],
      summary: {
        totalRows: rows.length,
        validRows: 0,
        errorCount: errors.length,
      },
    };
  }

  // All rows are valid — build the cleaned row data
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cleaned = {};

    // Extract student fields
    for (const field of STUDENT_FIELDS) {
      if (row[field] !== "" && row[field] !== undefined && row[field] !== null) {
        cleaned[field] = row[field];
      }
    }

    // Convert dates
    if (cleaned.dateOfBirth) {
      cleaned.dateOfBirth = parseDate(cleaned.dateOfBirth);
    }
    if (cleaned.dateOfIssueTC) {
      cleaned.dateOfIssueTC = parseDate(cleaned.dateOfIssueTC);
    }
    if (cleaned.midDayMealEligibility !== undefined) {
      cleaned.midDayMealEligibility = parseBoolean(cleaned.midDayMealEligibility);
    }

    // Add context
    cleaned._tenantId = tenantId;
    cleaned._academicYearId = academicYearId;
    cleaned._gradeId = gradeId;
    cleaned._sectionId = sectionId;

    // Determine parent definitions for this row
    cleaned._parents = buildParentDefs(row);

    validRows.push(cleaned);
  }

  return {
    errors: [],
    validRows,
    summary: {
      totalRows: rows.length,
      validRows: validRows.length,
      errorCount: 0,
    },
    _parentByPhone: parentByPhone,
    _existingAdmissionNumbers: existingAdmissionNumbers,
  };
}

/**
 * Extract parent definitions from a row.
 */
function buildParentDefs(row) {
  const defs = [];

  const fatherName = row["fatherName"] || row["father_name"];
  const fatherPhone = normalizePhone(row["fatherPhone"] || row["father_phone"]);
  const fatherEmail = row["fatherEmail"] || row["father_email"];
  const motherName = row["motherName"] || row["mother_name"];
  const motherPhone = normalizePhone(row["motherPhone"] || row["mother_phone"]);
  const motherEmail = row["motherEmail"] || row["mother_email"];
  const guardianName = row["guardianName"] || row["guardian_name"];
  const guardianPhone = normalizePhone(row["guardianContact"] || row["guardian_phone"] || row["guardianContact"]);
  const guardianRelation = (row["guardianRelation"] || row["guardian_relation"] || "").trim() || "Guardian";
  const guardianEmail = row["guardianEmail"] || row["guardian_email"];

  if (fatherName?.trim()) {
    defs.push({
      name: fatherName.trim(),
      phone: fatherPhone,
      email: fatherEmail?.trim() || null,
      relation: "Father",
    });
  }
  if (motherName?.trim()) {
    defs.push({
      name: motherName.trim(),
      phone: motherPhone,
      email: motherEmail?.trim() || null,
      relation: "Mother",
    });
  }
  if (guardianName?.trim()) {
    defs.push({
      name: guardianName.trim(),
      phone: guardianPhone,
      email: guardianEmail?.trim() || null,
      relation: guardianRelation,
    });
  }

  return defs;
}

// ─── Transactional Import ────────────────────────────────────────────────────

/**
 * Import validated rows into the database within a single transaction.
 * Assumes all rows have already been validated.
 *
 * @param {Array<Object>} validRows - Pre-validated row objects
 * @param {Object} parentByPhone - Map of normalized phone → existing parent record
 * @returns {{ successCount: number, enrollmentIds: Array<string> }}
 */
export async function importValidatedRows(validRows, parentByPhone = {}) {
  if (!validRows || validRows.length === 0) {
    throw new Error("No valid rows to import.");
  }

  const context = validRows[0];
  const tenantId = context._tenantId;
  const academicYearId = context._academicYearId;
  const gradeId = context._gradeId;
  const sectionId = context._sectionId;

  // Clone the parentByPhone map so we can add newly created parents during the transaction
  const parentCache = { ...parentByPhone };

  const result = await prisma.$transaction(async (tx) => {
    let successCount = 0;
    const enrollmentIds = [];

    for (const row of validRows) {
      // ── 1. Create Student ───────────────────────────────────────────────
      const studentData = {
        tenantId,
        gradeId,
        sectionId,
        firstName: row.firstName,
        middleName: row.middleName || null,
        lastName: row.lastName,
        dateOfBirth: row.dateOfBirth,
        gender: row.gender,
        admissionNumber: row.admissionNumber || null,
        pen: row.pen || null,
        apaarId: row.apaarId || null,
        aadhaarNumber: row.aadhaarNumber || null,
        casteCategory: row.casteCategory || null,
        subCaste: row.subCaste || null,
        religion: row.religion || null,
        motherTongue: row.motherTongue || null,
        bloodGroup: row.bloodGroup || null,
        nationality: row.nationality || "Indian",
        identificationMarks: row.identificationMarks || null,
        fatherName: row.fatherName || null,
        fatherOccupation: row.fatherOccupation || null,
        fatherPhone: row.fatherPhone != null ? String(row.fatherPhone) : null,
        fatherAadhaar: row.fatherAadhaar || null,
        motherName: row.motherName || null,
        motherOccupation: row.motherOccupation || null,
        motherPhone: row.motherPhone != null ? String(row.motherPhone) : null,
        motherAadhaar: row.motherAadhaar || null,
        guardianName: row.guardianName || null,
        guardianRelation: row.guardianRelation || null,
        guardianContact: row.guardianContact != null ? String(row.guardianContact) : null,
        guardianOccupation: row.guardianOccupation || null,
        guardianAadhaar: row.guardianAadhaar || null,
        classApplyingFor: row.classApplyingFor || null,
        mediumOfInstruction: row.mediumOfInstruction || null,
        previousSchoolName: row.previousSchoolName || null,
        previousClassAttended: row.previousClassAttended || null,
        transferCertificateNo: row.transferCertificateNo || null,
        dateOfIssueTC: row.dateOfIssueTC || null,
        modeOfTransport: row.modeOfTransport || null,
        permanentAddress: row.permanentAddress || null,
        state: row.state || null,
        pincode: row.pincode != null ? String(row.pincode) : null,
        feePaymentMode: row.feePaymentMode || null,
        bankAccountDetails: row.bankAccountDetails || null,
        midDayMealEligibility: row.midDayMealEligibility === true,
      };

      const created = await tx.student.create({ data: studentData });

      // ── 2. Create Enrollment ────────────────────────────────────────────
      const enrollment = await tx.studentEnrollment.create({
        data: {
          tenantId,
          studentId: created.id,
          academicYearId,
          gradeId,
          sectionId,
          status: "active",
        },
      });
      enrollmentIds.push(enrollment.id);

      // ── 3. Upsert Parents ───────────────────────────────────────────────
      const parentDefs = row._parents || [];
      let primaryAssigned = false;

      for (const def of parentDefs) {
        let parent;

        if (def.phone) {
          // Phone-based deduplication
          if (parentCache[def.phone]) {
            parent = parentCache[def.phone];
            // Update email if newly provided and existing is empty
            if (def.email && !parent.email) {
              parent = await tx.parent.update({
                where: { id: parent.id },
                data: { email: def.email },
              });
              parentCache[def.phone] = parent;
            }
          } else {
            // Create new parent
            parent = await tx.parent.create({
              data: {
                tenantId,
                fullName: def.name,
                phone: def.phone,
                email: def.email || null,
                relation: def.relation,
              },
            });
            parentCache[def.phone] = parent;
          }
        } else if (def.name) {
          // Fallback: name-based deduplication
          const existingParent = await tx.parent.findFirst({
            where: { tenantId, fullName: def.name },
          });

          if (existingParent) {
            parent = existingParent;
            if (def.email && !parent.email) {
              parent = await tx.parent.update({
                where: { id: parent.id },
                data: { email: def.email },
              });
            }
          } else {
            parent = await tx.parent.create({
              data: {
                tenantId,
                fullName: def.name,
                phone: null,
                email: def.email || null,
                relation: def.relation,
              },
            });
          }
        } else {
          continue; // No name and no phone — skip
        }

        // Create StudentParent link if not already present
        const existingLink = await tx.studentParent.findFirst({
          where: { tenantId, studentId: created.id, parentId: parent.id },
        });

        if (!existingLink) {
          const isPrimary = !primaryAssigned;
          await tx.studentParent.create({
            data: {
              tenantId,
              studentId: created.id,
              parentId: parent.id,
              isPrimary,
            },
          });
          if (isPrimary) primaryAssigned = true;
        }
      }

      successCount++;
    }

    return { successCount, enrollmentIds };
  });

  // ── 4. Auto-generate roll numbers ────────────────────────────────────────
  try {
    await sectionsService.generateRollNumbers(sectionId, tenantId);
  } catch (err) {
    console.warn("Failed to auto-generate roll numbers after import:", err.message);
    // Non-fatal — students are imported, admin can generate roll numbers manually
  }

  return result;
}

// ─── Full Import Pipeline ────────────────────────────────────────────────────

/**
 * Complete import pipeline: parse → validate → import.
 *
 * @param {Buffer} fileBuffer - The uploaded Excel file buffer
 * @param {Object} context - { tenantId, academicYearId, gradeId, sectionId }
 * @returns {{ success: boolean, summary: Object, errors: Array }}
 */
export async function importStudentsFromExcel(fileBuffer, context) {
  // 1. Parse
  const rows = parseExcelBuffer(fileBuffer);

  // 2. Validate
  const validation = await validateImportRows(rows, context);

  if (validation.errors.length > 0) {
    return {
      success: false,
      summary: validation.summary,
      errors: validation.errors,
    };
  }

  // 3. Import
  try {
    const result = await importValidatedRows(validation.validRows, validation._parentByPhone);
    return {
      success: true,
      summary: {
        totalRows: rows.length,
        successful: result.successCount,
        failed: 0,
      },
      errors: [],
      enrollmentIds: result.enrollmentIds,
    };
  } catch (err) {
    // DB-level error (e.g., unique constraint violation at insert time)
    return {
      success: false,
      summary: {
        totalRows: rows.length,
        successful: 0,
        failed: rows.length,
      },
      errors: [
        {
          row: 0,
          field: "_system",
          value: "",
          error: `Database error during import: ${err.message}`,
        },
      ],
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Faculty / Staff Import ────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const VALID_EMPLOYEE_TYPES = [
  "teacher", "driver", "clerk", "office_boy",
  "admin", "accountant", "security", "cleaner", "other",
];

const VALID_GOVT_ID_TYPES = ["aadhar", "pan", "voter_id", "passport"];

const VALID_VEHICLE_TYPES = ["bus", "van", "car", "auto"];

const FACULTY_MANDATORY_FIELDS = [
  "fullName",
  "email",
  "phone",
  "employeeCode",
  "employeeType",
];

// Fields that map to Teacher table directly
const FACULTY_FIELDS = [
  "fullName", "email", "phone", "gender", "employeeCode", "employeeType",
  "dateOfBirth", "dateOfJoining", "yearsOfExperience",
  "governmentIdType", "governmentIdNumber",
  "drivingLicenseNumber", "drivingExperienceYears", "vehicleType", "licenseExpiryDate",
];

/**
 * Validate email format.
 */
function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Validate all faculty rows and return a list of errors.
 * Does NOT write to the database.
 */
async function validateFacultyRows(rows, tenantId) {
  const errors = [];

  // Pre-fetch existing employee codes for this tenant
  const existingEmployeeCodes = new Set(
    (await prisma.teacher.findMany({
      where: { tenantId, employeeCode: { not: null } },
      select: { employeeCode: true },
    })).map((t) => t.employeeCode)
  );

  // Track employee codes within this batch
  const batchEmployeeCodes = new Set();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2;

    // ── Check mandatory fields ──────────────────────────────────────────
    for (const field of FACULTY_MANDATORY_FIELDS) {
      const val = row[field];
      if (val === "" || val === null || val === undefined) {
        errors.push({
          row: rowNum, field, value: "",
          error: `${field} is required.`,
        });
      }
    }

    // ── Validate email format ───────────────────────────────────────────
    const email = row["email"];
    if (email && email !== "" && !isValidEmail(email)) {
      errors.push({
        row: rowNum, field: "email", value: String(email),
        error: `Invalid email format: "${email}".`,
      });
    }

    // ── Validate gender ─────────────────────────────────────────────────
    const gender = row["gender"];
    if (gender && !VALID_GENDERS.includes(gender)) {
      errors.push({
        row: rowNum, field: "gender", value: gender,
        error: `Invalid gender "${gender}". Must be one of: ${VALID_GENDERS.join(", ")}`,
      });
    }

    // ── Validate employeeType ───────────────────────────────────────────
    const employeeType = row["employeeType"];
    if (employeeType && !VALID_EMPLOYEE_TYPES.includes(employeeType)) {
      errors.push({
        row: rowNum, field: "employeeType", value: employeeType,
        error: `Invalid employee type "${employeeType}". Must be one of: ${VALID_EMPLOYEE_TYPES.join(", ")}`,
      });
    }

    // ── Validate dateOfBirth ────────────────────────────────────────────
    const dobRaw = row["dateOfBirth"];
    if (dobRaw && dobRaw !== "") {
      const dob = parseDate(dobRaw);
      if (!dob) {
        errors.push({ row: rowNum, field: "dateOfBirth", value: String(dobRaw), error: "Invalid date format. Use DD/MM/YYYY or YYYY-MM-DD." });
      } else if (dob > new Date()) {
        errors.push({ row: rowNum, field: "dateOfBirth", value: String(dobRaw), error: "Date of birth cannot be in the future." });
      }
    }

    // ── Validate dateOfJoining ──────────────────────────────────────────
    const dojRaw = row["dateOfJoining"];
    if (dojRaw && dojRaw !== "") {
      const doj = parseDate(dojRaw);
      if (!doj) {
        errors.push({ row: rowNum, field: "dateOfJoining", value: String(dojRaw), error: "Invalid date format. Use DD/MM/YYYY or YYYY-MM-DD." });
      }
    }

    // ── Validate licenseExpiryDate ──────────────────────────────────────
    const ledRaw = row["licenseExpiryDate"];
    if (ledRaw && ledRaw !== "") {
      const led = parseDate(ledRaw);
      if (!led) {
        errors.push({ row: rowNum, field: "licenseExpiryDate", value: String(ledRaw), error: "Invalid date format. Use DD/MM/YYYY or YYYY-MM-DD." });
      }
    }

    // ── Validate governmentIdType ───────────────────────────────────────
    const govIdType = row["governmentIdType"];
    if (govIdType && !VALID_GOVT_ID_TYPES.includes(govIdType)) {
      errors.push({
        row: rowNum, field: "governmentIdType", value: govIdType,
        error: `Invalid government ID type "${govIdType}". Must be one of: ${VALID_GOVT_ID_TYPES.join(", ")}`,
      });
    }

    // ── Validate vehicleType ────────────────────────────────────────────
    const vType = row["vehicleType"];
    if (vType && !VALID_VEHICLE_TYPES.includes(vType)) {
      errors.push({
        row: rowNum, field: "vehicleType", value: vType,
        error: `Invalid vehicle type "${vType}". Must be one of: ${VALID_VEHICLE_TYPES.join(", ")}`,
      });
    }

    // ── Validate employeeCode uniqueness ────────────────────────────────
    const employeeCode = row["employeeCode"];
    if (employeeCode && employeeCode !== "") {
      if (existingEmployeeCodes.has(employeeCode)) {
        errors.push({
          row: rowNum, field: "employeeCode", value: employeeCode,
          error: `Employee code "${employeeCode}" already exists for another staff member in this school.`,
        });
      } else if (batchEmployeeCodes.has(employeeCode)) {
        errors.push({
          row: rowNum, field: "employeeCode", value: employeeCode,
          error: `Duplicate employee code "${employeeCode}" within the uploaded file.`,
        });
      } else {
        batchEmployeeCodes.add(employeeCode);
      }
    }
  }

  if (errors.length > 0) {
    return {
      errors,
      validRows: [],
      summary: { totalRows: rows.length, validRows: 0, errorCount: errors.length },
    };
  }

  // Build cleaned rows
  const validRows = [];
  for (const row of rows) {
    const cleaned = {};
    for (const field of FACULTY_FIELDS) {
      if (row[field] !== "" && row[field] !== undefined && row[field] !== null) {
        cleaned[field] = row[field];
      }
    }
    if (cleaned.dateOfBirth) cleaned.dateOfBirth = parseDate(cleaned.dateOfBirth);
    if (cleaned.dateOfJoining) cleaned.dateOfJoining = parseDate(cleaned.dateOfJoining);
    if (cleaned.licenseExpiryDate) cleaned.licenseExpiryDate = parseDate(cleaned.licenseExpiryDate);
    if (cleaned.yearsOfExperience != null) cleaned.yearsOfExperience = Number(cleaned.yearsOfExperience);
    if (cleaned.drivingExperienceYears != null) cleaned.drivingExperienceYears = Number(cleaned.drivingExperienceYears);
    cleaned._tenantId = tenantId;
    validRows.push(cleaned);
  }

  return {
    errors: [],
    validRows,
    summary: { totalRows: rows.length, validRows: validRows.length, errorCount: 0 },
  };
}

/**
 * Import validated faculty rows into the database within a single transaction.
 */
async function importValidatedFaculty(validRows) {
  if (!validRows || validRows.length === 0) {
    throw new Error("No valid rows to import.");
  }

  const tenantId = validRows[0]._tenantId;

  const result = await prisma.$transaction(async (tx) => {
    let successCount = 0;
    const teacherIds = [];

    for (const row of validRows) {
      const teacherData = {
        tenantId,
        fullName: row.fullName,
        email: row.email || null,
        phone: row.phone != null ? String(row.phone) : null,
        gender: row.gender || null,
        employeeCode: row.employeeCode || null,
        employeeType: row.employeeType || "teacher",
        dateOfBirth: row.dateOfBirth || null,
        dateOfJoining: row.dateOfJoining || null,
        yearsOfExperience: row.yearsOfExperience != null ? row.yearsOfExperience : null,
        governmentIdType: row.governmentIdType || null,
        governmentIdNumber: row.governmentIdNumber != null ? String(row.governmentIdNumber) : null,
        drivingLicenseNumber: row.drivingLicenseNumber || null,
        drivingExperienceYears: row.drivingExperienceYears != null ? row.drivingExperienceYears : null,
        vehicleType: row.vehicleType || null,
        licenseExpiryDate: row.licenseExpiryDate || null,
      };

      const created = await tx.teacher.create({ data: teacherData });
      teacherIds.push(created.id);
      successCount++;
    }

    return { successCount, teacherIds };
  });

  return result;
}

/**
 * Complete faculty import pipeline: parse → validate → import.
 *
 * @param {Buffer} fileBuffer - The uploaded Excel file buffer
 * @param {string} tenantId - The tenant ID
 * @returns {{ success: boolean, summary: Object, errors: Array }}
 */
export async function importFacultyFromExcel(fileBuffer, tenantId) {
  // 1. Parse
  const rows = parseExcelBuffer(fileBuffer);

  // 2. Validate
  const validation = await validateFacultyRows(rows, tenantId);

  if (validation.errors.length > 0) {
    return {
      success: false,
      summary: validation.summary,
      errors: validation.errors,
    };
  }

  // 3. Import
  try {
    const result = await importValidatedFaculty(validation.validRows);
    return {
      success: true,
      summary: {
        totalRows: rows.length,
        successful: result.successCount,
        failed: 0,
      },
      errors: [],
      teacherIds: result.teacherIds,
    };
  } catch (err) {
    return {
      success: false,
      summary: { totalRows: rows.length, successful: 0, failed: rows.length },
      errors: [
        { row: 0, field: "_system", value: "", error: `Database error during import: ${err.message}` },
      ],
    };
  }
}
