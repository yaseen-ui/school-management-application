-- AlterTable
ALTER TABLE "exam_marks" ADD COLUMN     "breakup" JSONB,
ALTER COLUMN "marksObtained" DROP NOT NULL;
