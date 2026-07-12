-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('company', 'tenant');

-- CreateEnum
CREATE TYPE "EntityStatus" AS ENUM ('active', 'inactive', 'suspended');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other');

-- CreateEnum
CREATE TYPE "AcademicYearStatus" AS ENUM ('draft', 'active', 'archived');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('active', 'promoted', 'transferred', 'left');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('present', 'absent', 'late', 'half_day', 'excused', 'leave');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('percentage', 'fixed');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('cash', 'card', 'bank_transfer', 'upi', 'cheque', 'online', 'other');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('debit', 'credit');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('paid', 'partial', 'pending', 'refunded', 'cancelled');

-- CreateEnum
CREATE TYPE "FeeAllocationMethod" AS ENUM ('equal', 'custom');

-- CreateEnum
CREATE TYPE "EmployeeType" AS ENUM ('teacher', 'driver', 'clerk', 'office_boy', 'admin', 'accountant', 'security', 'cleaner', 'other');

-- CreateEnum
CREATE TYPE "SectionAttendanceMode" AS ENUM ('period_wise', 'shift_wise');

-- CreateEnum
CREATE TYPE "AttendanceContextType" AS ENUM ('regular', 'exam', 'event', 'seminar', 'sports', 'assembly', 'lab', 'field_trip', 'other');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- CreateEnum
CREATE TYPE "TeacherRole" AS ENUM ('subject_teacher', 'class_teacher', 'assistant_teacher', 'lab_incharge');

-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('weekly', 'quarterly', 'half_yearly', 'annually');

-- CreateEnum
CREATE TYPE "ExamStatus" AS ENUM ('draft', 'published', 'in_progress', 'completed', 'cancelled', 'locked', 'archived');

