-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('debit', 'credit');

-- CreateTable
CREATE TABLE "account_categories" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_transactions" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "description" TEXT,
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "isVoided" BOOLEAN NOT NULL DEFAULT false,
    "voidReason" TEXT,
    "voidedAt" TIMESTAMP(3),
    "voidedById" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "account_categories_tenantId_idx" ON "account_categories"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "account_categories_id_tenantId_key" ON "account_categories"("id", "tenantId");

-- CreateIndex
CREATE INDEX "account_transactions_tenantId_categoryId_idx" ON "account_transactions"("tenantId", "categoryId");

-- CreateIndex
CREATE INDEX "account_transactions_tenantId_transactionDate_idx" ON "account_transactions"("tenantId", "transactionDate");

-- CreateIndex
CREATE INDEX "account_transactions_tenantId_referenceType_referenceId_idx" ON "account_transactions"("tenantId", "referenceType", "referenceId");

-- CreateIndex
CREATE UNIQUE INDEX "account_transactions_id_tenantId_key" ON "account_transactions"("id", "tenantId");

-- AddForeignKey
ALTER TABLE "account_categories" ADD CONSTRAINT "account_categories_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_transactions" ADD CONSTRAINT "account_transactions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_transactions" ADD CONSTRAINT "account_transactions_categoryId_tenantId_fkey" FOREIGN KEY ("categoryId", "tenantId") REFERENCES "account_categories"("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;
