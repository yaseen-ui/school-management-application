import { prisma } from "../../lib/prisma.js";

// ─── Account Categories ───────────────────────────────────────────────────────

function mapCategoryIn(data = {}, tenantId) {
  const out = { tenantId };
  if (data.name !== undefined) out.name = data.name;
  if (data.description !== undefined) out.description = data.description || null;
  if (data.sortOrder !== undefined) out.sortOrder = data.sortOrder ?? 0;
  if (data.isActive !== undefined) out.isActive = data.isActive ?? true;
  return out;
}

function mapCategoryOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    name: row.name,
    description: row.description,
    sortOrder: row.sortOrder,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    _count: row._count
      ? { transactions: row._count.transactions }
      : null,
  };
}

async function createCategory(data, tenantId) {
  const payload = mapCategoryIn(data, tenantId);
  const category = await prisma.accountCategory.create({ data: payload });
  return mapCategoryOut(category);
}

async function getCategoryById(id, tenantId) {
  const category = await prisma.accountCategory.findFirst({
    where: { id, tenantId },
    include: { _count: { select: { transactions: true } } },
  });
  return mapCategoryOut(category);
}

async function getAllCategories(tenantId, filters = {}) {
  const where = { tenantId };
  if (filters.search) {
    where.name = { contains: filters.search, mode: "insensitive" };
  }
  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive === "true";
  }
  const categories = await prisma.accountCategory.findMany({
    where,
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { transactions: true } } },
  });
  return categories.map(mapCategoryOut);
}

async function updateCategory(id, data, tenantId) {
  const payload = mapCategoryIn(data, tenantId);
  const category = await prisma.accountCategory.update({
    where: { id, tenantId },
    data: payload,
  });
  return mapCategoryOut(category);
}

async function deleteCategory(id, tenantId) {
  const txCount = await prisma.accountTransaction.count({
    where: { categoryId: id, tenantId },
  });
  if (txCount > 0) {
    throw new Error(`Cannot delete category with ${txCount} transaction(s). Remove transactions first.`);
  }
  await prisma.accountCategory.delete({ where: { id, tenantId } });
  return { id };
}

// ─── Account Transactions ──────────────────────────────────────────────────────

function mapTransactionIn(data = {}, tenantId) {
  const out = { tenantId };
  if (data.categoryId !== undefined) out.categoryId = data.categoryId;
  if (data.type !== undefined) out.type = data.type; // "debit" | "credit"
  if (data.amount !== undefined) out.amount = data.amount;
  if (data.description !== undefined) out.description = data.description || null;
  if (data.transactionDate !== undefined) out.transactionDate = new Date(data.transactionDate);
  if (data.partyType !== undefined) out.partyType = data.partyType || null;
  if (data.partyId !== undefined) out.partyId = data.partyId || null;
  if (data.partyName !== undefined) out.partyName = data.partyName || null;
  if (data.referenceType !== undefined) out.referenceType = data.referenceType || null;
  if (data.referenceId !== undefined) out.referenceId = data.referenceId || null;
  return out;
}

function mapTransactionOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    categoryId: row.categoryId,
    type: row.type,
    amount: Number(row.amount),
    description: row.description,
    transactionDate: row.transactionDate,
    partyType: row.partyType,
    partyId: row.partyId,
    partyName: row.partyName,
    referenceType: row.referenceType,
    referenceId: row.referenceId,
    isVoided: row.isVoided,
    voidReason: row.voidReason,
    voidedAt: row.voidedAt,
    voidedById: row.voidedById,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    category: row.category
      ? { id: row.category.id, name: row.category.name }
      : null,
  };
}

async function createTransaction(data, tenantId) {
  const payload = mapTransactionIn(data, tenantId);
  const transaction = await prisma.accountTransaction.create({
    data: payload,
    include: { category: true },
  });
  return mapTransactionOut(transaction);
}

async function getTransactionById(id, tenantId) {
  const transaction = await prisma.accountTransaction.findFirst({
    where: { id, tenantId },
    include: { category: true },
  });
  return mapTransactionOut(transaction);
}

