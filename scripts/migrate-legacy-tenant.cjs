/**
 * Migrate legacy tenants to RBAC v2.
 *
 * Performs the following for each tenant:
 *   1. Seeds the canonical permission catalog (idempotent)
 *   2. Seeds default roles + groups (idempotent)
 *   3. Migrates users on legacy roles to the new "School Admin" role
 *   4. Bumps permVersion so new JWTs carry the correct role IDs
 *
 * Usage:
 *   node scripts/migrate-legacy-tenant.cjs                    # migrate ALL tenants
 *   node scripts/migrate-legacy-tenant.cjs <tenant-uuid>      # migrate a specific tenant
 */

const { PrismaClient } = require('@prisma/client');
const path = require('path');

const prisma = new PrismaClient();

// ── Dynamic import for ESM seed modules ──
async function importSeedModules() {
  const { PERMISSIONS } = await import('../lib/backend/rbac/permissions.js');
  const { seedDefaultRoles } = await import('../lib/backend/rbac/seed-roles.js');
  return { PERMISSIONS, seedDefaultRoles };
}

async function seedPermissions() {
  const { PERMISSIONS } = await importSeedModules();
  const codes = Object.keys(PERMISSIONS);
  let created = 0;
  let updated = 0;

  for (const code of codes) {
    const def = PERMISSIONS[code];
    const existing = await prisma.permission.findUnique({ where: { code } });

    if (!existing) {
      await prisma.permission.create({
        data: { code, module: def.module, action: def.action, scope: def.scope ?? null, description: def.description },
      });
      created++;
    } else if (
      existing.module !== def.module ||
      existing.action !== def.action ||
      existing.scope !== def.scope ||
      existing.description !== def.description
    ) {
      await prisma.permission.update({
        where: { code },
        data: { module: def.module, action: def.action, scope: def.scope ?? null, description: def.description },
      });
      updated++;
    }
  }
  console.log(`  ✅ Permissions: ${codes.length} total (${created} created, ${updated} updated, ${codes.length - created - updated} unchanged)`);
}

async function migrateTenant(tenantId) {
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId }, select: { schoolName: true } });
  if (!tenant) {
    console.error(`  ❌ Tenant ${tenantId} not found`);
    return;
  }

  console.log(`\n📦 Migrating tenant: ${tenant.schoolName} (${tenantId})`);

  // 1. Seed permissions (global — idempotent, only needed once but safe to re-run)
  await seedPermissions();

  // 2. Seed default roles & groups for this tenant
  const { seedDefaultRoles } = await importSeedModules();
  const result = await seedDefaultRoles(tenantId);
  console.log(`  ✅ Roles: ${result.rolesCreated} created, ${result.rolesSkipped} already existed`);

  // 3. Migrate legacy users: find users on "school_super_admin" role → assign "School Admin"
  //    (the legacy role name from old tenant onboarding)
  const legacyRole = await prisma.role.findUnique({
    where: { uniqueRoleNamePerTenant: { tenantId, roleName: 'school_super_admin' } },
    select: { id: true },
  });

  const schoolAdminRole = await prisma.role.findUnique({
    where: { uniqueRoleNamePerTenant: { tenantId, roleName: 'School Admin' } },
    select: { id: true },
  });

  if (legacyRole && schoolAdminRole) {
    // Find all users linked to the legacy role via the old roleId field (migrated to user_roles).
    // The migration SQL already moved users.roleId → user_roles rows.
    const legacyUserRoles = await prisma.userRole.findMany({
      where: { tenantId, roleId: legacyRole.id },
      select: { userId: true },
    });

    // Assign "School Admin" role to these users (idempotent — ON CONFLICT DO NOTHING)
    let migratedCount = 0;
    for (const ur of legacyUserRoles) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO "user_roles" ("userId", "roleId", "tenantId", "createdAt")
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT DO NOTHING`,
        ur.userId,
        schoolAdminRole.id,
        tenantId,
      );

      // Bump permVersion for this user
      await prisma.user.update({
        where: { id: ur.userId },
        data: { permVersion: { increment: 1 } },
      });

      migratedCount++;
      await prisma.$executeRaw`SELECT 1`; // force sequence
    }

    console.log(`  ✅ Users migrated: ${migratedCount} users moved from "school_super_admin" → "School Admin" (admin:super)`);
  } else if (!legacyRole) {
    console.log(`  ℹ️  No legacy "school_super_admin" role found — nothing to migrate`);
  } else {
    console.log(`  ⚠️  Legacy role found but "School Admin" role not seeded`);
  }

  console.log(`  🎉 Tenant migration complete. Users must log out and log back in.\n`);
}

async function main() {
  const targetTenantId = process.argv[2];

  console.log('🚀 RBAC v2 — Legacy Tenant Migration\n');

  if (targetTenantId) {
    await migrateTenant(targetTenantId);
  } else {
    // Migrate ALL tenants
    const tenants = await prisma.tenant.findMany({ select: { id: true } });
    console.log(`Found ${tenants.length} tenant(s)\n`);
    for (const { id } of tenants) {
      await migrateTenant(id);
    }
  }

  await prisma.$disconnect();
  console.log('✅ Done.\n');
}

main().catch((err) => {
  console.error('❌ Migration failed:', err);
  prisma.$disconnect();
  process.exit(1);
});