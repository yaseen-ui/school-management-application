// src/modules/inventory/inventory.service.js
import { prisma } from "../../lib/prisma.js";

export const createCategory = async (data, tenantId) => {
  return prisma.inventoryCategory.create({
    data: {
      tenantId,
      name: data.name,
      description: data.description ?? null,
    },
  });
};

export const getCategories = async (tenantId) => {
  return prisma.inventoryCategory.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });
};

export const createItem = async (data, tenantId) => {
  // Ensure the category belongs to this tenant
  const category = await prisma.inventoryCategory.findFirst({
    where: { id: data.categoryId, tenantId },
    select: { id: true },
  });
  if (!category) throw new Error("Invalid category for this tenant");

  return prisma.inventoryItem.create({
    data: {
      tenantId,
      name: data.name,
      description: data.description ?? null,
      categoryId: data.categoryId,
      stockAvailable: data.stockAvailable ?? 0,
    },
  });
};

export const getItems = async (tenantId) => {
  return prisma.inventoryItem.findMany({
    where: { tenantId },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
};

export const adjustStock = async (itemId, data, tenantId) => {
  const { adjustmentAmount, reason, borrowerName, borrowerId } = data;

  return prisma.$transaction(async (tx) => {
    // Fetch item scoped by tenant
    const item = await tx.inventoryItem.findFirst({
      where: { id: itemId, tenantId },
      select: { id: true, stockAvailable: true },
    });
    if (!item) throw new Error("Item not found for this tenant");

    const newStock = item.stockAvailable + Number(adjustmentAmount || 0);
    if (newStock < 0) throw new Error("Insufficient stock");

    // Update item stock
    await tx.inventoryItem.update({
      where: { id: item.id },
      data: { stockAvailable: newStock },
    });

    // Record adjustment
    const adjustment = await tx.stockAdjustment.create({
      data: {
        tenantId,
        itemId: item.id,
        adjustmentAmount: Number(adjustmentAmount || 0),
        reason: reason ?? null,
        borrowerName: borrowerName ?? null,
        borrowerId: borrowerId ?? null,
      },
    });

    // Return latest item + the adjustment for convenience
    return {
      item: await tx.inventoryItem.findUnique({
        where: { id: item.id },
        include: { category: true },
      }),
      adjustment,
    };
  });
};
