/**
 * RBAC v2 — Permission Seeder
 *
 * Seeds the canonical permission catalog into the database on application startup.
 * Idempotent — uses upsert, so it can be run safely multiple times.
 * Only creates/updates permissions; never deletes anything.
 *
 * Called from:
 *   - Next.js instrumentation hook (app startup)
 *   - Manually via: node lib/backend/rbac/seed-permissions.js
 */

import { prisma } from '../lib/prisma.js';
import { PERMISSIONS } from './permissions.js';

/**
 * Seed all permissions into the database.
 * @returns {Promise<{ created: number, updated: number, total: number }>}
 */
async function seedPermissions() {
  const codes = Object.keys(PERMISSIONS);
  let created = 0;
  let updated = 0;

  for (const code of codes) {
    const def = PERMISSIONS[code];

    const existing = await prisma.permission.findUnique({
      where: { code },
      select: { id: true, module: true, action: true, scope: true, description: true },
    });

    if (!existing) {
      await prisma.permission.create({
        data: {
          code,
          module: def.module,
          action: def.action,
          scope: def.scope,
          description: def.description,
        },
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
        data: {
          module: def.module,
          action: def.action,
          scope: def.scope,
          description: def.description,
        },
      });
      updated++;
    }
  }

  console.log(
    `✅ RBAC: Seeded ${codes.length} permissions (${created} created, ${updated} updated, ${codes.length - created - updated} unchanged)`
  );

  return { created, updated, total: codes.length };
}

// Allow running directly: node lib/backend/rbac/seed-permissions.js
if (process.argv[1]?.endsWith('seed-permissions.js')) {
  seedPermissions()
    .then((result) => {
      console.log(`Done. Created: ${result.created}, Updated: ${result.updated}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed to seed permissions:', error);
      process.exit(1);
    });
}

export { seedPermissions };