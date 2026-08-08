# RBAC default role refresh (P3)

## What changed in default templates

| Role | Additions |
|------|-----------|
| **Principal** | Hostel (`hostel:read/manage/assign-staff/allocate`), payroll view + salary/compensation config, communication (from P0) |
| **Accountant** | Payroll process + salary components + compensation |
| **Academic Coordinator** | Communication notifications write + publications read (P0) |
| **Receptionist** | Communication notifications read (P0) |

School Admin remains `admin:super` only.

**Still excluded from Principal by design:** `roles:delete`, `payroll:process`, `settings:write` (process payroll is on Accountant).

## Safe refresh behavior

`seedDefaultRoles(tenantId)`:

1. Upserts default roles and groups  
2. **Adds** missing permissions via `ON CONFLICT DO NOTHING`  
3. **Does not** remove permissions already on the role  
4. **Does not** modify custom (non-default) roles  

## How to refresh existing tenants

```bash
# All tenants
node scripts/refresh-default-role-permissions.cjs

# One tenant
node scripts/refresh-default-role-permissions.cjs <tenant-uuid>
```

Ensure `DATABASE_URL` is set (or present in `.env`).

After refresh:

- Re-login as Principal / Accountant (or bump user `permVersion` if your auth flow does that on role change)
- Confirm Communication / Hostel / Payroll appear for Principal

## Manual alternative

Roles UI → open **Principal** → enable the new permission checkboxes → save.
