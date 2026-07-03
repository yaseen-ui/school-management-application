import { prisma } from "../../lib/prisma.js";

// ─── Store Categories ─────────────────────────────────────────────────────────

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
      ? { products: row._count.products }
      : null,
  };
}

async function createCategory(data, tenantId) {
  const payload = mapCategoryIn(data, tenantId);
  const category = await prisma.storeCategory.create({ data: payload });
  return mapCategoryOut(category);
}

async function getCategoryById(id, tenantId) {
  const category = await prisma.storeCategory.findFirst({
    where: { id, tenantId },
    include: { _count: { select: { products: true } } },
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
  const categories = await prisma.storeCategory.findMany({
    where,
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return categories.map(mapCategoryOut);
}

async function updateCategory(id, data, tenantId) {
  const payload = mapCategoryIn(data, tenantId);
  const category = await prisma.storeCategory.update({
    where: { id, tenantId },
    data: payload,
  });
  return mapCategoryOut(category);
}

async function deleteCategory(id, tenantId) {
  const productCount = await prisma.storeProduct.count({
    where: { categoryId: id, tenantId },
  });
  if (productCount > 0) {
    throw new Error(`Cannot delete category with ${productCount} product(s). Remove products first.`);
  }
  await prisma.storeCategory.delete({ where: { id, tenantId } });
  return { id };
}

// ─── Store Products ───────────────────────────────────────────────────────────

function mapProductIn(data = {}, tenantId) {
  const out = { tenantId };
  if (data.categoryId !== undefined) out.categoryId = data.categoryId;
  if (data.name !== undefined) out.name = data.name;
  if (data.description !== undefined) out.description = data.description || null;
  if (data.basePrice !== undefined) out.basePrice = data.basePrice;
  if (data.isActive !== undefined) out.isActive = data.isActive ?? true;
  if (data.isGeneral !== undefined) out.isGeneral = data.isGeneral ?? true;
  if (data.stockQuantity !== undefined) out.stockQuantity = data.stockQuantity ?? 0;
  return out;
}

function mapProductOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    categoryId: row.categoryId,
    name: row.name,
    description: row.description,
    basePrice: Number(row.basePrice),
    isActive: row.isActive,
    isGeneral: row.isGeneral,
    stockQuantity: row.stockQuantity,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    category: row.category
      ? { id: row.category.id, name: row.category.name }
      : null,
    sectionAssignments: row.sectionAssignments
      ? row.sectionAssignments.map((sa) => ({
          id: sa.id,
          sectionId: sa.sectionId,
          section: sa.section
            ? { id: sa.section.id, sectionName: sa.section.sectionName }
            : null,
        }))
      : null,
  };
}

async function createProduct(data, tenantId) {
  const { sectionIds, ...productData } = data;
  const payload = mapProductIn(productData, tenantId);

  const product = await prisma.storeProduct.create({
    data: {
      ...payload,
      sectionAssignments:
        sectionIds && sectionIds.length > 0
          ? {
              create: sectionIds.map((sectionId) => ({
                sectionId,
              })),
            }
          : undefined,
    },
    include: {
      category: true,
      sectionAssignments: {
        include: { section: true },
      },
    },
  });
  return mapProductOut(product);
}

async function getProductById(id, tenantId) {
  const product = await prisma.storeProduct.findFirst({
    where: { id, tenantId },
    include: {
      category: true,
      sectionAssignments: {
        include: { section: true },
      },
    },
  });
  return mapProductOut(product);
}

async function getAllProducts(tenantId, filters = {}) {
  const where = { tenantId };
  if (filters.search) {
    where.name = { contains: filters.search, mode: "insensitive" };
  }
  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }
  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive === "true";
  }
  if (filters.isGeneral !== undefined) {
    where.isGeneral = filters.isGeneral === "true";
  }
  if (filters.sectionId) {
    where.OR = [
      { isGeneral: true },
      { sectionAssignments: { some: { sectionId: filters.sectionId } } },
    ];
  }
  const products = await prisma.storeProduct.findMany({
    where,
    orderBy: { name: "asc" },
    include: {
      category: true,
      sectionAssignments: {
        include: { section: true },
      },
    },
  });
  return products.map(mapProductOut);
}

