-- CreateEnum
CREATE TYPE "ExpertiseLevel" AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');

-- CreateEnum
CREATE TYPE "SubjectScope" AS ENUM ('all_courses_all_grades', 'course_all_grades', 'grade_all_courses', 'course_grade');

-- AlterTable
ALTER TABLE "section_subjects" ADD COLUMN     "subjectOfferingId" TEXT;

-- CreateTable
CREATE TABLE "teacher_capabilities" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "courseId" TEXT,
    "gradeId" TEXT,
    "expertiseLevel" "ExpertiseLevel" NOT NULL DEFAULT 'intermediate',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "priorityScore" INTEGER NOT NULL DEFAULT 50,
    "canBeClassTeacher" BOOLEAN NOT NULL DEFAULT false,
    "remarks" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teacher_capabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject_offerings" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "courseId" TEXT,
    "gradeId" TEXT,
    "scope" "SubjectScope" NOT NULL DEFAULT 'course_all_grades',
    "isElective" BOOLEAN NOT NULL DEFAULT false,
    "weeklyPeriods" INTEGER,
    "status" "EntityStatus" NOT NULL DEFAULT 'active',
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subject_offerings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "teacher_capabilities_tenantId_teacherId_idx" ON "teacher_capabilities"("tenantId", "teacherId");

-- CreateIndex
CREATE INDEX "teacher_capabilities_tenantId_subjectId_idx" ON "teacher_capabilities"("tenantId", "subjectId");

-- CreateIndex
CREATE INDEX "teacher_capabilities_tenantId_courseId_idx" ON "teacher_capabilities"("tenantId", "courseId");

-- CreateIndex
CREATE INDEX "teacher_capabilities_tenantId_gradeId_idx" ON "teacher_capabilities"("tenantId", "gradeId");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_capabilities_id_tenantId_key" ON "teacher_capabilities"("id", "tenantId");

-- CreateIndex
CREATE INDEX "subject_offerings_tenantId_subjectId_idx" ON "subject_offerings"("tenantId", "subjectId");

-- CreateIndex
CREATE INDEX "subject_offerings_tenantId_courseId_idx" ON "subject_offerings"("tenantId", "courseId");

-- CreateIndex
CREATE INDEX "subject_offerings_tenantId_gradeId_idx" ON "subject_offerings"("tenantId", "gradeId");

-- CreateIndex
CREATE INDEX "subject_offerings_tenantId_scope_idx" ON "subject_offerings"("tenantId", "scope");

-- CreateIndex
CREATE INDEX "subject_offerings_tenantId_status_idx" ON "subject_offerings"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "subject_offerings_id_tenantId_key" ON "subject_offerings"("id", "tenantId");

-- CreateIndex
CREATE INDEX "section_subjects_tenantId_subjectOfferingId_idx" ON "section_subjects"("tenantId", "subjectOfferingId");

-- AddForeignKey
ALTER TABLE "section_subjects" ADD CONSTRAINT "section_subjects_subjectOfferingId_tenantId_fkey" FOREIGN KEY ("subjectOfferingId", "tenantId") REFERENCES "subject_offerings"("id", "tenantId") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_capabilities" ADD CONSTRAINT "teacher_capabilities_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_capabilities" ADD CONSTRAINT "teacher_capabilities_teacherId_tenantId_fkey" FOREIGN KEY ("teacherId", "tenantId") REFERENCES "teachers"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_capabilities" ADD CONSTRAINT "teacher_capabilities_subjectId_tenantId_fkey" FOREIGN KEY ("subjectId", "tenantId") REFERENCES "subjects"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_capabilities" ADD CONSTRAINT "teacher_capabilities_courseId_tenantId_fkey" FOREIGN KEY ("courseId", "tenantId") REFERENCES "courses"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_capabilities" ADD CONSTRAINT "teacher_capabilities_gradeId_tenantId_fkey" FOREIGN KEY ("gradeId", "tenantId") REFERENCES "grades"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_offerings" ADD CONSTRAINT "subject_offerings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_offerings" ADD CONSTRAINT "subject_offerings_subjectId_tenantId_fkey" FOREIGN KEY ("subjectId", "tenantId") REFERENCES "subjects"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_offerings" ADD CONSTRAINT "subject_offerings_courseId_tenantId_fkey" FOREIGN KEY ("courseId", "tenantId") REFERENCES "courses"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_offerings" ADD CONSTRAINT "subject_offerings_gradeId_tenantId_fkey" FOREIGN KEY ("gradeId", "tenantId") REFERENCES "grades"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;
