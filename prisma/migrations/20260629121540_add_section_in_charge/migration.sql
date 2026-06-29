-- AlterTable
ALTER TABLE "sections" ADD COLUMN     "sectionInChargeId" TEXT;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_sectionInChargeId_tenantId_fkey" FOREIGN KEY ("sectionInChargeId", "tenantId") REFERENCES "teachers"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;