async function updateProduct(id, data, tenantId) {
  const { sectionIds, ...productData } = data;
  const payload = mapProductIn(productData, tenantId);

  if (sectionIds !== undefined) {
    await prisma.storeProductSection.deleteMany({
      where: { productId: id, tenantId },
    });
    if (sectionIds.length > 0) {
      await prisma.storeProductSection.createMany({
        data: sectionIds.map((sectionId) => ({
          tenantId,
          productId: id,
          sectionId,
        })),
      });
    }
  }

  const product = await prisma.storeProduct.update({
    where: { id, tenantId },
    data: payload,
    include: {
      category: true,
      sectionAssignments: {
        include: { section: true },
      },
    },
  });
  return mapProductOut(product);
}

async function deleteProduct(id, tenantId) {
  await prisma.storeProduct.delete({ where: { id, tenantId } });
  return { id };
}

// ─── Store Kits (Templates — NOT stock items) ─────────────────────────────────

function mapKitOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    name: row.name,
    description: row.description,
    totalPrice: Number(row.totalPrice),
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    items: row.items
      ? row.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          categoryName: item.categoryName,
          unitPrice: Number(item.unitPrice),
          quantity: item.quantity,
          totalPrice: Number(item.totalPrice),
        }))
      : [],
    sections: row.sections
      ? row.sections.map((s) => ({
          id: s.id,
          sectionId: s.sectionId,
          section: s.section
            ? { id: s.section.id, sectionName: s.section.sectionName }
            : null,
        }))
      : [],
  };
}

async function createKit(data, tenantId) {
  const { items, sectionIds, ...kitData } = data;

  let totalPrice = 0;
  const kitItems = await Promise.all(
    (items || []).map(async (item) => {
      let productName = item.productName;
      let categoryName = item.categoryName || "";
      let unitPrice = item.unitPrice;

      if (item.productId && !item.productName) {
        const product = await prisma.storeProduct.findFirst({
          where: { id: item.productId, tenantId },
          include: { category: true },
        });
        if (product) {
          productName = product.name;
          categoryName = product.category?.name || "";
          unitPrice = product.basePrice;
        }
      }

      const itemTotal = Number(unitPrice) * item.quantity;
      totalPrice += itemTotal;
      return {
        productId: item.productId || null,
        productName: productName || "",
        categoryName: categoryName || "",
        unitPrice: unitPrice ?? 0,
        quantity: item.quantity,
        totalPrice: itemTotal,
      };
    })
  );

  const kit = await prisma.storeKit.create({
    data: {
      tenantId,
      name: kitData.name,
      description: kitData.description || null,
      totalPrice,
      isActive: kitData.isActive ?? true,
      items: {
        create: kitItems,
      },
      sections:
        sectionIds && sectionIds.length > 0
          ? {
              create: sectionIds.map((sectionId) => ({
                sectionId,
              })),
            }
          : undefined,
    },
    include: {
      items: true,
      sections: { include: { section: true } },
    },
  });
  return mapKitOut(kit);
}

async function getKitById(id, tenantId) {
  const kit = await prisma.storeKit.findFirst({
    where: { id, tenantId },
    include: {
      items: true,
      sections: { include: { section: true } },
    },
  });
  return mapKitOut(kit);
}

async function getAllKits(tenantId, filters = {}) {
  const where = { tenantId };
  if (filters.search) {
    where.name = { contains: filters.search, mode: "insensitive" };
  }
  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive === "true";
  }
  if (filters.sectionId) {
    where.sections = { some: { sectionId: filters.sectionId } };
  }
  const kits = await prisma.storeKit.findMany({
    where,
    orderBy: { name: "asc" },
    include: {
      items: true,
      sections: { include: { section: true } },
    },
  });
  return kits.map(mapKitOut);
}

async function updateKit(id, data, tenantId) {
  const { items, sectionIds, ...kitData } = data;

  const payload = {};
  if (kitData.name !== undefined) payload.name = kitData.name;
  if (kitData.description !== undefined) payload.description = kitData.description || null;
  if (kitData.isActive !== undefined) payload.isActive = kitData.isActive;

  if (items !== undefined) {
    let totalPrice = 0;
    const kitItems = items.map((item) => {
      const itemTotal = Number(item.unitPrice) * item.quantity;
      totalPrice += itemTotal;
      return {
        tenantId,
        productId: item.productId || null,
        productName: item.productName,
        categoryName: item.categoryName || "",
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        totalPrice: itemTotal,
      };
    });
    payload.totalPrice = totalPrice;

    await prisma.storeKitItem.deleteMany({
      where: { kitId: id, tenantId },
    });
    await prisma.storeKitItem.createMany({
      data: kitItems.map((item) => ({ ...item, kitId: id })),
    });
  }

  if (sectionIds !== undefined) {
    await prisma.storeKitSection.deleteMany({
      where: { kitId: id, tenantId },
    });
    if (sectionIds.length > 0) {
      await prisma.storeKitSection.createMany({
        data: sectionIds.map((sectionId) => ({
          tenantId,
          kitId: id,
          sectionId,
        })),
      });
    }
  }

  const kit = await prisma.storeKit.update({
    where: { id, tenantId },
    data: payload,
    include: {
      items: true,
      sections: { include: { section: true } },
    },
  });
  return mapKitOut(kit);
}

