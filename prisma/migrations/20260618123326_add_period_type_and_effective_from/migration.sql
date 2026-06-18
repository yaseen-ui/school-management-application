-- CreateEnum
CREATE TYPE "PeriodType" AS ENUM ('class', 'break', 'lunch', 'sports', 'leisure', 'study_hour');

-- AlterTable
ALTER TABLE "timetable_periods" ADD COLUMN     "type" "PeriodType" NOT NULL DEFAULT 'class';
