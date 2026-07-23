/*
  Warnings:

  - You are about to drop the column `sectionName` on the `hostel_sections` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tenantId,blockId,sectionId]` on the table `hostel_sections` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sectionId` to the `hostel_sections` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "hostel_sections_tenantId_blockId_sectionName_key";

-- AlterTable
ALTER TABLE "hostel_sections" DROP COLUMN "sectionName",
ADD COLUMN     "sectionId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "hostel_sections_tenantId_sectionId_idx" ON "hostel_sections"("tenantId", "sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "hostel_sections_tenantId_blockId_sectionId_key" ON "hostel_sections"("tenantId", "blockId", "sectionId");

-- AddForeignKey
ALTER TABLE "hostel_sections" ADD CONSTRAINT "hostel_sections_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES "sections"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;
