-- AlterTable
ALTER TABLE "teacher_capabilities" ADD COLUMN     "sectionId" TEXT;

-- CreateIndex
CREATE INDEX "teacher_capabilities_tenantId_sectionId_idx" ON "teacher_capabilities"("tenantId", "sectionId");

-- AddForeignKey
ALTER TABLE "teacher_capabilities" ADD CONSTRAINT "teacher_capabilities_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES "sections"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;
