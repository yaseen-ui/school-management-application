-- AlterTable
ALTER TABLE "store_pending_items" ADD COLUMN     "createdById" TEXT;

-- AddForeignKey
ALTER TABLE "store_pending_items" ADD CONSTRAINT "store_pending_items_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_dues" ADD CONSTRAINT "store_dues_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_dues" ADD CONSTRAINT "store_dues_updatedById_tenantId_fkey" FOREIGN KEY ("updatedById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_due_payments" ADD CONSTRAINT "store_due_payments_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_returns" ADD CONSTRAINT "store_returns_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_components" ADD CONSTRAINT "salary_components_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_components" ADD CONSTRAINT "salary_components_updatedById_tenantId_fkey" FOREIGN KEY ("updatedById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_compensations" ADD CONSTRAINT "employee_compensations_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_compensations" ADD CONSTRAINT "employee_compensations_updatedById_tenantId_fkey" FOREIGN KEY ("updatedById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compensation_history" ADD CONSTRAINT "compensation_history_changedById_tenantId_fkey" FOREIGN KEY ("changedById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_batches" ADD CONSTRAINT "payroll_batches_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_batches" ADD CONSTRAINT "payroll_batches_processedById_tenantId_fkey" FOREIGN KEY ("processedById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_records" ADD CONSTRAINT "payroll_records_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_transactions" ADD CONSTRAINT "account_transactions_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_transactions" ADD CONSTRAINT "account_transactions_voidedById_tenantId_fkey" FOREIGN KEY ("voidedById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;