-- CreateEnum
CREATE TYPE "ExamScheduleStatus" AS ENUM ('pending', 'scheduled', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "HolidayType" AS ENUM ('public', 'school', 'optional', 'vacation');

-- CreateEnum
CREATE TYPE "HolidayRuleType" AS ENUM ('all_weekday', 'nth_weekday_of_month');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('free', 'starter', 'growth', 'enterprise');

-- CreateEnum
CREATE TYPE "ExpertiseLevel" AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');

-- CreateEnum
CREATE TYPE "PeriodType" AS ENUM ('class', 'break', 'lunch', 'sports', 'leisure', 'study_hour');

-- CreateEnum
CREATE TYPE "RoomCategory" AS ENUM ('ac', 'non_ac', 'deluxe');

-- CreateEnum
CREATE TYPE "VehicleCategoryType" AS ENUM ('bus', 'van', 'car', 'auto');

-- CreateEnum
CREATE TYPE "VehicleAmenity" AS ENUM ('ac', 'non_ac', 'deluxe', 'standard');

-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('classroom', 'laboratory', 'library', 'auditorium', 'office', 'staff_room', 'computer_lab', 'science_lab', 'language_lab', 'sports_hall', 'art_room', 'music_room', 'seminar_hall', 'conference_room', 'other');

-- CreateEnum
CREATE TYPE "VisitorType" AS ENUM ('registered', 'non_registered');

-- CreateEnum
CREATE TYPE "VisitorApprovalStatus" AS ENUM ('pending', 'approved', 'rejected', 'not_required');

-- CreateEnum
CREATE TYPE "VisitorStatus" AS ENUM ('scheduled', 'checked_in', 'checked_out', 'cancelled');

-- CreateEnum
CREATE TYPE "ApprovalFrom" AS ENUM ('headmaster', 'point_of_contact', 'admin');

-- CreateEnum
CREATE TYPE "LeaveRequestStatus" AS ENUM ('draft', 'pending', 'partially_approved', 'approved', 'rejected', 'withdrawn', 'cancelled');

-- CreateEnum
CREATE TYPE "LeaveDayFraction" AS ENUM ('full_day', 'first_half', 'second_half');

-- CreateEnum
CREATE TYPE "LeaveApplicantType" AS ENUM ('student', 'employee');

-- CreateEnum
CREATE TYPE "LeaveAllocationMethod" AS ENUM ('annual', 'prorated', 'accrued_monthly');

-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "schoolName" TEXT NOT NULL,
    "contactAddress" JSONB,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "subscriptionPlan" "SubscriptionPlan" NOT NULL DEFAULT 'free',
    "domain" TEXT,
    "logo" TEXT,
    "caption" TEXT,
    "defaultTermCount" INTEGER NOT NULL DEFAULT 1,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userType" "UserType" NOT NULL DEFAULT 'tenant',
    "roleId" TEXT,
    "otp" TEXT,
    "otpExpiresAt" TIMESTAMP(3),
    "otpPurpose" TEXT,
    "isFirstLogin" BOOLEAN NOT NULL DEFAULT true,
    "phone" TEXT,
    "status" "EntityStatus" NOT NULL DEFAULT 'active',
    "deletedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "roleName" TEXT NOT NULL,
    "description" TEXT,
    "permissions" JSONB NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grades" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "gradeName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sections" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "gradeId" TEXT NOT NULL,
    "sectionName" TEXT NOT NULL,
    "structureId" TEXT,
    "roomId" TEXT,
    "sectionInChargeId" TEXT,
    "attendanceMode" "SectionAttendanceMode" NOT NULL DEFAULT 'period_wise',
    "shifts" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "subjectName" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "isCommon" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "section_subjects" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "isElective" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "section_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_years" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "AcademicYearStatus" NOT NULL DEFAULT 'draft',
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_years_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_enrollments" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "gradeId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "rollNumber" TEXT,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'active',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_enrollment_electives" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "sectionSubjectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_enrollment_electives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "gender" "Gender",
    "employeeCode" TEXT,
    "employeeType" "EmployeeType" NOT NULL DEFAULT 'teacher',
    "registrationToken" TEXT,
    "registrationTokenExp" TIMESTAMP(3),
    "isRegistered" BOOLEAN NOT NULL DEFAULT false,
    "profilePhotoUrl" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "dateOfJoining" TIMESTAMP(3),
    "yearsOfExperience" DOUBLE PRECISION,
    "governmentIdType" TEXT,
    "governmentIdNumber" TEXT,
    "governmentIdUrl" TEXT,
    "drivingLicenseNumber" TEXT,
    "drivingLicenseUrl" TEXT,
    "drivingExperienceYears" INTEGER,
    "vehicleType" TEXT,
    "licenseExpiryDate" TIMESTAMP(3),
    "medicalCertificateUrl" TEXT,
    "status" "EntityStatus" NOT NULL DEFAULT 'active',
    "deletedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_qualifications" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "qualificationName" TEXT NOT NULL,
    "specialization" TEXT,
    "institution" TEXT,
    "score" DOUBLE PRECISION,
    "yearOfPassing" INTEGER,
    "documentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teacher_qualifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_employment_history" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "organizationName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "reasonForLeaving" TEXT,
    "experienceYears" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teacher_employment_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_assignments" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "sectionSubjectId" TEXT NOT NULL,
    "role" "TeacherRole" NOT NULL DEFAULT 'subject_teacher',
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teacher_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_capabilities" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "courseId" TEXT,
    "gradeId" TEXT,
    "sectionId" TEXT,
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
CREATE TABLE "teacher_availability" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "startTime" INTEGER NOT NULL,
    "endTime" INTEGER NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teacher_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timetable_structures" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timetable_structures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timetable_periods" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "structureId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PeriodType" NOT NULL DEFAULT 'class',
    "startTime" INTEGER NOT NULL,
    "endTime" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timetable_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timetable_entries" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "periodId" TEXT NOT NULL,
    "sectionSubjectId" TEXT NOT NULL,
    "teacherAssignmentId" TEXT,
    "room" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timetable_entries_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "attendance_types" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_sessions" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "takenById" TEXT,
    "attendanceTypeId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "periodId" TEXT,
    "sectionSubjectId" TEXT,
    "examScheduleId" TEXT,
    "shift" TEXT,
    "notes" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_marks" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'present',
    "remarks" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_marks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_attendance" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "checkInTime" TIMESTAMP(3),
    "checkOutTime" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "totalMinutes" INTEGER NOT NULL DEFAULT 0,
    "sessionCount" INTEGER NOT NULL DEFAULT 0,
    "remarks" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_attendance_sessions" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "attendanceId" TEXT NOT NULL,
    "checkInTime" TIMESTAMP(3) NOT NULL,
    "checkInLat" DOUBLE PRECISION,
    "checkInLng" DOUBLE PRECISION,
    "checkInAccuracy" DOUBLE PRECISION,
    "checkInMethod" TEXT,
    "checkOutTime" TIMESTAMP(3),
    "checkOutLat" DOUBLE PRECISION,
    "checkOutLng" DOUBLE PRECISION,
    "checkOutAccuracy" DOUBLE PRECISION,
    "checkOutMethod" TEXT,
    "durationMinutes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_attendance_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parents" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "relation" TEXT NOT NULL,
    "aadhaarNumber" TEXT,
    "occupation" TEXT,
    "registrationToken" TEXT,
    "registrationTokenExp" TIMESTAMP(3),
    "isRegistered" BOOLEAN NOT NULL DEFAULT false,
    "status" "EntityStatus" NOT NULL DEFAULT 'active',
    "deletedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_parents" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "student_parents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exams" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "examType" "ExamType" NOT NULL,
    "status" "ExamStatus" NOT NULL DEFAULT 'draft',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'admin',
    "gradingScaleId" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "exam_marks" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "examPaperId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "marksObtained" DOUBLE PRECISION,
    "isAbsent" BOOLEAN NOT NULL DEFAULT false,
    "breakup" JSONB,
    "remarks" TEXT,
    "gradeLabel" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_marks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grading_scales" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grading_scales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grading_bands" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "scaleId" TEXT NOT NULL,
    "minMarks" DOUBLE PRECISION NOT NULL,
    "maxMarks" DOUBLE PRECISION NOT NULL,
    "grade" TEXT NOT NULL,
    "gpa" DOUBLE PRECISION,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grading_bands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holiday_categories" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "holiday_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holidays" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "academicYearId" TEXT,
    "categoryId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "type" "HolidayType" NOT NULL DEFAULT 'school',
    "isMandatory" BOOLEAN NOT NULL DEFAULT true,
    "fullDay" BOOLEAN NOT NULL DEFAULT true,
    "remarks" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "holidays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_holiday_rules" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "academicYearId" TEXT,
    "name" TEXT NOT NULL,
    "ruleType" "HolidayRuleType" NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "weekOfMonth" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "remarks" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_holiday_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "admissionNumber" TEXT,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "aadhaarNumber" TEXT,
    "casteCategory" TEXT,
    "subCaste" TEXT,
    "religion" TEXT,
    "motherTongue" TEXT,
    "bloodGroup" TEXT,
    "nationality" TEXT NOT NULL DEFAULT 'Indian',
    "identificationMarks" TEXT,
    "fatherName" TEXT,
    "fatherOccupation" TEXT,
    "fatherPhone" TEXT,
    "fatherAadhaar" TEXT,
    "motherName" TEXT,
    "motherOccupation" TEXT,
    "motherPhone" TEXT,
    "motherAadhaar" TEXT,
    "guardianName" TEXT,
    "guardianRelation" TEXT,
    "guardianContact" TEXT,
    "guardianOccupation" TEXT,
    "guardianAadhaar" TEXT,
    "classApplyingFor" TEXT,
    "mediumOfInstruction" TEXT,
    "previousSchoolName" TEXT,
    "previousClassAttended" TEXT,
    "transferCertificateNo" TEXT,
    "dateOfIssueTC" TIMESTAMP(3),
    "modeOfTransport" TEXT,
    "permanentAddress" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "feePaymentMode" TEXT,
    "bankAccountDetails" TEXT,
    "midDayMealEligibility" BOOLEAN NOT NULL DEFAULT false,
    "gradeId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "status" "EntityStatus" NOT NULL DEFAULT 'active',
    "deletedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_categories" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "inventoryCategoryName" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "inventoryItemName" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" TEXT,
    "stockAvailable" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_adjustments" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "itemId" TEXT,
    "adjustmentAmount" INTEGER NOT NULL,
    "reason" TEXT,
    "borrowerName" TEXT,
    "borrowerId" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token_blacklist" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "token_blacklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uploads" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdById" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "uploads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_heads" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isOptional" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_heads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "section_fees" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "termCount" INTEGER NOT NULL DEFAULT 1,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "section_fees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "section_fee_heads" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "sectionFeeId" TEXT NOT NULL,
    "feeHeadId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "section_fee_heads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_terms" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "sectionFeeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_fees" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "allocationMethod" "FeeAllocationMethod" NOT NULL DEFAULT 'equal',
    "totalActualFee" DECIMAL(10,2) NOT NULL,
    "totalNegotiatedFee" DECIMAL(10,2) NOT NULL,
    "discountType" "DiscountType",
    "discountValue" DECIMAL(10,2),
    "discountReason" TEXT,
    "headWiseDiscounts" JSONB,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_fees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_fee_heads" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "studentFeeId" TEXT NOT NULL,
    "feeHeadId" TEXT NOT NULL,
    "actualAmount" DECIMAL(10,2) NOT NULL,
    "negotiatedAmount" DECIMAL(10,2) NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_fee_heads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_payments" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "studentFeeId" TEXT NOT NULL,
    "termId" TEXT,
    "feeHeadId" TEXT,
    "amountPaid" DECIMAL(10,2) NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "transactionId" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'paid',
    "remarks" TEXT,
    "collectedById" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_refunds" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "reason" TEXT NOT NULL,
    "refundDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedById" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_refunds_pkey" PRIMARY KEY ("id")
);

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
    "isGeneral" BOOLEAN NOT NULL DEFAULT true,
    "stockQuantity" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_products_pkey" PRIMARY KEY ("id")
);

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
    "enrollmentId" TEXT,
    "academicYearId" TEXT,
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "actualTotalAmount" DECIMAL(10,2) NOT NULL,
    "discountAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "offeredAmount" DECIMAL(10,2),
    "customerName" TEXT,
    "customerPhone" TEXT,
    "customerType" TEXT NOT NULL DEFAULT 'student',
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "remarks" TEXT,
    "paymentMethod" TEXT,
    "transactionId" TEXT,
    "paymentMode" TEXT,
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
    "kitReferenceId" TEXT,
    "isReturned" BOOLEAN NOT NULL DEFAULT false,
    "returnedAt" TIMESTAMP(3),
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
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" TIMESTAMP(3),
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_pending_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_dues" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "enrollmentId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT,
    "customerType" TEXT NOT NULL DEFAULT 'student',
    "totalDueAmount" DECIMAL(10,2) NOT NULL,
    "paidAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "remarks" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_dues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_due_payments" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "dueId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentMethod" TEXT,
    "transactionId" TEXT,
    "remarks" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_due_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_returns" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "productId" TEXT,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "refundAmount" DECIMAL(10,2) NOT NULL,
    "reason" TEXT,
    "returnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_returns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary_components" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'earning',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salary_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_compensations" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_compensations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compensation_components" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "compensationId" TEXT NOT NULL,
    "salaryComponentId" TEXT NOT NULL,
    "value" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compensation_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compensation_history" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "compensationId" TEXT,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "components" JSONB NOT NULL,
    "changedById" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "compensation_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_batches" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "processedAt" TIMESTAMP(3),
    "processedById" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payroll_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_records" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "actualSalary" DECIMAL(12,2) NOT NULL,
    "paidAmount" DECIMAL(12,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentMethod" TEXT NOT NULL DEFAULT 'cash',
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payroll_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_categories" (
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

    CONSTRAINT "account_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_transactions" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "description" TEXT,
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "partyType" TEXT,
    "partyId" TEXT,
    "partyName" TEXT,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "isVoided" BOOLEAN NOT NULL DEFAULT false,
    "voidReason" TEXT,
    "voidedAt" TIMESTAMP(3),
    "voidedById" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_purposes" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "approvalFrom" "ApprovalFrom" NOT NULL DEFAULT 'admin',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visitor_purposes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitors" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "visitorType" "VisitorType" NOT NULL,
    "parentId" TEXT,
    "visitorName" TEXT,
    "visitorPhone" TEXT,
    "visitorEmail" TEXT,
    "purposeId" TEXT NOT NULL,
    "description" TEXT,
    "pointOfContactId" TEXT,
    "approvalStatus" "VisitorApprovalStatus" NOT NULL DEFAULT 'not_required',
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "checkInTime" TIMESTAMP(3),
    "checkOutTime" TIMESTAMP(3),
    "status" "VisitorStatus" NOT NULL DEFAULT 'scheduled',
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_notifications" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "sentToId" TEXT,
    "type" TEXT NOT NULL,
    "message" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visitor_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_categories" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "applicantType" "LeaveApplicantType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "daysAllocated" DOUBLE PRECISION,
    "isPaid" BOOLEAN NOT NULL DEFAULT true,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT true,
    "allowHalfDay" BOOLEAN NOT NULL DEFAULT false,
    "requireDocuments" BOOLEAN NOT NULL DEFAULT false,
    "requireDocsAfterDays" DOUBLE PRECISION,
    "allowCarryForward" BOOLEAN NOT NULL DEFAULT false,
    "maxCarryForward" DOUBLE PRECISION,
    "allowNegativeBalance" BOOLEAN NOT NULL DEFAULT false,
    "allocationMethod" "LeaveAllocationMethod" NOT NULL DEFAULT 'annual',
    "studentApprovalMode" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_leave_balances" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "leaveCategoryId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "allocated" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "carriedForward" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "manualAdjustment" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "used" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pending" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_leave_balances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_balance_transactions" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "balanceId" TEXT NOT NULL,
    "changeType" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "previousBalance" DOUBLE PRECISION NOT NULL,
    "newBalance" DOUBLE PRECISION NOT NULL,
    "actorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leave_balance_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_requests" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "applicantType" "LeaveApplicantType" NOT NULL,
    "studentId" TEXT,
    "enrollmentId" TEXT,
    "employeeId" TEXT,
    "leaveCategoryId" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "startFraction" "LeaveDayFraction" NOT NULL DEFAULT 'full_day',
    "endFraction" "LeaveDayFraction" NOT NULL DEFAULT 'full_day',
    "reason" TEXT NOT NULL,
    "status" "LeaveRequestStatus" NOT NULL DEFAULT 'draft',
    "calculatedDays" DOUBLE PRECISION,
    "supportingDocumentUrl" TEXT,
    "submittedById" TEXT,
    "submittedAt" TIMESTAMP(3),
    "withdrawnAt" TIMESTAMP(3),
    "withdrawnReason" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_approvals" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "leaveRequestId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "approverRole" TEXT NOT NULL,
    "approverId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "remarks" TEXT,
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_cancellations" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "leaveRequestId" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "approverId" TEXT,
    "approverRemarks" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_cancellations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_audit_logs" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "leaveRequestId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actorId" TEXT,
    "actorName" TEXT,
    "actorRole" TEXT,
    "changes" JSONB,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leave_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_notifications" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "leaveRequestId" TEXT NOT NULL,
    "sentToId" TEXT,
    "type" TEXT NOT NULL,
    "message" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_leave_loss_of_pay" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "leaveRequestId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "payrollBatchId" TEXT,
    "days" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consumedAt" TIMESTAMP(3),

    CONSTRAINT "employee_leave_loss_of_pay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_leave_configurations" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "workingDays" "DayOfWeek"[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']::"DayOfWeek"[],
    "allowSaturdayHalfDay" BOOLEAN NOT NULL DEFAULT false,
    "allowLeaveWithoutApproval" BOOLEAN NOT NULL DEFAULT false,
    "lowBalanceAlertThreshold" DOUBLE PRECISION,
    "enableLowBalanceAlert" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_leave_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "id_sequence_patterns" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "academicYearId" TEXT,
    "entityType" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "currentSeq" INTEGER NOT NULL DEFAULT 0,
    "seqLength" INTEGER NOT NULL DEFAULT 4,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "id_sequence_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "id_sequence_logs" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "patternId" TEXT NOT NULL,
    "generatedValue" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "id_sequence_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_domain_key" ON "tenants"("domain");

-- CreateIndex
CREATE INDEX "users_tenantId_idx" ON "users"("tenantId");

-- CreateIndex
CREATE INDEX "users_tenantId_status_idx" ON "users"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "users_tenantId_email_key" ON "users"("tenantId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_userType_key" ON "users"("email", "userType");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_tenantId_key" ON "users"("id", "tenantId");

-- CreateIndex
CREATE INDEX "roles_tenantId_idx" ON "roles"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "roles_id_tenantId_key" ON "roles"("id", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "roles_tenantId_roleName_key" ON "roles"("tenantId", "roleName");

-- CreateIndex
CREATE INDEX "courses_tenantId_idx" ON "courses"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "courses_id_tenantId_key" ON "courses"("id", "tenantId");

-- CreateIndex
CREATE INDEX "grades_tenantId_idx" ON "grades"("tenantId");

-- CreateIndex
CREATE INDEX "grades_tenantId_courseId_idx" ON "grades"("tenantId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "grades_id_tenantId_key" ON "grades"("id", "tenantId");

-- CreateIndex
CREATE INDEX "sections_tenantId_idx" ON "sections"("tenantId");

-- CreateIndex
CREATE INDEX "sections_tenantId_gradeId_idx" ON "sections"("tenantId", "gradeId");

-- CreateIndex
CREATE INDEX "sections_tenantId_structureId_idx" ON "sections"("tenantId", "structureId");

-- CreateIndex
CREATE INDEX "sections_tenantId_roomId_idx" ON "sections"("tenantId", "roomId");

-- CreateIndex
CREATE UNIQUE INDEX "sections_id_tenantId_key" ON "sections"("id", "tenantId");

-- CreateIndex
CREATE INDEX "subjects_tenantId_idx" ON "subjects"("tenantId");

-- CreateIndex
CREATE INDEX "subjects_tenantId_courseId_idx" ON "subjects"("tenantId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_id_tenantId_key" ON "subjects"("id", "tenantId");

-- CreateIndex
CREATE INDEX "section_subjects_tenantId_idx" ON "section_subjects"("tenantId");

-- CreateIndex
CREATE INDEX "section_subjects_tenantId_sectionId_idx" ON "section_subjects"("tenantId", "sectionId");

-- CreateIndex
CREATE INDEX "section_subjects_tenantId_subjectId_idx" ON "section_subjects"("tenantId", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "section_subjects_tenantId_sectionId_subjectId_key" ON "section_subjects"("tenantId", "sectionId", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "section_subjects_id_tenantId_key" ON "section_subjects"("id", "tenantId");

-- CreateIndex
CREATE INDEX "academic_years_tenantId_status_idx" ON "academic_years"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "academic_years_tenantId_name_key" ON "academic_years"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "academic_years_id_tenantId_key" ON "academic_years"("id", "tenantId");

-- CreateIndex
CREATE INDEX "student_enrollments_tenantId_academicYearId_idx" ON "student_enrollments"("tenantId", "academicYearId");

-- CreateIndex
CREATE INDEX "student_enrollments_tenantId_gradeId_idx" ON "student_enrollments"("tenantId", "gradeId");

-- CreateIndex
CREATE INDEX "student_enrollments_tenantId_sectionId_idx" ON "student_enrollments"("tenantId", "sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "student_enrollments_tenantId_studentId_academicYearId_key" ON "student_enrollments"("tenantId", "studentId", "academicYearId");

-- CreateIndex
CREATE UNIQUE INDEX "student_enrollments_id_tenantId_key" ON "student_enrollments"("id", "tenantId");

-- CreateIndex
CREATE INDEX "student_enrollment_electives_tenantId_enrollmentId_idx" ON "student_enrollment_electives"("tenantId", "enrollmentId");

-- CreateIndex
CREATE INDEX "student_enrollment_electives_tenantId_sectionSubjectId_idx" ON "student_enrollment_electives"("tenantId", "sectionSubjectId");

-- CreateIndex
CREATE UNIQUE INDEX "student_enrollment_electives_tenantId_enrollmentId_sectionS_key" ON "student_enrollment_electives"("tenantId", "enrollmentId", "sectionSubjectId");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_userId_key" ON "teachers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_registrationToken_key" ON "teachers"("registrationToken");

-- CreateIndex
CREATE INDEX "teachers_tenantId_idx" ON "teachers"("tenantId");

-- CreateIndex
CREATE INDEX "teachers_tenantId_status_idx" ON "teachers"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_userId_tenantId_key" ON "teachers"("userId", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_tenantId_employeeCode_key" ON "teachers"("tenantId", "employeeCode");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_id_tenantId_key" ON "teachers"("id", "tenantId");

-- CreateIndex
CREATE INDEX "teacher_qualifications_tenantId_idx" ON "teacher_qualifications"("tenantId");

-- CreateIndex
CREATE INDEX "teacher_qualifications_tenantId_teacherId_idx" ON "teacher_qualifications"("tenantId", "teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_qualifications_id_tenantId_key" ON "teacher_qualifications"("id", "tenantId");

-- CreateIndex
CREATE INDEX "teacher_employment_history_tenantId_idx" ON "teacher_employment_history"("tenantId");

-- CreateIndex
CREATE INDEX "teacher_employment_history_tenantId_teacherId_idx" ON "teacher_employment_history"("tenantId", "teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_employment_history_id_tenantId_key" ON "teacher_employment_history"("id", "tenantId");

-- CreateIndex
CREATE INDEX "teacher_assignments_tenantId_academicYearId_idx" ON "teacher_assignments"("tenantId", "academicYearId");

-- CreateIndex
CREATE INDEX "teacher_assignments_tenantId_teacherId_idx" ON "teacher_assignments"("tenantId", "teacherId");

-- CreateIndex
CREATE INDEX "teacher_assignments_tenantId_sectionSubjectId_idx" ON "teacher_assignments"("tenantId", "sectionSubjectId");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_assignments_tenantId_academicYearId_teacherId_secti_key" ON "teacher_assignments"("tenantId", "academicYearId", "teacherId", "sectionSubjectId");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_assignments_id_tenantId_key" ON "teacher_assignments"("id", "tenantId");

-- CreateIndex
CREATE INDEX "teacher_capabilities_tenantId_teacherId_idx" ON "teacher_capabilities"("tenantId", "teacherId");

-- CreateIndex
CREATE INDEX "teacher_capabilities_tenantId_subjectId_idx" ON "teacher_capabilities"("tenantId", "subjectId");

-- CreateIndex
CREATE INDEX "teacher_capabilities_tenantId_courseId_idx" ON "teacher_capabilities"("tenantId", "courseId");

-- CreateIndex
CREATE INDEX "teacher_capabilities_tenantId_gradeId_idx" ON "teacher_capabilities"("tenantId", "gradeId");

-- CreateIndex
CREATE INDEX "teacher_capabilities_tenantId_sectionId_idx" ON "teacher_capabilities"("tenantId", "sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_capabilities_id_tenantId_key" ON "teacher_capabilities"("id", "tenantId");

-- CreateIndex
CREATE INDEX "teacher_availability_tenantId_teacherId_idx" ON "teacher_availability"("tenantId", "teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_availability_tenantId_teacherId_dayOfWeek_startTime_key" ON "teacher_availability"("tenantId", "teacherId", "dayOfWeek", "startTime", "endTime");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_availability_id_tenantId_key" ON "teacher_availability"("id", "tenantId");

-- CreateIndex
CREATE INDEX "timetable_structures_tenantId_idx" ON "timetable_structures"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "timetable_structures_tenantId_name_key" ON "timetable_structures"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "timetable_structures_id_tenantId_key" ON "timetable_structures"("id", "tenantId");

-- CreateIndex
CREATE INDEX "timetable_periods_tenantId_idx" ON "timetable_periods"("tenantId");

-- CreateIndex
CREATE INDEX "timetable_periods_tenantId_structureId_idx" ON "timetable_periods"("tenantId", "structureId");

-- CreateIndex
CREATE UNIQUE INDEX "timetable_periods_tenantId_structureId_name_key" ON "timetable_periods"("tenantId", "structureId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "timetable_periods_id_tenantId_key" ON "timetable_periods"("id", "tenantId");

-- CreateIndex
CREATE INDEX "timetable_entries_tenantId_academicYearId_idx" ON "timetable_entries"("tenantId", "academicYearId");

-- CreateIndex
CREATE INDEX "timetable_entries_tenantId_sectionSubjectId_idx" ON "timetable_entries"("tenantId", "sectionSubjectId");

-- CreateIndex
CREATE INDEX "timetable_entries_tenantId_periodId_idx" ON "timetable_entries"("tenantId", "periodId");

-- CreateIndex
CREATE UNIQUE INDEX "timetable_entries_id_tenantId_key" ON "timetable_entries"("id", "tenantId");

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

-- CreateIndex
CREATE INDEX "attendance_types_tenantId_idx" ON "attendance_types"("tenantId");

-- CreateIndex
CREATE INDEX "attendance_types_tenantId_category_idx" ON "attendance_types"("tenantId", "category");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_types_tenantId_name_key" ON "attendance_types"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_types_id_tenantId_key" ON "attendance_types"("id", "tenantId");

-- CreateIndex
CREATE INDEX "attendance_sessions_tenantId_sectionId_date_idx" ON "attendance_sessions"("tenantId", "sectionId", "date");

-- CreateIndex
CREATE INDEX "attendance_sessions_tenantId_academicYearId_idx" ON "attendance_sessions"("tenantId", "academicYearId");

-- CreateIndex
CREATE INDEX "attendance_sessions_tenantId_attendanceTypeId_idx" ON "attendance_sessions"("tenantId", "attendanceTypeId");

-- CreateIndex
CREATE INDEX "attendance_sessions_tenantId_takenById_idx" ON "attendance_sessions"("tenantId", "takenById");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_sessions_tenantId_sectionId_date_attendanceTypeI_key" ON "attendance_sessions"("tenantId", "sectionId", "date", "attendanceTypeId", "periodId");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_sessions_id_tenantId_key" ON "attendance_sessions"("id", "tenantId");

-- CreateIndex
CREATE INDEX "attendance_marks_tenantId_enrollmentId_idx" ON "attendance_marks"("tenantId", "enrollmentId");

-- CreateIndex
CREATE INDEX "attendance_marks_tenantId_sessionId_idx" ON "attendance_marks"("tenantId", "sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_marks_tenantId_sessionId_enrollmentId_key" ON "attendance_marks"("tenantId", "sessionId", "enrollmentId");

-- CreateIndex
CREATE INDEX "staff_attendance_tenantId_date_idx" ON "staff_attendance"("tenantId", "date");

-- CreateIndex
CREATE INDEX "staff_attendance_tenantId_teacherId_idx" ON "staff_attendance"("tenantId", "teacherId");

-- CreateIndex
CREATE INDEX "staff_attendance_tenantId_date_status_idx" ON "staff_attendance"("tenantId", "date", "status");

-- CreateIndex
CREATE UNIQUE INDEX "staff_attendance_tenantId_teacherId_date_key" ON "staff_attendance"("tenantId", "teacherId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "staff_attendance_id_tenantId_key" ON "staff_attendance"("id", "tenantId");

-- CreateIndex
CREATE INDEX "staff_attendance_sessions_tenantId_attendanceId_idx" ON "staff_attendance_sessions"("tenantId", "attendanceId");

-- CreateIndex
CREATE UNIQUE INDEX "staff_attendance_sessions_id_tenantId_key" ON "staff_attendance_sessions"("id", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "parents_userId_key" ON "parents"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "parents_registrationToken_key" ON "parents"("registrationToken");

-- CreateIndex
CREATE INDEX "parents_tenantId_idx" ON "parents"("tenantId");

-- CreateIndex
CREATE INDEX "parents_tenantId_phone_idx" ON "parents"("tenantId", "phone");

-- CreateIndex
CREATE INDEX "parents_tenantId_email_idx" ON "parents"("tenantId", "email");

-- CreateIndex
CREATE INDEX "parents_tenantId_status_idx" ON "parents"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "parents_userId_tenantId_key" ON "parents"("userId", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "parents_id_tenantId_key" ON "parents"("id", "tenantId");

-- CreateIndex
CREATE INDEX "student_parents_tenantId_studentId_idx" ON "student_parents"("tenantId", "studentId");

-- CreateIndex
CREATE INDEX "student_parents_tenantId_parentId_idx" ON "student_parents"("tenantId", "parentId");

-- CreateIndex
CREATE UNIQUE INDEX "student_parents_tenantId_studentId_parentId_key" ON "student_parents"("tenantId", "studentId", "parentId");

-- CreateIndex
CREATE INDEX "exams_tenantId_academicYearId_idx" ON "exams"("tenantId", "academicYearId");

-- CreateIndex
CREATE INDEX "exams_tenantId_status_idx" ON "exams"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "exams_tenantId_academicYearId_name_key" ON "exams"("tenantId", "academicYearId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "exams_id_tenantId_key" ON "exams"("id", "tenantId");

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

-- CreateIndex
CREATE INDEX "exam_marks_tenantId_enrollmentId_idx" ON "exam_marks"("tenantId", "enrollmentId");

-- CreateIndex
CREATE INDEX "exam_marks_tenantId_examPaperId_idx" ON "exam_marks"("tenantId", "examPaperId");

-- CreateIndex
CREATE UNIQUE INDEX "exam_marks_tenantId_examPaperId_enrollmentId_key" ON "exam_marks"("tenantId", "examPaperId", "enrollmentId");

-- CreateIndex
CREATE INDEX "grading_scales_tenantId_idx" ON "grading_scales"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "grading_scales_tenantId_name_key" ON "grading_scales"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "grading_scales_id_tenantId_key" ON "grading_scales"("id", "tenantId");

-- CreateIndex
CREATE INDEX "grading_bands_tenantId_scaleId_idx" ON "grading_bands"("tenantId", "scaleId");

-- CreateIndex
CREATE UNIQUE INDEX "grading_bands_tenantId_scaleId_grade_key" ON "grading_bands"("tenantId", "scaleId", "grade");

-- CreateIndex
CREATE INDEX "holiday_categories_tenantId_idx" ON "holiday_categories"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "holiday_categories_tenantId_name_key" ON "holiday_categories"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "holiday_categories_id_tenantId_key" ON "holiday_categories"("id", "tenantId");

-- CreateIndex
CREATE INDEX "holidays_tenantId_date_idx" ON "holidays"("tenantId", "date");

-- CreateIndex
CREATE INDEX "holidays_tenantId_academicYearId_idx" ON "holidays"("tenantId", "academicYearId");

-- CreateIndex
CREATE INDEX "holidays_tenantId_categoryId_idx" ON "holidays"("tenantId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "holidays_tenantId_date_name_key" ON "holidays"("tenantId", "date", "name");

-- CreateIndex
CREATE UNIQUE INDEX "holidays_id_tenantId_key" ON "holidays"("id", "tenantId");

-- CreateIndex
CREATE INDEX "tenant_holiday_rules_tenantId_idx" ON "tenant_holiday_rules"("tenantId");

-- CreateIndex
CREATE INDEX "tenant_holiday_rules_tenantId_academicYearId_idx" ON "tenant_holiday_rules"("tenantId", "academicYearId");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_holiday_rules_id_tenantId_key" ON "tenant_holiday_rules"("id", "tenantId");

-- CreateIndex
CREATE INDEX "students_tenantId_idx" ON "students"("tenantId");

-- CreateIndex
CREATE INDEX "students_tenantId_gradeId_idx" ON "students"("tenantId", "gradeId");

-- CreateIndex
CREATE INDEX "students_tenantId_sectionId_idx" ON "students"("tenantId", "sectionId");

-- CreateIndex
CREATE INDEX "students_tenantId_status_idx" ON "students"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "students_tenantId_aadhaarNumber_key" ON "students"("tenantId", "aadhaarNumber");

-- CreateIndex
CREATE UNIQUE INDEX "students_tenantId_admissionNumber_key" ON "students"("tenantId", "admissionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "students_id_tenantId_key" ON "students"("id", "tenantId");

-- CreateIndex
CREATE INDEX "inventory_categories_tenantId_idx" ON "inventory_categories"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_categories_id_tenantId_key" ON "inventory_categories"("id", "tenantId");

-- CreateIndex
CREATE INDEX "inventory_items_tenantId_idx" ON "inventory_items"("tenantId");

-- CreateIndex
CREATE INDEX "inventory_items_tenantId_categoryId_idx" ON "inventory_items"("tenantId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_items_id_tenantId_key" ON "inventory_items"("id", "tenantId");

-- CreateIndex
CREATE INDEX "stock_adjustments_tenantId_idx" ON "stock_adjustments"("tenantId");

-- CreateIndex
CREATE INDEX "stock_adjustments_tenantId_itemId_idx" ON "stock_adjustments"("tenantId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "token_blacklist_token_key" ON "token_blacklist"("token");

-- CreateIndex
CREATE INDEX "uploads_tenantId_idx" ON "uploads"("tenantId");

-- CreateIndex
CREATE INDEX "uploads_tenantId_entityType_idx" ON "uploads"("tenantId", "entityType");

-- CreateIndex
CREATE INDEX "uploads_tenantId_entityId_idx" ON "uploads"("tenantId", "entityId");

-- CreateIndex
CREATE INDEX "uploads_tenantId_entityType_entityId_idx" ON "uploads"("tenantId", "entityType", "entityId");

-- CreateIndex
CREATE INDEX "fee_heads_tenantId_idx" ON "fee_heads"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "fee_heads_tenantId_name_key" ON "fee_heads"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "fee_heads_id_tenantId_key" ON "fee_heads"("id", "tenantId");

-- CreateIndex
CREATE INDEX "section_fees_tenantId_sectionId_idx" ON "section_fees"("tenantId", "sectionId");

-- CreateIndex
CREATE INDEX "section_fees_tenantId_academicYearId_idx" ON "section_fees"("tenantId", "academicYearId");

-- CreateIndex
CREATE UNIQUE INDEX "section_fees_tenantId_sectionId_academicYearId_key" ON "section_fees"("tenantId", "sectionId", "academicYearId");

-- CreateIndex
CREATE UNIQUE INDEX "section_fees_id_tenantId_key" ON "section_fees"("id", "tenantId");

-- CreateIndex
CREATE INDEX "section_fee_heads_tenantId_sectionFeeId_idx" ON "section_fee_heads"("tenantId", "sectionFeeId");

-- CreateIndex
CREATE INDEX "section_fee_heads_tenantId_feeHeadId_idx" ON "section_fee_heads"("tenantId", "feeHeadId");

-- CreateIndex
CREATE UNIQUE INDEX "section_fee_heads_tenantId_sectionFeeId_feeHeadId_key" ON "section_fee_heads"("tenantId", "sectionFeeId", "feeHeadId");

-- CreateIndex
CREATE UNIQUE INDEX "section_fee_heads_id_tenantId_key" ON "section_fee_heads"("id", "tenantId");

-- CreateIndex
CREATE INDEX "fee_terms_tenantId_sectionFeeId_idx" ON "fee_terms"("tenantId", "sectionFeeId");

-- CreateIndex
CREATE UNIQUE INDEX "fee_terms_tenantId_sectionFeeId_name_key" ON "fee_terms"("tenantId", "sectionFeeId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "fee_terms_id_tenantId_key" ON "fee_terms"("id", "tenantId");

-- CreateIndex
CREATE INDEX "student_fees_tenantId_enrollmentId_idx" ON "student_fees"("tenantId", "enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "student_fees_enrollmentId_tenantId_key" ON "student_fees"("enrollmentId", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "student_fees_id_tenantId_key" ON "student_fees"("id", "tenantId");

-- CreateIndex
CREATE INDEX "student_fee_heads_tenantId_studentFeeId_idx" ON "student_fee_heads"("tenantId", "studentFeeId");

-- CreateIndex
CREATE INDEX "student_fee_heads_tenantId_feeHeadId_idx" ON "student_fee_heads"("tenantId", "feeHeadId");

-- CreateIndex
CREATE UNIQUE INDEX "student_fee_heads_tenantId_studentFeeId_feeHeadId_key" ON "student_fee_heads"("tenantId", "studentFeeId", "feeHeadId");

-- CreateIndex
CREATE UNIQUE INDEX "student_fee_heads_id_tenantId_key" ON "student_fee_heads"("id", "tenantId");

-- CreateIndex
CREATE INDEX "fee_payments_tenantId_studentFeeId_idx" ON "fee_payments"("tenantId", "studentFeeId");

-- CreateIndex
CREATE INDEX "fee_payments_tenantId_termId_idx" ON "fee_payments"("tenantId", "termId");

-- CreateIndex
CREATE INDEX "fee_payments_tenantId_paymentDate_idx" ON "fee_payments"("tenantId", "paymentDate");

-- CreateIndex
CREATE INDEX "fee_payments_tenantId_collectedById_idx" ON "fee_payments"("tenantId", "collectedById");

-- CreateIndex
CREATE UNIQUE INDEX "fee_payments_id_tenantId_key" ON "fee_payments"("id", "tenantId");

-- CreateIndex
CREATE INDEX "fee_refunds_tenantId_paymentId_idx" ON "fee_refunds"("tenantId", "paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "fee_refunds_id_tenantId_key" ON "fee_refunds"("id", "tenantId");

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

-- CreateIndex
CREATE INDEX "store_dues_tenantId_orderId_idx" ON "store_dues"("tenantId", "orderId");

-- CreateIndex
CREATE INDEX "store_dues_tenantId_status_idx" ON "store_dues"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "store_dues_id_tenantId_key" ON "store_dues"("id", "tenantId");

-- CreateIndex
CREATE INDEX "store_due_payments_tenantId_dueId_idx" ON "store_due_payments"("tenantId", "dueId");

-- CreateIndex
CREATE UNIQUE INDEX "store_due_payments_id_tenantId_key" ON "store_due_payments"("id", "tenantId");

-- CreateIndex
CREATE INDEX "store_returns_tenantId_orderItemId_idx" ON "store_returns"("tenantId", "orderItemId");

-- CreateIndex
CREATE UNIQUE INDEX "store_returns_id_tenantId_key" ON "store_returns"("id", "tenantId");

-- CreateIndex
CREATE INDEX "salary_components_tenantId_idx" ON "salary_components"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "salary_components_tenantId_name_key" ON "salary_components"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "salary_components_id_tenantId_key" ON "salary_components"("id", "tenantId");

-- CreateIndex
CREATE INDEX "employee_compensations_tenantId_employeeId_idx" ON "employee_compensations"("tenantId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "employee_compensations_employeeId_tenantId_key" ON "employee_compensations"("employeeId", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "employee_compensations_id_tenantId_key" ON "employee_compensations"("id", "tenantId");

-- CreateIndex
CREATE INDEX "compensation_components_tenantId_compensationId_idx" ON "compensation_components"("tenantId", "compensationId");

-- CreateIndex
CREATE UNIQUE INDEX "compensation_components_tenantId_compensationId_salaryCompo_key" ON "compensation_components"("tenantId", "compensationId", "salaryComponentId");

-- CreateIndex
CREATE UNIQUE INDEX "compensation_components_id_tenantId_key" ON "compensation_components"("id", "tenantId");

-- CreateIndex
CREATE INDEX "compensation_history_tenantId_employeeId_idx" ON "compensation_history"("tenantId", "employeeId");

-- CreateIndex
CREATE INDEX "compensation_history_tenantId_changedAt_idx" ON "compensation_history"("tenantId", "changedAt");

-- CreateIndex
CREATE UNIQUE INDEX "compensation_history_id_tenantId_key" ON "compensation_history"("id", "tenantId");

-- CreateIndex
CREATE INDEX "payroll_batches_tenantId_month_year_idx" ON "payroll_batches"("tenantId", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_batches_tenantId_month_year_key" ON "payroll_batches"("tenantId", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_batches_id_tenantId_key" ON "payroll_batches"("id", "tenantId");

-- CreateIndex
CREATE INDEX "payroll_records_tenantId_batchId_idx" ON "payroll_records"("tenantId", "batchId");

-- CreateIndex
CREATE INDEX "payroll_records_tenantId_employeeId_idx" ON "payroll_records"("tenantId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_records_tenantId_batchId_employeeId_key" ON "payroll_records"("tenantId", "batchId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_records_id_tenantId_key" ON "payroll_records"("id", "tenantId");

-- CreateIndex
CREATE INDEX "account_categories_tenantId_idx" ON "account_categories"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "account_categories_id_tenantId_key" ON "account_categories"("id", "tenantId");

-- CreateIndex
CREATE INDEX "account_transactions_tenantId_categoryId_idx" ON "account_transactions"("tenantId", "categoryId");

-- CreateIndex
CREATE INDEX "account_transactions_tenantId_transactionDate_idx" ON "account_transactions"("tenantId", "transactionDate");

-- CreateIndex
CREATE INDEX "account_transactions_tenantId_referenceType_referenceId_idx" ON "account_transactions"("tenantId", "referenceType", "referenceId");

-- CreateIndex
CREATE INDEX "account_transactions_tenantId_partyType_partyId_idx" ON "account_transactions"("tenantId", "partyType", "partyId");

-- CreateIndex
CREATE UNIQUE INDEX "account_transactions_id_tenantId_key" ON "account_transactions"("id", "tenantId");

-- CreateIndex
CREATE INDEX "visitor_purposes_tenantId_idx" ON "visitor_purposes"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "visitor_purposes_tenantId_name_key" ON "visitor_purposes"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "visitor_purposes_id_tenantId_key" ON "visitor_purposes"("id", "tenantId");

-- CreateIndex
CREATE INDEX "visitors_tenantId_visitorType_idx" ON "visitors"("tenantId", "visitorType");

-- CreateIndex
CREATE INDEX "visitors_tenantId_parentId_idx" ON "visitors"("tenantId", "parentId");

-- CreateIndex
CREATE INDEX "visitors_tenantId_purposeId_idx" ON "visitors"("tenantId", "purposeId");

-- CreateIndex
CREATE INDEX "visitors_tenantId_pointOfContactId_idx" ON "visitors"("tenantId", "pointOfContactId");

-- CreateIndex
CREATE INDEX "visitors_tenantId_approvalStatus_idx" ON "visitors"("tenantId", "approvalStatus");

-- CreateIndex
CREATE INDEX "visitors_tenantId_status_idx" ON "visitors"("tenantId", "status");

-- CreateIndex
CREATE INDEX "visitors_tenantId_createdAt_idx" ON "visitors"("tenantId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "visitors_id_tenantId_key" ON "visitors"("id", "tenantId");

-- CreateIndex
CREATE INDEX "visitor_notifications_tenantId_visitorId_idx" ON "visitor_notifications"("tenantId", "visitorId");

-- CreateIndex
CREATE INDEX "visitor_notifications_tenantId_sentToId_idx" ON "visitor_notifications"("tenantId", "sentToId");

-- CreateIndex
CREATE INDEX "visitor_notifications_tenantId_isRead_idx" ON "visitor_notifications"("tenantId", "isRead");

-- CreateIndex
CREATE UNIQUE INDEX "visitor_notifications_id_tenantId_key" ON "visitor_notifications"("id", "tenantId");

-- CreateIndex
CREATE INDEX "leave_categories_tenantId_idx" ON "leave_categories"("tenantId");

-- CreateIndex
CREATE INDEX "leave_categories_tenantId_applicantType_idx" ON "leave_categories"("tenantId", "applicantType");

-- CreateIndex
CREATE UNIQUE INDEX "leave_categories_tenantId_name_applicantType_key" ON "leave_categories"("tenantId", "name", "applicantType");

-- CreateIndex
CREATE UNIQUE INDEX "leave_categories_id_tenantId_key" ON "leave_categories"("id", "tenantId");

-- CreateIndex
CREATE INDEX "employee_leave_balances_tenantId_employeeId_idx" ON "employee_leave_balances"("tenantId", "employeeId");

-- CreateIndex
CREATE INDEX "employee_leave_balances_tenantId_leaveCategoryId_idx" ON "employee_leave_balances"("tenantId", "leaveCategoryId");

-- CreateIndex
CREATE INDEX "employee_leave_balances_tenantId_academicYearId_idx" ON "employee_leave_balances"("tenantId", "academicYearId");

-- CreateIndex
CREATE UNIQUE INDEX "employee_leave_balances_tenantId_employeeId_leaveCategoryId_key" ON "employee_leave_balances"("tenantId", "employeeId", "leaveCategoryId", "academicYearId");

-- CreateIndex
CREATE UNIQUE INDEX "employee_leave_balances_id_tenantId_key" ON "employee_leave_balances"("id", "tenantId");

-- CreateIndex
CREATE INDEX "leave_balance_transactions_tenantId_balanceId_idx" ON "leave_balance_transactions"("tenantId", "balanceId");

-- CreateIndex
CREATE INDEX "leave_balance_transactions_tenantId_createdAt_idx" ON "leave_balance_transactions"("tenantId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "leave_balance_transactions_id_tenantId_key" ON "leave_balance_transactions"("id", "tenantId");

-- CreateIndex
CREATE INDEX "leave_requests_tenantId_studentId_idx" ON "leave_requests"("tenantId", "studentId");

-- CreateIndex
CREATE INDEX "leave_requests_tenantId_employeeId_idx" ON "leave_requests"("tenantId", "employeeId");

-- CreateIndex
CREATE INDEX "leave_requests_tenantId_status_idx" ON "leave_requests"("tenantId", "status");

-- CreateIndex
CREATE INDEX "leave_requests_tenantId_leaveCategoryId_idx" ON "leave_requests"("tenantId", "leaveCategoryId");

-- CreateIndex
CREATE INDEX "leave_requests_tenantId_startDate_idx" ON "leave_requests"("tenantId", "startDate");

-- CreateIndex
CREATE INDEX "leave_requests_tenantId_endDate_idx" ON "leave_requests"("tenantId", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "leave_requests_id_tenantId_key" ON "leave_requests"("id", "tenantId");

-- CreateIndex
CREATE INDEX "leave_approvals_tenantId_leaveRequestId_idx" ON "leave_approvals"("tenantId", "leaveRequestId");

-- CreateIndex
CREATE INDEX "leave_approvals_tenantId_approverId_idx" ON "leave_approvals"("tenantId", "approverId");

-- CreateIndex
CREATE INDEX "leave_approvals_tenantId_status_idx" ON "leave_approvals"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "leave_approvals_id_tenantId_key" ON "leave_approvals"("id", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "leave_approvals_tenantId_leaveRequestId_level_key" ON "leave_approvals"("tenantId", "leaveRequestId", "level");

-- CreateIndex
CREATE INDEX "leave_cancellations_tenantId_leaveRequestId_idx" ON "leave_cancellations"("tenantId", "leaveRequestId");

-- CreateIndex
CREATE INDEX "leave_cancellations_tenantId_status_idx" ON "leave_cancellations"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "leave_cancellations_id_tenantId_key" ON "leave_cancellations"("id", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "leave_cancellations_tenantId_leaveRequestId_key" ON "leave_cancellations"("tenantId", "leaveRequestId");

-- CreateIndex
CREATE INDEX "leave_audit_logs_tenantId_leaveRequestId_idx" ON "leave_audit_logs"("tenantId", "leaveRequestId");

-- CreateIndex
CREATE INDEX "leave_audit_logs_tenantId_createdAt_idx" ON "leave_audit_logs"("tenantId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "leave_audit_logs_id_tenantId_key" ON "leave_audit_logs"("id", "tenantId");

-- CreateIndex
CREATE INDEX "leave_notifications_tenantId_leaveRequestId_idx" ON "leave_notifications"("tenantId", "leaveRequestId");

-- CreateIndex
CREATE INDEX "leave_notifications_tenantId_sentToId_idx" ON "leave_notifications"("tenantId", "sentToId");

-- CreateIndex
CREATE INDEX "leave_notifications_tenantId_isRead_idx" ON "leave_notifications"("tenantId", "isRead");

-- CreateIndex
CREATE UNIQUE INDEX "leave_notifications_id_tenantId_key" ON "leave_notifications"("id", "tenantId");

-- CreateIndex
CREATE INDEX "employee_leave_loss_of_pay_tenantId_employeeId_idx" ON "employee_leave_loss_of_pay"("tenantId", "employeeId");

-- CreateIndex
CREATE INDEX "employee_leave_loss_of_pay_tenantId_status_idx" ON "employee_leave_loss_of_pay"("tenantId", "status");

-- CreateIndex
CREATE INDEX "employee_leave_loss_of_pay_tenantId_payrollBatchId_idx" ON "employee_leave_loss_of_pay"("tenantId", "payrollBatchId");

-- CreateIndex
CREATE UNIQUE INDEX "employee_leave_loss_of_pay_id_tenantId_key" ON "employee_leave_loss_of_pay"("id", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "employee_leave_loss_of_pay_tenantId_leaveRequestId_key" ON "employee_leave_loss_of_pay"("tenantId", "leaveRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_leave_configurations_tenantId_key" ON "tenant_leave_configurations"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_leave_configurations_id_tenantId_key" ON "tenant_leave_configurations"("id", "tenantId");

-- CreateIndex
CREATE INDEX "id_sequence_patterns_tenantId_idx" ON "id_sequence_patterns"("tenantId");

-- CreateIndex
CREATE INDEX "id_sequence_patterns_tenantId_entityType_idx" ON "id_sequence_patterns"("tenantId", "entityType");

-- CreateIndex
CREATE UNIQUE INDEX "id_sequence_patterns_tenantId_entityType_academicYearId_key" ON "id_sequence_patterns"("tenantId", "entityType", "academicYearId");

-- CreateIndex
CREATE UNIQUE INDEX "id_sequence_patterns_id_tenantId_key" ON "id_sequence_patterns"("id", "tenantId");

-- CreateIndex
CREATE INDEX "id_sequence_logs_tenantId_entityType_idx" ON "id_sequence_logs"("tenantId", "entityType");

-- CreateIndex
CREATE INDEX "id_sequence_logs_tenantId_entityId_idx" ON "id_sequence_logs"("tenantId", "entityId");

-- CreateIndex
CREATE INDEX "id_sequence_logs_tenantId_createdAt_idx" ON "id_sequence_logs"("tenantId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "id_sequence_logs_tenantId_generatedValue_key" ON "id_sequence_logs"("tenantId", "generatedValue");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_tenantId_fkey" FOREIGN KEY ("roleId", "tenantId") REFERENCES "roles"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_courseId_tenantId_fkey" FOREIGN KEY ("courseId", "tenantId") REFERENCES "courses"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_gradeId_tenantId_fkey" FOREIGN KEY ("gradeId", "tenantId") REFERENCES "grades"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_structureId_tenantId_fkey" FOREIGN KEY ("structureId", "tenantId") REFERENCES "timetable_structures"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_roomId_tenantId_fkey" FOREIGN KEY ("roomId", "tenantId") REFERENCES "rooms"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_sectionInChargeId_tenantId_fkey" FOREIGN KEY ("sectionInChargeId", "tenantId") REFERENCES "teachers"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_courseId_tenantId_fkey" FOREIGN KEY ("courseId", "tenantId") REFERENCES "courses"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_subjects" ADD CONSTRAINT "section_subjects_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_subjects" ADD CONSTRAINT "section_subjects_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES "sections"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_subjects" ADD CONSTRAINT "section_subjects_subjectId_tenantId_fkey" FOREIGN KEY ("subjectId", "tenantId") REFERENCES "subjects"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_years" ADD CONSTRAINT "academic_years_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_studentId_tenantId_fkey" FOREIGN KEY ("studentId", "tenantId") REFERENCES "students"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES "academic_years"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_gradeId_tenantId_fkey" FOREIGN KEY ("gradeId", "tenantId") REFERENCES "grades"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES "sections"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollment_electives" ADD CONSTRAINT "student_enrollment_electives_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollment_electives" ADD CONSTRAINT "student_enrollment_electives_enrollmentId_tenantId_fkey" FOREIGN KEY ("enrollmentId", "tenantId") REFERENCES "student_enrollments"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollment_electives" ADD CONSTRAINT "student_enrollment_electives_sectionSubjectId_tenantId_fkey" FOREIGN KEY ("sectionSubjectId", "tenantId") REFERENCES "section_subjects"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_userId_tenantId_fkey" FOREIGN KEY ("userId", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_qualifications" ADD CONSTRAINT "teacher_qualifications_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_qualifications" ADD CONSTRAINT "teacher_qualifications_teacherId_tenantId_fkey" FOREIGN KEY ("teacherId", "tenantId") REFERENCES "teachers"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_employment_history" ADD CONSTRAINT "teacher_employment_history_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_employment_history" ADD CONSTRAINT "teacher_employment_history_teacherId_tenantId_fkey" FOREIGN KEY ("teacherId", "tenantId") REFERENCES "teachers"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_assignments" ADD CONSTRAINT "teacher_assignments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_assignments" ADD CONSTRAINT "teacher_assignments_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES "academic_years"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_assignments" ADD CONSTRAINT "teacher_assignments_teacherId_tenantId_fkey" FOREIGN KEY ("teacherId", "tenantId") REFERENCES "teachers"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_assignments" ADD CONSTRAINT "teacher_assignments_sectionSubjectId_tenantId_fkey" FOREIGN KEY ("sectionSubjectId", "tenantId") REFERENCES "section_subjects"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "teacher_capabilities" ADD CONSTRAINT "teacher_capabilities_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES "sections"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_availability" ADD CONSTRAINT "teacher_availability_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_availability" ADD CONSTRAINT "teacher_availability_teacherId_tenantId_fkey" FOREIGN KEY ("teacherId", "tenantId") REFERENCES "teachers"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_structures" ADD CONSTRAINT "timetable_structures_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_periods" ADD CONSTRAINT "timetable_periods_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_periods" ADD CONSTRAINT "timetable_periods_structureId_tenantId_fkey" FOREIGN KEY ("structureId", "tenantId") REFERENCES "timetable_structures"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_entries" ADD CONSTRAINT "timetable_entries_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_entries" ADD CONSTRAINT "timetable_entries_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES "academic_years"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_entries" ADD CONSTRAINT "timetable_entries_periodId_tenantId_fkey" FOREIGN KEY ("periodId", "tenantId") REFERENCES "timetable_periods"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_entries" ADD CONSTRAINT "timetable_entries_sectionSubjectId_tenantId_fkey" FOREIGN KEY ("sectionSubjectId", "tenantId") REFERENCES "section_subjects"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_entries" ADD CONSTRAINT "timetable_entries_teacherAssignmentId_tenantId_fkey" FOREIGN KEY ("teacherAssignmentId", "tenantId") REFERENCES "teacher_assignments"("id", "tenantId") ON DELETE NO ACTION ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "attendance_types" ADD CONSTRAINT "attendance_types_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "attendance_sessions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "attendance_sessions_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES "academic_years"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "attendance_sessions_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES "sections"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "attendance_sessions_attendanceTypeId_tenantId_fkey" FOREIGN KEY ("attendanceTypeId", "tenantId") REFERENCES "attendance_types"("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "attendance_sessions_takenById_tenantId_fkey" FOREIGN KEY ("takenById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "attendance_sessions_periodId_tenantId_fkey" FOREIGN KEY ("periodId", "tenantId") REFERENCES "timetable_periods"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "attendance_sessions_sectionSubjectId_tenantId_fkey" FOREIGN KEY ("sectionSubjectId", "tenantId") REFERENCES "section_subjects"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "attendance_sessions_examScheduleId_tenantId_fkey" FOREIGN KEY ("examScheduleId", "tenantId") REFERENCES "exam_schedules"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_marks" ADD CONSTRAINT "attendance_marks_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_marks" ADD CONSTRAINT "attendance_marks_sessionId_tenantId_fkey" FOREIGN KEY ("sessionId", "tenantId") REFERENCES "attendance_sessions"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_marks" ADD CONSTRAINT "attendance_marks_enrollmentId_tenantId_fkey" FOREIGN KEY ("enrollmentId", "tenantId") REFERENCES "student_enrollments"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_attendance" ADD CONSTRAINT "staff_attendance_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_attendance" ADD CONSTRAINT "staff_attendance_teacherId_tenantId_fkey" FOREIGN KEY ("teacherId", "tenantId") REFERENCES "teachers"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_attendance_sessions" ADD CONSTRAINT "staff_attendance_sessions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_attendance_sessions" ADD CONSTRAINT "staff_attendance_sessions_attendanceId_tenantId_fkey" FOREIGN KEY ("attendanceId", "tenantId") REFERENCES "staff_attendance"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_userId_tenantId_fkey" FOREIGN KEY ("userId", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_parents" ADD CONSTRAINT "student_parents_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_parents" ADD CONSTRAINT "student_parents_studentId_tenantId_fkey" FOREIGN KEY ("studentId", "tenantId") REFERENCES "students"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_parents" ADD CONSTRAINT "student_parents_parentId_tenantId_fkey" FOREIGN KEY ("parentId", "tenantId") REFERENCES "parents"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES "academic_years"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_gradingScaleId_tenantId_fkey" FOREIGN KEY ("gradingScaleId", "tenantId") REFERENCES "grading_scales"("id", "tenantId") ON DELETE NO ACTION ON UPDATE CASCADE;

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
ALTER TABLE "exam_marks" ADD CONSTRAINT "exam_marks_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_marks" ADD CONSTRAINT "exam_marks_examPaperId_tenantId_fkey" FOREIGN KEY ("examPaperId", "tenantId") REFERENCES "exam_schedule_papers"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_marks" ADD CONSTRAINT "exam_marks_enrollmentId_tenantId_fkey" FOREIGN KEY ("enrollmentId", "tenantId") REFERENCES "student_enrollments"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grading_scales" ADD CONSTRAINT "grading_scales_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grading_bands" ADD CONSTRAINT "grading_bands_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grading_bands" ADD CONSTRAINT "grading_bands_scaleId_tenantId_fkey" FOREIGN KEY ("scaleId", "tenantId") REFERENCES "grading_scales"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holiday_categories" ADD CONSTRAINT "holiday_categories_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES "academic_years"("id", "tenantId") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_categoryId_tenantId_fkey" FOREIGN KEY ("categoryId", "tenantId") REFERENCES "holiday_categories"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_holiday_rules" ADD CONSTRAINT "tenant_holiday_rules_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_holiday_rules" ADD CONSTRAINT "tenant_holiday_rules_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES "academic_years"("id", "tenantId") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_gradeId_tenantId_fkey" FOREIGN KEY ("gradeId", "tenantId") REFERENCES "grades"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES "sections"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_categories" ADD CONSTRAINT "inventory_categories_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_categoryId_tenantId_fkey" FOREIGN KEY ("categoryId", "tenantId") REFERENCES "inventory_categories"("id", "tenantId") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_itemId_tenantId_fkey" FOREIGN KEY ("itemId", "tenantId") REFERENCES "inventory_items"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uploads" ADD CONSTRAINT "uploads_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_heads" ADD CONSTRAINT "fee_heads_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_fees" ADD CONSTRAINT "section_fees_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_fees" ADD CONSTRAINT "section_fees_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES "sections"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_fees" ADD CONSTRAINT "section_fees_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES "academic_years"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_fee_heads" ADD CONSTRAINT "section_fee_heads_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_fee_heads" ADD CONSTRAINT "section_fee_heads_sectionFeeId_tenantId_fkey" FOREIGN KEY ("sectionFeeId", "tenantId") REFERENCES "section_fees"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_fee_heads" ADD CONSTRAINT "section_fee_heads_feeHeadId_tenantId_fkey" FOREIGN KEY ("feeHeadId", "tenantId") REFERENCES "fee_heads"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_terms" ADD CONSTRAINT "fee_terms_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_terms" ADD CONSTRAINT "fee_terms_sectionFeeId_tenantId_fkey" FOREIGN KEY ("sectionFeeId", "tenantId") REFERENCES "section_fees"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fees" ADD CONSTRAINT "student_fees_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fees" ADD CONSTRAINT "student_fees_enrollmentId_tenantId_fkey" FOREIGN KEY ("enrollmentId", "tenantId") REFERENCES "student_enrollments"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fee_heads" ADD CONSTRAINT "student_fee_heads_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fee_heads" ADD CONSTRAINT "student_fee_heads_studentFeeId_tenantId_fkey" FOREIGN KEY ("studentFeeId", "tenantId") REFERENCES "student_fees"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fee_heads" ADD CONSTRAINT "student_fee_heads_feeHeadId_tenantId_fkey" FOREIGN KEY ("feeHeadId", "tenantId") REFERENCES "fee_heads"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_payments" ADD CONSTRAINT "fee_payments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_payments" ADD CONSTRAINT "fee_payments_studentFeeId_tenantId_fkey" FOREIGN KEY ("studentFeeId", "tenantId") REFERENCES "student_fees"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_payments" ADD CONSTRAINT "fee_payments_termId_tenantId_fkey" FOREIGN KEY ("termId", "tenantId") REFERENCES "fee_terms"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_payments" ADD CONSTRAINT "fee_payments_feeHeadId_tenantId_fkey" FOREIGN KEY ("feeHeadId", "tenantId") REFERENCES "fee_heads"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_payments" ADD CONSTRAINT "fee_payments_collectedById_tenantId_fkey" FOREIGN KEY ("collectedById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_refunds" ADD CONSTRAINT "fee_refunds_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_refunds" ADD CONSTRAINT "fee_refunds_paymentId_tenantId_fkey" FOREIGN KEY ("paymentId", "tenantId") REFERENCES "fee_payments"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_refunds" ADD CONSTRAINT "fee_refunds_processedById_tenantId_fkey" FOREIGN KEY ("processedById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_categories" ADD CONSTRAINT "store_categories_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_products" ADD CONSTRAINT "store_products_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_products" ADD CONSTRAINT "store_products_categoryId_tenantId_fkey" FOREIGN KEY ("categoryId", "tenantId") REFERENCES "store_categories"("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "store_orders" ADD CONSTRAINT "store_orders_enrollmentId_tenantId_fkey" FOREIGN KEY ("enrollmentId", "tenantId") REFERENCES "student_enrollments"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_orders" ADD CONSTRAINT "store_orders_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES "academic_years"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "store_pending_items" ADD CONSTRAINT "store_pending_items_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_dues" ADD CONSTRAINT "store_dues_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_dues" ADD CONSTRAINT "store_dues_orderId_tenantId_fkey" FOREIGN KEY ("orderId", "tenantId") REFERENCES "store_orders"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_dues" ADD CONSTRAINT "store_dues_enrollmentId_tenantId_fkey" FOREIGN KEY ("enrollmentId", "tenantId") REFERENCES "student_enrollments"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_dues" ADD CONSTRAINT "store_dues_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_dues" ADD CONSTRAINT "store_dues_updatedById_tenantId_fkey" FOREIGN KEY ("updatedById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_due_payments" ADD CONSTRAINT "store_due_payments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_due_payments" ADD CONSTRAINT "store_due_payments_dueId_tenantId_fkey" FOREIGN KEY ("dueId", "tenantId") REFERENCES "store_dues"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_due_payments" ADD CONSTRAINT "store_due_payments_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_returns" ADD CONSTRAINT "store_returns_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_returns" ADD CONSTRAINT "store_returns_orderItemId_tenantId_fkey" FOREIGN KEY ("orderItemId", "tenantId") REFERENCES "store_order_items"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_returns" ADD CONSTRAINT "store_returns_productId_tenantId_fkey" FOREIGN KEY ("productId", "tenantId") REFERENCES "store_products"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_returns" ADD CONSTRAINT "store_returns_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_components" ADD CONSTRAINT "salary_components_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_components" ADD CONSTRAINT "salary_components_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_components" ADD CONSTRAINT "salary_components_updatedById_tenantId_fkey" FOREIGN KEY ("updatedById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_compensations" ADD CONSTRAINT "employee_compensations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_compensations" ADD CONSTRAINT "employee_compensations_employeeId_tenantId_fkey" FOREIGN KEY ("employeeId", "tenantId") REFERENCES "teachers"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_compensations" ADD CONSTRAINT "employee_compensations_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_compensations" ADD CONSTRAINT "employee_compensations_updatedById_tenantId_fkey" FOREIGN KEY ("updatedById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compensation_components" ADD CONSTRAINT "compensation_components_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compensation_components" ADD CONSTRAINT "compensation_components_compensationId_tenantId_fkey" FOREIGN KEY ("compensationId", "tenantId") REFERENCES "employee_compensations"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compensation_components" ADD CONSTRAINT "compensation_components_salaryComponentId_tenantId_fkey" FOREIGN KEY ("salaryComponentId", "tenantId") REFERENCES "salary_components"("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compensation_history" ADD CONSTRAINT "compensation_history_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compensation_history" ADD CONSTRAINT "compensation_history_employeeId_tenantId_fkey" FOREIGN KEY ("employeeId", "tenantId") REFERENCES "teachers"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compensation_history" ADD CONSTRAINT "compensation_history_compensationId_tenantId_fkey" FOREIGN KEY ("compensationId", "tenantId") REFERENCES "employee_compensations"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compensation_history" ADD CONSTRAINT "compensation_history_changedById_tenantId_fkey" FOREIGN KEY ("changedById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_batches" ADD CONSTRAINT "payroll_batches_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_batches" ADD CONSTRAINT "payroll_batches_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_batches" ADD CONSTRAINT "payroll_batches_processedById_tenantId_fkey" FOREIGN KEY ("processedById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_records" ADD CONSTRAINT "payroll_records_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_records" ADD CONSTRAINT "payroll_records_batchId_tenantId_fkey" FOREIGN KEY ("batchId", "tenantId") REFERENCES "payroll_batches"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_records" ADD CONSTRAINT "payroll_records_employeeId_tenantId_fkey" FOREIGN KEY ("employeeId", "tenantId") REFERENCES "teachers"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_records" ADD CONSTRAINT "payroll_records_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_categories" ADD CONSTRAINT "account_categories_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_transactions" ADD CONSTRAINT "account_transactions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_transactions" ADD CONSTRAINT "account_transactions_categoryId_tenantId_fkey" FOREIGN KEY ("categoryId", "tenantId") REFERENCES "account_categories"("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_transactions" ADD CONSTRAINT "account_transactions_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_transactions" ADD CONSTRAINT "account_transactions_voidedById_tenantId_fkey" FOREIGN KEY ("voidedById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_purposes" ADD CONSTRAINT "visitor_purposes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_parentId_tenantId_fkey" FOREIGN KEY ("parentId", "tenantId") REFERENCES "parents"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_purposeId_tenantId_fkey" FOREIGN KEY ("purposeId", "tenantId") REFERENCES "visitor_purposes"("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_pointOfContactId_tenantId_fkey" FOREIGN KEY ("pointOfContactId", "tenantId") REFERENCES "teachers"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_approvedById_tenantId_fkey" FOREIGN KEY ("approvedById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_notifications" ADD CONSTRAINT "visitor_notifications_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_notifications" ADD CONSTRAINT "visitor_notifications_visitorId_tenantId_fkey" FOREIGN KEY ("visitorId", "tenantId") REFERENCES "visitors"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_notifications" ADD CONSTRAINT "visitor_notifications_sentToId_tenantId_fkey" FOREIGN KEY ("sentToId", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_categories" ADD CONSTRAINT "leave_categories_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_leave_balances" ADD CONSTRAINT "employee_leave_balances_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_leave_balances" ADD CONSTRAINT "employee_leave_balances_employeeId_tenantId_fkey" FOREIGN KEY ("employeeId", "tenantId") REFERENCES "teachers"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_leave_balances" ADD CONSTRAINT "employee_leave_balances_leaveCategoryId_tenantId_fkey" FOREIGN KEY ("leaveCategoryId", "tenantId") REFERENCES "leave_categories"("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_leave_balances" ADD CONSTRAINT "employee_leave_balances_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES "academic_years"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_balance_transactions" ADD CONSTRAINT "leave_balance_transactions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_balance_transactions" ADD CONSTRAINT "leave_balance_transactions_balanceId_tenantId_fkey" FOREIGN KEY ("balanceId", "tenantId") REFERENCES "employee_leave_balances"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_leaveCategoryId_tenantId_fkey" FOREIGN KEY ("leaveCategoryId", "tenantId") REFERENCES "leave_categories"("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_studentId_tenantId_fkey" FOREIGN KEY ("studentId", "tenantId") REFERENCES "students"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_enrollmentId_tenantId_fkey" FOREIGN KEY ("enrollmentId", "tenantId") REFERENCES "student_enrollments"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_employeeId_tenantId_fkey" FOREIGN KEY ("employeeId", "tenantId") REFERENCES "teachers"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_approvals" ADD CONSTRAINT "leave_approvals_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_approvals" ADD CONSTRAINT "leave_approvals_leaveRequestId_tenantId_fkey" FOREIGN KEY ("leaveRequestId", "tenantId") REFERENCES "leave_requests"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_cancellations" ADD CONSTRAINT "leave_cancellations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_cancellations" ADD CONSTRAINT "leave_cancellations_leaveRequestId_tenantId_fkey" FOREIGN KEY ("leaveRequestId", "tenantId") REFERENCES "leave_requests"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_audit_logs" ADD CONSTRAINT "leave_audit_logs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_audit_logs" ADD CONSTRAINT "leave_audit_logs_leaveRequestId_tenantId_fkey" FOREIGN KEY ("leaveRequestId", "tenantId") REFERENCES "leave_requests"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_notifications" ADD CONSTRAINT "leave_notifications_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_notifications" ADD CONSTRAINT "leave_notifications_leaveRequestId_tenantId_fkey" FOREIGN KEY ("leaveRequestId", "tenantId") REFERENCES "leave_requests"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_leave_loss_of_pay" ADD CONSTRAINT "employee_leave_loss_of_pay_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_leave_loss_of_pay" ADD CONSTRAINT "employee_leave_loss_of_pay_leaveRequestId_tenantId_fkey" FOREIGN KEY ("leaveRequestId", "tenantId") REFERENCES "leave_requests"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_leave_loss_of_pay" ADD CONSTRAINT "employee_leave_loss_of_pay_employeeId_tenantId_fkey" FOREIGN KEY ("employeeId", "tenantId") REFERENCES "teachers"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_leave_loss_of_pay" ADD CONSTRAINT "employee_leave_loss_of_pay_payrollBatchId_tenantId_fkey" FOREIGN KEY ("payrollBatchId", "tenantId") REFERENCES "payroll_batches"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_leave_configurations" ADD CONSTRAINT "tenant_leave_configurations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "id_sequence_patterns" ADD CONSTRAINT "id_sequence_patterns_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "id_sequence_patterns" ADD CONSTRAINT "id_sequence_patterns_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES "academic_years"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "id_sequence_logs" ADD CONSTRAINT "id_sequence_logs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "id_sequence_logs" ADD CONSTRAINT "id_sequence_logs_patternId_tenantId_fkey" FOREIGN KEY ("patternId", "tenantId") REFERENCES "id_sequence_patterns"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;