async function deleteKit(id, tenantId) {
  await prisma.storeKit.delete({ where: { id, tenantId } });
  return { id };
}

// ─── Kit Items (sub-resource) ─────────────────────────────────────────────────

async function addKitItem(kitId, data, tenantId) {
  const itemTotal = Number(data.unitPrice) * data.quantity;
  const item = await prisma.storeKitItem.create({
    data: {
      tenantId,
      kitId,
      productId: data.productId || null,
      productName: data.productName,
      categoryName: data.categoryName || "",
      unitPrice: data.unitPrice,
      quantity: data.quantity,
      totalPrice: itemTotal,
    },
  });

  await _recalcKitTotal(kitId, tenantId);

  return {
    id: item.id,
    productId: item.productId,
    productName: item.productName,
    categoryName: item.categoryName,
    unitPrice: Number(item.unitPrice),
    quantity: item.quantity,
    totalPrice: Number(item.totalPrice),
  };
}

async function updateKitItem(kitId, itemId, data, tenantId) {
  const payload = {};
  if (data.productName !== undefined) payload.productName = data.productName;
  if (data.categoryName !== undefined) payload.categoryName = data.categoryName;
  if (data.unitPrice !== undefined) payload.unitPrice = data.unitPrice;
  if (data.quantity !== undefined) payload.quantity = data.quantity;
  if (data.productId !== undefined) payload.productId = data.productId || null;

  const existing = await prisma.storeKitItem.findFirst({
    where: { id: itemId, kitId, tenantId },
  });
  if (!existing) throw new Error("Kit item not found");

  const unitPrice = data.unitPrice !== undefined ? Number(data.unitPrice) : Number(existing.unitPrice);
  const quantity = data.quantity !== undefined ? data.quantity : existing.quantity;
  payload.totalPrice = unitPrice * quantity;

  const item = await prisma.storeKitItem.update({
    where: { id: itemId, tenantId },
    data: payload,
  });

  await _recalcKitTotal(kitId, tenantId);

  return {
    id: item.id,
    productId: item.productId,
    productName: item.productName,
    categoryName: item.categoryName,
    unitPrice: Number(item.unitPrice),
    quantity: item.quantity,
    totalPrice: Number(item.totalPrice),
  };
}

async function deleteKitItem(kitId, itemId, tenantId) {
  await prisma.storeKitItem.delete({
    where: { id: itemId, tenantId },
  });
  await _recalcKitTotal(kitId, tenantId);
  return { id: itemId };
}

async function _recalcKitTotal(kitId, tenantId) {
  const items = await prisma.storeKitItem.findMany({
    where: { kitId, tenantId },
  });
  const totalPrice = items.reduce((sum, item) => sum + Number(item.totalPrice), 0);
  await prisma.storeKit.update({
    where: { id: kitId, tenantId },
    data: { totalPrice },
  });
}

// ─── Store Orders ─────────────────────────────────────────────────────────────

function mapOrderOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    enrollmentId: row.enrollmentId,
    academicYearId: row.academicYearId,
    orderDate: row.orderDate,
    totalAmount: Number(row.totalAmount),
    actualTotalAmount: Number(row.actualTotalAmount),
    discountAmount: Number(row.discountAmount),
    offeredAmount: row.offeredAmount ? Number(row.offeredAmount) : null,
    customerName: row.customerName,
    customerPhone: row.customerPhone,
    customerType: row.customerType,
    status: row.status,
    remarks: row.remarks,
    paymentMethod: row.paymentMethod,
    transactionId: row.transactionId,
    paymentMode: row.paymentMode,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    enrollment: row.enrollment
      ? {
          id: row.enrollment.id,
          rollNumber: row.enrollment.rollNumber,
          student: row.enrollment.student
            ? {
                id: row.enrollment.student.id,
                firstName: row.enrollment.student.firstName,
                lastName: row.enrollment.student.lastName,
              }
            : null,
          section: row.enrollment.section
            ? {
                id: row.enrollment.section.id,
                sectionName: row.enrollment.section.sectionName,
              }
            : null,
        }
      : null,
    academicYear: row.academicYear
      ? { id: row.academicYear.id, name: row.academicYear.name }
      : null,
    createdBy: row.createdBy
      ? { id: row.createdBy.id, fullName: row.createdBy.fullName }
      : null,
    items: row.items
      ? row.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          kitId: item.kitId,
          kitReferenceId: item.kitReferenceId,
          productName: item.productName,
          unitPrice: Number(item.unitPrice),
          quantity: item.quantity,
          totalPrice: Number(item.totalPrice),
          isReturned: item.isReturned,
          returnedAt: item.returnedAt,
          pendingItems: item.pendingItems
            ? item.pendingItems.map((pi) => ({
                id: pi.id,
                productName: pi.productName,
                quantity: pi.quantity,
                status: pi.status,
                collectedAt: pi.collectedAt,
                isPaid: pi.isPaid,
                paidAt: pi.paidAt,
              }))
            : [],
        }))
      : [],
    dues: row.dues
      ? row.dues.map((d) => ({
          id: d.id,
          totalDueAmount: Number(d.totalDueAmount),
          paidAmount: Number(d.paidAmount),
          status: d.status,
        }))
      : [],
  };
}

/**
 * Check stock availability for a list of items without creating an order.
 * Returns a report of which items are in stock and which are not.
 */
async function checkStock(data, tenantId) {
  const { items } = data;
  const availableItems = [];
  const unavailableItems = [];

  for (const item of items || []) {
    if (item.kitId) {
      // Kit item — expand kit into individual products
      const kit = await prisma.storeKit.findFirst({
        where: { id: item.kitId, tenantId },
        include: { items: true },
      });
      if (!kit) throw new Error(`Kit not found: ${item.kitId}`);

      for (const kitItem of kit.items) {
        if (kitItem.productId) {
          const product = await prisma.storeProduct.findFirst({
            where: { id: kitItem.productId, tenantId },
          });
          const requiredQty = kitItem.quantity * item.quantity;
          if (product && product.stockQuantity >= requiredQty) {
            availableItems.push({
              productId: kitItem.productId,
              productName: kitItem.productName,
              requiredQuantity: requiredQty,
              availableStock: product.stockQuantity,
              kitId: item.kitId,
              kitName: kit.name,
            });
          } else {
            unavailableItems.push({
              productId: kitItem.productId,
              productName: kitItem.productName,
              requiredQuantity: requiredQty,
              availableStock: product ? product.stockQuantity : 0,
              kitId: item.kitId,
              kitName: kit.name,
            });
          }
        } else {
          // Non-stock kit item (no productId) — always available
          availableItems.push({
            productId: null,
            productName: kitItem.productName,
            requiredQuantity: kitItem.quantity * item.quantity,
            availableStock: -1,
            kitId: item.kitId,
            kitName: kit.name,
          });
        }
      }
    } else {
      // Individual product
      if (item.productId) {
        const product = await prisma.storeProduct.findFirst({
          where: { id: item.productId, tenantId },
        });
        if (product && product.stockQuantity >= item.quantity) {
          availableItems.push({
            productId: item.productId,
            productName: item.productName,
            requiredQuantity: item.quantity,
            availableStock: product.stockQuantity,
          });
        } else {
          unavailableItems.push({
            productId: item.productId,
            productName: item.productName,
            requiredQuantity: item.quantity,
            availableStock: product ? product.stockQuantity : 0,
          });
        }
      } else {
        // Non-stock item — always available
        availableItems.push({
          productId: null,
          productName: item.productName,
          requiredQuantity: item.quantity,
          availableStock: -1,
        });
      }
    }
  }

  return {
    allAvailable: unavailableItems.length === 0,
    availableItems,
    unavailableItems,
  };
}

