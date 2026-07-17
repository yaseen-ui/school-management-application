# RBAC Implementation Plan

## Overview

Transform the existing flat role-permission system into a robust, scalable, multi-tenant RBAC (Role-Based Access Control) framework. This plan covers 12 sequential phases — from database schema redesign through frontend authorization.

### Core Design Principles

- **Identity in JWT, Authority from Server** — JWT carries lightweight identity (`userId`, `tenantId`, `roleIds[]`, `permVersion`). Permissions are resolved server-side on every request.
- **Two-Layer Enforcement** — Action-level (`can user perform this operation?`) + Resource-level (`can user access this specific data?`).
- **Backend is the Authority** — Frontend guards are UX hints only. Every API handler enforces authorization independently.
- **Groups are Organizational** — Groups help organize roles, enable bulk operations, and provide templates. They do not create permission inheritance chains.
- **No Dependencies on Redis or Edge Middleware** — Keep the stack simple. In-memory request-scoped caching with replaceable architecture.

---

## Phase 1: Database Schema Migration

### Objective
Replace the flat `Role.permissions Json` field with a first-class `Permission` model and many-to-many relationships. Add Groups, Audit Logs, and support for multiple roles per user.

### Current State
```prisma
model User {
  roleId  String?   // one-to-one with Role
  role    Role?
}

model Role {
  permissions Json   // flat array: ["manage_users", "view_students"]
  users      User[]
}
```

### Target State

```prisma
// --- New: Canonical Permission catalog ---
model Permission {
  id          String   @id @default(uuid())
  code        String   @unique      // e.g., "students:read"
  module      String                // e.g., "students"
  action      String                // e.g., "read", "write", "delete", "manage"
  scope       String?               // e.g., "section", "own", null
  description String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  rolePermissions RolePermission[]
  @@map("permissions")
}

// --- New: Many-to-many Role ↔ Permission ---
model RolePermission {
  roleId       String
  permissionId String
  tenantId     String
  createdAt    DateTime @default(now())

  role       Role       @relation(fields: [roleId, tenantId], references: [id, tenantId], onDelete: Cascade)
  permission Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@id([roleId, permissionId, tenantId])
  @@map("role_permissions")
}

// --- Modified: Role (drop permissions Json) ---
model Role {
  id          String   @id @default(uuid())
  tenantId    String
  roleName    String
  description String?
  isDefault   Boolean  @default(false)

  createdById String?
  updatedById String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tenant          Tenant           @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  userRoles       UserRole[]
  rolePermissions RolePermission[]
  roleGroups      RoleGroup[]

  @@unique([id, tenantId])
  @@unique([tenantId, roleName])
  @@map("roles")
}

// --- New: Many-to-many User ↔ Role (replaces user.roleId) ---
model UserRole {
  userId    String
  roleId    String
  tenantId  String
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role Role @relation(fields: [roleId, tenantId], references: [id, tenantId], onDelete: Cascade)

  @@id([userId, roleId, tenantId])
  @@map("user_roles")
}

// --- Modified: User (drop roleId, add permVersion) ---
model User {
  // ... existing fields ...
  roleId      String?   // REMOVE this
  role        Role?     // REMOVE relation
  permVersion Int       @default(0)   // ADD: bumped when roles/permissions change
  userRoles   UserRole[]              // ADD: multiple roles
}

// --- New: Group model ---
model Group {
  id          String   @id @default(uuid())
  tenantId    String
  groupName   String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  tenant     Tenant      @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  roleGroups RoleGroup[]

  @@unique([id, tenantId])
  @@unique([tenantId, groupName])
  @@map("groups")
}

// --- New: Many-to-many Role ↔ Group ---
model RoleGroup {
  roleId    String
  groupId   String
  tenantId  String
  createdAt DateTime @default(now())

  role  Role  @relation(fields: [roleId, tenantId], references: [id, tenantId], onDelete: Cascade)
  group Group @relation(fields: [groupId, tenantId], references: [id, tenantId], onDelete: Cascade)

  @@id([roleId, groupId, tenantId])
  @@map("role_groups")
}

// --- New: Audit Trail ---
model AuditLog {
  id         String   @id @default(uuid())
  tenantId   String?
  actorId    String?  // user who performed the action
  action     String   // "role.created", "permission.denied", "fee.refunded"
  targetType String?  // "Role", "User", "FeePayment"
  targetId   String?
  details    Json?    // optional context payload
  ipAddress  String?
  createdAt  DateTime @default(now())

  @@index([tenantId, createdAt])
  @@index([actorId])
  @@map("audit_logs")
}
```

### Migration Steps

1. Create migration SQL (Prisma migrate dev)
2. Data migration script: for each existing `Role`, parse `permissions Json` → create `RolePermission` rows mapping to canonical `Permission` codes
3. Seed `Permission` table with canonical permission codes
4. For existing `User` records with `roleId`, create `UserRole` rows
5. Drop `User.roleId` and `Role.permissions` columns
6. Verify data integrity

### Files to Create
- `prisma/migrations/..._rbac_schema_v2/migration.sql`
- `scripts/migrate-roles-to-v2.ts`

### Files to Modify
- `prisma/schema.prisma`

---

## Phase 2: Permission Registry

### Objective
Create a single source of truth for all permissions in the system. Every permission is defined here as code and seeded into the database on application startup.

### Permission Code Convention

```
module:action[:scope]

module  = logical feature area (students, attendance, fees, etc.)
action  = read | write | delete | manage | export | approve | process | collect
scope   = (optional) "section" | "own" | "assigned"
```

### Complete Permission Catalog

