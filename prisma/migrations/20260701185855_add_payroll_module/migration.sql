-- CreateTable
CREATE TABLE "salary_components" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'earning',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salary_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_compensations" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_compensations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compensation_components" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "compensationId" TEXT NOT NULL,
    "salaryComponentId" TEXT NOT NULL,
    "value" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compensation_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compensation_history" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "compensationId" TEXT,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "components" JSONB NOT NULL,
    "changedById" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "compensation_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_batches" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "processedAt" TIMESTAMP(3),
    "processedById" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payroll_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_records" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "actualSalary" DECIMAL(12,2) NOT NULL,
    "paidAmount" DECIMAL(12,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentMethod" TEXT NOT NULL DEFAULT 'cash',
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payroll_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "salary_components_tenantId_idx" ON "salary_components"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "salary_components_tenantId_name_key" ON "salary_components"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "salary_components_id_tenantId_key" ON "salary_components"("id", "tenantId");

-- CreateIndex
CREATE INDEX "employee_compensations_tenantId_employeeId_idx" ON "employee_compensations"("tenantId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "employee_compensations_employeeId_tenantId_key" ON "employee_compensations"("employeeId", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "employee_compensations_id_tenantId_key" ON "employee_compensations"("id", "tenantId");

-- CreateIndex
CREATE INDEX "compensation_components_tenantId_compensationId_idx" ON "compensation_components"("tenantId", "compensationId");

-- CreateIndex
CREATE UNIQUE INDEX "compensation_components_tenantId_compensationId_salaryCompo_key" ON "compensation_components"("tenantId", "compensationId", "salaryComponentId");

-- CreateIndex
CREATE UNIQUE INDEX "compensation_components_id_tenantId_key" ON "compensation_components"("id", "tenantId");

-- CreateIndex
CREATE INDEX "compensation_history_tenantId_employeeId_idx" ON "compensation_history"("tenantId", "employeeId");

-- CreateIndex
CREATE INDEX "compensation_history_tenantId_changedAt_idx" ON "compensation_history"("tenantId", "changedAt");

-- CreateIndex
CREATE UNIQUE INDEX "compensation_history_id_tenantId_key" ON "compensation_history"("id", "tenantId");

-- CreateIndex
CREATE INDEX "payroll_batches_tenantId_month_year_idx" ON "payroll_batches"("tenantId", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_batches_tenantId_month_year_key" ON "payroll_batches"("tenantId", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_batches_id_tenantId_key" ON "payroll_batches"("id", "tenantId");

-- CreateIndex
CREATE INDEX "payroll_records_tenantId_batchId_idx" ON "payroll_records"("tenantId", "batchId");

-- CreateIndex
CREATE INDEX "payroll_records_tenantId_employeeId_idx" ON "payroll_records"("tenantId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_records_tenantId_batchId_employeeId_key" ON "payroll_records"("tenantId", "batchId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_records_id_tenantId_key" ON "payroll_records"("id", "tenantId");

-- AddForeignKey
ALTER TABLE "salary_components" ADD CONSTRAINT "salary_components_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_compensations" ADD CONSTRAINT "employee_compensations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_compensations" ADD CONSTRAINT "employee_compensations_employeeId_tenantId_fkey" FOREIGN KEY ("employeeId", "tenantId") REFERENCES "teachers"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compensation_components" ADD CONSTRAINT "compensation_components_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compensation_components" ADD CONSTRAINT "compensation_components_compensationId_tenantId_fkey" FOREIGN KEY ("compensationId", "tenantId") REFERENCES "employee_compensations"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compensation_components" ADD CONSTRAINT "compensation_components_salaryComponentId_tenantId_fkey" FOREIGN KEY ("salaryComponentId", "tenantId") REFERENCES "salary_components"("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compensation_history" ADD CONSTRAINT "compensation_history_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compensation_history" ADD CONSTRAINT "compensation_history_employeeId_tenantId_fkey" FOREIGN KEY ("employeeId", "tenantId") REFERENCES "teachers"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compensation_history" ADD CONSTRAINT "compensation_history_compensationId_tenantId_fkey" FOREIGN KEY ("compensationId", "tenantId") REFERENCES "employee_compensations"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_batches" ADD CONSTRAINT "payroll_batches_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_records" ADD CONSTRAINT "payroll_records_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_records" ADD CONSTRAINT "payroll_records_batchId_tenantId_fkey" FOREIGN KEY ("batchId", "tenantId") REFERENCES "payroll_batches"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_records" ADD CONSTRAINT "payroll_records_employeeId_tenantId_fkey" FOREIGN KEY ("employeeId", "tenantId") REFERENCES "teachers"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;
