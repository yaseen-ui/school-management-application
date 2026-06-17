/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,structureId,name]` on the table `timetable_periods` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `structureId` to the `timetable_periods` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "timetable_periods_tenantId_name_key";

-- AlterTable
ALTER TABLE "sections" ADD COLUMN     "structureId" TEXT;

-- AlterTable
ALTER TABLE "timetable_periods" ADD COLUMN     "structureId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "timetable_structures" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timetable_structures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "timetable_structures_tenantId_idx" ON "timetable_structures"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "timetable_structures_tenantId_name_key" ON "timetable_structures"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "timetable_structures_id_tenantId_key" ON "timetable_structures"("id", "tenantId");

-- CreateIndex
CREATE INDEX "sections_tenantId_structureId_idx" ON "sections"("tenantId", "structureId");

-- CreateIndex
CREATE INDEX "timetable_periods_tenantId_structureId_idx" ON "timetable_periods"("tenantId", "structureId");

-- CreateIndex
CREATE UNIQUE INDEX "timetable_periods_tenantId_structureId_name_key" ON "timetable_periods"("tenantId", "structureId", "name");

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_structureId_tenantId_fkey" FOREIGN KEY ("structureId", "tenantId") REFERENCES "timetable_structures"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_structures" ADD CONSTRAINT "timetable_structures_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_periods" ADD CONSTRAINT "timetable_periods_structureId_tenantId_fkey" FOREIGN KEY ("structureId", "tenantId") REFERENCES "timetable_structures"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;