```javascript
// lib/backend/rbac/permissions.js

const PERMISSIONS = {
  // ── Dashboard ──
  'dashboard:view':               { module: 'dashboard', action: 'view', description: 'View dashboard and analytics' },

  // ── Users & Roles ──
  'users:read':                   { module: 'users', action: 'read', description: 'View users' },
  'users:write':                  { module: 'users', action: 'write', description: 'Create users' },
  'users:edit':                   { module: 'users', action: 'edit', description: 'Edit users' },
  'users:delete':                 { module: 'users', action: 'delete', description: 'Delete users' },
  'roles:read':                   { module: 'roles', action: 'read', description: 'View roles and permissions' },
  'roles:write':                  { module: 'roles', action: 'write', description: 'Create roles' },
  'roles:edit':                   { module: 'roles', action: 'edit', description: 'Edit roles and assign permissions' },
  'roles:delete':                 { module: 'roles', action: 'delete', description: 'Delete roles' },
  'roles:assign':                 { module: 'roles', action: 'assign', description: 'Assign roles to users' },

  // ── Students ──
  'students:read':                { module: 'students', action: 'read', description: 'View students' },
  'students:read:section':        { module: 'students', action: 'read', scope: 'section', description: 'View students in assigned sections' },
  'students:read:own':            { module: 'students', action: 'read', scope: 'own', description: 'View own linked children' },
  'students:write':               { module: 'students', action: 'write', description: 'Create students' },
  'students:edit':                { module: 'students', action: 'edit', description: 'Edit students' },
  'students:delete':              { module: 'students', action: 'delete', description: 'Delete students' },
  'students:promote':             { module: 'students', action: 'promote', description: 'Promote students to next grade' },

  // ── Teachers ──
  'teachers:read':                { module: 'teachers', action: 'read', description: 'View teachers' },
  'teachers:write':               { module: 'teachers', action: 'write', description: 'Create teachers' },
  'teachers:edit':                { module: 'teachers', action: 'edit', description: 'Edit teachers' },
  'teachers:delete':              { module: 'teachers', action: 'delete', description: 'Delete teachers' },

  // ── Courses ──
  'courses:read':                 { module: 'courses', action: 'read', description: 'View courses' },
  'courses:write':                { module: 'courses', action: 'write', description: 'Create courses' },
  'courses:edit':                 { module: 'courses', action: 'edit', description: 'Edit courses' },
  'courses:delete':               { module: 'courses', action: 'delete', description: 'Delete courses' },

  // ── Grades ──
  'grades:read':                  { module: 'grades', action: 'read', description: 'View grades' },
  'grades:write':                 { module: 'grades', action: 'write', description: 'Create grades' },
  'grades:edit':                  { module: 'grades', action: 'edit', description: 'Edit grades' },
  'grades:delete':                { module: 'grades', action: 'delete', description: 'Delete grades' },

  // ── Sections ──
  'sections:read':                { module: 'sections', action: 'read', description: 'View sections' },
  'sections:write':               { module: 'sections', action: 'write', description: 'Create sections' },
  'sections:edit':                { module: 'sections', action: 'edit', description: 'Edit sections' },
  'sections:delete':              { module: 'sections', action: 'delete', description: 'Delete sections' },

  // ── Subjects ──
  'subjects:read':                { module: 'subjects', action: 'read', description: 'View subjects' },
  'subjects:write':               { module: 'subjects', action: 'write', description: 'Create subjects' },
  'subjects:edit':                { module: 'subjects', action: 'edit', description: 'Edit subjects' },
  'subjects:delete':              { module: 'subjects', action: 'delete', description: 'Delete subjects' },

  // ── Section-Subject Mapping ──
  'section-subjects:read':        { module: 'section_subjects', action: 'read', description: 'View section-subject mappings' },
  'section-subjects:write':       { module: 'section_subjects', action: 'write', description: 'Assign subjects to sections' },
  'section-subjects:delete':      { module: 'section_subjects', action: 'delete', description: 'Remove subjects from sections' },

  // ── Attendance ──
  'attendance:read':              { module: 'attendance', action: 'read', description: 'View attendance records' },
  'attendance:read:section':      { module: 'attendance', action: 'read', scope: 'section', description: 'View attendance for assigned sections' },
  'attendance:mark':              { module: 'attendance', action: 'mark', description: 'Mark student attendance' },
  'attendance:mark:section':      { module: 'attendance', action: 'mark', scope: 'section', description: 'Mark attendance for assigned sections' },
  'attendance:report':            { module: 'attendance', action: 'report', description: 'Generate attendance reports' },

  // ── Staff Attendance ──
  'staff-attendance:read':        { module: 'staff_attendance', action: 'read', description: 'View staff attendance' },
  'staff-attendance:mark':        { module: 'staff_attendance', action: 'mark', description: 'Mark staff attendance' },
  'staff-attendance:report':      { module: 'staff_attendance', action: 'report', description: 'Generate staff attendance reports' },

  // ── Exams ──
  'exams:read':                   { module: 'exams', action: 'read', description: 'View exams' },
  'exams:write':                  { module: 'exams', action: 'write', description: 'Create exams' },
  'exams:edit':                   { module: 'exams', action: 'edit', description: 'Edit exams' },
  'exams:delete':                 { module: 'exams', action: 'delete', description: 'Delete exams' },
  'exams:manage':                 { module: 'exams', action: 'manage', description: 'Manage exam configuration' },

  // ── Exam Schedules ──
  'exam-schedules:read':          { module: 'exam_schedules', action: 'read', description: 'View exam schedules' },
  'exam-schedules:write':         { module: 'exam_schedules', action: 'write', description: 'Create exam schedules' },
  'exam-schedules:edit':          { module: 'exam_schedules', action: 'edit', description: 'Edit exam schedules' },
  'exam-schedules:delete':        { module: 'exam_schedules', action: 'delete', description: 'Delete exam schedules' },

  // ── Marks Entry ──
  'marks:read':                   { module: 'marks', action: 'read', description: 'View marks' },
  'marks:read:section':           { module: 'marks', action: 'read', scope: 'section', description: 'View marks for assigned sections' },
  'marks:entry':                  { module: 'marks', action: 'entry', description: 'Enter marks' },
  'marks:entry:section':          { module: 'marks', action: 'entry', scope: 'section', description: 'Enter marks for assigned sections' },
  'marks:publish':                { module: 'marks', action: 'publish', description: 'Publish / lock marks' },

  // ── Results ──
  'results:read':                 { module: 'results', action: 'read', description: 'View results' },
  'results:read:own':             { module: 'results', action: 'read', scope: 'own', description: 'View own child results' },
  'results:publish':              { module: 'results', action: 'publish', description: 'Publish results' },
  'results:export':               { module: 'results', action: 'export', description: 'Export results' },

  // ── Grading Scales ──
  'grading:read':                 { module: 'grading', action: 'read', description: 'View grading scales' },
  'grading:write':                { module: 'grading', action: 'write', description: 'Create grading scales' },
  'grading:edit':                 { module: 'grading', action: 'edit', description: 'Edit grading scales' },
  'grading:delete':               { module: 'grading', action: 'delete', description: 'Delete grading scales' },

  // ── Fees ──
  'fee-heads:read':               { module: 'fee_heads', action: 'read', description: 'View fee heads' },
  'fee-heads:write':              { module: 'fee_heads', action: 'write', description: 'Create fee heads' },
  'fee-heads:edit':               { module: 'fee_heads', action: 'edit', description: 'Edit fee heads' },
  'fee-heads:delete':             { module: 'fee_heads', action: 'delete', description: 'Delete fee heads' },
  'fee-terms:read':               { module: 'fee_terms', action: 'read', description: 'View fee terms' },
  'fee-terms:write':              { module: 'fee_terms', action: 'write', description: 'Create fee terms' },
  'fee-terms:edit':               { module: 'fee_terms', action: 'edit', description: 'Edit fee terms' },
  'fee-terms:delete':             { module: 'fee_terms', action: 'delete', description: 'Delete fee terms' },
  'section-fees:read':            { module: 'section_fees', action: 'read', description: 'View section fees' },
  'section-fees:write':           { module: 'section_fees', action: 'write', description: 'Configure section fees' },
  'section-fees:delete':          { module: 'section_fees', action: 'delete', description: 'Remove section fees' },
  'student-fees:read':            { module: 'student_fees', action: 'read', description: 'View student fees' },
  'student-fees:read:own':        { module: 'student_fees', action: 'read', scope: 'own', description: 'View own child fees' },
  'student-fees:write':           { module: 'student_fees', action: 'write', description: 'Assign fees to students' },
  'fee-payments:read':            { module: 'fee_payments', action: 'read', description: 'View fee payments' },
  'fee-payments:collect':         { module: 'fee_payments', action: 'collect', description: 'Collect fee payments' },
  'fee-payments:read:own':        { module: 'fee_payments', action: 'read', scope: 'own', description: 'View own child payments' },
  'fee-refunds:read':             { module: 'fee_refunds', action: 'read', description: 'View fee refunds' },
  'fee-refunds:process':          { module: 'fee_refunds', action: 'process', description: 'Process fee refunds' },

  // ── Payroll ──
  'payroll:read':                 { module: 'payroll', action: 'read', description: 'View payroll' },
  'payroll:process':              { module: 'payroll', action: 'process', description: 'Process payroll batches' },
  'salary-components:read':       { module: 'salary_components', action: 'read', description: 'View salary components' },
  'salary-components:write':      { module: 'salary_components', action: 'write', description: 'Create salary components' },
  'compensation:read':            { module: 'compensation', action: 'read', description: 'View employee compensation' },
  'compensation:write':           { module: 'compensation', action: 'write', description: 'Configure employee compensation' },

  // ── Accounts ──
  'accounts:read':                { module: 'accounts', action: 'read', description: 'View chart of accounts' },
  'accounts:write':               { module: 'accounts', action: 'write', description: 'Create account entries' },
  'accounts:edit':                { module: 'accounts', action: 'edit', description: 'Edit account entries' },
  'transactions:read':            { module: 'transactions', action: 'read', description: 'View transactions' },
  'transactions:write':           { module: 'transactions', action: 'write', description: 'Record transactions' },

  // ── Timetable ──
  'timetable:read':               { module: 'timetable', action: 'read', description: 'View timetable' },
  'timetable:write':              { module: 'timetable', action: 'write', description: 'Create timetable entries' },
  'timetable:edit':               { module: 'timetable', action: 'edit', description: 'Edit timetable' },
  'timetable:delete':             { module: 'timetable', action: 'delete', description: 'Delete timetable entries' },
  'timetable-structures:read':    { module: 'timetable_structures', action: 'read', description: 'View timetable structures' },
  'timetable-structures:write':   { module: 'timetable_structures', action: 'write', description: 'Create timetable structures' },
  'timetable-periods:read':       { module: 'timetable_periods', action: 'read', description: 'View periods' },
  'timetable-periods:write':      { module: 'timetable_periods', action: 'write', description: 'Create periods' },

  // ── Teacher Assignments ──
  'teacher-assignments:read':     { module: 'teacher_assignments', action: 'read', description: 'View teacher assignments' },
  'teacher-assignments:write':    { module: 'teacher_assignments', action: 'write', description: 'Assign teachers' },
  'teacher-capabilities:read':    { module: 'teacher_capabilities', action: 'read', description: 'View teacher capabilities' },
  'teacher-capabilities:write':   { module: 'teacher_capabilities', action: 'write', description: 'Manage teacher capabilities' },
  'teacher-availability:read':    { module: 'teacher_availability', action: 'read', description: 'View teacher availability' },
  'teacher-availability:write':   { module: 'teacher_availability', action: 'write', description: 'Set teacher availability' },

  // ── Leave Management ──
  'leave:read':                   { module: 'leave', action: 'read', description: 'View leave requests' },
  'leave:read:own':               { module: 'leave', action: 'read', scope: 'own', description: 'View own leave requests' },
  'leave:apply':                  { module: 'leave', action: 'apply', description: 'Apply for leave' },
  'leave:approve':                { module: 'leave', action: 'approve', description: 'Approve leave requests' },
  'leave:manage':                 { module: 'leave', action: 'manage', description: 'Manage leave categories and configuration' },

  // ── Holidays ──
  'holidays:read':                { module: 'holidays', action: 'read', description: 'View holidays' },
  'holidays:write':               { module: 'holidays', action: 'write', description: 'Create holidays' },
  'holidays:edit':                { module: 'holidays', action: 'edit', description: 'Edit holidays' },
  'holidays:delete':              { module: 'holidays', action: 'delete', description: 'Delete holidays' },

  // ── Parents ──
  'parents:read':                 { module: 'parents', action: 'read', description: 'View parents' },
  'parents:write':                { module: 'parents', action: 'write', description: 'Register parents' },
  'parents:edit':                 { module: 'parents', action: 'edit', description: 'Edit parents' },
  'parent-portal:access':         { module: 'parent_portal', action: 'access', description: 'Access parent portal features' },

  // ── Transportation ──
  'transport:read':               { module: 'transport', action: 'read', description: 'View transport data' },
  'transport:read:assigned':      { module: 'transport', action: 'read', scope: 'assigned', description: 'View assigned routes' },
  'transport:write':              { module: 'transport', action: 'write', description: 'Manage vehicles and routes' },
  'transport:assign':             { module: 'transport', action: 'assign', description: 'Assign students to transport' },

  // ── Infrastructure ──
  'infrastructure:read':          { module: 'infrastructure', action: 'read', description: 'View buildings, floors, rooms' },
  'infrastructure:write':         { module: 'infrastructure', action: 'write', description: 'Create infrastructure records' },
  'infrastructure:edit':          { module: 'infrastructure', action: 'edit', description: 'Edit infrastructure' },
  'infrastructure:delete':        { module: 'infrastructure', action: 'delete', description: 'Delete infrastructure' },

  // ── Inventory / Store ──
  'store:read':                   { module: 'store', action: 'read', description: 'View store items' },
  'store:write':                  { module: 'store', action: 'write', description: 'Manage store inventory' },
  'store:order':                  { module: 'store', action: 'order', description: 'Place store orders' },
  'store:order:own':              { module: 'store', action: 'order', scope: 'own', description: 'Place orders for own child' },
  'store:process':                { module: 'store', action: 'process', description: 'Process store orders, dues, returns' },

  // ── Visitors ──
  'visitors:read':                { module: 'visitors', action: 'read', description: 'View visitors' },
  'visitors:write':               { module: 'visitors', action: 'write', description: 'Register visitors' },
  'visitors:approve':             { module: 'visitors', action: 'approve', description: 'Approve visitor access' },
  'visitors:check-in':            { module: 'visitors', action: 'check_in', description: 'Check in visitors' },

  // ── Imports ──
  'imports:execute':              { module: 'imports', action: 'execute', description: 'Import data (students, teachers, etc.)' },

  // ── Settings ──
  'settings:read':                { module: 'settings', action: 'read', description: 'View settings' },
  'settings:write':               { module: 'settings', action: 'write', description: 'Update settings' },
  'academic-years:read':          { module: 'academic_years', action: 'read', description: 'View academic years' },
  'academic-years:write':         { module: 'academic_years', action: 'write', description: 'Create academic years' },
  'academic-years:edit':          { module: 'academic_years', action: 'edit', description: 'Edit academic years' },
  'tenants:read':                 { module: 'tenants', action: 'read', description: 'View tenants (company-level)' },
  'tenants:write':                { module: 'tenants', action: 'write', description: 'Create tenants (company-level)' },

  // ── Reports ──
  'reports:view':                 { module: 'reports', action: 'view', description: 'View reports' },
  'reports:export':               { module: 'reports', action: 'export', description: 'Export reports' },

  // ── Wildcards ──
  'admin:super':                  { module: 'admin', action: 'super', description: 'Full system access (wildcard)' },
};
```

