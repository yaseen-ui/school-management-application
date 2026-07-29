/**
 * Next.js Instrumentation Hook
 *
 * Runs once when the Next.js server starts (both in dev and production).
 * Used here to seed the canonical RBAC permission catalog into the database.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
  // Only run on Node.js runtime (skip edge runtime)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { seedPermissions } = await import(
      './lib/backend/rbac/seed-permissions.js'
    );

    try {
      await seedPermissions();
    } catch (error) {
      console.error(
        '❌ Failed to seed permissions on startup:',
        error instanceof Error ? error.message : error,
      );
      // Don't crash the server — the app can still run with manually seeded permissions
    }
  }
}