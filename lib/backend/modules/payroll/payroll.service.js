import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ─── Salary Components (Module 1: CRUD) ─────────────────────────────────────

async function listSalaryComponents(tenantId) {
  return prisma.salaryComponent.findMany({
    where: { tenantId },
    orderBy: { sortOrder: 'asc' },
  });
}

async function getSalaryComponent(tenantId, id) {
  return prisma.salaryComponent.findUnique({
    where: { salary_component_tenant_identity: { id, tenantId } },
  });
}

async function createSalaryComponent(tenantId, data, userId) {
  return prisma.salaryComponent.create({
    data: {
      tenantId,
      name: data.name,
      description: data.description,
      type: data.type || 'earning',
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
      createdById: userId,
    },
  });
}

async function updateSalaryComponent(tenantId, id, data, userId) {
  return prisma.salaryComponent.update({
    where: { salary_component_tenant_identity: { id, tenantId } },
    data: {
      name: data.name,
      description: data.description,
      type: data.type,
      isActive: data.isActive,
      sortOrder: data.sortOrder,
      updatedById: userId,
    },
  });
}

async function deleteSalaryComponent(tenantId, id) {
  return prisma.salaryComponent.delete({
    where: { salary_component_tenant_identity: { id, tenantId } },
  });
}

// ─── Employee Compensation (Module 2) ────────────────────────────────────────

