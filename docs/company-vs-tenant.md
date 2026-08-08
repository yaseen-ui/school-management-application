# Company vs tenant boundary (issue #13)

## Product rule

| Actor | Surface |
|-------|---------|
| **Company user** | Platform only: tenants, company users, auth, company uploads |
| **Tenant user** | One school (domain → JWT `tenantId` → data + RBAC) |

**Company users must not enter a tenant** (no school modules, no `x-tenant-id` school workspace).

## Why Express felt stricter than Next.js

Legacy Express school routes used:

```text
authenticate → authenticateTenant
```

`authenticateTenant` rejects anyone who is not `userType === "tenant"` with matching `tenantId`.

The Next.js App Router path uses `invokeBackendController` → `server-adapter`, which historically allowed company + `x-tenant-id`. That is **closed** as of this change.

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