### Seed Logic

```javascript
// lib/backend/rbac/seed-permissions.js
import { prisma } from '../lib/prisma.js';
import { PERMISSIONS } from './permissions.js';

async function seedPermissions() {
  for (const [code, def] of Object.entries(PERMISSIONS)) {
    await prisma.permission.upsert({
      where: { code },
      update: { module: def.module, action: def.action, scope: def.scope, description: def.description },
      create: { code, module: def.module, action: def.action, scope: def.scope, description: def.description },
    });
  }
  console.log(`Seeded ${Object.keys(PERMISSIONS).length} permissions`);
}
```

- Called on application startup (Next.js instrumentation hook)
- Idempotent: `upsert` ensures no duplicates
- Tenants CANNOT create/modify/delete these — only assign them to roles

### Files to Create
- `lib/backend/rbac/permissions.js`

### Files to Modify
- `package.json` (add seed on startup via instrumentation)
- `prisma/schema.prisma` (Phase 1)

---

## Phase 3: RBAC Engine

### Objective
Build the core authorization engine that resolves effective permissions and answers "can user X perform action Y on resource Z?"

### Architecture

```
lib/backend/rbac/
├── permissions.js          # Phase 2 — canonical permission catalog
├── seed-permissions.js     # Phase 2 — idempotent seeder
├── engine.js               # Phase 3 — core authorization logic
├── guards.js               # Phase 4 — action + resource guard functions
├── role-resolver.js        # Phase 5 — resolve user roles + permissions
├── scope-resolver.js       # Phase 5 — resolve resource-level access
├── audit.js                # Phase 9 — audit logging
└── seed-roles.js           # Phase 10 — default role seeding
```

