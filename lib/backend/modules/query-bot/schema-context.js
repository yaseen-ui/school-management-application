/**
 * ZAI Schema Context — Hybrid Approach
 *
 * Provides the LLM (DeepSeek) with:
 * 1. DYNAMIC: Prisma schema structure (auto-parsed from prisma/schema.prisma at startup)
 * 2. CURATED: Business glossary (human terminology → Prisma field/enum mapping)
 * 3. CURATED: Few-shot examples (correct Prisma query patterns)
 *
 * Cached once at module load time — regenerated on server restart.
 */

import fs from 'fs';
import path from 'path';

// ─────────────────────────────────────────────────────────────────
// 1. DYNAMIC: Parse prisma/schema.prisma
// ─────────────────────────────────────────────────────────────────

/**
 * Extract model names, field names, types, and relation hints from the Prisma schema.
 * Uses regex to avoid any dependency on Prisma internals.
 */
function parsePrismaSchema(raw) {
  const models = [];

  // Match model blocks: model ModelName { ... }
  const modelRegex = /^model\s+(\w+)\s*\{([\s\S]*?)^\}/gm;
  let modelMatch;

  while ((modelMatch = modelRegex.exec(raw)) !== null) {
    const modelName = modelMatch[1];
    const body = modelMatch[2];

    const fields = [];
    const relations = [];

    // Match field definitions: fieldName Type @annotations
    const fieldRegex = /^\s+(\w+)\s+(\w+(?:\[\])?)([\?\!]?)\s*(.*)$/gm;
    let fieldMatch;

    while ((fieldMatch = fieldRegex.exec(body)) !== null) {
      const fieldName = fieldMatch[1];
      const fieldType = fieldMatch[2];
      const isOptional = fieldMatch[3] === '?';
      const annotations = fieldMatch[4];

      if (fieldName === '@@map' || fieldName === '@@unique' || fieldName === '@@index' || fieldName === '@@id') continue;
      if (fieldName.startsWith('@@')) continue;

      // Detect relation fields (→ symbol in annotations or model types like User, Student, etc.)
      const isRelation = annotations.includes('@relation') || 
        /^[A-Z]/.test(fieldType.replace('[]', '')) && !['String', 'Int', 'Float', 'Boolean', 'DateTime', 'Decimal', 'Json'].includes(fieldType.replace('[]', ''));

      fields.push({
        name: fieldName,
        type: fieldType,
        optional: isOptional,
        isRelation,
      });

      if (isRelation) {
        relations.push({ field: fieldName, type: fieldType });
      }
    }

    // Extract @@map for actual table name
    const mapMatch = body.match(/@@map\("(\w+)"\)/);
    const tableName = mapMatch ? mapMatch[1] : modelName.toLowerCase();

    models.push({ name: modelName, tableName, fields, relations });
  }

  return models;
}

/**
 * Format parsed models into a compact, LLM-friendly text block.
 */
function formatModelsForLLM(models) {
  // Filter to only the key queriable models (skip junction tables, audit tables, etc.)
  const queryableModels = models.filter(m => {
    const skip = [
      'RolePermission', 'UserRole', 'RoleGroup', 'AuditLog', 'TokenBlacklist',
      'StudentParent', 'LeaveAuditLog', 'LeaveNotification', 'LeaveBalanceTransaction',
      'StoreDuePayment', 'StorePendingItem', 'StoreReturn', 'CompensationHistory',
      'IdSequenceLog', 'VisitorNotification', 'StudentEnrollmentElective',
      'ExamTargetGrade', 'ExamTargetSection',
    ];
    return !skip.includes(m.name);
  });

  return queryableModels.map(m => {
    const fieldLines = m.fields
      .filter(f => !f.name.startsWith('createdById') && !f.name.startsWith('updatedById'))
      .map(f => `    ${f.name}: ${f.type}${f.optional ? '?' : ''}${f.isRelation ? ' (RELATION)' : ''}`)
      .join('\n');

    return `Model ${m.name} (table: ${m.tableName}):\n${fieldLines}`;
  }).join('\n\n');
}

/**
 * Extract enum definitions from Prisma schema.
 */
function parseEnums(raw) {
  const enums = [];
  const enumRegex = /^enum\s+(\w+)\s*\{([\s\S]*?)^\}/gm;
  let enumMatch;

  while ((enumMatch = enumRegex.exec(raw)) !== null) {
    const name = enumMatch[1];
    const body = enumMatch[2];
    const values = [];
    const valueRegex = /^\s+(\w+)/gm;
    let valueMatch;
    while ((valueMatch = valueRegex.exec(body)) !== null) {
      values.push(valueMatch[1]);
    }
    enums.push({ name, values });
  }

  return enums;
}

function formatEnumsForLLM(enums) {
  // Only include enums that are useful for querying
  const relevant = [
    'ExamType', 'AttendanceStatus', 'EnrollmentStatus', 'PaymentStatus',
    'ExamStatus', 'Gender', 'EntityStatus', 'DayOfWeek', 'EmployeeType',
    'TeacherRole', 'LeaveRequestStatus',
  ];
  return enums
    .filter(e => relevant.includes(e.name))
    .map(e => `${e.name}: ${e.values.join(' | ')}`)
    .join('\n');
}

