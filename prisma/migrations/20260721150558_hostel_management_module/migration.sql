-- CreateEnum
CREATE TYPE "HostelStaffRole" AS ENUM ('warden', 'in_charge', 'cook', 'mate', 'cleaner', 'other');

-- AlterTable
ALTER TABLE "fee_heads" ADD COLUMN     "hostelRoomTypeId" TEXT;

-- CreateTable
CREATE TABLE "hostel_blocks" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "gender" "Gender",
    "status" "EntityStatus" NOT NULL DEFAULT 'active',
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hostel_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hostel_floors" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "floorNumber" INTEGER NOT NULL,
    "name" TEXT,
    "gender" "Gender",
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hostel_floors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hostel_room_types" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "defaultCapacity" INTEGER NOT NULL DEFAULT 1,
    "amenities" JSONB,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hostel_room_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hostel_rooms" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "floorId" TEXT NOT NULL,
    "roomTypeId" TEXT NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "status" "EntityStatus" NOT NULL DEFAULT 'active',
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hostel_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hostel_sections" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "sectionName" TEXT NOT NULL,
    "description" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hostel_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hostel_section_rooms" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hostel_section_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hostel_staff_assignments" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "role" "HostelStaffRole" NOT NULL,
    "fromDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "toDate" TIMESTAMP(3),
    "status" "EntityStatus" NOT NULL DEFAULT 'active',
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hostel_staff_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_hostel_allocations" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "sectionId" TEXT,
    "academicYearId" TEXT NOT NULL,
    "fromDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "toDate" TIMESTAMP(3),
    "status" "EntityStatus" NOT NULL DEFAULT 'active',
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_hostel_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "hostel_blocks_tenantId_idx" ON "hostel_blocks"("tenantId");