### Engine API

```javascript
// lib/backend/rbac/engine.js

class RbacEngine {
  /**
   * Check if a user has a specific permission code.
   * @param {Object} effectivePermissions - Pre-resolved permission set
   * @param {string} code - Permission code e.g., "students:read"
   * @returns {boolean}
   */
  static hasPermission(effectivePermissions, code) { ... }

  /**
   * Check if a user has any of the given permissions.
   * @param {Object} effectivePermissions
   * @param {string[]} codes
   * @returns {boolean}
   */
  static hasAnyPermission(effectivePermissions, codes) { ... }

  /**
   * Check if a user has all of the given permissions.
   * @param {Object} effectivePermissions
   * @param {string[]} codes
   * @returns {boolean}
   */
  static hasAllPermissions(effectivePermissions, codes) { ... }

  /**
   * Check if a user can access a resource.
   * @param {Object} req - Request object with user context
   * @param {string} resourceType - "section", "student", "subject"
   * @param {string} resourceId - UUID of the resource
   * @returns {Promise<boolean>}
   */
  static async canAccessResource(req, resourceType, resourceId) { ... }

  /**
   * Get all resource IDs of a given type that the user can access.
   * @param {Object} req
   * @param {string} resourceType
   * @returns {Promise<Set<string>>} - Set of allowed resource UUIDs
   */
  static async getAllowedResourceIds(req, resourceType) { ... }
}
```

### Permission Matching Logic

```
Input: permission set = { "students:read", "attendance:mark:section", "admin:super" }

Check: "students:read"
  → Exact match in set? YES → allow

Check: "students:write"  
  → Exact match? NO
  → Wildcard "students:*" in set? NO
  → Super-admin "admin:super" in set? YES → allow

Check: "attendance:mark" (no scope)
  → Exact match? NO
  → Wildcard "attendance:*" in set? NO  
  → But "attendance:mark:section" matches base "attendance:mark" → allow
  → (Scoped permission grants base permission — user can mark SOME attendance)

Check: "attendance:mark:section" WITH sectionId = "abc-123"
  → Has "attendance:mark:section"? YES
  → Now check scope: is sectionId in user's allowed sections? 
  → Call scope-resolver.getAllowedSections(user) → Set { "abc-123", "def-456" }
  → "abc-123" in set? YES → allow
```

### Performance Strategy

```javascript
// Request-scoped cache via AsyncLocalStorage or Map
const requestPermissionCache = new WeakMap();

async function resolvePermissions(req) {
  const { userId, tenantId, permVersion } = req.user;
  const cacheKey = `${userId}:${permVersion}`;
  
  // Check request-scoped cache first
  if (requestPermissionCache.has(cacheKey)) {
    return requestPermissionCache.get(cacheKey);
  }
  
  // DB query: get all permissions from all roles
  const permissions = await prisma.rolePermission.findMany({
    where: {
      tenantId,
      roleId: { in: req.user.roleIds },
    },
    include: { permission: { select: { code: true } } },
  });
  
  const permSet = new Set(permissions.map(rp => rp.permission.code));
  requestPermissionCache.set(cacheKey, permSet);
  
  return permSet;
}
```

