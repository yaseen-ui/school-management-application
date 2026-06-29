/*
  Warnings:

  - You are about to drop the `exam_papers` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `examType` on the `exams` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('weekly', 'quarterly', 'half_yearly', 'annually');

-- CreateEnum
CREATE TYPE "ExamScheduleStatus" AS ENUM ('pending', 'scheduled', 'completed', 'cancelled');

-- DropForeignKey
ALTER TABLE "exam_marks" DROP CONSTRAINT "exam_marks_examPaperId_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "exam_papers" DROP CONSTRAINT "exam_papers_examId_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "exam_papers" DROP CONSTRAINT "exam_papers_sectionSubjectId_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "exam_papers" DROP CONSTRAINT "exam_papers_tenantId_fkey";

-- AlterTable
ALTER TABLE "exams" ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'admin',
DROP COLUMN "examType",
ADD COLUMN     "examType" "ExamType" NOT NULL;

-- DropTable
DROP TABLE "exam_papers";

-- CreateTable
CREATE TABLE "exam_target_grades" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "gradeId" TEXT NOT NULL,

    CONSTRAINT "exam_target_grades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_target_sections" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,

    CONSTRAINT "exam_target_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_schedules" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "examId" TEXT,
    "sectionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ExamScheduleStatus" NOT NULL DEFAULT 'pending',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_schedule_papers" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "sectionSubjectId" TEXT NOT NULL,
    "examDate" TIMESTAMP(3) NOT NULL,
    "startTime" INTEGER NOT NULL,
    "endTime" INTEGER NOT NULL,
    "durationMinutes" INTEGER,
    "room" TEXT,
    "inChargeId" TEXT,
    "maxMarks" INTEGER NOT NULL,
    "passMarks" INTEGER NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_schedule_papers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "exam_target_grades_tenantId_examId_idx" ON "exam_target_grades"("tenantId", "examId");

-- CreateIndex
CREATE INDEX "exam_target_grades_tenantId_gradeId_idx" ON "exam_target_grades"("tenantId", "gradeId");

-- CreateIndex
CREATE UNIQUE INDEX "exam_target_grades_tenantId_examId_gradeId_key" ON "exam_target_grades"("tenantId", "examId", "gradeId");

-- CreateIndex
CREATE UNIQUE INDEX "exam_target_grades_id_tenantId_key" ON "exam_target_grades"("id", "tenantId");

-- CreateIndex
CREATE INDEX "exam_target_sections_tenantId_examId_idx" ON "exam_target_sections"("tenantId", "examId");

-- CreateIndex
CREATE INDEX "exam_target_sections_tenantId_sectionId_idx" ON "exam_target_sections"("tenantId", "sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "exam_target_sections_tenantId_examId_sectionId_key" ON "exam_target_sections"("tenantId", "examId", "sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "exam_target_sections_id_tenantId_key" ON "exam_target_sections"("id", "tenantId");

-- CreateIndex
CREATE INDEX "exam_schedules_tenantId_examId_idx" ON "exam_schedules"("tenantId", "examId");

-- CreateIndex
CREATE INDEX "exam_schedules_tenantId_sectionId_idx" ON "exam_schedules"("tenantId", "sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "exam_schedules_id_tenantId_key" ON "exam_schedules"("id", "tenantId");

-- CreateIndex
CREATE INDEX "exam_schedule_papers_tenantId_scheduleId_idx" ON "exam_schedule_papers"("tenantId", "scheduleId");

-- CreateIndex
CREATE INDEX "exam_schedule_papers_tenantId_sectionSubjectId_idx" ON "exam_schedule_papers"("tenantId", "sectionSubjectId");

-- CreateIndex
CREATE INDEX "exam_schedule_papers_tenantId_inChargeId_idx" ON "exam_schedule_papers"("tenantId", "inChargeId");

-- CreateIndex
CREATE UNIQUE INDEX "exam_schedule_papers_tenantId_scheduleId_sectionSubjectId_key" ON "exam_schedule_papers"("tenantId", "scheduleId", "sectionSubjectId");

-- CreateIndex
CREATE UNIQUE INDEX "exam_schedule_papers_id_tenantId_key" ON "exam_schedule_papers"("id", "tenantId");

-- AddForeignKey
ALTER TABLE "exam_target_grades" ADD CONSTRAINT "exam_target_grades_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_target_grades" ADD CONSTRAINT "exam_target_grades_examId_tenantId_fkey" FOREIGN KEY ("examId", "tenantId") REFERENCES "exams"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_target_grades" ADD CONSTRAINT "exam_target_grades_gradeId_tenantId_fkey" FOREIGN KEY ("gradeId", "tenantId") REFERENCES "grades"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_target_sections" ADD CONSTRAINT "exam_target_sections_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_target_sections" ADD CONSTRAINT "exam_target_sections_examId_tenantId_fkey" FOREIGN KEY ("examId", "tenantId") REFERENCES "exams"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_target_sections" ADD CONSTRAINT "exam_target_sections_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES "sections"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_schedules" ADD CONSTRAINT "exam_schedules_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_schedules" ADD CONSTRAINT "exam_schedules_examId_tenantId_fkey" FOREIGN KEY ("examId", "tenantId") REFERENCES "exams"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_schedules" ADD CONSTRAINT "exam_schedules_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES "sections"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_schedule_papers" ADD CONSTRAINT "exam_schedule_papers_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_schedule_papers" ADD CONSTRAINT "exam_schedule_papers_scheduleId_tenantId_fkey" FOREIGN KEY ("scheduleId", "tenantId") REFERENCES "exam_schedules"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_schedule_papers" ADD CONSTRAINT "exam_schedule_papers_sectionSubjectId_tenantId_fkey" FOREIGN KEY ("sectionSubjectId", "tenantId") REFERENCES "section_subjects"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_schedule_papers" ADD CONSTRAINT "exam_schedule_papers_inChargeId_tenantId_fkey" FOREIGN KEY ("inChargeId", "tenantId") REFERENCES "teachers"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_marks" ADD CONSTRAINT "exam_marks_examPaperId_tenantId_fkey" FOREIGN KEY ("examPaperId", "tenantId") REFERENCES "exam_schedule_papers"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;
