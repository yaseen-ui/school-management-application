/*
  Warnings:

  - A unique constraint covering the columns `[userId,tenantId]` on the table `parents` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,tenantId]` on the table `teachers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,tenantId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "parents" DROP CONSTRAINT "parents_userId_fkey";

-- DropForeignKey
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_userId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "parents_userId_tenantId_key" ON "parents"("userId", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_userId_tenantId_key" ON "teachers"("userId", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_tenantId_key" ON "users"("id", "tenantId");

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_userId_tenantId_fkey" FOREIGN KEY ("userId", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_userId_tenantId_fkey" FOREIGN KEY ("userId", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;