-- CreateIndex
CREATE INDEX "hostel_blocks_tenantId_status_idx" ON "hostel_blocks"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "hostel_blocks_id_tenantId_key" ON "hostel_blocks"("id", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "hostel_blocks_tenantId_name_key" ON "hostel_blocks"("tenantId", "name");

-- CreateIndex
CREATE INDEX "hostel_floors_tenantId_idx" ON "hostel_floors"("tenantId");

-- CreateIndex
CREATE INDEX "hostel_floors_tenantId_blockId_idx" ON "hostel_floors"("tenantId", "blockId");

-- CreateIndex
CREATE UNIQUE INDEX "hostel_floors_id_tenantId_key" ON "hostel_floors"("id", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "hostel_floors_tenantId_blockId_floorNumber_key" ON "hostel_floors"("tenantId", "blockId", "floorNumber");

-- CreateIndex
CREATE INDEX "hostel_room_types_tenantId_idx" ON "hostel_room_types"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "hostel_room_types_id_tenantId_key" ON "hostel_room_types"("id", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "hostel_room_types_tenantId_name_key" ON "hostel_room_types"("tenantId", "name");

-- CreateIndex
CREATE INDEX "hostel_rooms_tenantId_idx" ON "hostel_rooms"("tenantId");

-- CreateIndex
CREATE INDEX "hostel_rooms_tenantId_floorId_idx" ON "hostel_rooms"("tenantId", "floorId");

-- CreateIndex
CREATE INDEX "hostel_rooms_tenantId_roomTypeId_idx" ON "hostel_rooms"("tenantId", "roomTypeId");

-- CreateIndex
CREATE INDEX "hostel_rooms_tenantId_status_idx" ON "hostel_rooms"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "hostel_rooms_id_tenantId_key" ON "hostel_rooms"("id", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "hostel_rooms_tenantId_floorId_roomNumber_key" ON "hostel_rooms"("tenantId", "floorId", "roomNumber");

-- CreateIndex
CREATE INDEX "hostel_sections_tenantId_idx" ON "hostel_sections"("tenantId");

-- CreateIndex
CREATE INDEX "hostel_sections_tenantId_blockId_idx" ON "hostel_sections"("tenantId", "blockId");

-- CreateIndex
CREATE UNIQUE INDEX "hostel_sections_id_tenantId_key" ON "hostel_sections"("id", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "hostel_sections_tenantId_blockId_sectionName_key" ON "hostel_sections"("tenantId", "blockId", "sectionName");

-- CreateIndex
CREATE INDEX "hostel_section_rooms_tenantId_sectionId_idx" ON "hostel_section_rooms"("tenantId", "sectionId");

-- CreateIndex
CREATE INDEX "hostel_section_rooms_tenantId_roomId_idx" ON "hostel_section_rooms"("tenantId", "roomId");

-- CreateIndex
CREATE UNIQUE INDEX "hostel_section_rooms_id_tenantId_key" ON "hostel_section_rooms"("id", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "hostel_section_rooms_tenantId_sectionId_roomId_key" ON "hostel_section_rooms"("tenantId", "sectionId", "roomId");

-- CreateIndex
CREATE INDEX "hostel_staff_assignments_tenantId_blockId_idx" ON "hostel_staff_assignments"("tenantId", "blockId");

-- CreateIndex
CREATE INDEX "hostel_staff_assignments_tenantId_teacherId_idx" ON "hostel_staff_assignments"("tenantId", "teacherId");

-- CreateIndex
CREATE INDEX "hostel_staff_assignments_tenantId_role_idx" ON "hostel_staff_assignments"("tenantId", "role");

-- CreateIndex
CREATE INDEX "hostel_staff_assignments_tenantId_status_idx" ON "hostel_staff_assignments"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "hostel_staff_assignments_id_tenantId_key" ON "hostel_staff_assignments"("id", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "hostel_staff_assignments_tenantId_blockId_teacherId_role_fr_key" ON "hostel_staff_assignments"("tenantId", "blockId", "teacherId", "role", "fromDate");

-- CreateIndex
CREATE INDEX "student_hostel_allocations_tenantId_enrollmentId_idx" ON "student_hostel_allocations"("tenantId", "enrollmentId");

-- CreateIndex
CREATE INDEX "student_hostel_allocations_tenantId_roomId_idx" ON "student_hostel_allocations"("tenantId", "roomId");

-- CreateIndex
CREATE INDEX "student_hostel_allocations_tenantId_sectionId_idx" ON "student_hostel_allocations"("tenantId", "sectionId");

-- CreateIndex
CREATE INDEX "student_hostel_allocations_tenantId_academicYearId_idx" ON "student_hostel_allocations"("tenantId", "academicYearId");

-- CreateIndex
CREATE INDEX "student_hostel_allocations_tenantId_status_idx" ON "student_hostel_allocations"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "student_hostel_allocations_id_tenantId_key" ON "student_hostel_allocations"("id", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "student_hostel_allocations_tenantId_enrollmentId_academicYe_key" ON "student_hostel_allocations"("tenantId", "enrollmentId", "academicYearId");

-- CreateIndex
CREATE INDEX "fee_heads_tenantId_hostelRoomTypeId_idx" ON "fee_heads"("tenantId", "hostelRoomTypeId");

-- AddForeignKey
ALTER TABLE "hostel_blocks" ADD CONSTRAINT "hostel_blocks_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hostel_floors" ADD CONSTRAINT "hostel_floors_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hostel_floors" ADD CONSTRAINT "hostel_floors_blockId_tenantId_fkey" FOREIGN KEY ("blockId", "tenantId") REFERENCES "hostel_blocks"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hostel_room_types" ADD CONSTRAINT "hostel_room_types_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hostel_rooms" ADD CONSTRAINT "hostel_rooms_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hostel_rooms" ADD CONSTRAINT "hostel_rooms_floorId_tenantId_fkey" FOREIGN KEY ("floorId", "tenantId") REFERENCES "hostel_floors"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hostel_rooms" ADD CONSTRAINT "hostel_rooms_roomTypeId_tenantId_fkey" FOREIGN KEY ("roomTypeId", "tenantId") REFERENCES "hostel_room_types"("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hostel_sections" ADD CONSTRAINT "hostel_sections_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hostel_sections" ADD CONSTRAINT "hostel_sections_blockId_tenantId_fkey" FOREIGN KEY ("blockId", "tenantId") REFERENCES "hostel_blocks"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hostel_section_rooms" ADD CONSTRAINT "hostel_section_rooms_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hostel_section_rooms" ADD CONSTRAINT "hostel_section_rooms_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES "hostel_sections"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hostel_section_rooms" ADD CONSTRAINT "hostel_section_rooms_roomId_tenantId_fkey" FOREIGN KEY ("roomId", "tenantId") REFERENCES "hostel_rooms"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hostel_staff_assignments" ADD CONSTRAINT "hostel_staff_assignments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hostel_staff_assignments" ADD CONSTRAINT "hostel_staff_assignments_blockId_tenantId_fkey" FOREIGN KEY ("blockId", "tenantId") REFERENCES "hostel_blocks"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hostel_staff_assignments" ADD CONSTRAINT "hostel_staff_assignments_teacherId_tenantId_fkey" FOREIGN KEY ("teacherId", "tenantId") REFERENCES "teachers"("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_hostel_allocations" ADD CONSTRAINT "student_hostel_allocations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_hostel_allocations" ADD CONSTRAINT "student_hostel_allocations_enrollmentId_tenantId_fkey" FOREIGN KEY ("enrollmentId", "tenantId") REFERENCES "student_enrollments"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_hostel_allocations" ADD CONSTRAINT "student_hostel_allocations_roomId_tenantId_fkey" FOREIGN KEY ("roomId", "tenantId") REFERENCES "hostel_rooms"("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_hostel_allocations" ADD CONSTRAINT "student_hostel_allocations_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES "hostel_sections"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_hostel_allocations" ADD CONSTRAINT "student_hostel_allocations_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES "academic_years"("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_heads" ADD CONSTRAINT "fee_heads_hostelRoomTypeId_tenantId_fkey" FOREIGN KEY ("hostelRoomTypeId", "tenantId") REFERENCES "hostel_room_types"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;
