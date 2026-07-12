/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,pen]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId,apaarId]` on the table `students` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "students" ADD COLUMN     "apaarId" TEXT,
ADD COLUMN     "pen" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "students_tenantId_pen_key" ON "students"("tenantId", "pen");

-- CreateIndex
CREATE UNIQUE INDEX "students_tenantId_apaarId_key" ON "students"("tenantId", "apaarId");
