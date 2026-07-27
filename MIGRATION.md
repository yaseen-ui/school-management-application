# Database Migration Guide

## Prerequisites

- PostgreSQL running
- `pnpm` installed
- `.env` configured with `DATABASE_URL`

## Fresh Clone Setup

```bash
pnpm install
cp .env.example .env   # Edit DATABASE_URL with your DB credentials
pnpm prisma:migrate:dev
pnpm dev
```

## Reset Database (Wipe Everything)

Drops all tables, re-runs every migration, and regenerates the Prisma client:

```bash
npx prisma migrate reset
```

For force reset (skip confirmation prompt):

```bash
npx prisma migrate reset --force
```

## Run Pending Migrations Only

When you pull new code that includes migration files:

```bash
pnpm prisma:migrate:dev
```

## Push Schema Without Migrations (Dev Only)

Skips migration file generation — directly syncs schema to DB:

```bash
pnpm prisma:db:push
```

## Regenerate Prisma Client

After schema changes or after pulling updated schema:

```bash
pnpm prisma:generate
```

## Create a New Migration

After editing `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name describe_your_change
```

## Check Migration Status

```bash
npx prisma migrate status
```

## Open Prisma Studio (DB GUI)

```bash
pnpm prisma:studio
```

## Seed RBAC Data (Roles & Permissions)

After a fresh DB reset, seed the role-based access control data:

```bash
node lib/backend/rbac/seed-permissions.js
node lib/backend/rbac/seed-roles.js
```

## Legacy Tenant Migration

```bash
node scripts/migrate-legacy-tenant.cjs