async function listEmployeeCompensations(tenantId) {
  const compensations = await prisma.employeeCompensation.findMany({
    where: { tenantId },
    include: {
      employee: {
        select: { id: true, fullName: true, employeeCode: true },
      },
      components: {
        include: {
          salaryComponent: {
            select: { id: true, name: true, type: true },
          },
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
  return compensations;
}

async function getEmployeeCompensation(tenantId, employeeId) {
  return prisma.employeeCompensation.findUnique({
    where: { oneCompensationPerEmployee: { employeeId, tenantId } },
    include: {
      components: {
        include: {
          salaryComponent: {
            select: { id: true, name: true, type: true },
          },
        },
      },
    },
  });
}

async function upsertEmployeeCompensation(tenantId, employeeId, data, userId) {
  const { effectiveFrom, components } = data;

  // Filter out components with empty salaryComponentId
  const validComponents = components.filter(
    (c) => c.salaryComponentId && c.salaryComponentId.trim() !== ""
  );

  // Calculate total
  const totalAmount = validComponents.reduce(
    (sum, c) => sum + parseFloat(c.value),
    0
  );

  // Use a transaction to upsert compensation + components + history
  return prisma.$transaction(async (tx) => {
    // Upsert the compensation record
    const compensation = await tx.employeeCompensation.upsert({
      where: { oneCompensationPerEmployee: { employeeId, tenantId } },
      create: {
        tenantId,
        employeeId,
        effectiveFrom: new Date(effectiveFrom),
        totalAmount,
        createdById: userId,
      },
      update: {
        effectiveFrom: new Date(effectiveFrom),
        totalAmount,
        updatedById: userId,
      },
    });

    // Delete existing components and recreate
    await tx.compensationComponent.deleteMany({
      where: { compensationId: compensation.id, tenantId },
    });

    for (const comp of validComponents) {
      await tx.compensationComponent.create({
        data: {
          tenantId,
          compensationId: compensation.id,
          salaryComponentId: comp.salaryComponentId,
          value: parseFloat(comp.value),
        },
      });
    }

    // Append to history (never overwrite)
    await tx.compensationHistory.create({
      data: {
        tenantId,
        employeeId,
        compensationId: compensation.id,
        effectiveFrom: new Date(effectiveFrom),
        totalAmount,
        components: components, // full snapshot as JSON
        changedById: userId,
      },
    });

    // Return the updated compensation with components
    return tx.employeeCompensation.findUnique({
      where: { employee_compensation_tenant_identity: { id: compensation.id, tenantId } },
      include: {
        components: {
          include: {
            salaryComponent: {
              select: { id: true, name: true, type: true },
            },
          },
        },
      },
    });
  });
}

// ─── Compensation History ────────────────────────────────────────────────────

async function getCompensationHistory(tenantId, employeeId) {
  return prisma.compensationHistory.findMany({
    where: { tenantId, employeeId },
    orderBy: { changedAt: 'desc' },
  });
}

// ─── Payroll Processing (Module 3) ───────────────────────────────────────────

async function listPayrollBatches(tenantId) {
  return prisma.payrollBatch.findMany({
    where: { tenantId },
    orderBy: [{ year: 'desc' }, { month: 'desc' }],
    include: {
      _count: { select: { records: true } },
    },
  });
}

async function getPayrollBatch(tenantId, batchId) {
  return prisma.payrollBatch.findUnique({
    where: { payroll_batch_tenant_identity: { id: batchId, tenantId } },
    include: {
      records: {
        include: {
          employee: {
            select: { id: true, fullName: true, employeeCode: true },
          },
        },
      },
    },
  });
}

async function createOrGetPayrollBatch(tenantId, month, year, userId) {
  return prisma.payrollBatch.upsert({
    where: { uniqueBatchPerMonth: { tenantId, month, year } },
    create: {
      tenantId,
      month,
      year,
      status: 'draft',
      createdById: userId,
    },
    update: {},
  });
}

async function populatePayrollBatch(tenantId, batchId, userId) {
  // Get all active teachers with their compensations
  const teachers = await prisma.teacher.findMany({
    where: { tenantId, status: 'active' },
    include: {
      compensations: {
        include: {
          components: {
            include: {
              salaryComponent: { select: { name: true } },
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      },
    },
  });

  const batch = await prisma.payrollBatch.findUnique({
    where: { payroll_batch_tenant_identity: { id: batchId, tenantId } },
  });

  if (!batch) throw new Error('Batch not found');

  // Create payroll records for each teacher
  for (const teacher of teachers) {
    // compensations is an array (one-to-many), get the most recent one
    const activeComp = teacher.compensations.length > 0 ? teacher.compensations[0] : null;
    const actualSalary = activeComp ? parseFloat(activeComp.totalAmount) : 0;

    await prisma.payrollRecord.upsert({
      where: {
        uniqueRecordPerBatchEmployee: {
          tenantId,
          batchId,
          employeeId: teacher.id,
        },
      },
      create: {
        tenantId,
        batchId,
        employeeId: teacher.id,
        actualSalary,
        paidAmount: actualSalary,
        status: 'pending',
        paymentMethod: 'cash',
        createdById: userId,
      },
      update: {
        actualSalary,
        paidAmount: actualSalary,
      },
    });
  }

  return getPayrollBatch(tenantId, batchId);
}

async function updatePayrollRecord(tenantId, recordId, data) {
  return prisma.payrollRecord.update({
    where: { payroll_record_tenant_identity: { id: recordId, tenantId } },
    data: {
      paidAmount: data.paidAmount !== undefined ? parseFloat(data.paidAmount) : undefined,
      status: data.status,
      paymentMethod: data.paymentMethod,
    },
  });
}

async function bulkUpdatePayrollRecords(tenantId, batchId, records) {
  return prisma.$transaction(
    records.map((r) =>
      prisma.payrollRecord.update({
        where: {
          payroll_record_tenant_identity: { id: r.id, tenantId },
        },
        data: {
          paidAmount: r.paidAmount !== undefined ? parseFloat(r.paidAmount) : undefined,
          status: r.status,
          paymentMethod: r.paymentMethod,
        },
      })
    )
  );
}

async function submitPayrollBatch(tenantId, batchId, userId) {
  return prisma.$transaction(async (tx) => {
    const batch = await tx.payrollBatch.update({
      where: { payroll_batch_tenant_identity: { id: batchId, tenantId } },
      data: {
        status: 'completed',
        processedAt: new Date(),
        processedById: userId,
      },
    });

    // Get all completed records
    const records = await tx.payrollRecord.findMany({
      where: { tenantId, batchId, status: 'completed' },
    });

    // Create account transactions for each completed payroll record
    let salaryCategory = await tx.accountCategory.findFirst({
      where: { tenantId, name: 'Salary' },
    });

    if (!salaryCategory) {
      salaryCategory = await tx.accountCategory.create({
        data: {
          tenantId,
          name: 'Salary',
          description: 'Employee salary payments',
          sortOrder: 1,
          createdById: userId,
        },
      });
    }

    for (const record of records) {
      await tx.accountTransaction.create({
        data: {
          tenantId,
          categoryId: salaryCategory.id,
          type: 'debit',
          amount: record.paidAmount,
          description: `Salary payment for ${batch.month}/${batch.year}`,
          transactionDate: new Date(),
          referenceType: 'salary',
          referenceId: record.id,
          createdById: userId,
        },
      });
    }

    return batch;
  });
}

export {
  listSalaryComponents,
  getSalaryComponent,
  createSalaryComponent,
  updateSalaryComponent,
  deleteSalaryComponent,
  listEmployeeCompensations,
  getEmployeeCompensation,
  upsertEmployeeCompensation,
  getCompensationHistory,
  listPayrollBatches,
  getPayrollBatch,
  createOrGetPayrollBatch,
  populatePayrollBatch,
  updatePayrollRecord,
  bulkUpdatePayrollRecords,
  submitPayrollBatch,
};
