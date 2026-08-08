# RBAC multi-role test matrix (P4)

**Epic:** [#5](https://github.com/yaseen-ui/school-management-application/issues/5) · **Issue:** [#9](https://github.com/yaseen-ui/school-management-application/issues/9)

Use this matrix for acceptance of RBAC work. **Never sign off on School Admin alone** — `admin:super` hides gaps.

## Layers to verify (every role)

| Layer | What to check |
|-------|----------------|
| **Nav** | Sidebar items match intended modules |
| **Page** | Deep link to forbidden path → Access Denied |
| **API** | Representative GET/POST returns success vs denial |

## Automated smoke

```bash
pnpm test:rbac
# or
node scripts/rbac-smoke-test.mjs
```

This validates (no server required):

- Permission matching (`admin:super`, exact, `module:*`, scoped → base)
- Default role permission codes exist in the catalog
- Frontend route map codes exist in the catalog
- API `Guard.action` codes exist in the catalog
- Role matrix CAN / CANNOT expectations against default role templates

## Test accounts recipe

1. Ensure permissions catalog is seeded (app start or `seedPermissions`).
2. Refresh default roles (adds missing perms safely):

```bash
node scripts/refresh-default-role-permissions.cjs
# optional: <tenantId>
```

3. In **Users** UI (as School Admin), create one user per role (or re-use staff accounts):

| Account (suggested) | Assign role |
|---------------------|-------------|
| `admin@school.test` | School Admin |
| `principal@school.test` | Principal |
| `class.teacher@school.test` | Class Teacher |
| `subject.teacher@school.test` | Subject Teacher |
| `accountant@school.test` | Accountant |
| `reception@school.test` | Receptionist / Clerk |
| `parent@school.test` | Parent (+ link a student) |
| `driver@school.test` | Driver |
| `transport@school.test` | Transport Manager |

4. Log out fully between roles (clear token). Company users act as super-admin — use **tenant** users for role tests.

## Role matrix

### School Admin

| | Expect |
|--|--------|
| **CAN** | Full nav; all modules; Create/Edit/Delete where UI exposes them |
| **CANNOT** | — |
| **API samples** | `GET /api/students` OK · `POST /api/payroll/batches` OK · `GET /api/communication/channels` OK |
| **Deep link** | `/payroll/processing`, `/roles`, `/settings` all open |

### Principal

| | Expect |
|--|--------|
| **CAN** | Academics, students, teachers, exams, hostel, communication, fees **read**, payroll **read**, reports |
| **CANNOT** | `roles:delete`, `payroll:process`, `settings:write` (by design) |
| **API samples** | `GET /api/hostel/blocks` OK · `POST /api/payroll/batches` **denied** · `PUT /api/settings/institute` **denied** |
| **Deep link** | `/hostel/blocks` OK · `/settings` may view if `settings:read` only — edit disabled |

### Class Teacher

| | Expect |
|--|--------|
| **CAN** | Section-scoped students/attendance/marks; leave own; timetable read |
| **CANNOT** | Fee collect, users/roles, payroll, global student delete, imports |
| **API samples** | `GET /api/attendance/sessions` OK (if granted) · `POST /api/fee-payments` **denied** · `POST /api/users` **denied** |
| **Deep link** | `/fee-payments` → Access Denied · `/students` may show if scoped grants base `students:read` |

### Subject Teacher

| | Expect |
|--|--------|
| **CAN** | Same pattern as Class Teacher (section marks/attendance) |
| **CANNOT** | Fee refunds, imports, settings, roles |
| **API samples** | `POST /api/imports/students` **denied** · marks entry OK with section scope |

### Accountant

| | Expect |
|--|--------|
| **CAN** | Fee heads/terms/payments/refunds, accounts, transactions, payroll process |
| **CANNOT** | Teachers delete, roles edit, exam publish (unless later granted) |
| **API samples** | `POST /api/fee-payments` OK · `DELETE /api/teachers/:id` **denied** · `POST /api/payroll/batches` OK |
| **Deep link** | `/fee-payments` OK · `/teachers` → Access Denied |

### Receptionist / Clerk

| | Expect |
|--|--------|
| **CAN** | Students write, visitors, imports, notifications **read** |
| **CANNOT** | Payroll process, roles edit, hostel manage, fee refunds process |
| **API samples** | `POST /api/visitors` OK · `POST /api/imports/students` OK · `POST /api/payroll/batches` **denied** |
| **Deep link** | `/visitors` OK · `/payroll/processing` → Access Denied |

### Parent

| | Expect |
|--|--------|
| **CAN** | Parent portal; own-child attendance/results/fees; `parent-portal:access` |
| **CANNOT** | Staff modules (students list admin, fees collect, roles, hostel admin) |
| **API samples** | `GET /api/parent/me` OK · `GET /api/students` may pass base if scoped→base — prefer parent APIs · staff write **denied** |
| **Deep link** | `/parent-portal` OK · `/fee-payments` → Access Denied · `/roles` → Access Denied |

### Driver

| | Expect |
|--|--------|
| **CAN** | Transport assigned read, limited student section read |
| **CANNOT** | Student write, fees, payroll, roles |
| **API samples** | Transport read OK · `POST /api/students` **denied** |
| **Deep link** | `/students` may partial · `/fee-heads` Access Denied |

### Transport Manager

| | Expect |
|--|--------|
| **CAN** | Transport read/write/assign, students read |
| **CANNOT** | Payroll, roles, fee collect |
| **API samples** | `POST /api/transportation/vehicles` OK · `POST /api/roles` **denied** |
| **Deep link** | `/transportation/vehicles` OK · `/roles` Access Denied |

## Manual smoke run log

Copy and fill after each major RBAC release:

| Role | Nav OK | Page OK | API OK | Tester | Date | Notes |
|------|--------|---------|--------|--------|------|-------|
| School Admin | ☐ | ☐ | ☐ | | | |
| Principal | ☐ | ☐ | ☐ | | | |
| Class Teacher | ☐ | ☐ | ☐ | | | |
| Subject Teacher | ☐ | ☐ | ☐ | | | |
| Accountant | ☐ | ☐ | ☐ | | | |
| Receptionist | ☐ | ☐ | ☐ | | | |
| Parent | ☐ | ☐ | ☐ | | | |
| Driver | ☐ | ☐ | ☐ | | | |
| Transport Manager | ☐ | ☐ | ☐ | | | |

**Representative API curl** (replace token):

```bash
# Expect success for School Admin / denial for Class Teacher
curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  http://localhost:3000/api/fee-payments
```

> Note: unhandled `ForbiddenError` may surface as **500** in some Next handlers; treat any non-2xx denial as pass for “blocked”. Prefer fixing to JSON 403 in a follow-up if needed.

## Representative endpoints by module

| Module | GET (read) | Mutate |
|--------|------------|--------|
| Students | `/api/students` | `POST /api/students` |
| Teachers | `/api/teachers` | `POST /api/teachers` |
| Attendance | `/api/attendance/sessions` | `POST /api/attendance/marks` |
| Fees | `/api/fee-payments` | `POST /api/fee-payments` |
| Hostel | `/api/hostel/blocks` | `POST /api/hostel/blocks` |
| Store | `/api/store/products` | `POST /api/store/orders` |
| Transport | `/api/transportation/vehicles` | `POST /api/transportation/vehicles` |
| Leave | `/api/leave/requests` | `POST /api/leave/requests` |
| Payroll | `/api/payroll/batches` | `POST /api/payroll/batches` |
| Communication | `/api/communications` | `POST /api/communications` |
| Publications | `/api/publications` | `POST /api/publications` |
| Channels | `/api/communication/channels` | `PATCH /api/communication/channels` |
| Query bot | — | `POST /api/query-bot` |
| Roles | `/api/roles` | `POST /api/roles` |
| Settings | `/api/settings/institute` | `PUT /api/settings/institute` |
| Parent portal | `/api/parent/me` | — |

## Regression gate (new modules)

Every new module PR must:

1. Add codes to `lib/backend/rbac/permissions.js`
2. Assign default roles in `seed-roles.js` (if needed)
3. Add `Guard.action` on API routes
4. Add route entry in `lib/rbac/route-permissions.ts` (+ nav permission)
5. Add a **row** to this matrix (role CAN/CANNOT + one API sample)
6. Run `pnpm test:rbac` and keep it green

## Related docs

- [rbac-api-map.md](./rbac-api-map.md) — API Guard coverage  
- [rbac-role-refresh.md](./rbac-role-refresh.md) — reseed existing tenants  
- Catalog: `lib/backend/rbac/permissions.js`  
- Default roles: `lib/backend/rbac/seed-roles.js`
