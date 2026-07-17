/*
  RBAC v2 Schema Migration

  Steps:
  1. Create new tables (permissions, role_permissions, user_roles, groups, role_groups, audit_logs)
  2. Migrate existing role permissions → permission records + role_permissions
  3. Migrate existing user-role assignments → user_roles
  4. Drop old columns (roles.permissions, users.roleId)
*/

-- Step 1: Create new tables

CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "scope" TEXT,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "role_permissions" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("roleId","permissionId","tenantId")
);

CREATE TABLE "user_roles" (
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("userId","roleId","tenantId")
);

CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "role_groups" (
    "roleId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "role_groups_pkey" PRIMARY KEY ("roleId","groupId","tenantId")
);

CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "actorId" TEXT,
    "actorEmail" TEXT,
    "action" TEXT NOT NULL,
    "targetType" TEXT,
    "targetId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "level" TEXT NOT NULL DEFAULT 'info',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- Create indexes for new tables
CREATE UNIQUE INDEX "permissions_code_key" ON "permissions"("code");
CREATE INDEX "groups_tenantId_idx" ON "groups"("tenantId");
CREATE UNIQUE INDEX "groups_id_tenantId_key" ON "groups"("id", "tenantId");
CREATE UNIQUE INDEX "groups_tenantId_groupName_key" ON "groups"("tenantId", "groupName");
CREATE INDEX "audit_logs_tenantId_createdAt_idx" ON "audit_logs"("tenantId", "createdAt");
CREATE INDEX "audit_logs_actorId_idx" ON "audit_logs"("actorId");
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- Step 2: Migrate existing role permissions
-- For each role with permissions JSON array, create a Permission record (if not exists)
-- and a RolePermission linking record.
-- This uses a DO block to handle the JSON array iteration.

DO $$
DECLARE
    r RECORD;
    perm_text TEXT;
    perm_id TEXT;
BEGIN
    FOR r IN SELECT id, "tenantId", "permissions" FROM "roles" WHERE "permissions" IS NOT NULL
    LOOP
        FOR perm_text IN SELECT jsonb_array_elements_text(r."permissions"::jsonb)
        LOOP
            -- Generate a deterministic UUID for the permission code (to allow idempotent re-runs)
            perm_id := md5('perm_' || perm_text)::uuid;

            -- Insert permission if not exists (idempotent)
            INSERT INTO "permissions" ("id", "code", "module", "action", "scope", "description", "createdAt", "updatedAt")
            VALUES (
                perm_id,
                perm_text,
                'migrated',
                'manage',
                NULL,
                'Migrated from legacy role permissions',
                NOW(),
                NOW()
            )
            ON CONFLICT ("code") DO NOTHING;

            -- If the permission was newly created with a different ID due to conflict, fetch the existing one
            SELECT id INTO perm_id FROM "permissions" WHERE "code" = perm_text;

            -- Link role to permission
            INSERT INTO "role_permissions" ("roleId", "permissionId", "tenantId", "createdAt")
            VALUES (r.id, perm_id, r."tenantId", NOW())
            ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;
END $$;

-- Step 3: Migrate existing user-role assignments (users.roleId → user_roles)
INSERT INTO "user_roles" ("userId", "roleId", "tenantId", "createdAt")
SELECT id, "roleId", "tenantId", NOW()
FROM "users"
WHERE "roleId" IS NOT NULL AND "tenantId" IS NOT NULL
ON CONFLICT DO NOTHING;

-- Step 4: Drop old columns and constraints

-- Drop FK from users to roles
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_roleId_tenantId_fkey";

-- Drop old column from roles
ALTER TABLE "roles" DROP COLUMN IF EXISTS "permissions";

-- Add isDefault to roles
ALTER TABLE "roles" ADD COLUMN IF NOT EXISTS "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- Drop old column from users
ALTER TABLE "users" DROP COLUMN IF EXISTS "roleId";

-- Add permVersion to users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "permVersion" INTEGER NOT NULL DEFAULT 0;

-- Add FKs for new tables
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_tenantId_fkey" FOREIGN KEY ("roleId", "tenantId") REFERENCES "roles"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_tenantId_fkey" FOREIGN KEY ("roleId", "tenantId") REFERENCES "roles"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "groups" ADD CONSTRAINT "groups_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "role_groups" ADD CONSTRAINT "role_groups_roleId_tenantId_fkey" FOREIGN KEY ("roleId", "tenantId") REFERENCES "roles"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "role_groups" ADD CONSTRAINT "role_groups_groupId_tenantId_fkey" FOREIGN KEY ("groupId", "tenantId") REFERENCES "groups"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;