async function createOrder(data, tenantId) {
  const { items, paymentMethod, transactionId, paymentMode, ...orderData } = data;

  let actualTotalAmount = 0;
  let totalAmount = 0;
  const orderItems = [];
  const pendingItemsToCreate = [];
  const kitReferenceCounter = Date.now();

  for (const item of items || []) {
    if (item.kitId) {
      // Kit item — expand kit into individual products
      const kit = await prisma.storeKit.findFirst({
        where: { id: item.kitId, tenantId },
        include: { items: true },
      });
      if (!kit) throw new Error(`Kit not found: ${item.kitId}`);

      const kitRefId = `kit_${kit.id}_${kitReferenceCounter}_${Math.random().toString(36).substring(2, 8)}`;

      for (const kitItem of kit.items) {
        const itemTotal = Number(kitItem.unitPrice) * kitItem.quantity * item.quantity;
        actualTotalAmount += itemTotal;
        totalAmount += itemTotal;

        const orderItemData = {
          productId: kitItem.productId || null,
          kitId: item.kitId,
          kitReferenceId: kitRefId,
          productName: kitItem.productName,
          unitPrice: kitItem.unitPrice,
          quantity: kitItem.quantity * item.quantity,
          totalPrice: itemTotal,
        };

        if (kitItem.productId) {
          const product = await prisma.storeProduct.findFirst({
            where: { id: kitItem.productId, tenantId },
          });
          if (product && product.stockQuantity < kitItem.quantity * item.quantity) {
            pendingItemsToCreate.push({
              productId: kitItem.productId,
              productName: kitItem.productName,
              quantity: kitItem.quantity * item.quantity,
              orderItemIndex: orderItems.length,
            });
          } else if (product) {
            await prisma.storeProduct.update({
              where: { id: kitItem.productId, tenantId },
              data: { stockQuantity: { decrement: kitItem.quantity * item.quantity } },
            });
          }
        }

        orderItems.push(orderItemData);
      }
    } else {
      // Individual product
      const itemTotal = Number(item.unitPrice) * item.quantity;
      actualTotalAmount += itemTotal;
      totalAmount += itemTotal;

      const orderItemData = {
        productId: item.productId || null,
        kitId: null,
        kitReferenceId: null,
        productName: item.productName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        totalPrice: itemTotal,
      };

      if (item.productId) {
        const product = await prisma.storeProduct.findFirst({
          where: { id: item.productId, tenantId },
        });
        if (product && product.stockQuantity < item.quantity) {
          pendingItemsToCreate.push({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            orderItemIndex: orderItems.length,
          });
        } else if (product) {
          await prisma.storeProduct.update({
            where: { id: item.productId, tenantId },
            data: { stockQuantity: { decrement: item.quantity } },
          });
        }
      }

      orderItems.push(orderItemData);
    }
  }

  // Apply discount
  const discountAmount = orderData.discountAmount ? Number(orderData.discountAmount) : 0;
  if (discountAmount > 0) {
    totalAmount = totalAmount - discountAmount;
    if (totalAmount < 0) totalAmount = 0;
  }

  // Determine status: if payment info provided, mark as "collected", otherwise "confirmed"
  const status = paymentMethod ? "collected" : (orderData.status || "confirmed");

  // Create the order
  const order = await prisma.storeOrder.create({
    data: {
      tenantId,
      enrollmentId: orderData.enrollmentId || null,
      academicYearId: orderData.academicYearId || null,
      orderDate: orderData.orderDate ? new Date(orderData.orderDate) : new Date(),
      totalAmount,
      actualTotalAmount,
      discountAmount,
      offeredAmount: orderData.offeredAmount ? Number(orderData.offeredAmount) : null,
      customerName: orderData.customerName || null,
      customerPhone: orderData.customerPhone || null,
      customerType: orderData.customerType || "student",
      status,
      paymentMethod: paymentMethod || null,
      transactionId: transactionId || null,
      paymentMode: paymentMode || null,
      remarks: orderData.remarks || null,
      createdById: orderData.createdById || null,
      items: {
        create: orderItems,
      },
    },
    include: {
      items: {
        include: { pendingItems: true },
      },
      enrollment: {
        include: { student: true, section: true },
      },
      academicYear: true,
      createdBy: true,
      dues: true,
    },
  });

  // Create pending items for out-of-stock products
  if (pendingItemsToCreate.length > 0) {
    for (const pi of pendingItemsToCreate) {
      const orderItem = order.items[pi.orderItemIndex];
      if (orderItem) {
        await prisma.storePendingItem.create({
          data: {
            tenantId,
            orderItemId: orderItem.id,
            productId: pi.productId,
            productName: pi.productName,
            quantity: pi.quantity,
            status: "pending",
            isPaid: false,
            createdById: data.createdById || null,
          },
        });
      }
    }
  }

  // Handle dues — if no payment was made or amountPaid is less than totalAmount
  const amountPaid = orderData.amountPaid ? Number(orderData.amountPaid) : 0;
  const hasPayment = !!(paymentMethod || amountPaid > 0);
  if (!hasPayment || amountPaid < totalAmount) {
    const dueAmount = hasPayment
      ? totalAmount - amountPaid
      : totalAmount;
    const enrollment = orderData.enrollmentId
      ? await prisma.studentEnrollment.findFirst({
          where: { id: orderData.enrollmentId, tenantId },
          include: { student: true },
        })
      : null;

    await prisma.storeDue.create({
      data: {
        tenantId,
        orderId: order.id,
        enrollmentId: orderData.enrollmentId || null,
        customerName: orderData.customerName || (enrollment?.student ? `${enrollment.student.firstName} ${enrollment.student.lastName}` : "Unknown"),
        customerPhone: orderData.customerPhone || null,
        customerType: orderData.customerType || "student",
        totalDueAmount: dueAmount,
        paidAmount: 0,
        status: "pending",
        remarks: `Due from order ${order.id}`,
      },
    });
  }

  // Re-fetch order with pending items
  const updatedOrder = await prisma.storeOrder.findFirst({
    where: { id: order.id, tenantId },
    include: {
      items: {
        include: { pendingItems: true },
      },
      enrollment: {
        include: { student: true, section: true },
      },
      academicYear: true,
      createdBy: true,
      dues: true,
    },
  });

  return mapOrderOut(updatedOrder);
}

