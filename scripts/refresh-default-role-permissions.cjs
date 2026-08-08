/**
 * Refresh default role permission sets for all (or one) tenants.
 *
 * Uses seedDefaultRoles() which:
 *  - Upserts default roles/groups
 *  - INSERTs missing role_permissions (ON CONFLICT DO NOTHING)
 *  - Does NOT remove custom permissions or custom roles
 *
 * Usage:
 *   node scripts/refresh-default-role-permissions.cjs
 *   node scripts/refresh-default-role-permissions.cjs <tenantId>
 *
 * Requires DATABASE_URL (or .env loaded via dotenv if present).
 */

const path = require('path');

// Load .env if dotenv is available
try {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
} catch {
  // optional
}

async function main() {
  const { prisma } = await import('../lib/backend/lib/prisma.js');
  const { seedDefaultRoles } = await import('../lib/backend/rbac/seed-roles.js');
  const { seedPermissions } = await import('../lib/backend/rbac/seed-permissions.js');

  // Ensure catalog is up to date first
  await seedPermissions();

  const onlyTenantId = process.argv[2] || null;
  const tenants = onlyTenantId
    ? await prisma.tenant.findMany({ where: { id: onlyTenantId }, select: { id: true, schoolName: true } })
    : await prisma.tenant.findMany({ select: { id: true, schoolName: true } });

  if (!tenants.length) {
    console.error(onlyTenantId ? `No tenant found for id ${onlyTenantId}` : 'No tenants found');
    process.exit(1);
  }

  console.log(`Refreshing default roles for ${tenants.length} tenant(s)...`);
  for (const t of tenants) {
    console.log(`\n→ ${t.schoolName || t.id}`);
    const result = await seedDefaultRoles(t.id);
    console.log(`  rolesCreated=${result.rolesCreated} skipped=${result.rolesSkipped} permsTouched=${result.permissionsAssigned}`);
  }

  console.log('\nDone. Users may need to re-login (or wait for permVersion bump) to refresh JWT/permission cache.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