### Files to Create
- `lib/backend/rbac/engine.js`

### Files to Modify
- (None — internal module)

---

## Phase 4: Guard Functions

### Objective
Provide simple, explicit guard functions that controllers call as their first lines. Two guard types: action guards and resource guards.

### API Design

```javascript
// lib/backend/rbac/guards.js
import { RbacEngine } from './engine.js';
import { prisma } from '../lib/prisma.js';
import { auditAccessDenied } from './audit.js';

class Guard {
  /**
   * Action-level guard: throws if user lacks permission.
   * Just returns silently on success.
   * 
   * @param {Object} req - Request object with user/tenantId
   * @param {string} permissionCode - e.g., "students:delete"
   */
  static async action(req, permissionCode) { ... }

  /**
   * Resource-level guard: throws if user cannot access this resource.
   * 
   * @param {Object} req
   * @param {string} resourceType - "section", "student", "subject", "enrollment"
   * @param {string} resourceId
   * @param {Object} [options] - e.g., { allowOwnChild: true }
   */
  static async resource(req, resourceType, resourceId, options = {}) { ... }
}
```

### Usage Pattern (in any controller)

```javascript
import { Guard } from '@/lib/backend/rbac/guards.js';

class StudentController {
  static async getAllStudents(req, res) {
    await Guard.action(req, 'students:read');
    // ... fetch students
  }

  static async createStudent(req, res) {
    await Guard.action(req, 'students:write');
    // ... create student
  }

  static async deleteStudent(req, res) {
    await Guard.action(req, 'students:delete');
    await Guard.resource(req, 'student', req.params.studentId);
    // ... delete student
  }

  static async getStudentAttendance(req, res) {
    await Guard.action(req, 'attendance:read:section');
    await Guard.resource(req, 'section', req.params.sectionId);
    // ... fetch attendance for this section
  }
}
```

### Error Behavior

```javascript
// Guard throws a consistent error that the controller can catch or let propagate
class ForbiddenError extends Error {
  constructor(message, code = 'FORBIDDEN') {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
    this.code = code;
  }
}

// In guards:
throw new ForbiddenError(
  `Permission '${permissionCode}' is required to perform this action.`
);
```

### Audit on Denial

Every 403 denial is audited:
```javascript
await auditAccessDenied(req, {
  permissionCode,
  resourceType,
  resourceId,
  reason: 'insufficient_permissions',
});
```

### Wrapper for Route Handlers (Optional Convenience)

For routes that don't need custom logic, a lightweight wrapper:

```javascript
// app/api/students/route.ts
import { withAuth, withAction } from '@/lib/backend/rbac/guards';

// Combines auth + action guard in one line
export const GET = withAuth(withAction('students:read', async (req) => {
  // handler body
}));
```

This is purely for DRY convenience — the core `Guard.action()` and `Guard.resource()` are the primary API.

### Files to Create
- `lib/backend/rbac/guards.js`

---

## Phase 5: Role Resolver & Scope Resolver

### Role Resolver

```javascript
// lib/backend/rbac/role-resolver.js

class RoleResolver {
  /**
   * Resolve a user's effective permissions and role information.
   * Cached per request using permVersion.
   * 
   * @param {Object} req - Request with user context
   * @returns {Promise<{
   *   roleIds: string[],
   *   roleNames: string[],
   *   permissions: Set<string>,
   *   groups: string[]
   * }>}
   */
  static async resolve(req) { ... }

  /**
   * Bump permVersion for all users affected by a role/permission change.
   * Called whenever roles are created/edited/deleted or permissions assigned.
   * 
   * @param {string} tenantId
   * @param {string[]} roleIds - Roles that were modified
   */
  static async bumpVersion(tenantId, roleIds) { ... }
}
```

### Scope Resolver

```javascript
// lib/backend/rbac/scope-resolver.js

class ScopeResolver {
  /**
   * Get all section IDs the user can access based on their teacher assignments
   * or admin privileges.
   */
  static async getAllowedSections(req) { ... }

  /**
   * Get all student IDs the user can access (class teacher → section students,
   * parent → own children, admin → all students).
   */
  static async getAllowedStudents(req) { ... }

  /**
   * Get all subject IDs the user can access (subject teacher assignments).
   */
  static async getAllowedSubjects(req) { ... }

  /**
   * Get transport route/vehicle IDs the user can access (driver assignment).
   */
  static async getAllowedTransport(req) { ... }

  /**
   * Check if a specific student is the user's own child (parent scope).
   */
  static async isOwnChild(req, studentId) { ... }
}
```

### Scope Resolution Logic by Role

| Context | How Scopes Are Resolved |
|---|---|
| Super Admin / Principal | All scopes return unrestricted (empty/null = "all") |
| Class Teacher | `TeacherAssignment` where `role = class_teacher` → sections |
| Subject Teacher | `TeacherAssignment` where `role = subject_teacher` → section-subjects |
| Parent | `StudentParent` table → linked children → their enrollments |
| Driver | `VehicleDriverAssignment` → vehicle → `StudentTransportAssignment` → students |

### Files to Create
- `lib/backend/rbac/role-resolver.js`
- `lib/backend/rbac/scope-resolver.js`

---

## Phase 6: Update Auth Service & JWT Strategy

### JWT Payload (New)

```javascript
// After login — what goes in the JWT
const tokenPayload = {
  userId: user.id,
  tenantId: user.tenantId,
  userType: user.userType,
  
  // Role IDs only — not the full permission list
  roleIds: userRoles.map(ur => ur.roleId),
  
  // Version counter for cache busting
  permVersion: user.permVersion,
};
```

### What the JWT does NOT contain

- ❌ Permission codes
- ❌ Role names
- ❌ Scope data
- ❌ User profile details

### Auth Service Changes