async function getOrderById(id, tenantId) {
  const order = await prisma.storeOrder.findFirst({
    where: { id, tenantId },
    include: {
      items: {
        include: { pendingItems: true },
      },
      enrollment: {
        include: { student: true, section: true },
      },
      academicYear: true,
      createdBy: true,
      dues: true,
    },
  });
  return mapOrderOut(order);
}

async function getAllOrders(tenantId, filters = {}) {
  const where = { tenantId };
  if (filters.search) {
    where.OR = [
      { remarks: { contains: filters.search, mode: "insensitive" } },
      { customerName: { contains: filters.search, mode: "insensitive" } },
      { enrollment: { student: { firstName: { contains: filters.search, mode: "insensitive" } } } },
      { enrollment: { student: { lastName: { contains: filters.search, mode: "insensitive" } } } },
    ];
  }
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.enrollmentId) {
    where.enrollmentId = filters.enrollmentId;
  }
  if (filters.academicYearId) {
    where.academicYearId = filters.academicYearId;
  }
  if (filters.customerType) {
    where.customerType = filters.customerType;
  }
  const orders = await prisma.storeOrder.findMany({
    where,
    orderBy: { orderDate: "desc" },
    include: {
      items: {
        include: { pendingItems: true },
      },
      enrollment: {
        include: { student: true, section: true },
      },
      academicYear: true,
      createdBy: true,
      dues: true,
    },
  });
  return orders.map(mapOrderOut);
}

async function updateOrderStatus(id, data, tenantId) {
  const order = await prisma.storeOrder.update({
    where: { id, tenantId },
    data: {
      status: data.status,
      remarks: data.remarks !== undefined ? data.remarks : undefined,
    },
    include: {
      items: {
        include: { pendingItems: true },
      },
      enrollment: {
        include: { student: true, section: true },
      },
      academicYear: true,
      createdBy: true,
      dues: true,
    },
  });
  return mapOrderOut(order);
}

// ─── Pending Items ────────────────────────────────────────────────────────────

function mapPendingItemOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    orderItemId: row.orderItemId,
    productId: row.productId,
    productName: row.productName,
    quantity: row.quantity,
    status: row.status,
    collectedAt: row.collectedAt,
    isPaid: row.isPaid,
    paidAt: row.paidAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    createdById: row.createdById,
    createdBy: row.createdBy
      ? { id: row.createdBy.id, fullName: row.createdBy.fullName }
      : null,
    orderItem: row.orderItem
      ? {
          id: row.orderItem.id,
          productName: row.orderItem.productName,
          order: row.orderItem.order
            ? {
                id: row.orderItem.order.id,
                orderDate: row.orderItem.order.orderDate,
                enrollment: row.orderItem.order.enrollment
                  ? {
                      id: row.orderItem.order.enrollment.id,
                      student: row.orderItem.order.enrollment.student
                        ? {
                            id: row.orderItem.order.enrollment.student.id,
                            firstName: row.orderItem.order.enrollment.student.firstName,
                            lastName: row.orderItem.order.enrollment.student.lastName,
                          }
                        : null,
                    }
                  : null,
              }
            : null,
        }
      : null,
  };
}

