# RBAC API Permission Map

Backend authorization for Next.js App Router routes under `app/api/**`.

**Related:** Epic [#5](https://github.com/yaseen-ui/school-management-application/issues/5) · Phase P1 [#10](https://github.com/yaseen-ui/school-management-application/issues/10)

## Principles

1. **Backend is the authority** — every sensitive/mutating route calls `Guard.action(req, 'module:action')`.
2. Permission codes come only from `lib/backend/rbac/permissions.js` (seeded on startup).
3. Frontend nav/page gates (P2) are UX only; they must use the same codes.

## Coverage (after P1)

| Metric | Value |
|--------|------:|
| Total `route.ts` files | ~269 |
| Files with `Guard.action` | ~254 |
| Intentionally public / open | ~15 file groups (see below) |
| Catalog codes used by guards | all mapped codes exist in catalog |

Machine-readable summary of the last codemod run: [`rbac-api-map.json`](./rbac-api-map.json).

## Public / intentionally unguarded

These routes **must not** require RBAC permission codes (they use other auth models):

| Path prefix | Why |
|-------------|-----|
| `auth/*` | Login, logout, password reset, `/auth/permissions` bootstrap |
| `public/*` | Unauthenticated public endpoints |
| `webhooks/*` | Meta/WhatsApp webhooks (signature verify, not JWT) |
| `parents/invite/[token]` | Parent invite acceptance by token |
| `parents/register` | Parent self-registration via invite |
| `teachers/invite/[token]` | Staff invite acceptance by token |
| `teachers/register` | Staff self-registration via invite |
| `communications/inbox` | Personal inbox for any authenticated user |
| `communications/acknowledge` | Acknowledge own notifications |

## Module → permission conventions

| HTTP | Typical permission |
|------|--------------------|
| `GET` | `module:read` (or specialized read) |
| `POST` create | `module:write` / `module:manage` / domain verb |
| `PUT` / `PATCH` | `module:edit` or `module:manage` |
| `DELETE` | `module:delete` or `module:manage` |

### Domain-specific verbs

| Module | Codes |
|--------|--------|
| Attendance | `attendance:read`, `attendance:mark`, `attendance:report` |
| Fees | `fee-payments:collect`, `fee-refunds:process` |
| Leave | `leave:apply`, `leave:approve`, `leave:manage` |
| Hostel | `hostel:read`, `hostel:manage`, `hostel:allocate`, `hostel:assign-staff` |
| Store | `store:read`, `store:write`, `store:order`, `store:process` |
| Transport | `transport:read`, `transport:write`, `transport:assign` |
| Payroll | `payroll:read`, `payroll:process`, `salary-components:*`, `compensation:*` |
| Communication | `communication-notifications:*`, `communication-publications:*`, `communication-automation:manage`, `communication-templates:manage`, `communication-channels:manage` |
| Parent portal | `parent-portal:access` |
| AI Assistant | `query-bot:ask` |
| Uploads / GCS | `dashboard:view` (any authenticated staff with dashboard) |

## High-level path map

| API path prefix | Read | Write / mutate |
|-----------------|------|----------------|
| `/api/students` | `students:read` | `students:write` / `edit` / `delete` |
| `/api/teachers` | `teachers:read` | `teachers:write` / `edit` / `delete` |
| `/api/attendance/*` | `attendance:read` | `attendance:mark` |
| `/api/exams/*` | `exams:read` / `exam-schedules:read` / `marks:read` | `exams:*` / `marks:entry` |
| `/api/fee-*` | matching `fee-*:read` | collect / process / write / edit |
| `/api/hostel/*` | `hostel:read` | manage / allocate / assign-staff |
| `/api/store/*`, `/api/inventory/*` | `store:read` | write / order / process |
| `/api/transportation/*` | `transport:read` | write / assign |
| `/api/leave/*` | `leave:read` | apply / approve / manage |
| `/api/payroll/*` | `payroll:read` (+ salary/comp) | `payroll:process` |
| `/api/parent/*` | `parent-portal:access` | same |
| `/api/visitors/*` | `visitors:read` | write / approve / check-in |
| `/api/query-bot` | `query-bot:ask` | same |
| `/api/imports/*` | — | `imports:execute` |
| `/api/settings/*` | `settings:read` | `settings:write` |
| `/api/academic-years/*` | `academic-years:read` | write / edit |
| `/api/timetable-*` | `timetable*:read` | write / edit / delete |

## Wildcards & bypasses

- `admin:super` → all actions (School Admin).
- Company users without `tenantId` in JWT → full bypass in `Guard.action` (platform ops).
- Scoped perms (`:section`, `:own`) still grant their base action via the engine.

## Testing tips

1. Restart the server so permission seed is current.
2. As **School Admin** — all guarded routes succeed.
3. As a role **without** a code (e.g. Class Teacher calling `/api/fee-payments`) — expect authorization failure (`ForbiddenError` / 403-class denial).
4. Login/register/invite/webhook paths remain open.

## Adding a new API module

1. Add codes to `lib/backend/rbac/permissions.js` if missing.
2. Assign codes in `seed-roles.js` (and existing tenants via Roles UI until P3).
3. On each handler:

```ts
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest) {
  await Guard.action(req, 'my-module:read')
  // ...
}
```

4. Update this doc’s path table.
5. Prefer matching FE nav permission (P2).
