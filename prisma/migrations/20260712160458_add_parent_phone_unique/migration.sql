/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,phone]` on the table `parents` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "parents_tenantId_phone_key" ON "parents"("tenantId", "phone");
