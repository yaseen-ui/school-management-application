/*
  Warnings:

  - You are about to drop the column `totalQuantity` on the `store_kits` table. All the data in the column will be lost.
  - Added the required column `actualTotalAmount` to the `store_orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "store_orders" DROP CONSTRAINT "store_orders_academicYearId_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "store_orders" DROP CONSTRAINT "store_orders_enrollmentId_tenantId_fkey";

-- AlterTable
ALTER TABLE "store_kits" DROP COLUMN "totalQuantity";

-- AlterTable
ALTER TABLE "store_order_items" ADD COLUMN     "isReturned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "kitReferenceId" TEXT,
ADD COLUMN     "returnedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "store_orders" ADD COLUMN     "actualTotalAmount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "customerName" TEXT,
ADD COLUMN     "customerPhone" TEXT,
ADD COLUMN     "customerType" TEXT NOT NULL DEFAULT 'student',
ADD COLUMN     "discountAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "offeredAmount" DECIMAL(10,2),
ALTER COLUMN "enrollmentId" DROP NOT NULL,
ALTER COLUMN "academicYearId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "store_pending_items" ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paidAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "store_dues" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "enrollmentId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT,
    "customerType" TEXT NOT NULL DEFAULT 'student',
    "totalDueAmount" DECIMAL(10,2) NOT NULL,
    "paidAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "remarks" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_dues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_due_payments" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "dueId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentMethod" TEXT,
    "transactionId" TEXT,
    "remarks" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_due_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_returns" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "productId" TEXT,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "refundAmount" DECIMAL(10,2) NOT NULL,
    "reason" TEXT,
    "returnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_returns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "store_dues_tenantId_orderId_idx" ON "store_dues"("tenantId", "orderId");

-- CreateIndex
CREATE INDEX "store_dues_tenantId_status_idx" ON "store_dues"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "store_dues_id_tenantId_key" ON "store_dues"("id", "tenantId");

-- CreateIndex
CREATE INDEX "store_due_payments_tenantId_dueId_idx" ON "store_due_payments"("tenantId", "dueId");

-- CreateIndex
CREATE UNIQUE INDEX "store_due_payments_id_tenantId_key" ON "store_due_payments"("id", "tenantId");

-- CreateIndex
CREATE INDEX "store_returns_tenantId_orderItemId_idx" ON "store_returns"("tenantId", "orderItemId");

-- CreateIndex
CREATE UNIQUE INDEX "store_returns_id_tenantId_key" ON "store_returns"("id", "tenantId");

-- AddForeignKey
ALTER TABLE "store_orders" ADD CONSTRAINT "store_orders_enrollmentId_tenantId_fkey" FOREIGN KEY ("enrollmentId", "tenantId") REFERENCES "student_enrollments"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_orders" ADD CONSTRAINT "store_orders_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES "academic_years"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_dues" ADD CONSTRAINT "store_dues_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_dues" ADD CONSTRAINT "store_dues_orderId_tenantId_fkey" FOREIGN KEY ("orderId", "tenantId") REFERENCES "store_orders"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_dues" ADD CONSTRAINT "store_dues_enrollmentId_tenantId_fkey" FOREIGN KEY ("enrollmentId", "tenantId") REFERENCES "student_enrollments"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_due_payments" ADD CONSTRAINT "store_due_payments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_due_payments" ADD CONSTRAINT "store_due_payments_dueId_tenantId_fkey" FOREIGN KEY ("dueId", "tenantId") REFERENCES "store_dues"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_returns" ADD CONSTRAINT "store_returns_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_returns" ADD CONSTRAINT "store_returns_orderItemId_tenantId_fkey" FOREIGN KEY ("orderItemId", "tenantId") REFERENCES "store_order_items"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_returns" ADD CONSTRAINT "store_returns_productId_tenantId_fkey" FOREIGN KEY ("productId", "tenantId") REFERENCES "store_products"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;
