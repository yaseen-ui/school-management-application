-- AlterTable
ALTER TABLE "sections" ADD COLUMN     "roomId" TEXT;

-- CreateIndex
CREATE INDEX "sections_tenantId_roomId_idx" ON "sections"("tenantId", "roomId");

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_roomId_tenantId_fkey" FOREIGN KEY ("roomId", "tenantId") REFERENCES "rooms"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;