async function getAllPendingItems(tenantId, filters = {}) {
  const where = { tenantId };
  if (filters.status) {
    where.status = filters.status;
  }
  const items = await prisma.storePendingItem.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: true,
      orderItem: {
        include: {
          order: {
            include: {
              enrollment: {
                include: { student: true },
              },
            },
          },
        },
      },
    },
  });
  return items.map(mapPendingItemOut);
}

async function collectPendingItem(id, tenantId) {
  const item = await prisma.storePendingItem.update({
    where: { id, tenantId },
    data: {
      status: "collected",
      collectedAt: new Date(),
    },
    include: {
      createdBy: true,
      orderItem: {
        include: {
          order: {
            include: {
              enrollment: {
                include: { student: true },
              },
            },
          },
        },
      },
    },
  });
  return mapPendingItemOut(item);
}

// ─── Dues ─────────────────────────────────────────────────────────────────────

function mapDueOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    orderId: row.orderId,
    enrollmentId: row.enrollmentId,
    customerName: row.customerName,
    customerPhone: row.customerPhone,
    customerType: row.customerType,
    totalDueAmount: Number(row.totalDueAmount),
    paidAmount: Number(row.paidAmount),
    status: row.status,
    remarks: row.remarks,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    order: row.order
      ? {
          id: row.order.id,
          orderDate: row.order.orderDate,
          totalAmount: Number(row.order.totalAmount),
        }
      : null,
    payments: row.payments
      ? row.payments.map((p) => ({
          id: p.id,
          amount: Number(p.amount),
          paymentDate: p.paymentDate,
          paymentMethod: p.paymentMethod,
          transactionId: p.transactionId,
        }))
      : [],
  };
}

async function getAllDues(tenantId, filters = {}) {
  const where = { tenantId };
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.enrollmentId) {
    where.enrollmentId = filters.enrollmentId;
  }
  const dues = await prisma.storeDue.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      order: true,
      payments: true,
    },
  });
  return dues.map(mapDueOut);
}

async function getDueById(id, tenantId) {
  const due = await prisma.storeDue.findFirst({
    where: { id, tenantId },
    include: {
      order: true,
      payments: true,
    },
  });
  return mapDueOut(due);
}

async function createDuePayment(dueId, data, tenantId) {
  const due = await prisma.storeDue.findFirst({
    where: { id: dueId, tenantId },
  });
  if (!due) throw new Error("Due not found");

  const paymentAmount = Number(data.amount);
  const newPaidAmount = Number(due.paidAmount) + paymentAmount;

  const payment = await prisma.storeDuePayment.create({
    data: {
      tenantId,
      dueId,
      amount: paymentAmount,
      paymentDate: data.paymentDate ? new Date(data.paymentDate) : new Date(),
      paymentMethod: data.paymentMethod || null,
      transactionId: data.transactionId || null,
      remarks: data.remarks || null,
    },
  });

  let newStatus = "partially_paid";
  if (newPaidAmount >= Number(due.totalDueAmount)) {
    newStatus = "settled";
  }

  await prisma.storeDue.update({
    where: { id: dueId, tenantId },
    data: {
      paidAmount: newPaidAmount,
      status: newStatus,
    },
  });

  return {
    id: payment.id,
    dueId: payment.dueId,
    amount: Number(payment.amount),
    paymentDate: payment.paymentDate,
    paymentMethod: payment.paymentMethod,
    transactionId: payment.transactionId,
    remarks: payment.remarks,
  };
}

// ─── Returns / Exchanges ──────────────────────────────────────────────────────

function mapReturnOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    orderItemId: row.orderItemId,
    productId: row.productId,
    productName: row.productName,
    quantity: row.quantity,
    refundAmount: Number(row.refundAmount),
    reason: row.reason,
    returnedAt: row.returnedAt,
    createdAt: row.createdAt,
    orderItem: row.orderItem
      ? {
          id: row.orderItem.id,
          productName: row.orderItem.productName,
        }
      : null,
  };
}

