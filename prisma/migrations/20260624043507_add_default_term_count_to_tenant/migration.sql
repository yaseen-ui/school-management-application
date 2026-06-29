/*
  Warnings:

  - You are about to drop the column `teacherAssignmentId` on the `attendance_sessions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tenantId,sectionId,date,periodId,shift,contextType]` on the table `attendance_sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sectionId` to the `attendance_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('percentage', 'fixed');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('cash', 'card', 'bank_transfer', 'upi', 'cheque', 'online', 'other');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('paid', 'partial', 'pending', 'refunded', 'cancelled');

-- CreateEnum
CREATE TYPE "FeeAllocationMethod" AS ENUM ('equal', 'custom');

-- CreateEnum
CREATE TYPE "AttendanceType" AS ENUM ('period_wise', 'shift_wise');

-- CreateEnum
CREATE TYPE "AttendanceContextType" AS ENUM ('regular', 'exam', 'event', 'seminar', 'sports', 'assembly', 'lab', 'field_trip', 'other');

-- DropForeignKey
ALTER TABLE "attendance_sessions" DROP CONSTRAINT "attendance_sessions_periodId_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "attendance_sessions" DROP CONSTRAINT "attendance_sessions_sectionSubjectId_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "attendance_sessions" DROP CONSTRAINT "attendance_sessions_teacherAssignmentId_tenantId_fkey";

-- DropIndex
DROP INDEX "attendance_sessions_tenantId_academicYearId_date_idx";

-- DropIndex
DROP INDEX "attendance_sessions_tenantId_academicYearId_sectionSubjectI_key";

-- AlterTable
ALTER TABLE "attendance_sessions" DROP COLUMN "teacherAssignmentId",
ADD COLUMN     "contextName" TEXT,
ADD COLUMN     "contextRefId" TEXT,
ADD COLUMN     "contextRefType" TEXT,
ADD COLUMN     "contextType" "AttendanceContextType" NOT NULL DEFAULT 'regular',
ADD COLUMN     "sectionId" TEXT NOT NULL,
ADD COLUMN     "shift" TEXT,
ADD COLUMN     "takenById" TEXT,
ALTER COLUMN "sectionSubjectId" DROP NOT NULL,
ALTER COLUMN "date" SET DATA TYPE DATE,
ALTER COLUMN "periodId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "sections" ADD COLUMN     "attendanceType" "AttendanceType" NOT NULL DEFAULT 'period_wise',
ADD COLUMN     "shifts" JSONB;

-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "defaultTermCount" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "fee_heads" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isOptional" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_heads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "section_fees" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "termCount" INTEGER NOT NULL DEFAULT 1,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "section_fees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "section_fee_heads" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "sectionFeeId" TEXT NOT NULL,
    "feeHeadId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "section_fee_heads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_terms" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "sectionFeeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_fees" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "allocationMethod" "FeeAllocationMethod" NOT NULL DEFAULT 'equal',
    "totalActualFee" DECIMAL(10,2) NOT NULL,
    "totalNegotiatedFee" DECIMAL(10,2) NOT NULL,
    "discountType" "DiscountType",
    "discountValue" DECIMAL(10,2),
    "discountReason" TEXT,
    "headWiseDiscounts" JSONB,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_fees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_fee_heads" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "studentFeeId" TEXT NOT NULL,
    "feeHeadId" TEXT NOT NULL,
    "actualAmount" DECIMAL(10,2) NOT NULL,
    "negotiatedAmount" DECIMAL(10,2) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_fee_heads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_payments" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "studentFeeId" TEXT NOT NULL,
    "termId" TEXT,
    "feeHeadId" TEXT,
    "amountPaid" DECIMAL(10,2) NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "transactionId" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'paid',
    "remarks" TEXT,
    "collectedById" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_refunds" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "reason" TEXT NOT NULL,
    "refundDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedById" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_refunds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fee_heads_tenantId_idx" ON "fee_heads"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "fee_heads_tenantId_name_key" ON "fee_heads"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "fee_heads_id_tenantId_key" ON "fee_heads"("id", "tenantId");

-- CreateIndex
CREATE INDEX "section_fees_tenantId_sectionId_idx" ON "section_fees"("tenantId", "sectionId");

-- CreateIndex
CREATE INDEX "section_fees_tenantId_academicYearId_idx" ON "section_fees"("tenantId", "academicYearId");

-- CreateIndex
CREATE UNIQUE INDEX "section_fees_tenantId_sectionId_academicYearId_key" ON "section_fees"("tenantId", "sectionId", "academicYearId");

-- CreateIndex
CREATE UNIQUE INDEX "section_fees_id_tenantId_key" ON "section_fees"("id", "tenantId");

-- CreateIndex
CREATE INDEX "section_fee_heads_tenantId_sectionFeeId_idx" ON "section_fee_heads"("tenantId", "sectionFeeId");

-- CreateIndex
CREATE INDEX "section_fee_heads_tenantId_feeHeadId_idx" ON "section_fee_heads"("tenantId", "feeHeadId");

-- CreateIndex
CREATE UNIQUE INDEX "section_fee_heads_tenantId_sectionFeeId_feeHeadId_key" ON "section_fee_heads"("tenantId", "sectionFeeId", "feeHeadId");

-- CreateIndex
CREATE UNIQUE INDEX "section_fee_heads_id_tenantId_key" ON "section_fee_heads"("id", "tenantId");

-- CreateIndex
CREATE INDEX "fee_terms_tenantId_sectionFeeId_idx" ON "fee_terms"("tenantId", "sectionFeeId");

-- CreateIndex
CREATE UNIQUE INDEX "fee_terms_tenantId_sectionFeeId_name_key" ON "fee_terms"("tenantId", "sectionFeeId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "fee_terms_id_tenantId_key" ON "fee_terms"("id", "tenantId");

-- CreateIndex
CREATE INDEX "student_fees_tenantId_enrollmentId_idx" ON "student_fees"("tenantId", "enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "student_fees_enrollmentId_tenantId_key" ON "student_fees"("enrollmentId", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "student_fees_id_tenantId_key" ON "student_fees"("id", "tenantId");

-- CreateIndex
CREATE INDEX "student_fee_heads_tenantId_studentFeeId_idx" ON "student_fee_heads"("tenantId", "studentFeeId");

-- CreateIndex
CREATE INDEX "student_fee_heads_tenantId_feeHeadId_idx" ON "student_fee_heads"("tenantId", "feeHeadId");

-- CreateIndex
CREATE UNIQUE INDEX "student_fee_heads_tenantId_studentFeeId_feeHeadId_key" ON "student_fee_heads"("tenantId", "studentFeeId", "feeHeadId");

-- CreateIndex
CREATE UNIQUE INDEX "student_fee_heads_id_tenantId_key" ON "student_fee_heads"("id", "tenantId");

-- CreateIndex
CREATE INDEX "fee_payments_tenantId_studentFeeId_idx" ON "fee_payments"("tenantId", "studentFeeId");

-- CreateIndex
CREATE INDEX "fee_payments_tenantId_termId_idx" ON "fee_payments"("tenantId", "termId");

-- CreateIndex
CREATE INDEX "fee_payments_tenantId_paymentDate_idx" ON "fee_payments"("tenantId", "paymentDate");

-- CreateIndex
CREATE INDEX "fee_payments_tenantId_collectedById_idx" ON "fee_payments"("tenantId", "collectedById");

-- CreateIndex
CREATE UNIQUE INDEX "fee_payments_id_tenantId_key" ON "fee_payments"("id", "tenantId");

-- CreateIndex
CREATE INDEX "fee_refunds_tenantId_paymentId_idx" ON "fee_refunds"("tenantId", "paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "fee_refunds_id_tenantId_key" ON "fee_refunds"("id", "tenantId");

-- CreateIndex
CREATE INDEX "attendance_sessions_tenantId_sectionId_date_idx" ON "attendance_sessions"("tenantId", "sectionId", "date");

-- CreateIndex
CREATE INDEX "attendance_sessions_tenantId_academicYearId_idx" ON "attendance_sessions"("tenantId", "academicYearId");

-- CreateIndex
CREATE INDEX "attendance_sessions_tenantId_takenById_idx" ON "attendance_sessions"("tenantId", "takenById");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_sessions_tenantId_sectionId_date_periodId_shift__key" ON "attendance_sessions"("tenantId", "sectionId", "date", "periodId", "shift", "contextType");

-- AddForeignKey
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "attendance_sessions_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES "sections"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "attendance_sessions_takenById_tenantId_fkey" FOREIGN KEY ("takenById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "attendance_sessions_periodId_tenantId_fkey" FOREIGN KEY ("periodId", "tenantId") REFERENCES "timetable_periods"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "attendance_sessions_sectionSubjectId_tenantId_fkey" FOREIGN KEY ("sectionSubjectId", "tenantId") REFERENCES "section_subjects"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_heads" ADD CONSTRAINT "fee_heads_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_fees" ADD CONSTRAINT "section_fees_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_fees" ADD CONSTRAINT "section_fees_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES "sections"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_fees" ADD CONSTRAINT "section_fees_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES "academic_years"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_fee_heads" ADD CONSTRAINT "section_fee_heads_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_fee_heads" ADD CONSTRAINT "section_fee_heads_sectionFeeId_tenantId_fkey" FOREIGN KEY ("sectionFeeId", "tenantId") REFERENCES "section_fees"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_fee_heads" ADD CONSTRAINT "section_fee_heads_feeHeadId_tenantId_fkey" FOREIGN KEY ("feeHeadId", "tenantId") REFERENCES "fee_heads"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_terms" ADD CONSTRAINT "fee_terms_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_terms" ADD CONSTRAINT "fee_terms_sectionFeeId_tenantId_fkey" FOREIGN KEY ("sectionFeeId", "tenantId") REFERENCES "section_fees"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fees" ADD CONSTRAINT "student_fees_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fees" ADD CONSTRAINT "student_fees_enrollmentId_tenantId_fkey" FOREIGN KEY ("enrollmentId", "tenantId") REFERENCES "student_enrollments"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fee_heads" ADD CONSTRAINT "student_fee_heads_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fee_heads" ADD CONSTRAINT "student_fee_heads_studentFeeId_tenantId_fkey" FOREIGN KEY ("studentFeeId", "tenantId") REFERENCES "student_fees"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fee_heads" ADD CONSTRAINT "student_fee_heads_feeHeadId_tenantId_fkey" FOREIGN KEY ("feeHeadId", "tenantId") REFERENCES "fee_heads"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_payments" ADD CONSTRAINT "fee_payments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_payments" ADD CONSTRAINT "fee_payments_studentFeeId_tenantId_fkey" FOREIGN KEY ("studentFeeId", "tenantId") REFERENCES "student_fees"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_payments" ADD CONSTRAINT "fee_payments_termId_tenantId_fkey" FOREIGN KEY ("termId", "tenantId") REFERENCES "fee_terms"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_payments" ADD CONSTRAINT "fee_payments_feeHeadId_tenantId_fkey" FOREIGN KEY ("feeHeadId", "tenantId") REFERENCES "fee_heads"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_payments" ADD CONSTRAINT "fee_payments_collectedById_tenantId_fkey" FOREIGN KEY ("collectedById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_refunds" ADD CONSTRAINT "fee_refunds_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_refunds" ADD CONSTRAINT "fee_refunds_paymentId_tenantId_fkey" FOREIGN KEY ("paymentId", "tenantId") REFERENCES "fee_payments"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_refunds" ADD CONSTRAINT "fee_refunds_processedById_tenantId_fkey" FOREIGN KEY ("processedById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;