// ─────────────────────────────────────────────────────────────────
// 2. CURATED: Business Glossary
// ─────────────────────────────────────────────────────────────────

const BUSINESS_GLOSSARY = {
  examTerminology: {
    'quarterly exams': 'Exam.examType = "quarterly" AND ExamSchedulePaper through ExamSchedule → Section',
    'half-yearly exams': 'Exam.examType = "half_yearly"',
    'half yearly exams': 'Exam.examType = "half_yearly"',
    'annual exams': 'Exam.examType = "annually"',
    'final exams': 'Exam.examType = "annually"',
    'weekly tests': 'Exam.examType = "weekly"',
    'marks': 'ExamMark.marksObtained (use percentage for percentage-based queries)',
    'percentage': 'ExamMark.marksObtained divided by paper maxMarks * 100, or use grading scale',
    '90% marks': 'ExamMark.marksObtained >= 90 when marks are percentage-based, otherwise calculate proportionally',
    'pass marks': 'ExamSchedulePaper.passMarks',
    'max marks': 'ExamSchedulePaper.maxMarks',
  },

  sectionTerminology: {
    'section A': 'Section.sectionName = "A"',
    'section B': 'Section.sectionName = "B"',
    'A section': 'Section.sectionName = "A"',
    'B section': 'Section.sectionName = "B"',
    'class': 'Grade + Section combination. Use Grade.gradeName + Section.sectionName',
  },

  attendanceTerminology: {
    'present': 'AttendanceStatus.present',
    'absent': 'AttendanceStatus.absent',
    'late': 'AttendanceStatus.late',
    'today': 'Use current date. AttendanceSession.date = today\'s date AND AttendanceMark.status',
    'attendance percentage': 'Count of present marks / total marks * 100 for a student',
  },

  feeTerminology: {
    'fee payment': 'FeePayment model',
    'paid fees': 'FeePayment where status = "paid"',
    'pending fees': 'FeePayment where status = "pending"',
    'fee due': 'StudentFee where payments don\'t cover totalNegotiatedFee',
    'above 5000': 'FeePayment.amountPaid >= 5000',
    'this month': 'FeePayment.paymentDate within current month',
    'fee refund': 'FeeRefund model',
  },

  studentTerminology: {
    'student details': 'Student model with firstName, lastName, etc.',
    'enrolled students': 'StudentEnrollment where status = "active"',
    'admission number': 'Student.admissionNumber',
    'class teacher': 'TeacherAssignment where role = "class_teacher" → Teacher → TeacherAssignment → SectionSubject → Section',
    'roll number': 'StudentEnrollment.rollNumber',
    'guardian': 'Student.guardianName, guardianContact, guardianRelation',
    'parent': 'Parent model linked via StudentParent',
  },

  teacherTerminology: {
    'teacher': 'Teacher model',
    'staff': 'Teacher model (includes all employee types)',
    'employee': 'Teacher model',
    'driver': 'Teacher where employeeType = "driver"',
    'subject teacher': 'TeacherAssignment where role = "subject_teacher"',
    'class teacher': 'TeacherAssignment where role = "class_teacher"',
    'employee code': 'Teacher.employeeCode',
  },

  infrastructureTerminology: {
    'building': 'Building model',
    'floor': 'Floor model',
    'room': 'Room model',
    'classroom': 'Room where roomType = "classroom"',
    'laboratory': 'Room where roomType = "laboratory"',
    'capacity': 'Room.capacity',
  },

  transportTerminology: {
    'bus': 'Vehicle where category.type = "bus"',
    'van': 'Vehicle where category.type = "van"',
    'pickup point': 'PickupPoint model',
    'transport assignment': 'StudentTransportAssignment model',
    'route': 'Vehicle → VehicleDriverAssignment → PickupPoint',
  },
};

// ─────────────────────────────────────────────────────────────────
// 3. CURATED: Few-Shot Examples
// ─────────────────────────────────────────────────────────────────

