/*
  Warnings:

  - A unique constraint covering the columns `[id,tenantId]` on the table `holidays` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[registrationToken]` on the table `parents` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[registrationToken]` on the table `teachers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "HolidayRuleType" AS ENUM ('all_weekday', 'nth_weekday_of_month');

-- CreateEnum
CREATE TYPE "VisitorType" AS ENUM ('registered', 'non_registered');

-- CreateEnum
CREATE TYPE "VisitorApprovalStatus" AS ENUM ('pending', 'approved', 'rejected', 'not_required');

-- CreateEnum
CREATE TYPE "VisitorStatus" AS ENUM ('scheduled', 'checked_in', 'checked_out', 'cancelled');

-- CreateEnum
CREATE TYPE "ApprovalFrom" AS ENUM ('headmaster', 'point_of_contact', 'admin');

-- CreateEnum
CREATE TYPE "LeaveRequestStatus" AS ENUM ('draft', 'pending', 'partially_approved', 'approved', 'rejected', 'withdrawn', 'cancelled');

-- CreateEnum
CREATE TYPE "LeaveDayFraction" AS ENUM ('full_day', 'first_half', 'second_half');

-- CreateEnum
CREATE TYPE "LeaveApplicantType" AS ENUM ('student', 'employee');

-- CreateEnum
CREATE TYPE "LeaveAllocationMethod" AS ENUM ('annual', 'prorated', 'accrued_monthly');

-- AlterEnum
ALTER TYPE "AttendanceStatus" ADD VALUE 'leave';

-- AlterTable
ALTER TABLE "holidays" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "isMandatory" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "parents" ADD COLUMN     "isRegistered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "registrationToken" TEXT,
ADD COLUMN     "registrationTokenExp" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "isRegistered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "registrationToken" TEXT,
ADD COLUMN     "registrationTokenExp" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "staff_attendance" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "checkInTime" TIMESTAMP(3),
    "checkOutTime" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "totalMinutes" INTEGER NOT NULL DEFAULT 0,
    "sessionCount" INTEGER NOT NULL DEFAULT 0,
    "remarks" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_attendance_sessions" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "attendanceId" TEXT NOT NULL,
    "checkInTime" TIMESTAMP(3) NOT NULL,
    "checkInLat" DOUBLE PRECISION,
    "checkInLng" DOUBLE PRECISION,
    "checkInAccuracy" DOUBLE PRECISION,
    "checkInMethod" TEXT,
    "checkOutTime" TIMESTAMP(3),
    "checkOutLat" DOUBLE PRECISION,
    "checkOutLng" DOUBLE PRECISION,
    "checkOutAccuracy" DOUBLE PRECISION,
    "checkOutMethod" TEXT,
    "durationMinutes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_attendance_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holiday_categories" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "holiday_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_holiday_rules" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "academicYearId" TEXT,
    "name" TEXT NOT NULL,
    "ruleType" "HolidayRuleType" NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "weekOfMonth" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "remarks" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_holiday_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_purposes" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "approvalFrom" "ApprovalFrom" NOT NULL DEFAULT 'admin',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visitor_purposes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitors" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "visitorType" "VisitorType" NOT NULL,
    "parentId" TEXT,
    "visitorName" TEXT,
    "visitorPhone" TEXT,
    "visitorEmail" TEXT,
    "purposeId" TEXT NOT NULL,
    "description" TEXT,
    "pointOfContactId" TEXT,
    "approvalStatus" "VisitorApprovalStatus" NOT NULL DEFAULT 'not_required',
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "checkInTime" TIMESTAMP(3),
    "checkOutTime" TIMESTAMP(3),
    "status" "VisitorStatus" NOT NULL DEFAULT 'scheduled',
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_notifications" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "sentToId" TEXT,
    "type" TEXT NOT NULL,
    "message" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visitor_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_categories" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "applicantType" "LeaveApplicantType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "daysAllocated" DOUBLE PRECISION,
    "isPaid" BOOLEAN NOT NULL DEFAULT true,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT true,
    "allowHalfDay" BOOLEAN NOT NULL DEFAULT false,
    "requireDocuments" BOOLEAN NOT NULL DEFAULT false,
    "requireDocsAfterDays" DOUBLE PRECISION,
    "allowCarryForward" BOOLEAN NOT NULL DEFAULT false,
    "maxCarryForward" DOUBLE PRECISION,
    "allowNegativeBalance" BOOLEAN NOT NULL DEFAULT false,
    "allocationMethod" "LeaveAllocationMethod" NOT NULL DEFAULT 'annual',
    "studentApprovalMode" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_leave_balances" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "leaveCategoryId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "allocated" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "carriedForward" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "manualAdjustment" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "used" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pending" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_leave_balances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_balance_transactions" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "balanceId" TEXT NOT NULL,
    "changeType" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "previousBalance" DOUBLE PRECISION NOT NULL,
    "newBalance" DOUBLE PRECISION NOT NULL,
    "actorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leave_balance_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_requests" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "applicantType" "LeaveApplicantType" NOT NULL,
    "studentId" TEXT,
    "enrollmentId" TEXT,
    "employeeId" TEXT,
    "leaveCategoryId" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "startFraction" "LeaveDayFraction" NOT NULL DEFAULT 'full_day',
    "endFraction" "LeaveDayFraction" NOT NULL DEFAULT 'full_day',
    "reason" TEXT NOT NULL,
    "status" "LeaveRequestStatus" NOT NULL DEFAULT 'draft',
    "calculatedDays" DOUBLE PRECISION,
    "supportingDocumentUrl" TEXT,
    "submittedById" TEXT,
    "submittedAt" TIMESTAMP(3),
    "withdrawnAt" TIMESTAMP(3),
    "withdrawnReason" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_approvals" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "leaveRequestId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "approverRole" TEXT NOT NULL,
    "approverId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "remarks" TEXT,
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_cancellations" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "leaveRequestId" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "approverId" TEXT,
    "approverRemarks" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_cancellations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_audit_logs" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "leaveRequestId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actorId" TEXT,
    "actorName" TEXT,
    "actorRole" TEXT,
    "changes" JSONB,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leave_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_notifications" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "leaveRequestId" TEXT NOT NULL,
    "sentToId" TEXT,
    "type" TEXT NOT NULL,
    "message" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_leave_loss_of_pay" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "leaveRequestId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "payrollBatchId" TEXT,
    "days" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consumedAt" TIMESTAMP(3),

    CONSTRAINT "employee_leave_loss_of_pay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_leave_configurations" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "workingDays" "DayOfWeek"[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']::"DayOfWeek"[],
    "allowSaturdayHalfDay" BOOLEAN NOT NULL DEFAULT false,
    "allowLeaveWithoutApproval" BOOLEAN NOT NULL DEFAULT false,
    "lowBalanceAlertThreshold" DOUBLE PRECISION,
    "enableLowBalanceAlert" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_leave_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "staff_attendance_tenantId_date_idx" ON "staff_attendance"("tenantId", "date");

-- CreateIndex
CREATE INDEX "staff_attendance_tenantId_teacherId_idx" ON "staff_attendance"("tenantId", "teacherId");

-- CreateIndex
CREATE INDEX "staff_attendance_tenantId_date_status_idx" ON "staff_attendance"("tenantId", "date", "status");

-- CreateIndex
CREATE UNIQUE INDEX "staff_attendance_tenantId_teacherId_date_key" ON "staff_attendance"("tenantId", "teacherId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "staff_attendance_id_tenantId_key" ON "staff_attendance"("id", "tenantId");

-- CreateIndex
CREATE INDEX "staff_attendance_sessions_tenantId_attendanceId_idx" ON "staff_attendance_sessions"("tenantId", "attendanceId");

-- CreateIndex
CREATE UNIQUE INDEX "staff_attendance_sessions_id_tenantId_key" ON "staff_attendance_sessions"("id", "tenantId");

-- CreateIndex
CREATE INDEX "holiday_categories_tenantId_idx" ON "holiday_categories"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "holiday_categories_tenantId_name_key" ON "holiday_categories"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "holiday_categories_id_tenantId_key" ON "holiday_categories"("id", "tenantId");

-- CreateIndex
CREATE INDEX "tenant_holiday_rules_tenantId_idx" ON "tenant_holiday_rules"("tenantId");

-- CreateIndex
CREATE INDEX "tenant_holiday_rules_tenantId_academicYearId_idx" ON "tenant_holiday_rules"("tenantId", "academicYearId");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_holiday_rules_id_tenantId_key" ON "tenant_holiday_rules"("id", "tenantId");

-- CreateIndex
CREATE INDEX "visitor_purposes_tenantId_idx" ON "visitor_purposes"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "visitor_purposes_tenantId_name_key" ON "visitor_purposes"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "visitor_purposes_id_tenantId_key" ON "visitor_purposes"("id", "tenantId");

-- CreateIndex
CREATE INDEX "visitors_tenantId_visitorType_idx" ON "visitors"("tenantId", "visitorType");

-- CreateIndex
CREATE INDEX "visitors_tenantId_parentId_idx" ON "visitors"("tenantId", "parentId");

-- CreateIndex
CREATE INDEX "visitors_tenantId_purposeId_idx" ON "visitors"("tenantId", "purposeId");

-- CreateIndex
CREATE INDEX "visitors_tenantId_pointOfContactId_idx" ON "visitors"("tenantId", "pointOfContactId");

-- CreateIndex
CREATE INDEX "visitors_tenantId_approvalStatus_idx" ON "visitors"("tenantId", "approvalStatus");

-- CreateIndex
CREATE INDEX "visitors_tenantId_status_idx" ON "visitors"("tenantId", "status");

-- CreateIndex
CREATE INDEX "visitors_tenantId_createdAt_idx" ON "visitors"("tenantId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "visitors_id_tenantId_key" ON "visitors"("id", "tenantId");

-- CreateIndex
CREATE INDEX "visitor_notifications_tenantId_visitorId_idx" ON "visitor_notifications"("tenantId", "visitorId");

-- CreateIndex
CREATE INDEX "visitor_notifications_tenantId_sentToId_idx" ON "visitor_notifications"("tenantId", "sentToId");

-- CreateIndex
CREATE INDEX "visitor_notifications_tenantId_isRead_idx" ON "visitor_notifications"("tenantId", "isRead");

-- CreateIndex
CREATE UNIQUE INDEX "visitor_notifications_id_tenantId_key" ON "visitor_notifications"("id", "tenantId");

-- CreateIndex
CREATE INDEX "leave_categories_tenantId_idx" ON "leave_categories"("tenantId");

-- CreateIndex
CREATE INDEX "leave_categories_tenantId_applicantType_idx" ON "leave_categories"("tenantId", "applicantType");

-- CreateIndex
CREATE UNIQUE INDEX "leave_categories_tenantId_name_applicantType_key" ON "leave_categories"("tenantId", "name", "applicantType");

-- CreateIndex
CREATE UNIQUE INDEX "leave_categories_id_tenantId_key" ON "leave_categories"("id", "tenantId");

-- CreateIndex
CREATE INDEX "employee_leave_balances_tenantId_employeeId_idx" ON "employee_leave_balances"("tenantId", "employeeId");

-- CreateIndex
CREATE INDEX "employee_leave_balances_tenantId_leaveCategoryId_idx" ON "employee_leave_balances"("tenantId", "leaveCategoryId");

-- CreateIndex
CREATE INDEX "employee_leave_balances_tenantId_academicYearId_idx" ON "employee_leave_balances"("tenantId", "academicYearId");

-- CreateIndex
CREATE UNIQUE INDEX "employee_leave_balances_tenantId_employeeId_leaveCategoryId_key" ON "employee_leave_balances"("tenantId", "employeeId", "leaveCategoryId", "academicYearId");

-- CreateIndex
CREATE UNIQUE INDEX "employee_leave_balances_id_tenantId_key" ON "employee_leave_balances"("id", "tenantId");

-- CreateIndex
CREATE INDEX "leave_balance_transactions_tenantId_balanceId_idx" ON "leave_balance_transactions"("tenantId", "balanceId");

-- CreateIndex
CREATE INDEX "leave_balance_transactions_tenantId_createdAt_idx" ON "leave_balance_transactions"("tenantId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "leave_balance_transactions_id_tenantId_key" ON "leave_balance_transactions"("id", "tenantId");

-- CreateIndex
CREATE INDEX "leave_requests_tenantId_studentId_idx" ON "leave_requests"("tenantId", "studentId");

-- CreateIndex
CREATE INDEX "leave_requests_tenantId_employeeId_idx" ON "leave_requests"("tenantId", "employeeId");

-- CreateIndex
CREATE INDEX "leave_requests_tenantId_status_idx" ON "leave_requests"("tenantId", "status");

-- CreateIndex
CREATE INDEX "leave_requests_tenantId_leaveCategoryId_idx" ON "leave_requests"("tenantId", "leaveCategoryId");

-- CreateIndex
CREATE INDEX "leave_requests_tenantId_startDate_idx" ON "leave_requests"("tenantId", "startDate");

-- CreateIndex
CREATE INDEX "leave_requests_tenantId_endDate_idx" ON "leave_requests"("tenantId", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "leave_requests_id_tenantId_key" ON "leave_requests"("id", "tenantId");

-- CreateIndex
CREATE INDEX "leave_approvals_tenantId_leaveRequestId_idx" ON "leave_approvals"("tenantId", "leaveRequestId");

-- CreateIndex
CREATE INDEX "leave_approvals_tenantId_approverId_idx" ON "leave_approvals"("tenantId", "approverId");

-- CreateIndex
CREATE INDEX "leave_approvals_tenantId_status_idx" ON "leave_approvals"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "leave_approvals_id_tenantId_key" ON "leave_approvals"("id", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "leave_approvals_tenantId_leaveRequestId_level_key" ON "leave_approvals"("tenantId", "leaveRequestId", "level");

-- CreateIndex
CREATE INDEX "leave_cancellations_tenantId_leaveRequestId_idx" ON "leave_cancellations"("tenantId", "leaveRequestId");

-- CreateIndex
CREATE INDEX "leave_cancellations_tenantId_status_idx" ON "leave_cancellations"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "leave_cancellations_id_tenantId_key" ON "leave_cancellations"("id", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "leave_cancellations_tenantId_leaveRequestId_key" ON "leave_cancellations"("tenantId", "leaveRequestId");

-- CreateIndex
CREATE INDEX "leave_audit_logs_tenantId_leaveRequestId_idx" ON "leave_audit_logs"("tenantId", "leaveRequestId");

-- CreateIndex
CREATE INDEX "leave_audit_logs_tenantId_createdAt_idx" ON "leave_audit_logs"("tenantId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "leave_audit_logs_id_tenantId_key" ON "leave_audit_logs"("id", "tenantId");

-- CreateIndex
CREATE INDEX "leave_notifications_tenantId_leaveRequestId_idx" ON "leave_notifications"("tenantId", "leaveRequestId");

-- CreateIndex
CREATE INDEX "leave_notifications_tenantId_sentToId_idx" ON "leave_notifications"("tenantId", "sentToId");

-- CreateIndex
CREATE INDEX "leave_notifications_tenantId_isRead_idx" ON "leave_notifications"("tenantId", "isRead");

-- CreateIndex
CREATE UNIQUE INDEX "leave_notifications_id_tenantId_key" ON "leave_notifications"("id", "tenantId");

-- CreateIndex
CREATE INDEX "employee_leave_loss_of_pay_tenantId_employeeId_idx" ON "employee_leave_loss_of_pay"("tenantId", "employeeId");

-- CreateIndex
CREATE INDEX "employee_leave_loss_of_pay_tenantId_status_idx" ON "employee_leave_loss_of_pay"("tenantId", "status");

-- CreateIndex
CREATE INDEX "employee_leave_loss_of_pay_tenantId_payrollBatchId_idx" ON "employee_leave_loss_of_pay"("tenantId", "payrollBatchId");

-- CreateIndex
CREATE UNIQUE INDEX "employee_leave_loss_of_pay_id_tenantId_key" ON "employee_leave_loss_of_pay"("id", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "employee_leave_loss_of_pay_tenantId_leaveRequestId_key" ON "employee_leave_loss_of_pay"("tenantId", "leaveRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_leave_configurations_tenantId_key" ON "tenant_leave_configurations"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_leave_configurations_id_tenantId_key" ON "tenant_leave_configurations"("id", "tenantId");

-- CreateIndex
CREATE INDEX "holidays_tenantId_categoryId_idx" ON "holidays"("tenantId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "holidays_id_tenantId_key" ON "holidays"("id", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "parents_registrationToken_key" ON "parents"("registrationToken");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_registrationToken_key" ON "teachers"("registrationToken");

-- AddForeignKey
ALTER TABLE "staff_attendance" ADD CONSTRAINT "staff_attendance_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_attendance" ADD CONSTRAINT "staff_attendance_teacherId_tenantId_fkey" FOREIGN KEY ("teacherId", "tenantId") REFERENCES "teachers"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_attendance_sessions" ADD CONSTRAINT "staff_attendance_sessions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_attendance_sessions" ADD CONSTRAINT "staff_attendance_sessions_attendanceId_tenantId_fkey" FOREIGN KEY ("attendanceId", "tenantId") REFERENCES "staff_attendance"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holiday_categories" ADD CONSTRAINT "holiday_categories_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_categoryId_tenantId_fkey" FOREIGN KEY ("categoryId", "tenantId") REFERENCES "holiday_categories"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_holiday_rules" ADD CONSTRAINT "tenant_holiday_rules_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_holiday_rules" ADD CONSTRAINT "tenant_holiday_rules_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES "academic_years"("id", "tenantId") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_purposes" ADD CONSTRAINT "visitor_purposes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_parentId_tenantId_fkey" FOREIGN KEY ("parentId", "tenantId") REFERENCES "parents"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_purposeId_tenantId_fkey" FOREIGN KEY ("purposeId", "tenantId") REFERENCES "visitor_purposes"("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_pointOfContactId_tenantId_fkey" FOREIGN KEY ("pointOfContactId", "tenantId") REFERENCES "teachers"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_approvedById_tenantId_fkey" FOREIGN KEY ("approvedById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_notifications" ADD CONSTRAINT "visitor_notifications_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_notifications" ADD CONSTRAINT "visitor_notifications_visitorId_tenantId_fkey" FOREIGN KEY ("visitorId", "tenantId") REFERENCES "visitors"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_notifications" ADD CONSTRAINT "visitor_notifications_sentToId_tenantId_fkey" FOREIGN KEY ("sentToId", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_categories" ADD CONSTRAINT "leave_categories_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_leave_balances" ADD CONSTRAINT "employee_leave_balances_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_leave_balances" ADD CONSTRAINT "employee_leave_balances_employeeId_tenantId_fkey" FOREIGN KEY ("employeeId", "tenantId") REFERENCES "teachers"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_leave_balances" ADD CONSTRAINT "employee_leave_balances_leaveCategoryId_tenantId_fkey" FOREIGN KEY ("leaveCategoryId", "tenantId") REFERENCES "leave_categories"("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_leave_balances" ADD CONSTRAINT "employee_leave_balances_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES "academic_years"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_balance_transactions" ADD CONSTRAINT "leave_balance_transactions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_balance_transactions" ADD CONSTRAINT "leave_balance_transactions_balanceId_tenantId_fkey" FOREIGN KEY ("balanceId", "tenantId") REFERENCES "employee_leave_balances"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_leaveCategoryId_tenantId_fkey" FOREIGN KEY ("leaveCategoryId", "tenantId") REFERENCES "leave_categories"("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_studentId_tenantId_fkey" FOREIGN KEY ("studentId", "tenantId") REFERENCES "students"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_enrollmentId_tenantId_fkey" FOREIGN KEY ("enrollmentId", "tenantId") REFERENCES "student_enrollments"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_employeeId_tenantId_fkey" FOREIGN KEY ("employeeId", "tenantId") REFERENCES "teachers"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_approvals" ADD CONSTRAINT "leave_approvals_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_approvals" ADD CONSTRAINT "leave_approvals_leaveRequestId_tenantId_fkey" FOREIGN KEY ("leaveRequestId", "tenantId") REFERENCES "leave_requests"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_cancellations" ADD CONSTRAINT "leave_cancellations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_cancellations" ADD CONSTRAINT "leave_cancellations_leaveRequestId_tenantId_fkey" FOREIGN KEY ("leaveRequestId", "tenantId") REFERENCES "leave_requests"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_audit_logs" ADD CONSTRAINT "leave_audit_logs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_audit_logs" ADD CONSTRAINT "leave_audit_logs_leaveRequestId_tenantId_fkey" FOREIGN KEY ("leaveRequestId", "tenantId") REFERENCES "leave_requests"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_notifications" ADD CONSTRAINT "leave_notifications_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_notifications" ADD CONSTRAINT "leave_notifications_leaveRequestId_tenantId_fkey" FOREIGN KEY ("leaveRequestId", "tenantId") REFERENCES "leave_requests"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_leave_loss_of_pay" ADD CONSTRAINT "employee_leave_loss_of_pay_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_leave_loss_of_pay" ADD CONSTRAINT "employee_leave_loss_of_pay_leaveRequestId_tenantId_fkey" FOREIGN KEY ("leaveRequestId", "tenantId") REFERENCES "leave_requests"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_leave_loss_of_pay" ADD CONSTRAINT "employee_leave_loss_of_pay_employeeId_tenantId_fkey" FOREIGN KEY ("employeeId", "tenantId") REFERENCES "teachers"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_leave_loss_of_pay" ADD CONSTRAINT "employee_leave_loss_of_pay_payrollBatchId_tenantId_fkey" FOREIGN KEY ("payrollBatchId", "tenantId") REFERENCES "payroll_batches"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_leave_configurations" ADD CONSTRAINT "tenant_leave_configurations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
