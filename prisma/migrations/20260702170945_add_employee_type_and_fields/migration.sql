-- CreateEnum
CREATE TYPE "EmployeeType" AS ENUM ('teacher', 'driver', 'clerk', 'office_boy', 'admin', 'accountant', 'security', 'cleaner', 'other');

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "drivingExperienceYears" INTEGER,
ADD COLUMN     "drivingLicenseNumber" TEXT,
ADD COLUMN     "drivingLicenseUrl" TEXT,
ADD COLUMN     "employeeType" "EmployeeType" NOT NULL DEFAULT 'teacher',
ADD COLUMN     "governmentIdNumber" TEXT,
ADD COLUMN     "governmentIdType" TEXT,
ADD COLUMN     "governmentIdUrl" TEXT,
ADD COLUMN     "licenseExpiryDate" TIMESTAMP(3),
ADD COLUMN     "medicalCertificateUrl" TEXT,
ADD COLUMN     "vehicleType" TEXT;
