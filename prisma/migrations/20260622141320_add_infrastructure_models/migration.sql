-- CreateEnum
CREATE TYPE "RoomCategory" AS ENUM ('ac', 'non_ac', 'deluxe');

-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('classroom', 'laboratory', 'library', 'auditorium', 'office', 'staff_room', 'computer_lab', 'science_lab', 'language_lab', 'sports_hall', 'art_room', 'music_room', 'seminar_hall', 'conference_room', 'other');

-- CreateTable
CREATE TABLE "buildings" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buildings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "floors" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "floorNumber" INTEGER NOT NULL,
    "name" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "floors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "floorId" TEXT NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "roomName" TEXT,
    "roomType" "RoomType" NOT NULL DEFAULT 'classroom',
    "roomCategory" "RoomCategory",
    "capacity" INTEGER NOT NULL,
    "status" "EntityStatus" NOT NULL DEFAULT 'active',
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "buildings_tenantId_idx" ON "buildings"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "buildings_id_tenantId_key" ON "buildings"("id", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "buildings_tenantId_name_key" ON "buildings"("tenantId", "name");

-- CreateIndex
CREATE INDEX "floors_tenantId_idx" ON "floors"("tenantId");

-- CreateIndex
CREATE INDEX "floors_tenantId_buildingId_idx" ON "floors"("tenantId", "buildingId");

-- CreateIndex
CREATE UNIQUE INDEX "floors_id_tenantId_key" ON "floors"("id", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "floors_tenantId_buildingId_floorNumber_key" ON "floors"("tenantId", "buildingId", "floorNumber");

-- CreateIndex
CREATE INDEX "rooms_tenantId_idx" ON "rooms"("tenantId");

-- CreateIndex
CREATE INDEX "rooms_tenantId_floorId_idx" ON "rooms"("tenantId", "floorId");

-- CreateIndex
CREATE INDEX "rooms_tenantId_status_idx" ON "rooms"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_id_tenantId_key" ON "rooms"("id", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_tenantId_floorId_roomNumber_key" ON "rooms"("tenantId", "floorId", "roomNumber");

-- AddForeignKey
ALTER TABLE "buildings" ADD CONSTRAINT "buildings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "floors" ADD CONSTRAINT "floors_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "floors" ADD CONSTRAINT "floors_buildingId_tenantId_fkey" FOREIGN KEY ("buildingId", "tenantId") REFERENCES "buildings"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_floorId_tenantId_fkey" FOREIGN KEY ("floorId", "tenantId") REFERENCES "floors"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;
