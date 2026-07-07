-- CreateEnum
CREATE TYPE "VehicleCategoryType" AS ENUM ('bus', 'van', 'car', 'auto');

-- CreateEnum
CREATE TYPE "VehicleAmenity" AS ENUM ('ac', 'non_ac', 'deluxe', 'standard');

-- CreateTable
CREATE TABLE "vehicle_categories" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "VehicleCategoryType" NOT NULL,
    "occupancy" INTEGER NOT NULL,
    "amenities" "VehicleAmenity"[],
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicle_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "registrationNumber" TEXT,
    "capacity" INTEGER NOT NULL,
    "description" TEXT,
    "status" "EntityStatus" NOT NULL DEFAULT 'active',
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_driver_assignments" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "isPrimaryDriver" BOOLEAN NOT NULL DEFAULT true,
    "assignedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "status" "EntityStatus" NOT NULL DEFAULT 'active',
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicle_driver_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pickup_points" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pickup_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_transport_assignments" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "pickupPointId" TEXT NOT NULL,
    "vehicleId" TEXT,
    "categoryId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_transport_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "vehicle_categories_tenantId_idx" ON "vehicle_categories"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_categories_tenantId_name_key" ON "vehicle_categories"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_categories_id_tenantId_key" ON "vehicle_categories"("id", "tenantId");

-- CreateIndex
CREATE INDEX "vehicles_tenantId_idx" ON "vehicles"("tenantId");

-- CreateIndex
CREATE INDEX "vehicles_tenantId_categoryId_idx" ON "vehicles"("tenantId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_tenantId_registrationNumber_key" ON "vehicles"("tenantId", "registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_id_tenantId_key" ON "vehicles"("id", "tenantId");

-- CreateIndex
CREATE INDEX "vehicle_driver_assignments_tenantId_vehicleId_idx" ON "vehicle_driver_assignments"("tenantId", "vehicleId");

-- CreateIndex
CREATE INDEX "vehicle_driver_assignments_tenantId_driverId_idx" ON "vehicle_driver_assignments"("tenantId", "driverId");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_driver_assignments_tenantId_vehicleId_driverId_key" ON "vehicle_driver_assignments"("tenantId", "vehicleId", "driverId");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_driver_assignments_id_tenantId_key" ON "vehicle_driver_assignments"("id", "tenantId");

-- CreateIndex
CREATE INDEX "pickup_points_tenantId_idx" ON "pickup_points"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "pickup_points_tenantId_name_key" ON "pickup_points"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "pickup_points_id_tenantId_key" ON "pickup_points"("id", "tenantId");

-- CreateIndex
CREATE INDEX "student_transport_assignments_tenantId_enrollmentId_idx" ON "student_transport_assignments"("tenantId", "enrollmentId");

-- CreateIndex
CREATE INDEX "student_transport_assignments_tenantId_pickupPointId_idx" ON "student_transport_assignments"("tenantId", "pickupPointId");

-- CreateIndex
CREATE INDEX "student_transport_assignments_tenantId_vehicleId_idx" ON "student_transport_assignments"("tenantId", "vehicleId");

-- CreateIndex
CREATE INDEX "student_transport_assignments_tenantId_categoryId_idx" ON "student_transport_assignments"("tenantId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "student_transport_assignments_tenantId_enrollmentId_key" ON "student_transport_assignments"("tenantId", "enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "student_transport_assignments_id_tenantId_key" ON "student_transport_assignments"("id", "tenantId");

-- AddForeignKey
ALTER TABLE "vehicle_categories" ADD CONSTRAINT "vehicle_categories_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_categoryId_tenantId_fkey" FOREIGN KEY ("categoryId", "tenantId") REFERENCES "vehicle_categories"("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_driver_assignments" ADD CONSTRAINT "vehicle_driver_assignments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_driver_assignments" ADD CONSTRAINT "vehicle_driver_assignments_vehicleId_tenantId_fkey" FOREIGN KEY ("vehicleId", "tenantId") REFERENCES "vehicles"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_driver_assignments" ADD CONSTRAINT "vehicle_driver_assignments_driverId_tenantId_fkey" FOREIGN KEY ("driverId", "tenantId") REFERENCES "teachers"("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickup_points" ADD CONSTRAINT "pickup_points_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_transport_assignments" ADD CONSTRAINT "student_transport_assignments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_transport_assignments" ADD CONSTRAINT "student_transport_assignments_enrollmentId_tenantId_fkey" FOREIGN KEY ("enrollmentId", "tenantId") REFERENCES "student_enrollments"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_transport_assignments" ADD CONSTRAINT "student_transport_assignments_pickupPointId_tenantId_fkey" FOREIGN KEY ("pickupPointId", "tenantId") REFERENCES "pickup_points"("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_transport_assignments" ADD CONSTRAINT "student_transport_assignments_vehicleId_tenantId_fkey" FOREIGN KEY ("vehicleId", "tenantId") REFERENCES "vehicles"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_transport_assignments" ADD CONSTRAINT "student_transport_assignments_categoryId_tenantId_fkey" FOREIGN KEY ("categoryId", "tenantId") REFERENCES "vehicle_categories"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;