```javascript
// lib/backend/modules/auth/auth.service.js

static async login(email, password, tenantId = null) {
  // ... existing lookup logic ...

  // Fetch user with role IDs (new: many-to-many)
  const userSelect = {
    id: true,
    email: true,
    password: true,
    userType: true,
    tenantId: true,
    permVersion: true,
    userRoles: {
      select: {
        roleId: true,
        role: {
          select: { roleName: true },
        },
      },
    },
  };

  // ... password check ...

  const tokenPayload = {
    userId: user.id,
    tenantId: user.tenantId,
    userType: user.userType,
    roleIds: user.userRoles.map(ur => ur.roleId),
    permVersion: user.permVersion,
  };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '24400h' });

  // Return full authorization context for frontend
  const effectivePermissions = await RbacEngine.getEffectivePermissions(user.id, user.tenantId);
  
  return {
    token,
    user: {
      userId: user.id,
      email: user.email,
      userType: user.userType,
      tenantId: user.tenantId,
      roles: user.userRoles.map(ur => ({ id: ur.roleId, name: ur.role.roleName })),
      permissions: [...effectivePermissions],
    },
  };
}
```

### versionBump Logic

```javascript
// When a role's permissions change, bump all affected users
static async bumpUserPermissionVersion(tenantId, roleId) {
  await prisma.user.updateMany({
    where: {
      tenantId,
      userRoles: { some: { roleId } },
    },
    data: {
      permVersion: { increment: 1 },
    },
  });
}
```

This is called automatically whenever:
- A role's permissions are modified
- A role is assigned to / removed from a user
- A permission is added to / removed from a role

### Server Adapter Update

```javascript
// lib/api/server-adapter.ts

// The createMockReq already decodes JWT. Update the user mapping:
const safeUser = user
  ? { ...user, id: user.userId, roleIds: user.roleIds || [] }
  : (tenantId ? { tenantId, userId: null, userType: 'tenant', roleIds: [], id: null } : null);
```

### Files to Modify
- `lib/backend/modules/auth/auth.service.js`
- `lib/api/server-adapter.ts`

---

## Phase 7: Authorization API for Frontend

### Endpoint

```
GET /api/auth/permissions
Authorization: Bearer <token>
```

### Response

```json
{
  "status": "success",
  "data": {
    "user": {
      "userId": "uuid...",
      "email": "john@school.com",
      "fullName": "John Doe",
      "tenantId": "uuid..."
    },
    "roles": [
      { "id": "uuid", "name": "Class Teacher" },
      { "id": "uuid", "name": "Subject Teacher" }
    ],
    "groups": ["Teaching Staff", "Academic Staff"],
    "permissions": [
      "students:read:section",
      "attendance:mark:section",
      "marks:entry:section",
      "teachers:read"
    ],
    "scopes": {
      "sections": ["uuid-1", "uuid-2"],
      "subjects": ["uuid-3"],
      "students": ["uuid-a", "uuid-b", "uuid-c"]
    }
  }
}
```

### Usage

- Called once on app mount (after login or page refresh)
- Stored in `PermissionStore` (Zustand store)
- Used by `<Can>` and `usePermission` to make UI decisions
- Scopes used to pre-filter dropdowns, section selectors, etc.

### Files to Create
- `app/api/auth/permissions/route.ts`

---

## Phase 8: Frontend Authorization

### Permission Store

```typescript
// stores/permission-store.ts
import { create } from 'zustand';

interface PermissionStore {
  roles: Role[];
  groups: string[];
  permissions: Set<string>;
  scopes: Scopes;
  isLoaded: boolean;
  
  hasPermission: (code: string) => boolean;
  hasAnyPermission: (codes: string[]) => boolean;
  hasAllPermissions: (codes: string[]) => boolean;
  canAccessSection: (sectionId: string) => boolean;
  
  load: () => Promise<void>;
  reset: () => void;
}
```

### Permission Provider

```tsx
// components/providers/permission-provider.tsx
"use client";

import { useEffect } from 'react';
import { usePermissionStore } from '@/stores/permission-store';
import { useAuthStore } from '@/stores/auth-store';

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  const { load } = usePermissionStore();

  useEffect(() => {
    if (token) load();
  }, [token, load]);

  return <>{children}</>;
}
```

### usePermission Hook

```typescript
// hooks/use-permission.ts
export function usePermission(code: string): boolean {
  return usePermissionStore((s) => s.hasPermission(code));
}

export function useAnyPermission(codes: string[]): boolean {
  return usePermissionStore((s) => s.hasAnyPermission(codes));
}
```

### `<Can>` Component

```tsx
// components/shared/can.tsx
interface CanProps {
  permission: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function Can({ permission, fallback = null, children }: CanProps) {
  const can = usePermission(permission);
  return can ? <>{children}</> : <>{fallback}</>;
}
```

### Gate Existing Dashboard Layout

```tsx
// app/(dashboard)/layout.tsx — sidebar items
const navItems = [
  { label: 'Dashboard', href: '/dashboard', permission: 'dashboard:view' },
  { label: 'Students', href: '/students', permission: 'students:read' },
  { label: 'Teachers', href: '/teachers', permission: 'teachers:read' },
  { label: 'Attendance', href: '/attendance', permission: 'attendance:read' },
  { label: 'Exams', href: '/exams', permission: 'exams:read' },
  { label: 'Marks', href: '/marks-entry', permission: 'marks:entry' },
  { label: 'Results', href: '/results', permission: 'results:read' },
  { label: 'Fees', href: '/fees', permission: 'student-fees:read' },
  { label: 'Payroll', href: '/payroll', permission: 'payroll:read' },
  // ...
];

// Filter based on permissions
const visibleItems = navItems.filter(item => hasPermission(item.permission));
```

### Files to Create
- `stores/permission-store.ts`
- `hooks/use-permission.ts`
- `components/shared/can.tsx`
- `components/providers/permission-provider.tsx`

### Files to Modify
- `app/(dashboard)/layout.tsx`
- `app/layout.tsx` (add PermissionProvider)

---

## Phase 9: Audit Trail

### What Gets Logged

| Event | Trigger | Audit Level |
|---|---|---|
| `role.created` | Role creation | Info |
| `role.updated` | Role name/description changed | Info |
| `role.deleted` | Role deletion | Warning |
| `role.permissions_changed` | Permissions assigned/removed from role | Warning |
| `user.role_assigned` | Role given to user | Info |
| `user.role_removed` | Role removed from user | Info |
| `permission.denied` | 403 returned (action guard fail) | Warning |
| `resource.denied` | 403 returned (resource guard fail) | Warning |
| `fee.refunded` | Refund processed | Critical |
| `marks.published` | Marks locked/published | Critical |
| `payroll.processed` | Payroll batch processed | Critical |
| `settings.changed` | Tenant setting modified | Warning |
| `student.deleted` | Student record deleted | Critical |
| `user.created` | New user created | Info |

### Audit Module