async function getAllTransactions(tenantId, filters = {}) {
  const where = { tenantId };
  if (filters.search) {
    where.description = { contains: filters.search, mode: "insensitive" };
  }
  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }
  if (filters.type) {
    where.type = filters.type;
  }
  if (filters.startDate) {
    where.transactionDate = {
      ...(where.transactionDate || {}),
      gte: new Date(filters.startDate),
    };
  }
  if (filters.endDate) {
    where.transactionDate = {
      ...(where.transactionDate || {}),
      lte: new Date(filters.endDate),
    };
  }
  if (filters.isVoided !== undefined) {
    where.isVoided = filters.isVoided === "true";
  }

  const transactions = await prisma.accountTransaction.findMany({
    where,
    orderBy: { transactionDate: "desc" },
    include: { category: true },
  });
  return transactions.map(mapTransactionOut);
}

async function updateTransaction(id, data, tenantId) {
  // Only allow updating non-voided transactions
  const existing = await prisma.accountTransaction.findFirst({
    where: { id, tenantId },
  });
  if (!existing) throw new Error("Transaction not found");
  if (existing.isVoided) throw new Error("Cannot update a voided transaction");

  const payload = {};
  if (data.categoryId !== undefined) payload.categoryId = data.categoryId;
  if (data.type !== undefined) payload.type = data.type;
  if (data.amount !== undefined) payload.amount = data.amount;
  if (data.description !== undefined) payload.description = data.description || null;
  if (data.transactionDate !== undefined) payload.transactionDate = new Date(data.transactionDate);
  if (data.partyType !== undefined) payload.partyType = data.partyType || null;
  if (data.partyId !== undefined) payload.partyId = data.partyId || null;
  if (data.partyName !== undefined) payload.partyName = data.partyName || null;

  const transaction = await prisma.accountTransaction.update({
    where: { id, tenantId },
    data: payload,
    include: { category: true },
  });
  return mapTransactionOut(transaction);
}

async function voidTransaction(id, data, tenantId) {
  const existing = await prisma.accountTransaction.findFirst({
    where: { id, tenantId },
  });
  if (!existing) throw new Error("Transaction not found");
  if (existing.isVoided) throw new Error("Transaction is already voided");

  const transaction = await prisma.accountTransaction.update({
    where: { id, tenantId },
    data: {
      isVoided: true,
      voidReason: data.voidReason || null,
      voidedAt: new Date(),
      voidedById: data.voidedById || null,
    },
    include: { category: true },
  });
  return mapTransactionOut(transaction);
}

async function deleteTransaction(id, tenantId) {
  const existing = await prisma.accountTransaction.findFirst({
    where: { id, tenantId },
  });
  if (!existing) throw new Error("Transaction not found");
  if (existing.isVoided) throw new Error("Cannot delete a voided transaction. Unvoid it first.");

  await prisma.accountTransaction.delete({ where: { id, tenantId } });
  return { id };
}

// ─── Ledger Summary ────────────────────────────────────────────────────────────

async function getLedgerSummary(tenantId, filters = {}) {
  const where = { tenantId, isVoided: false };
  if (filters.startDate) {
    where.transactionDate = {
      ...(where.transactionDate || {}),
      gte: new Date(filters.startDate),
    };
  }
  if (filters.endDate) {
    where.transactionDate = {
      ...(where.transactionDate || {}),
      lte: new Date(filters.endDate),
    };
  }

  const transactions = await prisma.accountTransaction.findMany({
    where,
    include: { category: true },
  });

  // Group by category
  const categoryMap = {};
  let totalDebit = 0;
  let totalCredit = 0;

  for (const tx of transactions) {
    const catId = tx.categoryId;
    if (!categoryMap[catId]) {
      categoryMap[catId] = {
        categoryId: catId,
        categoryName: tx.category?.name || "Unknown",
        debit: 0,
        credit: 0,
        balance: 0,
      };
    }
    const amount = Number(tx.amount);
    if (tx.type === "debit") {
      categoryMap[catId].debit += amount;
      totalDebit += amount;
    } else {
      categoryMap[catId].credit += amount;
      totalCredit += amount;
    }
  }

  const categorySummaries = Object.values(categoryMap).map((c) => ({
    ...c,
    balance: c.credit - c.debit,
  }));

  return {
    totalDebit,
    totalCredit,
    balance: totalCredit - totalDebit,
    categories: categorySummaries,
  };
}

export default {
  // Categories
  createCategory,
  getCategoryById,
  getAllCategories,
  updateCategory,
  deleteCategory,
  // Transactions
  createTransaction,
  getTransactionById,
  getAllTransactions,
  updateTransaction,
  voidTransaction,
  deleteTransaction,
  // Summary
  getLedgerSummary,
};
