# Company vs tenant boundary (issue #13)

## Product rule

| Actor | Surface |
|-------|---------|
| **Company user** | Platform only: tenants, company users, auth, company uploads |
| **Tenant user** | One school (domain → JWT `tenantId` → data + RBAC) |

**Company users must not enter a tenant** (no school modules, no `x-tenant-id` school workspace).

## History (Express → Next)

The old dual-app setup used Express routers:

```text
authenticate → authenticateTenant → controller
```

`authenticateTenant` rejected company users on school routes. After the monorepo refactor, the browser hit Next `app/api` → `server-adapter` → the same controllers **without** those Express routers (which allowed company + `x-tenant-id` until #13).

Legacy Express `*.routes.js` / Express-only middlewares were **removed** as dead code. All live traffic uses Next + `server-adapter` + `company-boundary`.

## Enforcement (current)

| Layer | Behavior |
|-------|----------|
| `lib/backend/auth/company-boundary.js` | Shared allow-list + assertions |
| `lib/api/server-adapter.ts` | Company never gets `tenantId`; non-platform APIs → 403 |
| `lib/backend/rbac/guards.js` | Company blocked on non-platform paths before `admin:super` bypass |
| `app/api/query-bot` | No company “open school workspace” |
| FE `apiClient` / auth store | Company host never sends school `x-tenant-id` |

## Platform API allow-list

Company may call:

- `/api/auth/**`
- `/api/public/**`
- `/api/webhooks/**`
- `/api/tenants/**`
- `/api/users/company/**`
- `/api/gcs/**` (company-level uploads)
- `/api/uploads/**` (company-level uploads)

Everything else (students, fees, attendance, …) → **403** `COMPANY_TENANT_FORBIDDEN`.

## Tenant users

- JWT `tenantId` is the source of school context.
- Header `x-tenant-id` cannot override JWT to another school.
- Domain login still binds the user to that school at auth time.

## Related

- GitHub #13 — company cannot enter tenant  
- GitHub #11 — domain → tenantId hardening (tenant path)  
- GitHub #14 — parent vs staff landings  
