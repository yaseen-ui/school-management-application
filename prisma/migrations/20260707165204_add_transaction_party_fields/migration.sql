-- AlterTable
ALTER TABLE "account_transactions" ADD COLUMN     "partyId" TEXT,
ADD COLUMN     "partyName" TEXT,
ADD COLUMN     "partyType" TEXT;

-- CreateIndex
CREATE INDEX "account_transactions_tenantId_partyType_partyId_idx" ON "account_transactions"("tenantId", "partyType", "partyId");