const FEW_SHOT_EXAMPLES = [
  {
    question: 'Get all students in section A',
    output: {
      model: 'student',
      operation: 'findMany',
      args: {
        where: {
          section: { sectionName: 'A' },
          tenantId: '__TENANT_ID__',
        },
        include: {
          section: { select: { sectionName: true } },
          grade: { select: { gradeName: true } },
        },
        take: 500,
      },
    },
  },
  {
    question: 'How many students are enrolled in each grade?',
    output: {
      model: 'student',
      operation: 'groupBy',
      args: {
        by: ['gradeId'],
        _count: { id: true },
        where: { tenantId: '__TENANT_ID__', status: 'active' },
      },
    },
  },
  {
    question: 'Show students with attendance below 75% this month',
    output: {
      model: 'student',
      operation: 'findMany',
      args: {
        where: {
          tenantId: '__TENANT_ID__',
          enrollments: {
            some: {
              status: 'active',
              attendanceMarks: {
                some: {
                  session: {
                    date: { gte: '__MONTH_START__', lte: '__MONTH_END__' },
                  },
                },
              },
            },
          },
        },
        include: {
          enrollments: {
            include: {
              section: true,
              attendanceMarks: {
                include: { session: true },
              },
            },
          },
        },
        take: 500,
      },
    },
  },
  {
    question: 'List fee payments above 5000 this month',
    output: {
      model: 'feePayment',
      operation: 'findMany',
      args: {
        where: {
          tenantId: '__TENANT_ID__',
          amountPaid: { gte: 5000 },
          paymentDate: { gte: '__MONTH_START__', lte: '__MONTH_END__' },
        },
        include: {
          studentFee: {
            include: {
              enrollment: {
                include: {
                  student: { select: { firstName: true, lastName: true } },
                },
              },
            },
          },
        },
        take: 500,
      },
    },
  },
  {
    question: 'Show teachers assigned to class 10 section B',
    output: {
      model: 'teacherAssignment',
      operation: 'findMany',
      args: {
        where: {
          tenantId: '__TENANT_ID__',
          sectionSubject: {
            section: {
              sectionName: 'B',
              grade: { gradeName: '10' },
            },
          },
        },
        include: {
          teacher: { select: { fullName: true, employeeCode: true } },
          sectionSubject: {
            include: {
              section: true,
              subject: { select: { subjectName: true } },
            },
          },
        },
        take: 500,
      },
    },
  },
  {
    question: 'Count students present today',
    output: {
      model: 'attendanceMark',
      operation: 'count',
      args: {
        where: {
          tenantId: '__TENANT_ID__',
          status: 'present',
          session: {
            date: '__TODAY__',
          },
        },
      },
    },
  },
];

function formatExamples(examples) {
  return examples.map((ex, i) =>
    `Example ${i + 1}:
Q: "${ex.question}"
A: ${JSON.stringify(ex.output, null, 2)}`
  ).join('\n\n');
}

// ─────────────────────────────────────────────────────────────────
// 4. Build the final system prompt
// ─────────────────────────────────────────────────────────────────

let cachedSystemPrompt = null;

export function getSystemPrompt() {
  if (cachedSystemPrompt) return cachedSystemPrompt;

  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
  const schemaRaw = fs.readFileSync(schemaPath, 'utf-8');

  const models = parsePrismaSchema(schemaRaw);
  const enums = parseEnums(schemaRaw);

  const modelsText = formatModelsForLLM(models);
  const enumsText = formatEnumsForLLM(enums);
  const examplesText = formatExamples(FEW_SHOT_EXAMPLES);

  // Format business glossary as compact text
  const glossaryLines = [];
  for (const [category, terms] of Object.entries(BUSINESS_GLOSSARY)) {
    glossaryLines.push(`\n[${category}]`);
    for (const [term, meaning] of Object.entries(terms)) {
      glossaryLines.push(`  "${term}" → ${meaning}`);
    }
  }
  const glossaryText = glossaryLines.join('\n');

  cachedSystemPrompt = `You are a Prisma query generator for a school management system (Zed School).
Your ONLY job is to convert natural language questions into Prisma Client query parameters.
Output ONLY valid JSON — no explanation, no markdown, no code blocks.

=== DATABASE SCHEMA (auto-generated from prisma/schema.prisma) ===
${modelsText}

=== ENUMS ===
${enumsText}

=== BUSINESS GLOSSARY (human terms → Prisma mappings) ===
${glossaryText}

=== FEW-SHOT EXAMPLES ===
${examplesText}

=== ABSOLUTE RULES ===
1. Output ONLY a JSON object with exactly: { "model": "ModelName", "operation": "findMany|findFirst|count|aggregate|groupBy", "args": { ... } }
2. Always use "__TENANT_ID__" EXACTLY as the tenantId value (we replace it server-side)
3. Only allowed operations: findMany, findFirst, count, aggregate, groupBy
4. Always include "take": 500 in findMany args (unless user specifies a different limit)
5. Use "include" to fetch related data for readable results
6. For date filters, use "__TODAY__", "__MONTH_START__", "__MONTH_END__" placeholders
7. The "args" object must be valid Prisma Client query arguments
8. Model name must be in camelCase as defined in the schema
9. Never invent fields or models — only use what's in the schema above
10. Return ONLY the JSON — nothing before, nothing after`.trim();

  return cachedSystemPrompt;
}

/**
 * Force-rebuild the cached prompt (useful after schema changes without restart).
 */
export function rebuildSystemPrompt() {
  cachedSystemPrompt = null;
  return getSystemPrompt();
}

// ─────────────────────────────────────────────────────────────────
// Export individual components for testing / debugging
// ─────────────────────────────────────────────────────────────────

export {
  parsePrismaSchema,
  formatModelsForLLM,
  parseEnums,
  formatEnumsForLLM,
  BUSINESS_GLOSSARY,
  FEW_SHOT_EXAMPLES,
  formatExamples,
};