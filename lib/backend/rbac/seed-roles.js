/**
 * RBAC v2 — Default Role Seeder
 *
 * Seeds pre-defined roles, permissions, and groups for a newly created tenant.
 * Each default role gets assigned to a group and receives its initial permissions.
 *
 * Called automatically when a new tenant is created (via tenant.service.js).
 * Idempotent — uses upsert, safe to re-run on existing tenants.
 *
 * Role Templates (10 default roles):
 *   1. School Admin        → admin:super
 *   2. Principal           → all except roles:delete, payroll:process, settings:write
 *   3. Academic Coordinator → academic modules (students, teachers, courses, etc.)
 *   4. Class Teacher       → scoped to their sections
 *   5. Subject Teacher     → scoped to their sections/subjects
 *   6. Accountant          → financial modules
 *   7. Receptionist/Clerk  → read/write students, visitors, imports
 *   8. Parent              → own-child scoped
 *   9. Driver              → transport:read:assigned
 *  10. Transport Manager   → transport:*
 */

import { prisma } from '../lib/prisma.js';

// ─────────────────────────────────────────────────────────────────────
// Default Role Definitions
// ─────────────────────────────────────────────────────────────────────

const DEFAULT_ROLES = [
  {
    name: 'School Admin',
    group: 'Administration',
    description: 'Full system access — manage everything within the school',
    permissions: ['admin:super'],
  },
  {
    name: 'Principal',
    group: 'Administration',
    description: 'Oversees all academic and administrative operations',
    permissions: [
      'dashboard:view',
      'users:read', 'users:write', 'users:edit',
      'roles:read', 'roles:write', 'roles:edit', 'roles:assign',
      'students:read', 'students:write', 'students:edit', 'students:delete', 'students:promote',
      'teachers:read', 'teachers:write', 'teachers:edit',
      'courses:read', 'courses:write', 'courses:edit',
      'grades:read', 'grades:write', 'grades:edit',
      'sections:read', 'sections:write', 'sections:edit',
      'subjects:read', 'subjects:write', 'subjects:edit',
      'section-subjects:read', 'section-subjects:write',
      'attendance:read', 'attendance:mark', 'attendance:report',
      'staff-attendance:read', 'staff-attendance:mark', 'staff-attendance:report',
      'exams:read', 'exams:write', 'exams:edit', 'exams:manage',
      'exam-schedules:read', 'exam-schedules:write', 'exam-schedules:edit',
      'marks:read', 'marks:entry', 'marks:publish',
      'results:read', 'results:publish', 'results:export',
      'grading:read', 'grading:write', 'grading:edit',
      'fee-heads:read', 'fee-terms:read', 'section-fees:read', 'student-fees:read',
      'fee-payments:read', 'fee-refunds:read',
      'accounts:read', 'transactions:read',
      'timetable:read', 'timetable:write', 'timetable:edit',
      'timetable-structures:read', 'timetable-structures:write',
      'timetable-periods:read', 'timetable-periods:write',
      'teacher-assignments:read', 'teacher-assignments:write',
      'teacher-capabilities:read', 'teacher-capabilities:write',
      'teacher-availability:read', 'teacher-availability:write',
      'leave:read', 'leave:approve', 'leave:manage',
      'holidays:read', 'holidays:write', 'holidays:edit',
      'parents:read', 'parents:write', 'parents:edit',
      'transport:read', 'transport:write', 'transport:assign',
      'infrastructure:read', 'infrastructure:write', 'infrastructure:edit',
      'store:read', 'store:write', 'store:order', 'store:process',
      'visitors:read', 'visitors:write', 'visitors:approve', 'visitors:check-in',
      'imports:execute',
      'settings:read',
      'academic-years:read', 'academic-years:write', 'academic-years:edit',
      'reports:view', 'reports:export',
      'query-bot:ask',
    ],
  },
  {
    name: 'Academic Coordinator',
    group: 'Academic Staff',
    description: 'Manages curriculum, teachers, timetables, and academic operations',
    permissions: [
      'dashboard:view',
      'students:read', 'students:write', 'students:edit',
      'teachers:read', 'teachers:write', 'teachers:edit',
      'courses:read', 'courses:write', 'courses:edit',
      'grades:read', 'grades:write', 'grades:edit',
      'sections:read', 'sections:write', 'sections:edit',
      'subjects:read', 'subjects:write', 'subjects:edit',
      'section-subjects:read', 'section-subjects:write',
      'attendance:read',
      'exams:read', 'exams:write', 'exams:edit',
      'exam-schedules:read', 'exam-schedules:write', 'exam-schedules:edit',
      'marks:read', 'marks:entry', 'marks:publish',
      'results:read', 'results:publish',
      'timetable:read', 'timetable:write', 'timetable:edit',
      'timetable-structures:read', 'timetable-structures:write',
      'timetable-periods:read', 'timetable-periods:write',
      'teacher-assignments:read', 'teacher-assignments:write',
      'teacher-capabilities:read', 'teacher-capabilities:write',
      'teacher-availability:read',
      'holidays:read', 'holidays:write', 'holidays:edit',
      'academic-years:read', 'academic-years:write', 'academic-years:edit',
      'reports:view',
    ],
  },
  {
    name: 'Class Teacher',
    group: 'Teaching Staff',
    description: 'Manages assigned section — attendance, marks, student records',
    permissions: [
      'dashboard:view',
      'students:read:section',
      'attendance:read:section', 'attendance:mark:section',
      'marks:read:section', 'marks:entry:section',
      'teacher-availability:read', 'teacher-availability:write',
      'leave:read:own', 'leave:apply',
      'holidays:read',
      'timetable:read',
      'teacher-assignments:read',
      'reports:view',
    ],
  },
  {
    name: 'Subject Teacher',
    group: 'Teaching Staff',
    description: 'Teaches assigned subjects — marks entry, attendance for assigned sections',
    permissions: [
      'dashboard:view',
      'students:read:section',
      'attendance:read:section', 'attendance:mark:section',
      'marks:read:section', 'marks:entry:section',
      'teacher-availability:read', 'teacher-availability:write',
      'leave:read:own', 'leave:apply',
      'holidays:read',
      'timetable:read',
      'teacher-assignments:read',
      'reports:view',
    ],
  },
  {
    name: 'Accountant',
    group: 'Finance',
    description: 'Manages all financial operations — fees, payments, refunds, accounts',
    permissions: [
      'dashboard:view',
      'fee-heads:read', 'fee-heads:write', 'fee-heads:edit', 'fee-heads:delete',
      'fee-terms:read', 'fee-terms:write', 'fee-terms:edit', 'fee-terms:delete',
      'section-fees:read', 'section-fees:write', 'section-fees:delete',
      'student-fees:read', 'student-fees:write',
      'fee-payments:read', 'fee-payments:collect',
      'fee-refunds:read', 'fee-refunds:process',
      'accounts:read', 'accounts:write', 'accounts:edit',
      'transactions:read', 'transactions:write',
      'students:read',
      'reports:view', 'reports:export',
    ],
  },
  {
    name: 'Receptionist / Clerk',
    group: 'Administration',
    description: 'Front-desk operations — student registration, visitor management, data imports',
    permissions: [
      'dashboard:view',
      'students:read', 'students:write',
      'visitors:read', 'visitors:write', 'visitors:approve', 'visitors:check-in',
      'imports:execute',
      'parents:read',
      'holidays:read',
      'leave:read',
    ],
  },
  {
    name: 'Parent',
    group: 'Parents',
    description: 'View own children — attendance, marks, results, fees, store orders',
    permissions: [
      'dashboard:view',
      'students:read:own',
      'attendance:read:own',
      'marks:read:own',
      'results:read:own',
      'student-fees:read:own',
      'fee-payments:read:own',
      'leave:read:own',
      'store:order:own',
      'parent-portal:access',
    ],
  },
  {
    name: 'Driver',
    group: 'Transport',
    description: 'View assigned routes and students on their vehicle',
    permissions: [
      'dashboard:view',
      'transport:read:assigned',
      'students:read:section',
      'leave:read:own', 'leave:apply',
    ],
  },
  {
    name: 'Transport Manager',
    group: 'Transport',
    description: 'Manages all transport operations — vehicles, routes, driver assignments',
    permissions: [
      'dashboard:view',
      'transport:read', 'transport:write', 'transport:assign',
      'students:read',
      'leave:read',
      'holidays:read',
      'reports:view',
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────
// Default Groups
// ─────────────────────────────────────────────────────────────────────

const DEFAULT_GROUPS = [
  { name: 'Administration', description: 'Principal, Admin, Clerk, Receptionist' },
  { name: 'Teaching Staff', description: 'Class Teacher, Subject Teacher, Lab Incharge' },
  { name: 'Academic Staff', description: 'Academic Coordinator, Exam Coordinator' },
  { name: 'Finance', description: 'Accountant, Bursar' },
  { name: 'Transport', description: 'Transport Manager, Driver, Conductor' },
  { name: 'Parents', description: 'All parent users' },
  { name: 'Support Staff', description: 'Office Boy, Cleaner, Security' },
];

// ─────────────────────────────────────────────────────────────────────
// Seeder
// ─────────────────────────────────────────────────────────────────────

/**
 * Seed default roles, permissions, and groups for a tenant.
 * Idempotent — safe to call multiple times for the same tenant.
 *
 * @param {string} tenantId - The tenant to seed roles for
 * @returns {Promise<{ rolesCreated: number, rolesSkipped: number, permissionsAssigned: number }>}
 */
async function seedDefaultRoles(tenantId) {
  let rolesCreated = 0;
  let rolesSkipped = 0;
  let permissionsAssigned = 0;

  // 1. Seed groups first (idempotent)
  for (const groupDef of DEFAULT_GROUPS) {
    await prisma.group.upsert({
      where: { uniqueGroupNamePerTenant: { tenantId, groupName: groupDef.name } },
      create: { tenantId, groupName: groupDef.name, description: groupDef.description },
      update: { description: groupDef.description },
    });
  }

  // 2. Seed roles and assign permissions
  for (const roleDef of DEFAULT_ROLES) {
    // Create or update the role
    const role = await prisma.role.upsert({
      where: { uniqueRoleNamePerTenant: { tenantId, roleName: roleDef.name } },
      create: {
        tenantId,
        roleName: roleDef.name,
        description: roleDef.description,
        isDefault: true,
      },
      update: {
        description: roleDef.description,
        isDefault: true,
      },
    });

    // Detect if this role already existed
    const isNew = role.createdAt.getTime() === role.updatedAt.getTime();
    if (isNew) {
      rolesCreated++;
    } else {
      rolesSkipped++;
    }

    // 3. Assign permissions to role (idempotent via upsert)
    for (const permCode of roleDef.permissions) {
      const permission = await prisma.permission.findUnique({
        where: { code: permCode },
        select: { id: true },
      });

      if (!permission) {
        console.warn(`[SeedRoles] Permission "${permCode}" not found in catalog — skipping for role "${roleDef.name}"`);
        continue;
      }

      // Use raw upsert via the composite primary key
      await prisma.$executeRawUnsafe(
        `INSERT INTO "role_permissions" ("roleId", "permissionId", "tenantId", "createdAt")
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT ("roleId", "permissionId", "tenantId") DO NOTHING`,
        role.id,
        permission.id,
        tenantId,
      );
      permissionsAssigned++;
    }

    // 4. Assign role to group
    const group = await prisma.group.findUnique({
      where: { uniqueGroupNamePerTenant: { tenantId, groupName: roleDef.group } },
      select: { id: true },
    });

    if (group) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO "role_groups" ("roleId", "groupId", "tenantId", "createdAt")
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT ("roleId", "groupId", "tenantId") DO NOTHING`,
        role.id,
        group.id,
        tenantId,
      );
    }
  }

  console.log(
    `✅ RBAC: Seeded ${DEFAULT_ROLES.length} roles for tenant ${tenantId} ` +
    `(${rolesCreated} created, ${rolesSkipped} already existed, ${permissionsAssigned} permissions assigned)`
  );

  return { rolesCreated, rolesSkipped, permissionsAssigned };
}

// ─────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────
export { seedDefaultRoles, DEFAULT_ROLES, DEFAULT_GROUPS };