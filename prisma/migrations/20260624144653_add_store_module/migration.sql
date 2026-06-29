-- CreateTable
CREATE TABLE "store_categories" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_products" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "basePrice" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "store_categories_tenantId_name_idx" ON "store_categories"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "store_categories_id_tenantId_key" ON "store_categories"("id", "tenantId");

-- CreateIndex
CREATE INDEX "store_products_tenantId_categoryId_idx" ON "store_products"("tenantId", "categoryId");

-- CreateIndex
CREATE INDEX "store_products_tenantId_name_idx" ON "store_products"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "store_products_id_tenantId_key" ON "store_products"("id", "tenantId");

-- AddForeignKey
ALTER TABLE "store_categories" ADD CONSTRAINT "store_categories_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_products" ADD CONSTRAINT "store_products_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_products" ADD CONSTRAINT "store_products_categoryId_tenantId_fkey" FOREIGN KEY ("categoryId", "tenantId") REFERENCES "store_categories"("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;
