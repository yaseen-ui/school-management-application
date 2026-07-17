/**
 * RBAC v2 — Canonical Permission Catalog
 *
 * Single source of truth for all permissions in the system.
 * Every permission is defined here with:
 *   - code: unique identifier (module:action[:scope])
 *   - module: logical feature area
 *   - action: the operation being performed
 *   - scope: (optional) restricts the permission to a specific context
 *   - description: human-readable label
 *
 * These permissions are seeded into the database on application startup.
 * Tenants CANNOT create/modify/delete these — only assign them to roles.
 *
 * Convention: module:action[:scope]
 *   module  = students, attendance, fees, etc.
 *   action  = read | write | edit | delete | manage | export | approve | process | collect | ...
 *   scope   = (optional) "section" | "own" | "assigned"
 */

const PERMISSIONS = {
  // ─────────────────────────────────────────────────
  // Dashboard
  // ─────────────────────────────────────────────────
  'dashboard:view': {
    module: 'dashboard',
    action: 'view',
    scope: null,
    description: 'View dashboard and analytics',
  },

  // ─────────────────────────────────────────────────
  // Users & Roles
  // ─────────────────────────────────────────────────
  'users:read': {
    module: 'users',
    action: 'read',
    scope: null,
    description: 'View users',
  },
  'users:write': {
    module: 'users',
    action: 'write',
    scope: null,
    description: 'Create users',
  },
  'users:edit': {
    module: 'users',
    action: 'edit',
    scope: null,
    description: 'Edit users',
  },
  'users:delete': {
    module: 'users',
    action: 'delete',
    scope: null,
    description: 'Delete users',
  },
  'roles:read': {
    module: 'roles',
    action: 'read',
    scope: null,
    description: 'View roles and permissions',
  },
  'roles:write': {
    module: 'roles',
    action: 'write',
    scope: null,
    description: 'Create roles',
  },
  'roles:edit': {
    module: 'roles',
    action: 'edit',
    scope: null,
    description: 'Edit roles and assign permissions',
  },
  'roles:delete': {
    module: 'roles',
    action: 'delete',
    scope: null,
    description: 'Delete roles',
  },
  'roles:assign': {
    module: 'roles',
    action: 'assign',
    scope: null,
    description: 'Assign roles to users',
  },

  // ─────────────────────────────────────────────────
  // Students
  // ─────────────────────────────────────────────────
  'students:read': {
    module: 'students',
    action: 'read',
    scope: null,
    description: 'View students',
  },
  'students:read:section': {
    module: 'students',
    action: 'read',
    scope: 'section',
    description: 'View students in assigned sections',
  },
  'students:read:own': {
    module: 'students',
    action: 'read',
    scope: 'own',
    description: 'View own linked children',
  },
  'students:write': {
    module: 'students',
    action: 'write',
    scope: null,
    description: 'Create students',
  },
  'students:edit': {
    module: 'students',
    action: 'edit',
    scope: null,
    description: 'Edit students',
  },
  'students:delete': {
    module: 'students',
    action: 'delete',
    scope: null,
    description: 'Delete students',
  },
  'students:promote': {
    module: 'students',
    action: 'promote',
    scope: null,
    description: 'Promote students to next grade',
  },

  // ─────────────────────────────────────────────────
  // Teachers
  // ─────────────────────────────────────────────────
  'teachers:read': {
    module: 'teachers',
    action: 'read',
    scope: null,
    description: 'View teachers',
  },
  'teachers:write': {
    module: 'teachers',
    action: 'write',
    scope: null,
    description: 'Create teachers',
  },
  'teachers:edit': {
    module: 'teachers',
    action: 'edit',
    scope: null,
    description: 'Edit teachers',
  },
  'teachers:delete': {
    module: 'teachers',
    action: 'delete',
    scope: null,
    description: 'Delete teachers',
  },

  // ─────────────────────────────────────────────────
  // Courses
  // ─────────────────────────────────────────────────
  'courses:read': {
    module: 'courses',
    action: 'read',
    scope: null,
    description: 'View courses',
  },
  'courses:write': {
    module: 'courses',
    action: 'write',
    scope: null,
    description: 'Create courses',
  },
  'courses:edit': {
    module: 'courses',
    action: 'edit',
    scope: null,
    description: 'Edit courses',
  },
  'courses:delete': {
    module: 'courses',
    action: 'delete',
    scope: null,
    description: 'Delete courses',
  },

  // ─────────────────────────────────────────────────
  // Grades
  // ─────────────────────────────────────────────────
  'grades:read': {
    module: 'grades',
    action: 'read',
    scope: null,
    description: 'View grades',
  },
  'grades:write': {
    module: 'grades',
    action: 'write',
    scope: null,
    description: 'Create grades',
  },
  'grades:edit': {
    module: 'grades',
    action: 'edit',
    scope: null,
    description: 'Edit grades',
  },
  'grades:delete': {
    module: 'grades',
    action: 'delete',
    scope: null,
    description: 'Delete grades',
  },

  // ─────────────────────────────────────────────────
  // Sections
  // ─────────────────────────────────────────────────
  'sections:read': {
    module: 'sections',
    action: 'read',
    scope: null,
    description: 'View sections',
  },
  'sections:write': {
    module: 'sections',
    action: 'write',
    scope: null,
    description: 'Create sections',
  },
  'sections:edit': {
    module: 'sections',
    action: 'edit',
    scope: null,
    description: 'Edit sections',
  },
  'sections:delete': {
    module: 'sections',
    action: 'delete',
    scope: null,
    description: 'Delete sections',
  },

  // ─────────────────────────────────────────────────
  // Subjects
  // ─────────────────────────────────────────────────
  'subjects:read': {
    module: 'subjects',
    action: 'read',
    scope: null,
    description: 'View subjects',
  },
  'subjects:write': {
    module: 'subjects',
    action: 'write',
    scope: null,
    description: 'Create subjects',
  },
  'subjects:edit': {
    module: 'subjects',
    action: 'edit',
    scope: null,
    description: 'Edit subjects',
  },
  'subjects:delete': {
    module: 'subjects',
    action: 'delete',
    scope: null,
    description: 'Delete subjects',
  },

  // ─────────────────────────────────────────────────
  // Section-Subject Mapping
  // ─────────────────────────────────────────────────
  'section-subjects:read': {
    module: 'section_subjects',
    action: 'read',
    scope: null,
    description: 'View section-subject mappings',
  },
  'section-subjects:write': {
    module: 'section_subjects',
    action: 'write',
    scope: null,
    description: 'Assign subjects to sections',
  },
  'section-subjects:delete': {
    module: 'section_subjects',
    action: 'delete',
    scope: null,
    description: 'Remove subjects from sections',
  },

  // ─────────────────────────────────────────────────
  // Attendance
  // ─────────────────────────────────────────────────
  'attendance:read': {
    module: 'attendance',
    action: 'read',
    scope: null,
    description: 'View attendance records',
  },
  'attendance:read:section': {
    module: 'attendance',
    action: 'read',
    scope: 'section',
    description: 'View attendance for assigned sections',
  },
  'attendance:mark': {
    module: 'attendance',
    action: 'mark',
    scope: null,
    description: 'Mark student attendance',
  },
  'attendance:mark:section': {
    module: 'attendance',
    action: 'mark',
    scope: 'section',
    description: 'Mark attendance for assigned sections',
  },
  'attendance:read:own': {
    module: 'attendance',
    action: 'read',
    scope: 'own',
    description: 'View own child attendance records',
  },
  'attendance:report': {
    module: 'attendance',
    action: 'report',
    scope: null,
    description: 'Generate attendance reports',
  },

  // ─────────────────────────────────────────────────
  // Staff Attendance
  // ─────────────────────────────────────────────────
  'staff-attendance:read': {
    module: 'staff_attendance',
    action: 'read',
    scope: null,
    description: 'View staff attendance',
  },
  'staff-attendance:mark': {
    module: 'staff_attendance',
    action: 'mark',
    scope: null,
    description: 'Mark staff attendance',
  },
  'staff-attendance:report': {
    module: 'staff_attendance',
    action: 'report',
    scope: null,
    description: 'Generate staff attendance reports',
  },

  // ─────────────────────────────────────────────────
  // Exams
  // ─────────────────────────────────────────────────
  'exams:read': {
    module: 'exams',
    action: 'read',
    scope: null,
    description: 'View exams',
  },
  'exams:write': {
    module: 'exams',
    action: 'write',
    scope: null,
    description: 'Create exams',
  },
  'exams:edit': {
    module: 'exams',
    action: 'edit',
    scope: null,
    description: 'Edit exams',
  },
  'exams:delete': {
    module: 'exams',
    action: 'delete',
    scope: null,
    description: 'Delete exams',
  },
  'exams:manage': {
    module: 'exams',
    action: 'manage',
    scope: null,
    description: 'Manage exam configuration',
  },

  // ─────────────────────────────────────────────────
  // Exam Schedules
  // ─────────────────────────────────────────────────
  'exam-schedules:read': {
    module: 'exam_schedules',
    action: 'read',
    scope: null,
    description: 'View exam schedules',
  },
  'exam-schedules:write': {
    module: 'exam_schedules',
    action: 'write',
    scope: null,
    description: 'Create exam schedules',
  },
  'exam-schedules:edit': {
    module: 'exam_schedules',
    action: 'edit',
    scope: null,
    description: 'Edit exam schedules',
  },
  'exam-schedules:delete': {
    module: 'exam_schedules',
    action: 'delete',
    scope: null,
    description: 'Delete exam schedules',
  },

  // ─────────────────────────────────────────────────
  // Marks Entry
  // ─────────────────────────────────────────────────
  'marks:read': {
    module: 'marks',
    action: 'read',
    scope: null,
    description: 'View marks',
  },
  'marks:read:section': {
    module: 'marks',
    action: 'read',
    scope: 'section',
    description: 'View marks for assigned sections',
  },
  'marks:read:own': {
    module: 'marks',
    action: 'read',
    scope: 'own',
    description: 'View own child marks',
  },
  'marks:entry': {
    module: 'marks',
    action: 'entry',
    scope: null,
    description: 'Enter marks',
  },
  'marks:entry:section': {
    module: 'marks',
    action: 'entry',
    scope: 'section',
    description: 'Enter marks for assigned sections',
  },
  'marks:publish': {
    module: 'marks',
    action: 'publish',
    scope: null,
    description: 'Publish / lock marks',
  },

  // ─────────────────────────────────────────────────
  // Results
  // ─────────────────────────────────────────────────
  'results:read': {
    module: 'results',
    action: 'read',
    scope: null,
    description: 'View results',
  },
  'results:read:own': {
    module: 'results',
    action: 'read',
    scope: 'own',
    description: 'View own child results',
  },
  'results:publish': {
    module: 'results',
    action: 'publish',
    scope: null,
    description: 'Publish results',
  },
  'results:export': {
    module: 'results',
    action: 'export',
    scope: null,
    description: 'Export results',
  },

  // ─────────────────────────────────────────────────
  // Grading Scales
  // ─────────────────────────────────────────────────
  'grading:read': {
    module: 'grading',
    action: 'read',
    scope: null,
    description: 'View grading scales',
  },
  'grading:write': {
    module: 'grading',
    action: 'write',
    scope: null,
    description: 'Create grading scales',
  },
  'grading:edit': {
    module: 'grading',
    action: 'edit',
    scope: null,
    description: 'Edit grading scales',
  },
  'grading:delete': {
    module: 'grading',
    action: 'delete',
    scope: null,
    description: 'Delete grading scales',
  },

  // ─────────────────────────────────────────────────
  // Fees
  // ─────────────────────────────────────────────────
  'fee-heads:read': {
    module: 'fee_heads',
    action: 'read',
    scope: null,
    description: 'View fee heads',
  },
  'fee-heads:write': {
    module: 'fee_heads',
    action: 'write',
    scope: null,
    description: 'Create fee heads',
  },
  'fee-heads:edit': {
    module: 'fee_heads',
    action: 'edit',
    scope: null,
    description: 'Edit fee heads',
  },
  'fee-heads:delete': {
    module: 'fee_heads',
    action: 'delete',
    scope: null,
    description: 'Delete fee heads',
  },
  'fee-terms:read': {
    module: 'fee_terms',
    action: 'read',
    scope: null,
    description: 'View fee terms',
  },
  'fee-terms:write': {
    module: 'fee_terms',
    action: 'write',
    scope: null,
    description: 'Create fee terms',
  },
  'fee-terms:edit': {
    module: 'fee_terms',
    action: 'edit',
    scope: null,
    description: 'Edit fee terms',
  },
  'fee-terms:delete': {
    module: 'fee_terms',
    action: 'delete',
    scope: null,
    description: 'Delete fee terms',
  },
  'section-fees:read': {
    module: 'section_fees',
    action: 'read',
    scope: null,
    description: 'View section fees',
  },
  'section-fees:write': {
    module: 'section_fees',
    action: 'write',
    scope: null,
    description: 'Configure section fees',
  },
  'section-fees:delete': {
    module: 'section_fees',
    action: 'delete',
    scope: null,
    description: 'Remove section fees',
  },
  'student-fees:read': {
    module: 'student_fees',
    action: 'read',
    scope: null,
    description: 'View student fees',
  },
  'student-fees:read:own': {
    module: 'student_fees',
    action: 'read',
    scope: 'own',
    description: 'View own child fees',
  },
  'student-fees:write': {
    module: 'student_fees',
    action: 'write',
    scope: null,
    description: 'Assign fees to students',
  },
  'fee-payments:read': {
    module: 'fee_payments',
    action: 'read',
    scope: null,
    description: 'View fee payments',
  },
  'fee-payments:collect': {
    module: 'fee_payments',
    action: 'collect',
    scope: null,
    description: 'Collect fee payments',
  },
  'fee-payments:read:own': {
    module: 'fee_payments',
    action: 'read',
    scope: 'own',
    description: 'View own child payments',
  },
  'fee-refunds:read': {
    module: 'fee_refunds',
    action: 'read',
    scope: null,
    description: 'View fee refunds',
  },
  'fee-refunds:process': {
    module: 'fee_refunds',
    action: 'process',
    scope: null,
    description: 'Process fee refunds',
  },

  // ─────────────────────────────────────────────────
  // Payroll
  // ─────────────────────────────────────────────────
  'payroll:read': {
    module: 'payroll',
    action: 'read',
    scope: null,
    description: 'View payroll',
  },
  'payroll:process': {
    module: 'payroll',
    action: 'process',
    scope: null,
    description: 'Process payroll batches',
  },
  'salary-components:read': {
    module: 'salary_components',
    action: 'read',
    scope: null,
    description: 'View salary components',
  },
  'salary-components:write': {
    module: 'salary_components',
    action: 'write',
    scope: null,
    description: 'Create salary components',
  },
  'compensation:read': {
    module: 'compensation',
    action: 'read',
    scope: null,
    description: 'View employee compensation',
  },
  'compensation:write': {
    module: 'compensation',
    action: 'write',
    scope: null,
    description: 'Configure employee compensation',
  },

  // ─────────────────────────────────────────────────
  // Accounts
  // ─────────────────────────────────────────────────
  'accounts:read': {
    module: 'accounts',
    action: 'read',
    scope: null,
    description: 'View chart of accounts',
  },
  'accounts:write': {
    module: 'accounts',
    action: 'write',
    scope: null,
    description: 'Create account entries',
  },
  'accounts:edit': {
    module: 'accounts',
    action: 'edit',
    scope: null,
    description: 'Edit account entries',
  },
  'transactions:read': {
    module: 'transactions',
    action: 'read',
    scope: null,
    description: 'View transactions',
  },
  'transactions:write': {
    module: 'transactions',
    action: 'write',
    scope: null,
    description: 'Record transactions',
  },

  // ─────────────────────────────────────────────────
  // Timetable
  // ─────────────────────────────────────────────────
  'timetable:read': {
    module: 'timetable',
    action: 'read',
    scope: null,
    description: 'View timetable',
  },
  'timetable:write': {
    module: 'timetable',
    action: 'write',
    scope: null,
    description: 'Create timetable entries',
  },
  'timetable:edit': {
    module: 'timetable',
    action: 'edit',
    scope: null,
    description: 'Edit timetable',
  },
  'timetable:delete': {
    module: 'timetable',
    action: 'delete',
    scope: null,
    description: 'Delete timetable entries',
  },
  'timetable-structures:read': {
    module: 'timetable_structures',
    action: 'read',
    scope: null,
    description: 'View timetable structures',
  },
  'timetable-structures:write': {
    module: 'timetable_structures',
    action: 'write',
    scope: null,
    description: 'Create timetable structures',
  },
  'timetable-periods:read': {
    module: 'timetable_periods',
    action: 'read',
    scope: null,
    description: 'View periods',
  },
  'timetable-periods:write': {
    module: 'timetable_periods',
    action: 'write',
    scope: null,
    description: 'Create periods',
  },

  // ─────────────────────────────────────────────────
  // Teacher Assignments & Capabilities
  // ─────────────────────────────────────────────────
  'teacher-assignments:read': {
    module: 'teacher_assignments',
    action: 'read',
    scope: null,
    description: 'View teacher assignments',
  },
  'teacher-assignments:write': {
    module: 'teacher_assignments',
    action: 'write',
    scope: null,
    description: 'Assign teachers',
  },
  'teacher-capabilities:read': {
    module: 'teacher_capabilities',
    action: 'read',
    scope: null,
    description: 'View teacher capabilities',
  },
  'teacher-capabilities:write': {
    module: 'teacher_capabilities',
    action: 'write',
    scope: null,
    description: 'Manage teacher capabilities',
  },
  'teacher-availability:read': {
    module: 'teacher_availability',
    action: 'read',
    scope: null,
    description: 'View teacher availability',
  },
  'teacher-availability:write': {
    module: 'teacher_availability',
    action: 'write',
    scope: null,
    description: 'Set teacher availability',
  },

  // ─────────────────────────────────────────────────
  // Leave Management
  // ─────────────────────────────────────────────────
  'leave:read': {
    module: 'leave',
    action: 'read',
    scope: null,
    description: 'View leave requests',
  },
  'leave:read:own': {
    module: 'leave',
    action: 'read',
    scope: 'own',
    description: 'View own leave requests',
  },
  'leave:apply': {
    module: 'leave',
    action: 'apply',
    scope: null,
    description: 'Apply for leave',
  },
  'leave:approve': {
    module: 'leave',
    action: 'approve',
    scope: null,
    description: 'Approve leave requests',
  },
  'leave:manage': {
    module: 'leave',
    action: 'manage',
    scope: null,
    description: 'Manage leave categories and configuration',
  },

  // ─────────────────────────────────────────────────
  // Holidays
  // ─────────────────────────────────────────────────
  'holidays:read': {
    module: 'holidays',
    action: 'read',
    scope: null,
    description: 'View holidays',
  },
  'holidays:write': {
    module: 'holidays',
    action: 'write',
    scope: null,
    description: 'Create holidays',
  },
  'holidays:edit': {
    module: 'holidays',
    action: 'edit',
    scope: null,
    description: 'Edit holidays',
  },
  'holidays:delete': {
    module: 'holidays',
    action: 'delete',
    scope: null,
    description: 'Delete holidays',
  },

  // ─────────────────────────────────────────────────
  // Parents
  // ─────────────────────────────────────────────────
  'parents:read': {
    module: 'parents',
    action: 'read',
    scope: null,
    description: 'View parents',
  },
  'parents:write': {
    module: 'parents',
    action: 'write',
    scope: null,
    description: 'Register parents',
  },
  'parents:edit': {
    module: 'parents',
    action: 'edit',
    scope: null,
    description: 'Edit parents',
  },
  'parent-portal:access': {
    module: 'parent_portal',
    action: 'access',
    scope: null,
    description: 'Access parent portal features',
  },

  // ─────────────────────────────────────────────────
  // Transportation
  // ─────────────────────────────────────────────────
  'transport:read': {
    module: 'transport',
    action: 'read',
    scope: null,
    description: 'View transport data',
  },
  'transport:read:assigned': {
    module: 'transport',
    action: 'read',
    scope: 'assigned',
    description: 'View assigned routes',
  },
  'transport:write': {
    module: 'transport',
    action: 'write',
    scope: null,
    description: 'Manage vehicles and routes',
  },
  'transport:assign': {
    module: 'transport',
    action: 'assign',
    scope: null,
    description: 'Assign students to transport',
  },

  // ─────────────────────────────────────────────────
  // Infrastructure
  // ─────────────────────────────────────────────────
  'infrastructure:read': {
    module: 'infrastructure',
    action: 'read',
    scope: null,
    description: 'View buildings, floors, rooms',
  },
  'infrastructure:write': {
    module: 'infrastructure',
    action: 'write',
    scope: null,
    description: 'Create infrastructure records',
  },
  'infrastructure:edit': {
    module: 'infrastructure',
    action: 'edit',
    scope: null,
    description: 'Edit infrastructure',
  },
  'infrastructure:delete': {
    module: 'infrastructure',
    action: 'delete',
    scope: null,
    description: 'Delete infrastructure',
  },

  // ─────────────────────────────────────────────────
  // Inventory / Store
  // ─────────────────────────────────────────────────
  'store:read': {
    module: 'store',
    action: 'read',
    scope: null,
    description: 'View store items',
  },
  'store:write': {
    module: 'store',
    action: 'write',
    scope: null,
    description: 'Manage store inventory',
  },
  'store:order': {
    module: 'store',
    action: 'order',
    scope: null,
    description: 'Place store orders',
  },
  'store:order:own': {
    module: 'store',
    action: 'order',
    scope: 'own',
    description: 'Place orders for own child',
  },
  'store:process': {
    module: 'store',
    action: 'process',
    scope: null,
    description: 'Process store orders, dues, returns',
  },

  // ─────────────────────────────────────────────────
  // Visitors
  // ─────────────────────────────────────────────────
  'visitors:read': {
    module: 'visitors',
    action: 'read',
    scope: null,
    description: 'View visitors',
  },
  'visitors:write': {
    module: 'visitors',
    action: 'write',
    scope: null,
    description: 'Register visitors',
  },
  'visitors:approve': {
    module: 'visitors',
    action: 'approve',
    scope: null,
    description: 'Approve visitor access',
  },
  'visitors:check-in': {
    module: 'visitors',
    action: 'check_in',
    scope: null,
    description: 'Check in visitors',
  },

  // ─────────────────────────────────────────────────
  // Imports
  // ─────────────────────────────────────────────────
  'imports:execute': {
    module: 'imports',
    action: 'execute',
    scope: null,
    description: 'Import data (students, teachers, etc.)',
  },

  // ─────────────────────────────────────────────────
  // Settings
  // ─────────────────────────────────────────────────
  'settings:read': {
    module: 'settings',
    action: 'read',
    scope: null,
    description: 'View settings',
  },
  'settings:write': {
    module: 'settings',
    action: 'write',
    scope: null,
    description: 'Update settings',
  },
  'academic-years:read': {
    module: 'academic_years',
    action: 'read',
    scope: null,
    description: 'View academic years',
  },
  'academic-years:write': {
    module: 'academic_years',
    action: 'write',
    scope: null,
    description: 'Create academic years',
  },
  'academic-years:edit': {
    module: 'academic_years',
    action: 'edit',
    scope: null,
    description: 'Edit academic years',
  },
  'tenants:read': {
    module: 'tenants',
    action: 'read',
    scope: null,
    description: 'View tenants (company-level)',
  },
  'tenants:write': {
    module: 'tenants',
    action: 'write',
    scope: null,
    description: 'Create tenants (company-level)',
  },

  // ─────────────────────────────────────────────────
  // Reports
  // ─────────────────────────────────────────────────
  'reports:view': {
    module: 'reports',
    action: 'view',
    scope: null,
    description: 'View reports',
  },
  'reports:export': {
    module: 'reports',
    action: 'export',
    scope: null,
    description: 'Export reports',
  },

  // ─────────────────────────────────────────────────
  // Wildcards
  // ─────────────────────────────────────────────────
  'admin:super': {
    module: 'admin',
    action: 'super',
    scope: null,
    description: 'Full system access (wildcard)',
  },
};

/**
 * Helper to get all permission codes as an array.
 * Useful for seeding or validation.
 * @returns {string[]}
 */
function getAllCodes() {
  return Object.keys(PERMISSIONS);
}

/**
 * Helper to get permissions grouped by module.
 * Useful for UI rendering (permission picker grouped by module).
 * @returns {Record<string, Array<{ code: string, action: string, scope: string|null, description: string }>>}
 */
function getPermissionsByModule() {
  const grouped = {};
  for (const [code, def] of Object.entries(PERMISSIONS)) {
    if (!grouped[def.module]) {
      grouped[def.module] = [];
    }
    grouped[def.module].push({
      code,
      action: def.action,
      scope: def.scope,
      description: def.description,
    });
  }
  return grouped;
}

export { PERMISSIONS, getAllCodes, getPermissionsByModule };