```javascript
// lib/backend/rbac/audit.js

class AuditLogger {
  static async log(req, action, targetType, targetId, details = {}, level = 'info') { ... }
  
  static async logAccessDenied(req, { permissionCode, resourceType, resourceId, reason }) { ... }
  
  static async logRoleChange(req, action, roleId, changes = {}) { ... }
  
  static async logCritical(req, action, targetType, targetId, details = {}) {
    return this.log(req, action, targetType, targetId, details, 'critical');
  }
}
```

### Audit Log Schema

```prisma
model AuditLog {
  id         String   @id @default(uuid())
  tenantId   String?
  actorId    String?
  actorEmail String?  // denormalized for quick display even if user deleted
  action     String   // "role.created", "permission.denied", "fee.refunded"
  targetType String?  // "Role", "User", "FeePayment"
  targetId   String?
  details    Json?    // flexible payload
  ipAddress  String?
  level      String   @default("info")  // "info" | "warning" | "critical"
  createdAt  DateTime @default(now())
}
```

### Audit UI (Future Enhancement)

A dedicated `/audit-logs` page for super admins to view, filter, and export audit trails.

### Files to Create
- `lib/backend/rbac/audit.js`

---

## Phase 10: Default Roles & Seeding

### Default Role Templates

When a new tenant is created, the system automatically seeds these roles:

| # | Role | Group | Key Permissions |
|---|---|---|---|
| 1 | School Admin | Administration | `*:*` (all) |
| 2 | Principal | Administration | All except roles:delete, payroll:process, settings:write |
| 3 | Academic Coordinator | Academic Staff | students:*, teachers:*, courses:*, grades:*, sections:*, subjects:*, timetable:*, attendance:read, exams:*, marks:*, results:* |
| 4 | Class Teacher | Teaching Staff | students:read:section, attendance:mark:section, attendance:read:section, marks:entry:section, marks:read:section |
| 5 | Subject Teacher | Teaching Staff | students:read:section, marks:entry:section, marks:read:section, attendance:mark:section |
| 6 | Accountant | Finance | fee-heads:*, fee-terms:*, section-fees:*, student-fees:*, fee-payments:*, fee-refunds:*, accounts:*, reports:view, reports:export |
| 7 | Receptionist / Clerk | Administration | students:read, students:write, visitors:*, imports:execute, parents:read |
| 8 | Parent | Parents | students:read:own, attendance:read:own, marks:read:own, results:read:own, fee-payments:read:own, leave:read:own, parent-portal:access |
| 9 | Driver | Transport | transport:read:assigned, students:read:section |
| 10 | Transport Manager | Transport | transport:* |

### Default Groups

| Group | Purpose |
|---|---|
| Administration | Principal, Admin, Clerk, Receptionist |
| Teaching Staff | Class Teacher, Subject Teacher, Lab Incharge |
| Academic Staff | Academic Coordinator, Exam Coordinator |
| Finance | Accountant, Bursar |
| Transport | Transport Manager, Driver, Conductor |
| Parents | All parent users |
| Support Staff | Office Boy, Cleaner, Security |

### Seeding Trigger

```javascript
// lib/backend/rbac/seed-roles.js

async function seedDefaultRoles(tenantId) {
  const defaultRoles = [
    { name: 'School Admin', group: 'Administration', permissions: ['admin:super'] },
    { name: 'Principal', group: 'Administration', permissions: [/* ... */] },
    // ... etc
  ];

  for (const roleDef of defaultRoles) {
    const role = await prisma.role.upsert({
      where: { uniqueRoleNamePerTenant: { tenantId, roleName: roleDef.name } },
      create: { tenantId, roleName: roleDef.name, description: `Default ${roleDef.name} role`, isDefault: true },
      update: {},
    });

    // Assign permissions
    for (const permCode of roleDef.permissions) {
      const perm = await prisma.permission.findUnique({ where: { code: permCode } });
      if (perm) {
        await prisma.rolePermission.upsert({
          where: { role_permission_unique: { roleId: role.id, permissionId: perm.id, tenantId } },
          create: { roleId: role.id, permissionId: perm.id, tenantId },
          update: {},
        });
      }
    }

    // Assign to group
    const group = await prisma.group.upsert({
      where: { uniqueGroupNamePerTenant: { tenantId, groupName: roleDef.group } },
      create: { tenantId, groupName: roleDef.group },
      update: {},
    });
    await prisma.roleGroup.upsert({
      where: { role_group_unique: { roleId: role.id, groupId: group.id, tenantId } },
      create: { roleId: role.id, groupId: group.id, tenantId },
      update: {},
    });
  }
}
```

### Tenant Operations Allowed

Each tenant can:
- Use default roles as-is
- Rename roles
- Add/remove permissions from roles (only from the canonical catalog)
- Duplicate roles
- Create entirely new roles
- Assign multiple roles to a single user

Tenants CANNOT:
- Create new permission codes
- Delete canonical permissions
- Modify permission descriptions

### Files to Create
- `lib/backend/rbac/seed-roles.js`

### Files to Modify
- `lib/backend/modules/tenants/tenants.service.js` (trigger seed on tenant creation)

---

## Phase 11: Retrofitting Controllers

### Approach

Every controller method gets two lines at the top:

```javascript
// Before: no authorization
static async deleteStudent(req, res) {
  const student = await prisma.student.delete({ where: { id: req.params.id } });
  return responseHandler(res, 'success', student);
}

// After: with authorization
static async deleteStudent(req, res) {
  await Guard.action(req, 'students:delete');
  await Guard.resource(req, 'student', req.params.id);
  
  const student = await prisma.student.delete({ where: { id: req.params.id } });
  await AuditLogger.logCritical(req, 'student.deleted', 'Student', req.params.id);
  return responseHandler(res, 'success', student);
}
```

### Priority Order for Retrofitting

| Priority | Modules | Reason |
|---|---|---|
| **P0** | students, attendance, marks, results | Core academic data |
| **P1** | exams, exam-schedules, fees, fee-payments, fee-refunds | Sensitive / financial |
| **P2** | teachers, payroll, accounts, settings | Administrative |
| **P3** | courses, grades, sections, subjects, section-subjects | Configuration |
| **P4** | timetable, holidays, leave, store, transport | Operational |
| **P5** | visitors, imports, infrastructure, parents | Supplementary |

### Pattern for Different Controller Types

#### Simple CRUD (e.g., Courses)
```javascript
export const GET    = async (req) => { await Guard.action(req, 'courses:read'); ... };
export const POST   = async (req) => { await Guard.action(req, 'courses:write'); ... };
export const PUT    = async (req) => { await Guard.action(req, 'courses:edit'); ... };
export const DELETE = async (req) => { await Guard.action(req, 'courses:delete'); ... };
```

