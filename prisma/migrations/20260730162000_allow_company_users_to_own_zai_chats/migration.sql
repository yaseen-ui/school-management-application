-- ZAI conversations remain isolated by "tenantId", but company users may
-- operate inside a selected tenant workspace. Ownership therefore references
-- the globally unique user ID rather than requiring the owner to belong to the
-- same tenant row.
ALTER TABLE "zai_chats"
  DROP CONSTRAINT IF EXISTS "zai_chats_userId_tenantId_fkey";

ALTER TABLE "zai_chats"
  ADD CONSTRAINT "zai_chats_userId_fkey"
  FOREIGN KEY ("userId")
  REFERENCES "users"("id")
  ON DELETE CASCADE
  ON UPDATE CASCADE;