async function createReturn(data, tenantId) {
  const { orderItemId, reason, ...returnData } = data;

  const orderItem = await prisma.storeOrderItem.findFirst({
    where: { id: orderItemId, tenantId },
    include: { order: true },
  });
  if (!orderItem) throw new Error("Order item not found");
  if (orderItem.isReturned) throw new Error("Order item has already been returned");

  const refundAmount = Number(returnData.refundAmount) || Number(orderItem.totalPrice);
  const quantity = returnData.quantity || orderItem.quantity;

  const storeReturn = await prisma.storeReturn.create({
    data: {
      tenantId,
      orderItemId,
      productId: orderItem.productId,
      productName: orderItem.productName,
      quantity,
      refundAmount,
      reason: reason || null,
      returnedAt: new Date(),
    },
    include: {
      orderItem: true,
    },
  });

  await prisma.storeOrderItem.update({
    where: { id: orderItemId, tenantId },
    data: {
      isReturned: true,
      returnedAt: new Date(),
    },
  });

  if (orderItem.productId) {
    await prisma.storeProduct.update({
      where: { id: orderItem.productId, tenantId },
      data: { stockQuantity: { increment: quantity } },
    });
  }

  return mapReturnOut(storeReturn);
}

async function getAllReturns(tenantId, filters = {}) {
  const where = { tenantId };
  if (filters.orderItemId) {
    where.orderItemId = filters.orderItemId;
  }
  const returns = await prisma.storeReturn.findMany({
    where,
    orderBy: { returnedAt: "desc" },
    include: {
      orderItem: {
        include: {
          order: {
            include: {
              enrollment: {
                include: { student: true },
              },
            },
          },
        },
      },
    },
  });
  return returns.map(mapReturnOut);
}

// ─── Student Purchases ────────────────────────────────────────────────────────

async function getStudentPurchases(enrollmentId, tenantId) {
  const orders = await prisma.storeOrder.findMany({
    where: { enrollmentId, tenantId },
    orderBy: { orderDate: "desc" },
    include: {
      items: {
        include: { pendingItems: true },
      },
      enrollment: {
        include: { student: true, section: true },
      },
      academicYear: true,
      createdBy: true,
      dues: true,
    },
  });
  return orders.map(mapOrderOut);
}

// ─── Backfill ─────────────────────────────────────────────────────────────────

/**
 * Backfill dues for existing orders that don't have any due records.
 * This is useful for fixing historical data after the dues logic was updated.
 */
async function backfillDues(tenantId) {
  const orders = await prisma.storeOrder.findMany({
    where: {
      tenantId,
      dues: { none: {} }, // orders without any due
      status: { not: "cancelled" },
    },
    include: {
      enrollment: {
        include: { student: true },
      },
    },
  });

  const createdDues = [];
  for (const order of orders) {
    // Only create due if no payment was made (no paymentMethod)
    if (!order.paymentMethod) {
      const due = await prisma.storeDue.create({
        data: {
          tenantId,
          orderId: order.id,
          enrollmentId: order.enrollmentId || null,
          customerName: order.customerName
            || (order.enrollment?.student
              ? `${order.enrollment.student.firstName} ${order.enrollment.student.lastName}`
              : "Unknown"),
          customerPhone: order.customerPhone || null,
          customerType: order.customerType || "student",
          totalDueAmount: Number(order.totalAmount),
          paidAmount: 0,
          status: "pending",
          remarks: `Due from order ${order.id}`,
        },
      });
      createdDues.push(due);
    }
  }

  return {
    totalOrdersWithoutDues: orders.length,
    duesCreated: createdDues.length,
    ordersProcessed: orders.filter((o) => !o.paymentMethod).length,
    ordersSkipped: orders.filter((o) => o.paymentMethod).length,
  };
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default {
  // Categories
  createCategory,
  getCategoryById,
  getAllCategories,
  updateCategory,
  deleteCategory,

  // Products
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,

  // Kits
  createKit,
  getKitById,
  getAllKits,
  updateKit,
  deleteKit,

  // Kit Items
  addKitItem,
  updateKitItem,
  deleteKitItem,

  // Orders
  checkStock,
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,

  // Pending Items
  getAllPendingItems,
  collectPendingItem,

  // Dues
  getAllDues,
  getDueById,
  createDuePayment,

  // Returns
  createReturn,
  getAllReturns,

  // Student Purchases
  getStudentPurchases,

  // Backfill
  backfillDues,
};