#### Scoped Read (e.g., Student Attendance by Section)
```javascript
export const GET = async (req, { params }) => {
  await Guard.action(req, 'attendance:read:section');
  await Guard.resource(req, 'section', params.sectionId);
  // ... fetch attendance for that section
};
```

#### Own-Scope (e.g., Parent viewing own child)
```javascript
export const GET = async (req, { params }) => {
  await Guard.action(req, 'results:read:own');
  await Guard.resource(req, 'student', params.studentId, { allowOwnChild: true });
  // ... fetch results for linked child only
};
```

### Exceptions

Some endpoints need less strict guards:
- `GET /api/auth/permissions` — only needs authentication (no permission check — every authenticated user needs their own permissions)
- `POST /api/auth/login` — public
- `POST /api/auth/logout` — only needs authentication

### Files to Modify
Approximately 35+ route files across `app/api/*/route.ts`. Each gets 1-2 lines of guard calls per method.

---

## Phase 12: Roles & Groups Management UI

### Overview

Overhaul the existing Roles page and add a Groups management page.

### Roles Page Enhancements

1. **Role list** — shows role name, description, group(s), assigned user count, permissions count
2. **Role create/edit dialog** — 
   - Name & description fields
   - Multi-select permission picker (grouped by module, with checkboxes)
   - Group assignment dropdown
   - "Duplicate from existing role" option
3. **Role detail view** — shows all users with this role, all permissions, history
4. **Bulk permission assignment** — select a group → assign a permission to all roles in that group
5. **Delete with impact warning** — shows "X users will lose this role" before confirming

### Groups Page (New)

```
app/(dashboard)/roles/groups/page.tsx
components/roles/groups-table.tsx
components/roles/group-dialog.tsx
```

Simple CRUD for groups with:
- Group name & description
- List of roles in each group
- Ability to add/remove roles from groups

### Role Templates Page (New)

```
app/(dashboard)/roles/templates/page.tsx
```

Pre-built role templates that new tenants can install:
- Standard School Package
- Large School Package (more specialized roles)
- Minimal Package (just admin + teacher + parent)

### User Role Assignment

In the User creation/edit dialog:
- Replace single-role dropdown with multi-role picker (checkboxes)
- Show inherited permissions summary when roles are selected
- Warn if removing a role that provides a permission the user still needs

### Files to Create
- `app/(dashboard)/roles/groups/page.tsx`
- `components/roles/groups-table.tsx`
- `components/roles/group-dialog.tsx`
- `app/(dashboard)/roles/templates/page.tsx`
- `components/roles/role-templates.tsx`

### Files to Modify
- `components/roles/role-dialog.tsx` (complete rewrite)
- `components/users/user-dialog.tsx` (add multi-role picker)
- `app/(dashboard)/roles/page.tsx`
- `hooks/use-roles.ts`
- `hooks/use-users.ts`
- `lib/api/roles.ts`
- `lib/backend/modules/roles/roles.service.js`

---

## Summary: Files Created & Modified

### New Files (~20)

| File | Phase |
|---|---|
| `lib/backend/rbac/permissions.js` | 2 |
| `lib/backend/rbac/seed-permissions.js` | 2 |
| `lib/backend/rbac/engine.js` | 3 |
| `lib/backend/rbac/guards.js` | 4 |
| `lib/backend/rbac/role-resolver.js` | 5 |
| `lib/backend/rbac/scope-resolver.js` | 5 |
| `lib/backend/rbac/audit.js` | 9 |
| `lib/backend/rbac/seed-roles.js` | 10 |
| `app/api/auth/permissions/route.ts` | 7 |
| `stores/permission-store.ts` | 8 |
| `hooks/use-permission.ts` | 8 |
| `components/shared/can.tsx` | 8 |
| `components/providers/permission-provider.tsx` | 8 |
| `docs/rbac-implementation-plan.md` | — |
| `prisma/migrations/..._rbac_schema_v2/migration.sql` | 1 |
| `scripts/migrate-roles-to-v2.ts` | 1 |
| `app/(dashboard)/roles/groups/page.tsx` | 12 |
| `components/roles/groups-table.tsx` | 12 |
| `components/roles/group-dialog.tsx` | 12 |
| `app/(dashboard)/roles/templates/page.tsx` | 12 |

### Modified Files (~50)

| File | Phase |
|---|---|
| `prisma/schema.prisma` | 1 |
| `lib/api/server-adapter.ts` | 6 |
| `lib/backend/modules/auth/auth.service.js` | 6 |
| `lib/backend/modules/auth/auth.controller.js` | 6 |
| `lib/backend/modules/roles/roles.service.js` | 1, 12 |
| `lib/backend/modules/roles/roles.controller.js` | 1, 12 |
| `lib/backend/modules/tenants/tenants.service.js` | 10 |
| `lib/api/roles.ts` | 12 |
| `hooks/use-roles.ts` | 12 |
| `hooks/use-users.ts` | 12 |
| `app/(dashboard)/layout.tsx` | 8 |
| `app/layout.tsx` | 8 |
| `components/roles/role-dialog.tsx` | 12 |
| `components/users/user-dialog.tsx` | 12 |
| `app/(dashboard)/roles/page.tsx` | 12 |
| `app/api/roles/route.ts` | 12 |
| `middleware.ts` | 6 |
| **~35 API route files** (retrofitting) | 11 |

---

## Edge Cases & Security Considerations

1. **User deletion** — when a user is deleted, `UserRole` rows cascade-delete. No cleanup needed.
2. **Role deletion with users** — prevent deletion if `UserRole` count > 0. Show warning: "X users are assigned to this role. Reassign them first."
3. **Super admin cannot be locked out** — the `admin:super` permission is always available to at least one tenant user.
4. **Company vs Tenant users** — company users (`userType: company`, `tenantId: null`) bypass tenant-scoped permission checks. They have implicit `admin:super` across all tenants.
5. **Permission version overflow** — `permVersion` is an Int (max 2^31). If a tenant somehow bumps it billions of times, wrap to 0, invalidating all caches safely.
6. **Idempotent seeding** — permission seed runs on every startup. Uses `upsert` so existing permissions are never overwritten.
7. **Scope for non-teaching staff** — drivers, clerks, and other employee types get their scopes from their specific assignments (vehicle routes, etc.), not teacher assignments.
8. **Multiple roles with conflicting scopes** — scopes are unioned. If a user is both Class Teacher of Section A and Subject Teacher of Section B, they can access both sections.