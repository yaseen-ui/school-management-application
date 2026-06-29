-- AlterTable
ALTER TABLE "store_products" ADD COLUMN     "isGeneral" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "stockQuantity" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "store_product_sections" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_product_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_kits" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "totalQuantity" INTEGER NOT NULL DEFAULT 0,
    "totalPrice" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_kits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_kit_items" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "kitId" TEXT NOT NULL,
    "productId" TEXT,
    "productName" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_kit_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_kit_sections" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "kitId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_kit_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_orders" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "remarks" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_order_items" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT,
    "kitId" TEXT,
    "productName" TEXT NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_pending_items" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "productId" TEXT,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "collectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_pending_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "store_product_sections_tenantId_productId_idx" ON "store_product_sections"("tenantId", "productId");

-- CreateIndex
CREATE INDEX "store_product_sections_tenantId_sectionId_idx" ON "store_product_sections"("tenantId", "sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "store_product_sections_tenantId_productId_sectionId_key" ON "store_product_sections"("tenantId", "productId", "sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "store_product_sections_id_tenantId_key" ON "store_product_sections"("id", "tenantId");

-- CreateIndex
CREATE INDEX "store_kits_tenantId_idx" ON "store_kits"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "store_kits_id_tenantId_key" ON "store_kits"("id", "tenantId");

-- CreateIndex
CREATE INDEX "store_kit_items_tenantId_kitId_idx" ON "store_kit_items"("tenantId", "kitId");

-- CreateIndex
CREATE UNIQUE INDEX "store_kit_items_id_tenantId_key" ON "store_kit_items"("id", "tenantId");

-- CreateIndex
CREATE INDEX "store_kit_sections_tenantId_kitId_idx" ON "store_kit_sections"("tenantId", "kitId");

-- CreateIndex
CREATE INDEX "store_kit_sections_tenantId_sectionId_idx" ON "store_kit_sections"("tenantId", "sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "store_kit_sections_tenantId_kitId_sectionId_key" ON "store_kit_sections"("tenantId", "kitId", "sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "store_kit_sections_id_tenantId_key" ON "store_kit_sections"("id", "tenantId");

-- CreateIndex
CREATE INDEX "store_orders_tenantId_enrollmentId_idx" ON "store_orders"("tenantId", "enrollmentId");

-- CreateIndex
CREATE INDEX "store_orders_tenantId_academicYearId_idx" ON "store_orders"("tenantId", "academicYearId");

-- CreateIndex
CREATE UNIQUE INDEX "store_orders_id_tenantId_key" ON "store_orders"("id", "tenantId");

-- CreateIndex
CREATE INDEX "store_order_items_tenantId_orderId_idx" ON "store_order_items"("tenantId", "orderId");

-- CreateIndex
CREATE UNIQUE INDEX "store_order_items_id_tenantId_key" ON "store_order_items"("id", "tenantId");

-- CreateIndex
CREATE INDEX "store_pending_items_tenantId_orderItemId_idx" ON "store_pending_items"("tenantId", "orderItemId");

-- CreateIndex
CREATE INDEX "store_pending_items_tenantId_status_idx" ON "store_pending_items"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "store_pending_items_id_tenantId_key" ON "store_pending_items"("id", "tenantId");

-- AddForeignKey
ALTER TABLE "store_product_sections" ADD CONSTRAINT "store_product_sections_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_product_sections" ADD CONSTRAINT "store_product_sections_productId_tenantId_fkey" FOREIGN KEY ("productId", "tenantId") REFERENCES "store_products"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_product_sections" ADD CONSTRAINT "store_product_sections_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES "sections"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_kits" ADD CONSTRAINT "store_kits_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_kit_items" ADD CONSTRAINT "store_kit_items_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_kit_items" ADD CONSTRAINT "store_kit_items_kitId_tenantId_fkey" FOREIGN KEY ("kitId", "tenantId") REFERENCES "store_kits"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_kit_items" ADD CONSTRAINT "store_kit_items_productId_tenantId_fkey" FOREIGN KEY ("productId", "tenantId") REFERENCES "store_products"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_kit_sections" ADD CONSTRAINT "store_kit_sections_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_kit_sections" ADD CONSTRAINT "store_kit_sections_kitId_tenantId_fkey" FOREIGN KEY ("kitId", "tenantId") REFERENCES "store_kits"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_kit_sections" ADD CONSTRAINT "store_kit_sections_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES "sections"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_orders" ADD CONSTRAINT "store_orders_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_orders" ADD CONSTRAINT "store_orders_enrollmentId_tenantId_fkey" FOREIGN KEY ("enrollmentId", "tenantId") REFERENCES "student_enrollments"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_orders" ADD CONSTRAINT "store_orders_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES "academic_years"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_orders" ADD CONSTRAINT "store_orders_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_order_items" ADD CONSTRAINT "store_order_items_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_order_items" ADD CONSTRAINT "store_order_items_orderId_tenantId_fkey" FOREIGN KEY ("orderId", "tenantId") REFERENCES "store_orders"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_order_items" ADD CONSTRAINT "store_order_items_productId_tenantId_fkey" FOREIGN KEY ("productId", "tenantId") REFERENCES "store_products"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_order_items" ADD CONSTRAINT "store_order_items_kitId_tenantId_fkey" FOREIGN KEY ("kitId", "tenantId") REFERENCES "store_kits"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_pending_items" ADD CONSTRAINT "store_pending_items_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_pending_items" ADD CONSTRAINT "store_pending_items_orderItemId_tenantId_fkey" FOREIGN KEY ("orderItemId", "tenantId") REFERENCES "store_order_items"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_pending_items" ADD CONSTRAINT "store_pending_items_productId_tenantId_fkey" FOREIGN KEY ("productId", "tenantId") REFERENCES "store_products"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;
