--
-- PostgreSQL database dump
--

\restrict joD7drg6PpkPmPXHTC7M0fHnYVgsJ0cs6JH1jILpWwSRvrIKEeCH7vdTgi0e81M

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: AcademicYearStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."AcademicYearStatus" AS ENUM (
    'draft',
    'active',
    'archived'
);


--
-- Name: ApprovalFrom; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ApprovalFrom" AS ENUM (
    'headmaster',
    'point_of_contact',
    'admin'
);


--
-- Name: AttendanceContextType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."AttendanceContextType" AS ENUM (
    'regular',
    'exam',
    'event',
    'seminar',
    'sports',
    'assembly',
    'lab',
    'field_trip',
    'other'
);


--
-- Name: AttendanceStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."AttendanceStatus" AS ENUM (
    'present',
    'absent',
    'late',
    'half_day',
    'excused',
    'leave'
);


--
-- Name: CommunicationChannel; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."CommunicationChannel" AS ENUM (
    'in_app',
    'email',
    'sms',
    'push'
);


--
-- Name: CommunicationStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."CommunicationStatus" AS ENUM (
    'draft',
    'sent',
    'scheduled',
    'cancelled'
);


--
-- Name: CommunicationType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."CommunicationType" AS ENUM (
    'notification',
    'alert',
    'reminder',
    'action_required',
    'emergency'
);


--
-- Name: DayOfWeek; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."DayOfWeek" AS ENUM (
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
);


--
-- Name: DeliveryStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."DeliveryStatus" AS ENUM (
    'pending',
    'sent',
    'delivered',
    'failed',
    'viewed',
    'acknowledged'
);


--
-- Name: DiscountType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."DiscountType" AS ENUM (
    'percentage',
    'fixed'
);


--
-- Name: EmployeeType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EmployeeType" AS ENUM (
    'teacher',
    'driver',
    'clerk',
    'office_boy',
    'admin',
    'accountant',
    'security',
    'cleaner',
    'other'
);


--
-- Name: EnrollmentStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EnrollmentStatus" AS ENUM (
    'active',
    'promoted',
    'transferred',
    'left'
);


--
-- Name: EntityStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EntityStatus" AS ENUM (
    'active',
    'inactive',
    'suspended'
);


--
-- Name: ExamScheduleStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ExamScheduleStatus" AS ENUM (
    'pending',
    'scheduled',
    'completed',
    'cancelled'
);


--
-- Name: ExamStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ExamStatus" AS ENUM (
    'draft',
    'published',
    'in_progress',
    'completed',
    'cancelled',
    'locked',
    'archived'
);


--
-- Name: ExamType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ExamType" AS ENUM (
    'weekly',
    'quarterly',
    'half_yearly',
    'annually'
);


--
-- Name: ExpertiseLevel; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ExpertiseLevel" AS ENUM (
    'beginner',
    'intermediate',
    'advanced',
    'expert'
);


--
-- Name: FeeAllocationMethod; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."FeeAllocationMethod" AS ENUM (
    'equal',
    'custom'
);


--
-- Name: Gender; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Gender" AS ENUM (
    'Male',
    'Female',
    'Other'
);


--
-- Name: HolidayRuleType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."HolidayRuleType" AS ENUM (
    'all_weekday',
    'nth_weekday_of_month'
);


--
-- Name: HolidayType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."HolidayType" AS ENUM (
    'public',
    'school',
    'optional',
    'vacation'
);


--
-- Name: HostelStaffRole; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."HostelStaffRole" AS ENUM (
    'warden',
    'in_charge',
    'cook',
    'mate',
    'cleaner',
    'other'
);


--
-- Name: LeaveAllocationMethod; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."LeaveAllocationMethod" AS ENUM (
    'annual',
    'prorated',
    'accrued_monthly'
);


--
-- Name: LeaveApplicantType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."LeaveApplicantType" AS ENUM (
    'student',
    'employee'
);


--
-- Name: LeaveDayFraction; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."LeaveDayFraction" AS ENUM (
    'full_day',
    'first_half',
    'second_half'
);


--
-- Name: LeaveRequestStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."LeaveRequestStatus" AS ENUM (
    'draft',
    'pending',
    'partially_approved',
    'approved',
    'rejected',
    'withdrawn',
    'cancelled'
);


--
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'cash',
    'card',
    'bank_transfer',
    'upi',
    'cheque',
    'online',
    'other'
);


--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'paid',
    'partial',
    'pending',
    'refunded',
    'cancelled'
);


--
-- Name: PeriodType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PeriodType" AS ENUM (
    'class',
    'break',
    'lunch',
    'sports',
    'leisure',
    'study_hour'
);


--
-- Name: PublicationStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PublicationStatus" AS ENUM (
    'draft',
    'pending_approval',
    'approved',
    'rejected',
    'published',
    'expired',
    'archived',
    'withdrawn'
);


--
-- Name: PublicationType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PublicationType" AS ENUM (
    'circular',
    'announcement',
    'notice_board',
    'holiday_notice',
    'event_notice',
    'academic_notice'
);


--
-- Name: RoomCategory; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."RoomCategory" AS ENUM (
    'ac',
    'non_ac',
    'deluxe'
);


--
-- Name: RoomType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."RoomType" AS ENUM (
    'classroom',
    'laboratory',
    'library',
    'auditorium',
    'office',
    'staff_room',
    'computer_lab',
    'science_lab',
    'language_lab',
    'sports_hall',
    'art_room',
    'music_room',
    'seminar_hall',
    'conference_room',
    'other'
);


--
-- Name: SectionAttendanceMode; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."SectionAttendanceMode" AS ENUM (
    'period_wise',
    'shift_wise'
);


--
-- Name: SenderType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."SenderType" AS ENUM (
    'user',
    'system'
);


--
-- Name: SubscriptionPlan; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."SubscriptionPlan" AS ENUM (
    'free',
    'starter',
    'growth',
    'enterprise'
);


--
-- Name: TeacherRole; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TeacherRole" AS ENUM (
    'subject_teacher',
    'class_teacher',
    'assistant_teacher',
    'lab_incharge'
);


--
-- Name: TransactionType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TransactionType" AS ENUM (
    'debit',
    'credit'
);


--
-- Name: UserType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UserType" AS ENUM (
    'company',
    'tenant'
);


--
-- Name: VehicleAmenity; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."VehicleAmenity" AS ENUM (
    'ac',
    'non_ac',
    'deluxe',
    'standard'
);


--
-- Name: VehicleCategoryType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."VehicleCategoryType" AS ENUM (
    'bus',
    'van',
    'car',
    'auto'
);


--
-- Name: VisitorApprovalStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."VisitorApprovalStatus" AS ENUM (
    'pending',
    'approved',
    'rejected',
    'not_required'
);


--
-- Name: VisitorStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."VisitorStatus" AS ENUM (
    'scheduled',
    'checked_in',
    'checked_out',
    'cancelled'
);


--
-- Name: VisitorType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."VisitorType" AS ENUM (
    'registered',
    'non_registered'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: academic_years; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.academic_years (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    status public."AcademicYearStatus" DEFAULT 'draft'::public."AcademicYearStatus" NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: account_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account_categories (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    description text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: account_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account_transactions (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "categoryId" text NOT NULL,
    type public."TransactionType" NOT NULL,
    amount numeric(12,2) NOT NULL,
    description text,
    "transactionDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "partyType" text,
    "partyId" text,
    "partyName" text,
    "referenceType" text,
    "referenceId" text,
    "isVoided" boolean DEFAULT false NOT NULL,
    "voidReason" text,
    "voidedAt" timestamp(3) without time zone,
    "voidedById" text,
    "createdById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: attendance_marks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attendance_marks (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "sessionId" text NOT NULL,
    "enrollmentId" text NOT NULL,
    status public."AttendanceStatus" DEFAULT 'present'::public."AttendanceStatus" NOT NULL,
    remarks text,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: attendance_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attendance_sessions (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "academicYearId" text NOT NULL,
    "sectionId" text NOT NULL,
    "takenById" text,
    "attendanceTypeId" text NOT NULL,
    date date NOT NULL,
    "periodId" text,
    "sectionSubjectId" text,
    "examScheduleId" text,
    shift text,
    notes text,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: attendance_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attendance_types (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id text NOT NULL,
    "tenantId" text,
    "actorId" text,
    "actorEmail" text,
    action text NOT NULL,
    "targetType" text,
    "targetId" text,
    details jsonb,
    "ipAddress" text,
    level text DEFAULT 'info'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: automation_rules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.automation_rules (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    description text,
    "sourceModule" text NOT NULL,
    event text NOT NULL,
    "templateId" text NOT NULL,
    channels public."CommunicationChannel"[] DEFAULT ARRAY['in_app'::public."CommunicationChannel"],
    "isEnabled" boolean DEFAULT true NOT NULL,
    "cooldownMinutes" integer,
    "filterCriteria" jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: buildings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.buildings (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    code text,
    description text,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: channel_configurations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.channel_configurations (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    channel public."CommunicationChannel" NOT NULL,
    provider text,
    config jsonb NOT NULL,
    "isEnabled" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: communication_recipients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.communication_recipients (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "communicationId" text NOT NULL,
    "userId" text NOT NULL,
    channel public."CommunicationChannel" NOT NULL,
    "deliveryStatus" public."DeliveryStatus" DEFAULT 'pending'::public."DeliveryStatus" NOT NULL,
    "viewedAt" timestamp(3) without time zone,
    "acknowledgedAt" timestamp(3) without time zone,
    "retryCount" integer DEFAULT 0 NOT NULL,
    "lastError" text,
    "deliveredAt" timestamp(3) without time zone,
    "providerMessageId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: communications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.communications (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    type public."CommunicationType" NOT NULL,
    "senderType" public."SenderType" DEFAULT 'user'::public."SenderType" NOT NULL,
    "senderId" text,
    title text NOT NULL,
    message text NOT NULL,
    priority integer DEFAULT 0 NOT NULL,
    "actionButton" jsonb,
    "scheduledAt" timestamp(3) without time zone,
    "expiresAt" timestamp(3) without time zone,
    status public."CommunicationStatus" DEFAULT 'draft'::public."CommunicationStatus" NOT NULL,
    "targetUserIds" jsonb,
    "targetRoles" jsonb,
    "targetGroups" jsonb,
    "targetGrades" jsonb,
    "targetSections" jsonb,
    "targetEmployeeTypes" jsonb,
    "targetAudience" jsonb,
    "automationRuleId" text,
    "sourceModule" text,
    "sourceEvent" text,
    "sourceReference" jsonb,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: compensation_components; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.compensation_components (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "compensationId" text NOT NULL,
    "salaryComponentId" text NOT NULL,
    value numeric(12,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: compensation_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.compensation_history (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "employeeId" text NOT NULL,
    "compensationId" text,
    "effectiveFrom" timestamp(3) without time zone NOT NULL,
    "totalAmount" numeric(12,2) NOT NULL,
    components jsonb NOT NULL,
    "changedById" text,
    "changedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.courses (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "courseName" text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: employee_compensations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employee_compensations (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "employeeId" text NOT NULL,
    "effectiveFrom" timestamp(3) without time zone NOT NULL,
    "totalAmount" numeric(12,2) DEFAULT 0 NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: employee_leave_balances; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employee_leave_balances (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "employeeId" text NOT NULL,
    "leaveCategoryId" text NOT NULL,
    "academicYearId" text NOT NULL,
    allocated double precision DEFAULT 0 NOT NULL,
    "carriedForward" double precision DEFAULT 0 NOT NULL,
    "manualAdjustment" double precision DEFAULT 0 NOT NULL,
    used double precision DEFAULT 0 NOT NULL,
    pending double precision DEFAULT 0 NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: employee_leave_loss_of_pay; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employee_leave_loss_of_pay (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "leaveRequestId" text NOT NULL,
    "employeeId" text NOT NULL,
    "payrollBatchId" text,
    days double precision NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "consumedAt" timestamp(3) without time zone
);


--
-- Name: exam_marks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exam_marks (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "examPaperId" text NOT NULL,
    "enrollmentId" text NOT NULL,
    "marksObtained" double precision,
    "isAbsent" boolean DEFAULT false NOT NULL,
    breakup jsonb,
    remarks text,
    "gradeLabel" text,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: exam_schedule_papers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exam_schedule_papers (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "scheduleId" text NOT NULL,
    "sectionSubjectId" text NOT NULL,
    "examDate" timestamp(3) without time zone NOT NULL,
    "startTime" integer NOT NULL,
    "endTime" integer NOT NULL,
    "durationMinutes" integer,
    room text,
    "inChargeId" text,
    "maxMarks" integer NOT NULL,
    "passMarks" integer NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: exam_schedules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exam_schedules (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "examId" text,
    "sectionId" text NOT NULL,
    name text NOT NULL,
    description text,
    status public."ExamScheduleStatus" DEFAULT 'pending'::public."ExamScheduleStatus" NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: exam_target_grades; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exam_target_grades (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "examId" text NOT NULL,
    "gradeId" text NOT NULL
);


--
-- Name: exam_target_sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exam_target_sections (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "examId" text NOT NULL,
    "sectionId" text NOT NULL
);


--
-- Name: exams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exams (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "academicYearId" text NOT NULL,
    name text NOT NULL,
    description text,
    "examType" public."ExamType" NOT NULL,
    status public."ExamStatus" DEFAULT 'draft'::public."ExamStatus" NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    source text DEFAULT 'admin'::text NOT NULL,
    "gradingScaleId" text,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: fee_heads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fee_heads (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    description text,
    "isOptional" boolean DEFAULT false NOT NULL,
    "hostelRoomTypeId" text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: fee_payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fee_payments (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "studentFeeId" text NOT NULL,
    "termId" text,
    "feeHeadId" text,
    "amountPaid" numeric(10,2) NOT NULL,
    "paymentDate" timestamp(3) without time zone NOT NULL,
    "paymentMethod" public."PaymentMethod" NOT NULL,
    "transactionId" text,
    status public."PaymentStatus" DEFAULT 'paid'::public."PaymentStatus" NOT NULL,
    remarks text,
    "collectedById" text,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: fee_refunds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fee_refunds (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "paymentId" text NOT NULL,
    amount numeric(10,2) NOT NULL,
    reason text NOT NULL,
    "refundDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "processedById" text,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: fee_terms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fee_terms (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "sectionFeeId" text NOT NULL,
    name text NOT NULL,
    "dueDate" timestamp(3) without time zone NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: floors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.floors (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "buildingId" text NOT NULL,
    "floorNumber" integer NOT NULL,
    name text,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: grades; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grades (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "courseId" text NOT NULL,
    "gradeName" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: grading_bands; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grading_bands (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "scaleId" text NOT NULL,
    "minMarks" double precision NOT NULL,
    "maxMarks" double precision NOT NULL,
    grade text NOT NULL,
    gpa double precision,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: grading_scales; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grading_scales (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.groups (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "groupName" text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: holiday_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.holiday_categories (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: holidays; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.holidays (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "academicYearId" text,
    "categoryId" text,
    date timestamp(3) without time zone NOT NULL,
    name text NOT NULL,
    type public."HolidayType" DEFAULT 'school'::public."HolidayType" NOT NULL,
    "isMandatory" boolean DEFAULT true NOT NULL,
    "fullDay" boolean DEFAULT true NOT NULL,
    remarks text,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: hostel_blocks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hostel_blocks (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    code text,
    description text,
    gender public."Gender",
    status public."EntityStatus" DEFAULT 'active'::public."EntityStatus" NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: hostel_floors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hostel_floors (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "blockId" text NOT NULL,
    "floorNumber" integer NOT NULL,
    name text,
    gender public."Gender",
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: hostel_room_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hostel_room_types (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    description text,
    "defaultCapacity" integer DEFAULT 1 NOT NULL,
    amenities jsonb,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: hostel_rooms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hostel_rooms (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "floorId" text NOT NULL,
    "roomTypeId" text NOT NULL,
    "roomNumber" text NOT NULL,
    capacity integer NOT NULL,
    status public."EntityStatus" DEFAULT 'active'::public."EntityStatus" NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: hostel_section_rooms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hostel_section_rooms (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "sectionId" text NOT NULL,
    "roomId" text NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: hostel_sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hostel_sections (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "sectionId" text NOT NULL,
    description text,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: hostel_staff_assignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hostel_staff_assignments (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "blockId" text NOT NULL,
    "teacherId" text NOT NULL,
    role public."HostelStaffRole" NOT NULL,
    "fromDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "toDate" timestamp(3) without time zone,
    status public."EntityStatus" DEFAULT 'active'::public."EntityStatus" NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: id_sequence_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.id_sequence_logs (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "patternId" text NOT NULL,
    "generatedValue" text NOT NULL,
    "entityType" text NOT NULL,
    "entityId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: id_sequence_patterns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.id_sequence_patterns (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "academicYearId" text,
    "entityType" text NOT NULL,
    pattern text NOT NULL,
    "currentSeq" integer DEFAULT 0 NOT NULL,
    "seqLength" integer DEFAULT 4 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: inventory_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inventory_categories (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "inventoryCategoryName" text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: inventory_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inventory_items (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "inventoryItemName" text NOT NULL,
    description text,
    "categoryId" text,
    "stockAvailable" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: leave_approvals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leave_approvals (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "leaveRequestId" text NOT NULL,
    level integer NOT NULL,
    "approverRole" text NOT NULL,
    "approverId" text,
    status text DEFAULT 'pending'::text NOT NULL,
    remarks text,
    "decidedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: leave_audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leave_audit_logs (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "leaveRequestId" text NOT NULL,
    action text NOT NULL,
    "actorId" text,
    "actorName" text,
    "actorRole" text,
    changes jsonb,
    remarks text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: leave_balance_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leave_balance_transactions (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "balanceId" text NOT NULL,
    "changeType" text NOT NULL,
    amount double precision NOT NULL,
    reason text,
    "referenceType" text,
    "referenceId" text,
    "previousBalance" double precision NOT NULL,
    "newBalance" double precision NOT NULL,
    "actorId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: leave_cancellations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leave_cancellations (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "leaveRequestId" text NOT NULL,
    "requestedById" text NOT NULL,
    reason text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    "approverId" text,
    "approverRemarks" text,
    "requestedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "decidedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: leave_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leave_categories (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    description text,
    "applicantType" public."LeaveApplicantType" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "daysAllocated" double precision,
    "isPaid" boolean DEFAULT true NOT NULL,
    "requiresApproval" boolean DEFAULT true NOT NULL,
    "allowHalfDay" boolean DEFAULT false NOT NULL,
    "requireDocuments" boolean DEFAULT false NOT NULL,
    "requireDocsAfterDays" double precision,
    "allowCarryForward" boolean DEFAULT false NOT NULL,
    "maxCarryForward" double precision,
    "allowNegativeBalance" boolean DEFAULT false NOT NULL,
    "allocationMethod" public."LeaveAllocationMethod" DEFAULT 'annual'::public."LeaveAllocationMethod" NOT NULL,
    "studentApprovalMode" text,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: leave_notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leave_notifications (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "leaveRequestId" text NOT NULL,
    "sentToId" text,
    type text NOT NULL,
    message text,
    "isRead" boolean DEFAULT false NOT NULL,
    "readAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: leave_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leave_requests (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "applicantType" public."LeaveApplicantType" NOT NULL,
    "studentId" text,
    "enrollmentId" text,
    "employeeId" text,
    "leaveCategoryId" text NOT NULL,
    "startDate" date NOT NULL,
    "endDate" date NOT NULL,
    "startFraction" public."LeaveDayFraction" DEFAULT 'full_day'::public."LeaveDayFraction" NOT NULL,
    "endFraction" public."LeaveDayFraction" DEFAULT 'full_day'::public."LeaveDayFraction" NOT NULL,
    reason text NOT NULL,
    status public."LeaveRequestStatus" DEFAULT 'draft'::public."LeaveRequestStatus" NOT NULL,
    "calculatedDays" double precision,
    "supportingDocumentUrl" text,
    "submittedById" text,
    "submittedAt" timestamp(3) without time zone,
    "withdrawnAt" timestamp(3) without time zone,
    "withdrawnReason" text,
    "deletedAt" timestamp(3) without time zone,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: notification_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification_templates (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    description text,
    type public."CommunicationType" NOT NULL,
    subject text NOT NULL,
    body text NOT NULL,
    "defaultChannel" public."CommunicationChannel" DEFAULT 'in_app'::public."CommunicationChannel" NOT NULL,
    "defaultPriority" integer DEFAULT 0 NOT NULL,
    "isSystem" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: parents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.parents (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "userId" text,
    "fullName" text NOT NULL,
    phone text,
    email text,
    relation text NOT NULL,
    "aadhaarNumber" text,
    occupation text,
    "registrationToken" text,
    "registrationTokenExp" timestamp(3) without time zone,
    "isRegistered" boolean DEFAULT false NOT NULL,
    status public."EntityStatus" DEFAULT 'active'::public."EntityStatus" NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: payroll_batches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payroll_batches (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    month integer NOT NULL,
    year integer NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    "processedAt" timestamp(3) without time zone,
    "processedById" text,
    "createdById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: payroll_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payroll_records (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "batchId" text NOT NULL,
    "employeeId" text NOT NULL,
    "actualSalary" numeric(12,2) NOT NULL,
    "paidAmount" numeric(12,2) NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    "paymentMethod" text DEFAULT 'cash'::text NOT NULL,
    "createdById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permissions (
    id text NOT NULL,
    code text NOT NULL,
    module text NOT NULL,
    action text NOT NULL,
    scope text,
    description text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: pickup_points; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pickup_points (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    address text,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: publication_revisions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.publication_revisions (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "publicationId" text NOT NULL,
    revision integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "changedById" text,
    "changeSummary" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: publications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.publications (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    type public."PublicationType" NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "circularNumber" text,
    attachments jsonb,
    "targetUserIds" jsonb,
    "targetRoles" jsonb,
    "targetGroups" jsonb,
    "targetGrades" jsonb,
    "targetSections" jsonb,
    "targetEmployeeTypes" jsonb,
    "targetAudience" jsonb,
    "publishDate" timestamp(3) without time zone,
    "expiryDate" timestamp(3) without time zone,
    priority integer DEFAULT 0 NOT NULL,
    "isPinned" boolean DEFAULT false NOT NULL,
    "requireAcknowledgement" boolean DEFAULT false NOT NULL,
    "sendNotification" boolean DEFAULT false NOT NULL,
    status public."PublicationStatus" DEFAULT 'draft'::public."PublicationStatus" NOT NULL,
    "submittedAt" timestamp(3) without time zone,
    "submittedById" text,
    "approvedAt" timestamp(3) without time zone,
    "approvedById" text,
    "approvalRemarks" text,
    "rejectedAt" timestamp(3) without time zone,
    "rejectedById" text,
    "rejectionReason" text,
    "publishedAt" timestamp(3) without time zone,
    "archivedAt" timestamp(3) without time zone,
    "withdrawnAt" timestamp(3) without time zone,
    revision integer DEFAULT 0 NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: role_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_groups (
    "roleId" text NOT NULL,
    "groupId" text NOT NULL,
    "tenantId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_permissions (
    "roleId" text NOT NULL,
    "permissionId" text NOT NULL,
    "tenantId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "roleName" text NOT NULL,
    description text,
    "isDefault" boolean DEFAULT false NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: rooms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rooms (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "floorId" text NOT NULL,
    "roomNumber" text NOT NULL,
    "roomName" text,
    "roomType" public."RoomType" DEFAULT 'classroom'::public."RoomType" NOT NULL,
    "roomCategory" public."RoomCategory",
    capacity integer NOT NULL,
    status public."EntityStatus" DEFAULT 'active'::public."EntityStatus" NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: salary_components; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.salary_components (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    description text,
    type text DEFAULT 'earning'::text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: section_fee_heads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.section_fee_heads (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "sectionFeeId" text NOT NULL,
    "feeHeadId" text NOT NULL,
    amount numeric(10,2) NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: section_fees; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.section_fees (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "sectionId" text NOT NULL,
    "academicYearId" text NOT NULL,
    "termCount" integer DEFAULT 1 NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: section_subjects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.section_subjects (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "sectionId" text NOT NULL,
    "subjectId" text NOT NULL,
    "isElective" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sections (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "gradeId" text NOT NULL,
    "sectionName" text NOT NULL,
    "structureId" text,
    "roomId" text,
    "sectionInChargeId" text,
    "attendanceMode" public."SectionAttendanceMode" DEFAULT 'period_wise'::public."SectionAttendanceMode" NOT NULL,
    shifts jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: staff_attendance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.staff_attendance (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "teacherId" text NOT NULL,
    date date NOT NULL,
    "checkInTime" timestamp(3) without time zone,
    "checkOutTime" timestamp(3) without time zone,
    status text DEFAULT 'pending'::text NOT NULL,
    "totalMinutes" integer DEFAULT 0 NOT NULL,
    "sessionCount" integer DEFAULT 0 NOT NULL,
    remarks text,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: staff_attendance_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.staff_attendance_sessions (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "attendanceId" text NOT NULL,
    "checkInTime" timestamp(3) without time zone NOT NULL,
    "checkInLat" double precision,
    "checkInLng" double precision,
    "checkInAccuracy" double precision,
    "checkInMethod" text,
    "checkOutTime" timestamp(3) without time zone,
    "checkOutLat" double precision,
    "checkOutLng" double precision,
    "checkOutAccuracy" double precision,
    "checkOutMethod" text,
    "durationMinutes" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: stock_adjustments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stock_adjustments (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "itemId" text,
    "adjustmentAmount" integer NOT NULL,
    reason text,
    "borrowerName" text,
    "borrowerId" text,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: store_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_categories (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    description text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: store_due_payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_due_payments (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "dueId" text NOT NULL,
    amount numeric(10,2) NOT NULL,
    "paymentDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "paymentMethod" text,
    "transactionId" text,
    remarks text,
    "createdById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: store_dues; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_dues (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "orderId" text NOT NULL,
    "enrollmentId" text,
    "customerName" text NOT NULL,
    "customerPhone" text,
    "customerType" text DEFAULT 'student'::text NOT NULL,
    "totalDueAmount" numeric(10,2) NOT NULL,
    "paidAmount" numeric(10,2) DEFAULT 0 NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    remarks text,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: store_kit_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_kit_items (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "kitId" text NOT NULL,
    "productId" text,
    "productName" text NOT NULL,
    "categoryName" text NOT NULL,
    "unitPrice" numeric(10,2) NOT NULL,
    quantity integer NOT NULL,
    "totalPrice" numeric(10,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: store_kit_sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_kit_sections (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "kitId" text NOT NULL,
    "sectionId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: store_kits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_kits (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    description text,
    "totalPrice" numeric(10,2) DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: store_order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_order_items (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "orderId" text NOT NULL,
    "productId" text,
    "kitId" text,
    "productName" text NOT NULL,
    "unitPrice" numeric(10,2) NOT NULL,
    quantity integer NOT NULL,
    "totalPrice" numeric(10,2) NOT NULL,
    "kitReferenceId" text,
    "isReturned" boolean DEFAULT false NOT NULL,
    "returnedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: store_orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_orders (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "enrollmentId" text,
    "academicYearId" text,
    "orderDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "totalAmount" numeric(10,2) NOT NULL,
    "actualTotalAmount" numeric(10,2) NOT NULL,
    "discountAmount" numeric(10,2) DEFAULT 0 NOT NULL,
    "offeredAmount" numeric(10,2),
    "customerName" text,
    "customerPhone" text,
    "customerType" text DEFAULT 'student'::text NOT NULL,
    status text DEFAULT 'confirmed'::text NOT NULL,
    remarks text,
    "paymentMethod" text,
    "transactionId" text,
    "paymentMode" text,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: store_pending_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_pending_items (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "orderItemId" text NOT NULL,
    "productId" text,
    "productName" text NOT NULL,
    quantity integer NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    "collectedAt" timestamp(3) without time zone,
    "isPaid" boolean DEFAULT false NOT NULL,
    "paidAt" timestamp(3) without time zone,
    "createdById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: store_product_sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_product_sections (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "productId" text NOT NULL,
    "sectionId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: store_products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_products (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "categoryId" text NOT NULL,
    name text NOT NULL,
    description text,
    "basePrice" numeric(10,2) NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "isGeneral" boolean DEFAULT true NOT NULL,
    "stockQuantity" integer DEFAULT 0 NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: store_returns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_returns (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "orderItemId" text NOT NULL,
    "productId" text,
    "productName" text NOT NULL,
    quantity integer NOT NULL,
    "refundAmount" numeric(10,2) NOT NULL,
    reason text,
    "returnedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: student_enrollment_electives; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_enrollment_electives (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "enrollmentId" text NOT NULL,
    "sectionSubjectId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: student_enrollments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_enrollments (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "studentId" text NOT NULL,
    "academicYearId" text NOT NULL,
    "gradeId" text NOT NULL,
    "sectionId" text NOT NULL,
    "rollNumber" text,
    status public."EnrollmentStatus" DEFAULT 'active'::public."EnrollmentStatus" NOT NULL,
    "joinedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "leftAt" timestamp(3) without time zone,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: student_fee_heads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_fee_heads (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "studentFeeId" text NOT NULL,
    "feeHeadId" text NOT NULL,
    "actualAmount" numeric(10,2) NOT NULL,
    "negotiatedAmount" numeric(10,2) NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: student_fees; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_fees (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "enrollmentId" text NOT NULL,
    "allocationMethod" public."FeeAllocationMethod" DEFAULT 'equal'::public."FeeAllocationMethod" NOT NULL,
    "totalActualFee" numeric(10,2) NOT NULL,
    "totalNegotiatedFee" numeric(10,2) NOT NULL,
    "discountType" public."DiscountType",
    "discountValue" numeric(10,2),
    "discountReason" text,
    "headWiseDiscounts" jsonb,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: student_hostel_allocations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_hostel_allocations (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "enrollmentId" text NOT NULL,
    "roomId" text NOT NULL,
    "sectionId" text,
    "academicYearId" text NOT NULL,
    "fromDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "toDate" timestamp(3) without time zone,
    status public."EntityStatus" DEFAULT 'active'::public."EntityStatus" NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: student_parents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_parents (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "studentId" text NOT NULL,
    "parentId" text NOT NULL,
    "isPrimary" boolean DEFAULT false NOT NULL
);


--
-- Name: student_transport_assignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_transport_assignments (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "enrollmentId" text NOT NULL,
    "pickupPointId" text NOT NULL,
    "vehicleId" text,
    "categoryId" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: students; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.students (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "admissionNumber" text,
    pen text,
    "apaarId" text,
    "firstName" text NOT NULL,
    "middleName" text,
    "lastName" text NOT NULL,
    "dateOfBirth" timestamp(3) without time zone NOT NULL,
    gender public."Gender" NOT NULL,
    "aadhaarNumber" text,
    "casteCategory" text,
    "subCaste" text,
    religion text,
    "motherTongue" text,
    "bloodGroup" text,
    nationality text DEFAULT 'Indian'::text NOT NULL,
    "identificationMarks" text,
    "fatherName" text,
    "fatherOccupation" text,
    "fatherPhone" text,
    "fatherAadhaar" text,
    "motherName" text,
    "motherOccupation" text,
    "motherPhone" text,
    "motherAadhaar" text,
    "guardianName" text,
    "guardianRelation" text,
    "guardianContact" text,
    "guardianOccupation" text,
    "guardianAadhaar" text,
    "classApplyingFor" text,
    "mediumOfInstruction" text,
    "previousSchoolName" text,
    "previousClassAttended" text,
    "transferCertificateNo" text,
    "dateOfIssueTC" timestamp(3) without time zone,
    "modeOfTransport" text,
    "permanentAddress" text,
    state text,
    pincode text,
    "feePaymentMode" text,
    "bankAccountDetails" text,
    "midDayMealEligibility" boolean DEFAULT false NOT NULL,
    "gradeId" text NOT NULL,
    "sectionId" text NOT NULL,
    status public."EntityStatus" DEFAULT 'active'::public."EntityStatus" NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: subjects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subjects (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "subjectName" text NOT NULL,
    "courseId" text NOT NULL,
    "isCommon" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: teacher_assignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teacher_assignments (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "academicYearId" text NOT NULL,
    "teacherId" text NOT NULL,
    "sectionSubjectId" text NOT NULL,
    role public."TeacherRole" DEFAULT 'subject_teacher'::public."TeacherRole" NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: teacher_availability; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teacher_availability (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "teacherId" text NOT NULL,
    "dayOfWeek" public."DayOfWeek" NOT NULL,
    "startTime" integer NOT NULL,
    "endTime" integer NOT NULL,
    "isAvailable" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: teacher_capabilities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teacher_capabilities (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "teacherId" text NOT NULL,
    "subjectId" text NOT NULL,
    "courseId" text,
    "gradeId" text,
    "sectionId" text,
    "expertiseLevel" public."ExpertiseLevel" DEFAULT 'intermediate'::public."ExpertiseLevel" NOT NULL,
    "isPrimary" boolean DEFAULT false NOT NULL,
    "priorityScore" integer DEFAULT 50 NOT NULL,
    "canBeClassTeacher" boolean DEFAULT false NOT NULL,
    remarks text,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: teacher_employment_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teacher_employment_history (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "teacherId" text NOT NULL,
    "organizationName" text NOT NULL,
    role text NOT NULL,
    "startDate" timestamp(3) without time zone,
    "endDate" timestamp(3) without time zone,
    "reasonForLeaving" text,
    "experienceYears" double precision,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: teacher_qualifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teacher_qualifications (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "teacherId" text NOT NULL,
    "qualificationName" text NOT NULL,
    specialization text,
    institution text,
    score double precision,
    "yearOfPassing" integer,
    "documentUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: teachers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teachers (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "userId" text,
    "fullName" text NOT NULL,
    email text,
    phone text,
    gender public."Gender",
    "employeeCode" text,
    "employeeType" public."EmployeeType" DEFAULT 'teacher'::public."EmployeeType" NOT NULL,
    "registrationToken" text,
    "registrationTokenExp" timestamp(3) without time zone,
    "isRegistered" boolean DEFAULT false NOT NULL,
    "profilePhotoUrl" text,
    "dateOfBirth" timestamp(3) without time zone,
    "dateOfJoining" timestamp(3) without time zone,
    "yearsOfExperience" double precision,
    "governmentIdType" text,
    "governmentIdNumber" text,
    "governmentIdUrl" text,
    "drivingLicenseNumber" text,
    "drivingLicenseUrl" text,
    "drivingExperienceYears" integer,
    "vehicleType" text,
    "licenseExpiryDate" timestamp(3) without time zone,
    "medicalCertificateUrl" text,
    status public."EntityStatus" DEFAULT 'active'::public."EntityStatus" NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: tenant_holiday_rules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tenant_holiday_rules (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "academicYearId" text,
    name text NOT NULL,
    "ruleType" public."HolidayRuleType" NOT NULL,
    "dayOfWeek" public."DayOfWeek" NOT NULL,
    "weekOfMonth" integer,
    "isActive" boolean DEFAULT true NOT NULL,
    remarks text,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: tenant_leave_configurations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tenant_leave_configurations (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "workingDays" public."DayOfWeek"[] DEFAULT ARRAY['Monday'::public."DayOfWeek", 'Tuesday'::public."DayOfWeek", 'Wednesday'::public."DayOfWeek", 'Thursday'::public."DayOfWeek", 'Friday'::public."DayOfWeek"],
    "allowSaturdayHalfDay" boolean DEFAULT false NOT NULL,
    "allowLeaveWithoutApproval" boolean DEFAULT false NOT NULL,
    "lowBalanceAlertThreshold" double precision,
    "enableLowBalanceAlert" boolean DEFAULT false NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: tenants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tenants (
    id text NOT NULL,
    "schoolName" text NOT NULL,
    "contactAddress" jsonb,
    "contactPhone" text,
    "contactEmail" text,
    "subscriptionPlan" public."SubscriptionPlan" DEFAULT 'free'::public."SubscriptionPlan" NOT NULL,
    domain text,
    logo text,
    caption text,
    "defaultTermCount" integer DEFAULT 1 NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: timetable_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.timetable_entries (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "academicYearId" text NOT NULL,
    "dayOfWeek" public."DayOfWeek" NOT NULL,
    "periodId" text NOT NULL,
    "sectionSubjectId" text NOT NULL,
    "teacherAssignmentId" text,
    room text,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: timetable_periods; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.timetable_periods (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "structureId" text NOT NULL,
    name text NOT NULL,
    type public."PeriodType" DEFAULT 'class'::public."PeriodType" NOT NULL,
    "startTime" integer NOT NULL,
    "endTime" integer NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: timetable_structures; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.timetable_structures (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: token_blacklist; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.token_blacklist (
    id text NOT NULL,
    token text NOT NULL,
    "expiredAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: uploads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.uploads (
    id text NOT NULL,
    "tenantId" text,
    "entityType" text NOT NULL,
    "entityId" text NOT NULL,
    "documentType" text NOT NULL,
    "fileUrl" text NOT NULL,
    "createdById" text,
    "uploadedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    "userId" text NOT NULL,
    "roleId" text NOT NULL,
    "tenantId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id text NOT NULL,
    "tenantId" text,
    "fullName" text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "userType" public."UserType" DEFAULT 'tenant'::public."UserType" NOT NULL,
    otp text,
    "otpExpiresAt" timestamp(3) without time zone,
    "otpPurpose" text,
    "isFirstLogin" boolean DEFAULT true NOT NULL,
    phone text,
    "permVersion" integer DEFAULT 0 NOT NULL,
    status public."EntityStatus" DEFAULT 'active'::public."EntityStatus" NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: vehicle_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vehicle_categories (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    type public."VehicleCategoryType" NOT NULL,
    occupancy integer NOT NULL,
    amenities public."VehicleAmenity"[],
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: vehicle_driver_assignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vehicle_driver_assignments (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "vehicleId" text NOT NULL,
    "driverId" text NOT NULL,
    "isPrimaryDriver" boolean DEFAULT true NOT NULL,
    "assignedDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "endDate" timestamp(3) without time zone,
    status public."EntityStatus" DEFAULT 'active'::public."EntityStatus" NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: vehicles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vehicles (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "categoryId" text NOT NULL,
    name text NOT NULL,
    "registrationNumber" text,
    capacity integer NOT NULL,
    description text,
    status public."EntityStatus" DEFAULT 'active'::public."EntityStatus" NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: visitor_notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.visitor_notifications (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "visitorId" text NOT NULL,
    "sentToId" text,
    type text NOT NULL,
    message text,
    "isRead" boolean DEFAULT false NOT NULL,
    "readAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: visitor_purposes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.visitor_purposes (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    description text,
    "requiresApproval" boolean DEFAULT false NOT NULL,
    "approvalFrom" public."ApprovalFrom" DEFAULT 'admin'::public."ApprovalFrom" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: visitors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.visitors (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "visitorType" public."VisitorType" NOT NULL,
    "parentId" text,
    "visitorName" text,
    "visitorPhone" text,
    "visitorEmail" text,
    "purposeId" text NOT NULL,
    description text,
    "pointOfContactId" text,
    "approvalStatus" public."VisitorApprovalStatus" DEFAULT 'not_required'::public."VisitorApprovalStatus" NOT NULL,
    "approvedById" text,
    "approvedAt" timestamp(3) without time zone,
    "rejectionReason" text,
    "checkInTime" timestamp(3) without time zone,
    "checkOutTime" timestamp(3) without time zone,
    status public."VisitorStatus" DEFAULT 'scheduled'::public."VisitorStatus" NOT NULL,
    "createdById" text,
    "updatedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: zai_chats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.zai_chats (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "userId" text NOT NULL,
    title text DEFAULT 'New Chat'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: zai_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.zai_messages (
    id text NOT NULL,
    "chatId" text NOT NULL,
    "tenantId" text NOT NULL,
    role text NOT NULL,
    content text NOT NULL,
    "queryUsed" jsonb,
    "resultData" jsonb,
    "resultCount" integer,
    error text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
a4144be4-0e3d-42bd-a40c-437223ee9f08	a207d0585fe94291f12e23bfaeb979ccca73d629a541b9be1406a5e72f25001b	2026-07-29 14:03:34.352992+05:30	20260729083334_init	\N	\N	2026-07-29 14:03:34.100015+05:30	1
\.


--
-- Data for Name: academic_years; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.academic_years (id, "tenantId", name, "startDate", "endDate", status, "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
e5f4dea7-1367-4857-b2f3-c4261158304a	765730a3-b25d-4883-ab96-6fc8651b4703	2025-26	2026-07-07 18:30:00	2026-07-16 18:30:00	active	\N	\N	2026-07-29 18:38:43.623	2026-07-29 18:38:48.489
\.


--
-- Data for Name: account_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.account_categories (id, "tenantId", name, description, "sortOrder", "isActive", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
82d4779d-33cc-40f9-9139-1c581894645b	765730a3-b25d-4883-ab96-6fc8651b4703	Student Fees	Auto-created category for student fee payments	0	t	\N	\N	2026-08-05 17:05:45.957	2026-08-05 17:05:45.957
e212b818-2c8b-4487-b166-3b860251886d	765730a3-b25d-4883-ab96-6fc8651b4703	For Inventory	\N	0	t	\N	\N	2026-08-05 17:07:20.782	2026-08-05 17:07:20.782
\.


--
-- Data for Name: account_transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.account_transactions (id, "tenantId", "categoryId", type, amount, description, "transactionDate", "partyType", "partyId", "partyName", "referenceType", "referenceId", "isVoided", "voidReason", "voidedAt", "voidedById", "createdById", "createdAt", "updatedAt") FROM stdin;
290abef6-da16-4c21-b012-00afa3abb110	765730a3-b25d-4883-ab96-6fc8651b4703	82d4779d-33cc-40f9-9139-1c581894645b	credit	10000.00	Fee payment received	2026-08-05 00:00:00	\N	\N	\N	fee_payment	7cfcd7fc-56f6-404d-8958-46fee0ddea00	f	\N	\N	\N	\N	2026-08-05 17:05:45.959	2026-08-05 17:05:45.959
339dbea3-0e6b-4bb6-8afe-190d1dd444e4	765730a3-b25d-4883-ab96-6fc8651b4703	e212b818-2c8b-4487-b166-3b860251886d	debit	5000.00	\N	2026-08-05 00:00:00	teacher	a4379069-8f79-488c-9991-574b25a4306c	Lakshmi Iyer	\N	\N	f	\N	\N	\N	\N	2026-08-05 17:07:38.308	2026-08-05 17:07:38.308
\.


--
-- Data for Name: attendance_marks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.attendance_marks (id, "tenantId", "sessionId", "enrollmentId", status, remarks, "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: attendance_sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.attendance_sessions (id, "tenantId", "academicYearId", "sectionId", "takenById", "attendanceTypeId", date, "periodId", "sectionSubjectId", "examScheduleId", shift, notes, "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: attendance_types; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.attendance_types (id, "tenantId", name, category, "sortOrder", "isActive", "createdAt", "updatedAt") FROM stdin;
0eddd044-463d-4031-a930-3b823f4ae98a	765730a3-b25d-4883-ab96-6fc8651b4703	Morning	shift	0	t	2026-07-31 18:52:11.904	2026-07-31 18:52:11.904
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.audit_logs (id, "tenantId", "actorId", "actorEmail", action, "targetType", "targetId", details, "ipAddress", level, "createdAt") FROM stdin;
86606ecc-2ba7-489c-8a18-38e1623070cf	765730a3-b25d-4883-ab96-6fc8651b4703	\N	\N	communication.sent	communication	60311694-30c7-4cb8-ab33-e9d075e4a593	{"type": "notification", "title": "Test Notification", "failed": 0, "skipped": 0, "channels": ["in_app"], "delivered": 0, "audienceResolvedCount": 0}	\N	info	2026-08-06 16:15:17.824
93bd8d07-bda6-4935-adfd-968f22d35c4a	765730a3-b25d-4883-ab96-6fc8651b4703	\N	\N	communication.sent	communication	7e9ab8a2-fdfb-4ff9-b352-f7c4053f22ce	{"type": "notification", "title": "This is for the parent", "failed": 0, "skipped": 0, "channels": ["in_app"], "delivered": 0, "audienceResolvedCount": 0}	\N	info	2026-08-06 17:12:49.261
f13aba01-0387-489f-ac13-b1ba5ef161d4	765730a3-b25d-4883-ab96-6fc8651b4703	\N	\N	communication.sent	communication	ad23b1bd-df39-4c8f-809f-6c7be157fefc	{"type": "notification", "title": "Send this to parent", "failed": 0, "skipped": 0, "channels": ["in_app"], "delivered": 1, "audienceResolvedCount": 1}	\N	info	2026-08-06 17:34:29.793
\.


--
-- Data for Name: automation_rules; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.automation_rules (id, "tenantId", name, description, "sourceModule", event, "templateId", channels, "isEnabled", "cooldownMinutes", "filterCriteria", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: buildings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.buildings (id, "tenantId", name, code, description, "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: channel_configurations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.channel_configurations (id, "tenantId", channel, provider, config, "isEnabled", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: communication_recipients; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.communication_recipients (id, "tenantId", "communicationId", "userId", channel, "deliveryStatus", "viewedAt", "acknowledgedAt", "retryCount", "lastError", "deliveredAt", "providerMessageId", "createdAt", "updatedAt") FROM stdin;
ed2d286f-f6f4-4939-98d8-e858ff0af826	765730a3-b25d-4883-ab96-6fc8651b4703	ad23b1bd-df39-4c8f-809f-6c7be157fefc	21c7c587-89c5-4e08-8328-1aec124b62b8	in_app	viewed	2026-08-06 18:29:06.239	\N	0	\N	2026-08-06 17:34:29.792	\N	2026-08-06 17:34:29.787	2026-08-06 18:29:06.239
\.


--
-- Data for Name: communications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.communications (id, "tenantId", type, "senderType", "senderId", title, message, priority, "actionButton", "scheduledAt", "expiresAt", status, "targetUserIds", "targetRoles", "targetGroups", "targetGrades", "targetSections", "targetEmployeeTypes", "targetAudience", "automationRuleId", "sourceModule", "sourceEvent", "sourceReference", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
60311694-30c7-4cb8-ab33-e9d075e4a593	765730a3-b25d-4883-ab96-6fc8651b4703	notification	user	\N	Test Notification	Hi User this is sent to test the notification feature	0	null	\N	\N	sent	null	null	null	null	null	["teacher"]	null	\N	\N	\N	null	\N	\N	2026-08-06 16:15:17.813	2026-08-06 16:15:17.813
7e9ab8a2-fdfb-4ff9-b352-f7c4053f22ce	765730a3-b25d-4883-ab96-6fc8651b4703	notification	user	\N	This is for the parent	This notification is for parent test	0	null	\N	\N	sent	null	null	null	null	null	null	["parent"]	\N	\N	\N	null	\N	\N	2026-08-06 17:12:49.251	2026-08-06 17:12:49.251
ad23b1bd-df39-4c8f-809f-6c7be157fefc	765730a3-b25d-4883-ab96-6fc8651b4703	notification	user	\N	Send this to parent	I have shared a message to the parent	0	null	\N	\N	sent	null	null	null	null	null	null	["parent"]	\N	\N	\N	null	\N	\N	2026-08-06 17:34:29.777	2026-08-06 17:34:29.777
\.


--
-- Data for Name: compensation_components; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.compensation_components (id, "tenantId", "compensationId", "salaryComponentId", value, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: compensation_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.compensation_history (id, "tenantId", "employeeId", "compensationId", "effectiveFrom", "totalAmount", components, "changedById", "changedAt") FROM stdin;
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.courses (id, "tenantId", "courseName", description, "createdAt", "updatedAt") FROM stdin;
a61c2a2c-108d-4845-ae6d-72af87ddaa8f	765730a3-b25d-4883-ab96-6fc8651b4703	MPC	Maths Physics Chemistry	2026-07-29 18:37:51.715	2026-07-29 18:37:51.715
\.


--
-- Data for Name: employee_compensations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.employee_compensations (id, "tenantId", "employeeId", "effectiveFrom", "totalAmount", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: employee_leave_balances; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.employee_leave_balances (id, "tenantId", "employeeId", "leaveCategoryId", "academicYearId", allocated, "carriedForward", "manualAdjustment", used, pending, "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: employee_leave_loss_of_pay; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.employee_leave_loss_of_pay (id, "tenantId", "leaveRequestId", "employeeId", "payrollBatchId", days, status, "createdAt", "consumedAt") FROM stdin;
\.


--
-- Data for Name: exam_marks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.exam_marks (id, "tenantId", "examPaperId", "enrollmentId", "marksObtained", "isAbsent", breakup, remarks, "gradeLabel", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: exam_schedule_papers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.exam_schedule_papers (id, "tenantId", "scheduleId", "sectionSubjectId", "examDate", "startTime", "endTime", "durationMinutes", room, "inChargeId", "maxMarks", "passMarks", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: exam_schedules; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.exam_schedules (id, "tenantId", "examId", "sectionId", name, description, status, "startDate", "endDate", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: exam_target_grades; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.exam_target_grades (id, "tenantId", "examId", "gradeId") FROM stdin;
\.


--
-- Data for Name: exam_target_sections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.exam_target_sections (id, "tenantId", "examId", "sectionId") FROM stdin;
\.


--
-- Data for Name: exams; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.exams (id, "tenantId", "academicYearId", name, description, "examType", status, "startDate", "endDate", source, "gradingScaleId", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: fee_heads; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fee_heads (id, "tenantId", name, description, "isOptional", "hostelRoomTypeId", "sortOrder", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
b7b1efa7-3c9c-4704-be1e-e477c90cc7f9	765730a3-b25d-4883-ab96-6fc8651b4703	Tution Fee	\N	f	\N	0	\N	\N	2026-08-05 16:55:15.873	2026-08-05 16:55:15.873
90d6921d-2211-4efc-8a6c-3979b76ad4e1	765730a3-b25d-4883-ab96-6fc8651b4703	Admission Fee	\N	f	\N	0	\N	\N	2026-08-05 16:55:23.711	2026-08-05 16:55:23.711
\.


--
-- Data for Name: fee_payments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fee_payments (id, "tenantId", "studentFeeId", "termId", "feeHeadId", "amountPaid", "paymentDate", "paymentMethod", "transactionId", status, remarks, "collectedById", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
7cfcd7fc-56f6-404d-8958-46fee0ddea00	765730a3-b25d-4883-ab96-6fc8651b4703	bdb2a4fb-2f33-4348-869d-07adc72df137	91b2f91f-8c7e-41a6-8fad-1d5bcc439b5b	\N	10000.00	2026-08-05 00:00:00	cash	\N	paid	\N	\N	\N	\N	2026-08-05 17:05:45.944	2026-08-05 17:05:45.944
\.


--
-- Data for Name: fee_refunds; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fee_refunds (id, "tenantId", "paymentId", amount, reason, "refundDate", "processedById", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: fee_terms; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fee_terms (id, "tenantId", "sectionFeeId", name, "dueDate", "sortOrder", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
91b2f91f-8c7e-41a6-8fad-1d5bcc439b5b	765730a3-b25d-4883-ab96-6fc8651b4703	4bd45dc6-8db5-4a4f-9b98-8c5e3f3e5de5	Term 1	2026-03-05 00:00:00	0	\N	\N	2026-08-05 17:01:00.416	2026-08-05 17:01:00.416
\.


--
-- Data for Name: floors; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.floors (id, "tenantId", "buildingId", "floorNumber", name, "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: grades; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.grades (id, "tenantId", "courseId", "gradeName", "createdAt", "updatedAt") FROM stdin;
eb13067e-80e0-41ea-84f0-e0c7c9325cf6	765730a3-b25d-4883-ab96-6fc8651b4703	a61c2a2c-108d-4845-ae6d-72af87ddaa8f	1	2026-07-29 18:38:01.081	2026-07-29 18:38:01.081
\.


--
-- Data for Name: grading_bands; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.grading_bands (id, "tenantId", "scaleId", "minMarks", "maxMarks", grade, gpa, "sortOrder", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: grading_scales; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.grading_scales (id, "tenantId", name, "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.groups (id, "tenantId", "groupName", description, "createdAt", "updatedAt") FROM stdin;
0a6b2fba-1ba5-43a0-956c-80205b857c05	765730a3-b25d-4883-ab96-6fc8651b4703	Administration	Principal, Admin, Clerk, Receptionist	2026-07-29 18:35:55.871	2026-07-29 18:35:55.871
f6149011-8c04-472e-9238-36013d5d4ce3	765730a3-b25d-4883-ab96-6fc8651b4703	Teaching Staff	Class Teacher, Subject Teacher, Lab Incharge	2026-07-29 18:35:55.877	2026-07-29 18:35:55.877
161f2551-3d52-4b36-84f9-949062875c1d	765730a3-b25d-4883-ab96-6fc8651b4703	Academic Staff	Academic Coordinator, Exam Coordinator	2026-07-29 18:35:55.878	2026-07-29 18:35:55.878
5f477df4-b18f-40da-bc0f-3403046db2dd	765730a3-b25d-4883-ab96-6fc8651b4703	Finance	Accountant, Bursar	2026-07-29 18:35:55.879	2026-07-29 18:35:55.879
878afd3d-bdf0-4963-bff1-6666924a99f5	765730a3-b25d-4883-ab96-6fc8651b4703	Transport	Transport Manager, Driver, Conductor	2026-07-29 18:35:55.879	2026-07-29 18:35:55.879
c53038a5-d703-45fe-a650-a62449a8edbe	765730a3-b25d-4883-ab96-6fc8651b4703	Parents	All parent users	2026-07-29 18:35:55.88	2026-07-29 18:35:55.88
7d9b0a95-e9a9-4488-9ef5-991a3e0f2c8e	765730a3-b25d-4883-ab96-6fc8651b4703	Support Staff	Office Boy, Cleaner, Security	2026-07-29 18:35:55.88	2026-07-29 18:35:55.88
\.


--
-- Data for Name: holiday_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.holiday_categories (id, "tenantId", name, description, "isActive", "sortOrder", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: holidays; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.holidays (id, "tenantId", "academicYearId", "categoryId", date, name, type, "isMandatory", "fullDay", remarks, "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: hostel_blocks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hostel_blocks (id, "tenantId", name, code, description, gender, status, "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
0cfd2649-ee9e-49cd-aae5-ccb86620bdcf	765730a3-b25d-4883-ab96-6fc8651b4703	Raman Block	RB	\N	Male	active	\N	\N	2026-08-05 17:26:43.991	2026-08-05 17:26:43.991
\.


--
-- Data for Name: hostel_floors; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hostel_floors (id, "tenantId", "blockId", "floorNumber", name, gender, "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
778e5e8b-e48c-4429-a8e5-4ed8863199c4	765730a3-b25d-4883-ab96-6fc8651b4703	0cfd2649-ee9e-49cd-aae5-ccb86620bdcf	1	Floor 1	Male	\N	\N	2026-08-05 17:27:04.677	2026-08-05 17:27:04.677
\.


--
-- Data for Name: hostel_room_types; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hostel_room_types (id, "tenantId", name, description, "defaultCapacity", amenities, "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: hostel_rooms; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hostel_rooms (id, "tenantId", "floorId", "roomTypeId", "roomNumber", capacity, status, "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: hostel_section_rooms; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hostel_section_rooms (id, "tenantId", "sectionId", "roomId", "sortOrder", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: hostel_sections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hostel_sections (id, "tenantId", "sectionId", description, "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: hostel_staff_assignments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hostel_staff_assignments (id, "tenantId", "blockId", "teacherId", role, "fromDate", "toDate", status, "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: id_sequence_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.id_sequence_logs (id, "tenantId", "patternId", "generatedValue", "entityType", "entityId", "createdAt") FROM stdin;
\.


--
-- Data for Name: id_sequence_patterns; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.id_sequence_patterns (id, "tenantId", "academicYearId", "entityType", pattern, "currentSeq", "seqLength", "isActive", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: inventory_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.inventory_categories (id, "tenantId", "inventoryCategoryName", description, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: inventory_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.inventory_items (id, "tenantId", "inventoryItemName", description, "categoryId", "stockAvailable", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: leave_approvals; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.leave_approvals (id, "tenantId", "leaveRequestId", level, "approverRole", "approverId", status, remarks, "decidedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: leave_audit_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.leave_audit_logs (id, "tenantId", "leaveRequestId", action, "actorId", "actorName", "actorRole", changes, remarks, "createdAt") FROM stdin;
\.


--
-- Data for Name: leave_balance_transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.leave_balance_transactions (id, "tenantId", "balanceId", "changeType", amount, reason, "referenceType", "referenceId", "previousBalance", "newBalance", "actorId", "createdAt") FROM stdin;
\.


--
-- Data for Name: leave_cancellations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.leave_cancellations (id, "tenantId", "leaveRequestId", "requestedById", reason, status, "approverId", "approverRemarks", "requestedAt", "decidedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: leave_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.leave_categories (id, "tenantId", name, description, "applicantType", "isActive", "sortOrder", "daysAllocated", "isPaid", "requiresApproval", "allowHalfDay", "requireDocuments", "requireDocsAfterDays", "allowCarryForward", "maxCarryForward", "allowNegativeBalance", "allocationMethod", "studentApprovalMode", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: leave_notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.leave_notifications (id, "tenantId", "leaveRequestId", "sentToId", type, message, "isRead", "readAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: leave_requests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.leave_requests (id, "tenantId", "applicantType", "studentId", "enrollmentId", "employeeId", "leaveCategoryId", "startDate", "endDate", "startFraction", "endFraction", reason, status, "calculatedDays", "supportingDocumentUrl", "submittedById", "submittedAt", "withdrawnAt", "withdrawnReason", "deletedAt", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: notification_templates; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notification_templates (id, "tenantId", name, description, type, subject, body, "defaultChannel", "defaultPriority", "isSystem", "isActive", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: parents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.parents (id, "tenantId", "userId", "fullName", phone, email, relation, "aadhaarNumber", occupation, "registrationToken", "registrationTokenExp", "isRegistered", status, "deletedAt", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
da33ceff-2079-42b9-aa87-996254da1952	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Rajesh Sharma	+919876543201	\N	Father	\N	\N	\N	\N	f	active	\N	\N	\N	2026-07-31 18:53:12.082	2026-07-31 18:53:12.082
47ccc89e-3e42-4547-b3ca-4fb9582e92b2	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Sunita Sharma	+919876543202	\N	Mother	\N	\N	\N	\N	f	active	\N	\N	\N	2026-07-31 18:53:12.086	2026-07-31 18:53:12.086
ed5e6dca-601f-4f4e-9035-2e452a26aa31	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Vikram Gupta	+919876543203	\N	Father	\N	\N	\N	\N	f	active	\N	\N	\N	2026-07-31 18:53:12.089	2026-07-31 18:53:12.089
83f9badf-2f84-4789-9ed1-a4d2b5666d52	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Anita Gupta	+919876543204	\N	Mother	\N	\N	\N	\N	f	active	\N	\N	\N	2026-07-31 18:53:12.09	2026-07-31 18:53:12.09
408f34b0-4f4b-4335-a2c9-d99067de55e0	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Harpreet Singh	+919876543205	\N	Father	\N	\N	\N	\N	f	active	\N	\N	\N	2026-07-31 18:53:12.093	2026-07-31 18:53:12.093
b6b5984a-2e9f-4ebe-8fc1-6ea3da3bd68d	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Gurpreet Kaur	+919876543206	\N	Mother	\N	\N	\N	\N	f	active	\N	\N	\N	2026-07-31 18:53:12.094	2026-07-31 18:53:12.094
5f3391e2-8645-4b17-a530-da7a760188cf	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Suresh Reddy	+919876543207	\N	Father	\N	\N	\N	\N	f	active	\N	\N	\N	2026-07-31 18:53:12.097	2026-07-31 18:53:12.097
b3c45a38-12be-4fee-9b27-a5c7ed7d4364	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Lakshmi Reddy	+919876543208	\N	Mother	\N	\N	\N	\N	f	active	\N	\N	\N	2026-07-31 18:53:12.098	2026-07-31 18:53:12.098
d88f7ce7-82dc-44e3-a532-38ae3db86159	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Rajesh Reddy	+919876543209	\N	Grandfather	\N	\N	\N	\N	f	active	\N	\N	\N	2026-07-31 18:53:12.099	2026-07-31 18:53:12.099
f5d8b378-04be-4656-9a69-e51273b185f8	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Amit Patel	+919876543210	\N	Father	\N	\N	\N	\N	f	active	\N	\N	\N	2026-07-31 18:53:12.101	2026-07-31 18:53:12.101
69c825a9-5d17-4105-b9ec-aa9266349f42	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Neha Patel	+919876543211	\N	Mother	\N	\N	\N	\N	f	active	\N	\N	\N	2026-07-31 18:53:12.102	2026-07-31 18:53:12.102
302ff336-fe0e-49c0-bc06-3541db7e82e4	765730a3-b25d-4883-ab96-6fc8651b4703	\N	John Thomas	+919876543212	\N	Father	\N	\N	\N	\N	f	active	\N	\N	\N	2026-07-31 18:53:12.104	2026-07-31 18:53:12.104
8ee2f808-7d74-4ecd-9529-b6c5b826efd9	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Mary Thomas	+919876543213	\N	Mother	\N	\N	\N	\N	f	active	\N	\N	\N	2026-07-31 18:53:12.104	2026-07-31 18:53:12.104
3241ceeb-40aa-4819-91d3-6877bad03115	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Rajeev Nair	+919876543214	\N	Father	\N	\N	\N	\N	f	active	\N	\N	\N	2026-07-31 18:53:12.106	2026-07-31 18:53:12.106
eb0be08e-360a-4351-8851-dfc893ddc3da	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Deepa Nair	+919876543215	\N	Mother	\N	\N	\N	\N	f	active	\N	\N	\N	2026-07-31 18:53:12.107	2026-07-31 18:53:12.107
9935c552-632d-4287-886a-4f11bf1e052e	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Shabana Khan	+919876543217	\N	Mother	\N	\N	\N	\N	f	active	\N	\N	\N	2026-07-31 18:53:12.109	2026-07-31 18:53:12.109
d8dbad28-8b5f-4234-9e68-ac68319bc07e	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Mahesh Choudhary	+919876543218	\N	Father	\N	\N	\N	\N	f	active	\N	\N	\N	2026-07-31 18:53:12.111	2026-07-31 18:53:12.111
ecb5bdcf-fe66-4c4c-98a8-c540eb45d1db	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Sunita Choudhary	+919876543219	\N	Mother	\N	\N	\N	\N	f	active	\N	\N	\N	2026-07-31 18:53:12.111	2026-07-31 18:53:12.111
349684ff-f9f8-4bd2-97e8-9c46664c5279	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Prasenjit Das	+919876543220	\N	Father	\N	\N	\N	\N	f	active	\N	\N	\N	2026-07-31 18:53:12.113	2026-07-31 18:53:12.113
a50d9d52-3f08-4b6f-a2ae-32c599af324c	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Priya Das	+919876543221	\N	Mother	\N	\N	\N	\N	f	active	\N	\N	\N	2026-07-31 18:53:12.113	2026-07-31 18:53:12.113
bd26d8c9-d53e-4c2d-8a46-725802c43e67	765730a3-b25d-4883-ab96-6fc8651b4703	21c7c587-89c5-4e08-8328-1aec124b62b8	Imran Khan	+919876543216	imran@gmail.com	Father	\N	\N	\N	\N	t	active	\N	\N	\N	2026-07-31 18:53:12.108	2026-08-06 17:14:33.017
\.


--
-- Data for Name: payroll_batches; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payroll_batches (id, "tenantId", month, year, status, "processedAt", "processedById", "createdById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: payroll_records; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payroll_records (id, "tenantId", "batchId", "employeeId", "actualSalary", "paidAmount", status, "paymentMethod", "createdById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.permissions (id, code, module, action, scope, description, "createdAt", "updatedAt") FROM stdin;
1d839a11-9358-4280-9d05-1f437b9698c9	dashboard:view	dashboard	view	\N	View dashboard and analytics	2026-07-29 18:33:31.06	2026-07-29 18:33:31.06
5cac3634-2546-44f5-9a86-21201583488c	users:read	users	read	\N	View users	2026-07-29 18:33:31.065	2026-07-29 18:33:31.065
0115c870-2656-4a37-b9b6-ebbebfee8901	users:write	users	write	\N	Create users	2026-07-29 18:33:31.066	2026-07-29 18:33:31.066
cf11ddcb-7085-4529-800c-c31ffe9a8563	users:edit	users	edit	\N	Edit users	2026-07-29 18:33:31.066	2026-07-29 18:33:31.066
54be27be-f81f-44a1-96a6-89291344a6f6	users:delete	users	delete	\N	Delete users	2026-07-29 18:33:31.067	2026-07-29 18:33:31.067
28f633fa-080d-4ec3-b1b0-1815eeb69cc8	roles:read	roles	read	\N	View roles and permissions	2026-07-29 18:33:31.067	2026-07-29 18:33:31.067
67ebe7ff-cb32-480e-976b-dd580a1a4008	roles:write	roles	write	\N	Create roles	2026-07-29 18:33:31.068	2026-07-29 18:33:31.068
993aa072-ef5a-48de-a467-b2fbeea7daca	roles:edit	roles	edit	\N	Edit roles and assign permissions	2026-07-29 18:33:31.068	2026-07-29 18:33:31.068
4fae386d-02a6-4777-985a-bf2296cc10b6	roles:delete	roles	delete	\N	Delete roles	2026-07-29 18:33:31.069	2026-07-29 18:33:31.069
f503c7c6-11d1-4553-9871-d43d2f1fb9c1	roles:assign	roles	assign	\N	Assign roles to users	2026-07-29 18:33:31.069	2026-07-29 18:33:31.069
11adb936-bbc6-415e-89b3-3658c9daa9c2	students:read	students	read	\N	View students	2026-07-29 18:33:31.07	2026-07-29 18:33:31.07
c622a77b-9d6d-49d3-8afe-d46343055dc4	students:read:section	students	read	section	View students in assigned sections	2026-07-29 18:33:31.07	2026-07-29 18:33:31.07
a1b99c88-c1db-4f53-a7c4-b5da349839ad	students:read:own	students	read	own	View own linked children	2026-07-29 18:33:31.071	2026-07-29 18:33:31.071
b4131e89-2c5e-4e9a-8b92-2fe822af5c2d	students:write	students	write	\N	Create students	2026-07-29 18:33:31.071	2026-07-29 18:33:31.071
24ae3cac-70ad-41bd-a459-58ba373d7cd6	students:edit	students	edit	\N	Edit students	2026-07-29 18:33:31.072	2026-07-29 18:33:31.072
a0ee95c3-8df7-49d9-bf3b-1af921e4b73f	students:delete	students	delete	\N	Delete students	2026-07-29 18:33:31.072	2026-07-29 18:33:31.072
e1b7b8ae-3b84-498e-8c16-70e5ad1e0e21	students:promote	students	promote	\N	Promote students to next grade	2026-07-29 18:33:31.072	2026-07-29 18:33:31.072
b087d4d3-fbb9-4af8-b7b4-e9a93895b75a	teachers:read	teachers	read	\N	View teachers	2026-07-29 18:33:31.073	2026-07-29 18:33:31.073
6edf2316-181d-4715-b62c-0cbf8f724ed7	teachers:write	teachers	write	\N	Create teachers	2026-07-29 18:33:31.073	2026-07-29 18:33:31.073
dc493e43-524c-4c3c-aaee-e5a1adcddd1d	teachers:edit	teachers	edit	\N	Edit teachers	2026-07-29 18:33:31.074	2026-07-29 18:33:31.074
cd888a96-76d8-4c87-92d5-da832d25b2e1	teachers:delete	teachers	delete	\N	Delete teachers	2026-07-29 18:33:31.074	2026-07-29 18:33:31.074
3bbecf49-76ef-402c-8291-de896242bdaf	courses:read	courses	read	\N	View courses	2026-07-29 18:33:31.075	2026-07-29 18:33:31.075
a27d7941-848a-47c6-80c3-0f28714333b8	courses:write	courses	write	\N	Create courses	2026-07-29 18:33:31.075	2026-07-29 18:33:31.075
00071ac1-35da-44f4-b971-60c8647fdc39	courses:edit	courses	edit	\N	Edit courses	2026-07-29 18:33:31.076	2026-07-29 18:33:31.076
d37c6ade-8cc8-4672-999f-8ab82f95af27	courses:delete	courses	delete	\N	Delete courses	2026-07-29 18:33:31.076	2026-07-29 18:33:31.076
bf2ba494-ca7c-4e74-b28c-eab506813d83	grades:read	grades	read	\N	View grades	2026-07-29 18:33:31.077	2026-07-29 18:33:31.077
29dbce88-67ef-43c8-88ac-52accef54aee	grades:write	grades	write	\N	Create grades	2026-07-29 18:33:31.077	2026-07-29 18:33:31.077
974a9db2-9727-4a23-b909-2d3749b322e9	grades:edit	grades	edit	\N	Edit grades	2026-07-29 18:33:31.077	2026-07-29 18:33:31.077
1cb34db4-e46a-4f7f-8729-fe2e04e8d580	grades:delete	grades	delete	\N	Delete grades	2026-07-29 18:33:31.078	2026-07-29 18:33:31.078
74eecad0-a2db-46fd-b41e-71f1e54025aa	sections:read	sections	read	\N	View sections	2026-07-29 18:33:31.078	2026-07-29 18:33:31.078
27d9d7a0-3d14-42b8-b51f-973327f92894	sections:write	sections	write	\N	Create sections	2026-07-29 18:33:31.079	2026-07-29 18:33:31.079
d9d78ce3-1612-4e88-ac0f-6715ae9f4fa6	sections:edit	sections	edit	\N	Edit sections	2026-07-29 18:33:31.079	2026-07-29 18:33:31.079
ef5b178e-2ab5-4e47-a231-bea2ecf32200	sections:delete	sections	delete	\N	Delete sections	2026-07-29 18:33:31.079	2026-07-29 18:33:31.079
375d5d54-b8a0-4304-bbb8-d3c76b97e4eb	subjects:read	subjects	read	\N	View subjects	2026-07-29 18:33:31.08	2026-07-29 18:33:31.08
2ec7f37d-80b5-4dea-8ee5-b0b58a740aa9	subjects:write	subjects	write	\N	Create subjects	2026-07-29 18:33:31.08	2026-07-29 18:33:31.08
f96c58f6-3168-48e0-aee3-ef4774773374	subjects:edit	subjects	edit	\N	Edit subjects	2026-07-29 18:33:31.081	2026-07-29 18:33:31.081
d42d01ff-e281-405f-aa1a-cf59c46e5066	subjects:delete	subjects	delete	\N	Delete subjects	2026-07-29 18:33:31.081	2026-07-29 18:33:31.081
eb8632e1-5953-4ea0-b992-15e7c37565a4	section-subjects:read	section_subjects	read	\N	View section-subject mappings	2026-07-29 18:33:31.081	2026-07-29 18:33:31.081
2e770c82-073e-4edd-b52e-5fc651fa9be8	section-subjects:write	section_subjects	write	\N	Assign subjects to sections	2026-07-29 18:33:31.082	2026-07-29 18:33:31.082
594b14e1-c58d-42a4-9627-a5c008e1905e	section-subjects:delete	section_subjects	delete	\N	Remove subjects from sections	2026-07-29 18:33:31.082	2026-07-29 18:33:31.082
244ebef0-ec86-47dc-80bd-1de17404f4c8	attendance:read	attendance	read	\N	View attendance records	2026-07-29 18:33:31.082	2026-07-29 18:33:31.082
285da0d8-1d02-4c85-844a-be496326b08b	attendance:read:section	attendance	read	section	View attendance for assigned sections	2026-07-29 18:33:31.083	2026-07-29 18:33:31.083
a2a63af2-4366-4baf-a137-b44c6d216f05	attendance:mark	attendance	mark	\N	Mark student attendance	2026-07-29 18:33:31.083	2026-07-29 18:33:31.083
109f25b1-9f34-4076-bd20-e0ca3a5e3366	attendance:mark:section	attendance	mark	section	Mark attendance for assigned sections	2026-07-29 18:33:31.084	2026-07-29 18:33:31.084
e1fc9ed5-06a8-4fd5-bd58-9fef9f8b1939	attendance:read:own	attendance	read	own	View own child attendance records	2026-07-29 18:33:31.084	2026-07-29 18:33:31.084
25471d10-5029-4ff4-bd61-48a9954fec41	attendance:report	attendance	report	\N	Generate attendance reports	2026-07-29 18:33:31.084	2026-07-29 18:33:31.084
3185119b-3c49-450d-a04a-5e1afefacdc2	staff-attendance:read	staff_attendance	read	\N	View staff attendance	2026-07-29 18:33:31.085	2026-07-29 18:33:31.085
d1bbe994-e08b-479d-b569-02b5b2c2b855	staff-attendance:mark	staff_attendance	mark	\N	Mark staff attendance	2026-07-29 18:33:31.085	2026-07-29 18:33:31.085
9bd66370-d719-4450-a38a-e594b7462aff	staff-attendance:report	staff_attendance	report	\N	Generate staff attendance reports	2026-07-29 18:33:31.085	2026-07-29 18:33:31.085
a09b9a6e-900f-4ce9-8b5e-744696150ab0	exams:read	exams	read	\N	View exams	2026-07-29 18:33:31.086	2026-07-29 18:33:31.086
5dce5c42-3fec-452c-9b79-e0034355fbe1	exams:write	exams	write	\N	Create exams	2026-07-29 18:33:31.086	2026-07-29 18:33:31.086
fe4afc99-03c1-4d22-8241-0580ce854da8	exams:edit	exams	edit	\N	Edit exams	2026-07-29 18:33:31.086	2026-07-29 18:33:31.086
a4852a93-dba3-4dc6-8f90-696906dc9793	exams:delete	exams	delete	\N	Delete exams	2026-07-29 18:33:31.087	2026-07-29 18:33:31.087
59c27a78-011e-4ca8-9e4a-26656a8fa238	exams:manage	exams	manage	\N	Manage exam configuration	2026-07-29 18:33:31.087	2026-07-29 18:33:31.087
5997fecc-5055-443c-b33d-b2828272e55d	exam-schedules:read	exam_schedules	read	\N	View exam schedules	2026-07-29 18:33:31.088	2026-07-29 18:33:31.088
d448ff40-6bef-494a-bbf3-da653391011c	exam-schedules:write	exam_schedules	write	\N	Create exam schedules	2026-07-29 18:33:31.088	2026-07-29 18:33:31.088
be0e3601-d536-4642-9ba7-1ff285ddaf7a	exam-schedules:edit	exam_schedules	edit	\N	Edit exam schedules	2026-07-29 18:33:31.088	2026-07-29 18:33:31.088
6252b279-e454-46bf-87fa-0e28f7ec878a	exam-schedules:delete	exam_schedules	delete	\N	Delete exam schedules	2026-07-29 18:33:31.089	2026-07-29 18:33:31.089
e2363afa-81d0-457b-9076-04dc08d9e7bc	marks:read	marks	read	\N	View marks	2026-07-29 18:33:31.089	2026-07-29 18:33:31.089
150d2aed-af07-4545-a4ee-97e3b9635226	marks:read:section	marks	read	section	View marks for assigned sections	2026-07-29 18:33:31.089	2026-07-29 18:33:31.089
a8862e71-138b-42c5-8f63-9f6971995c8e	marks:read:own	marks	read	own	View own child marks	2026-07-29 18:33:31.09	2026-07-29 18:33:31.09
b0fc6ce6-1b0e-4f2e-91c0-bbf9ad2df40d	marks:entry	marks	entry	\N	Enter marks	2026-07-29 18:33:31.091	2026-07-29 18:33:31.091
e4a2e1e9-d8b6-4533-9fa7-fabf30d085dc	marks:entry:section	marks	entry	section	Enter marks for assigned sections	2026-07-29 18:33:31.091	2026-07-29 18:33:31.091
272d8835-99a4-439b-b9b3-f6a347f3deb5	marks:publish	marks	publish	\N	Publish / lock marks	2026-07-29 18:33:31.092	2026-07-29 18:33:31.092
74bd7ecd-5e8a-46a0-83af-b3e3af8500e7	results:read	results	read	\N	View results	2026-07-29 18:33:31.092	2026-07-29 18:33:31.092
ae2b3e43-04f9-48c3-ae87-e29594049601	results:read:own	results	read	own	View own child results	2026-07-29 18:33:31.092	2026-07-29 18:33:31.092
c5db2f9a-8f8c-4411-8fe8-c3bc54d2170c	results:publish	results	publish	\N	Publish results	2026-07-29 18:33:31.093	2026-07-29 18:33:31.093
8db7d26d-a804-4653-9a43-050a58fce354	results:export	results	export	\N	Export results	2026-07-29 18:33:31.093	2026-07-29 18:33:31.093
a5588fed-86eb-4dae-9ed1-8cc0e4ecd056	grading:read	grading	read	\N	View grading scales	2026-07-29 18:33:31.093	2026-07-29 18:33:31.093
5332c5bf-1afc-4750-8680-60788ebbb589	grading:write	grading	write	\N	Create grading scales	2026-07-29 18:33:31.094	2026-07-29 18:33:31.094
4efac29f-a0a0-4456-94a6-2cbde4927a2b	grading:edit	grading	edit	\N	Edit grading scales	2026-07-29 18:33:31.094	2026-07-29 18:33:31.094
882a614b-c2f3-4e3a-98eb-bf56297ae0df	grading:delete	grading	delete	\N	Delete grading scales	2026-07-29 18:33:31.094	2026-07-29 18:33:31.094
ee7f62cd-859e-47c1-955a-14ea6f890bdf	fee-heads:read	fee_heads	read	\N	View fee heads	2026-07-29 18:33:31.095	2026-07-29 18:33:31.095
4ed4154c-8d2a-4d2c-a07e-905a9fc3267e	fee-heads:write	fee_heads	write	\N	Create fee heads	2026-07-29 18:33:31.095	2026-07-29 18:33:31.095
0fada222-cc3e-4fca-988a-0c200f29d229	fee-heads:edit	fee_heads	edit	\N	Edit fee heads	2026-07-29 18:33:31.096	2026-07-29 18:33:31.096
bd4a0227-0de2-4b65-aa0f-0dd934952871	fee-heads:delete	fee_heads	delete	\N	Delete fee heads	2026-07-29 18:33:31.096	2026-07-29 18:33:31.096
b2efbcf3-b03e-459d-b436-7fe55f0b84e4	fee-terms:read	fee_terms	read	\N	View fee terms	2026-07-29 18:33:31.096	2026-07-29 18:33:31.096
02019e2e-c7b4-460e-8d11-351b627a50ba	fee-terms:write	fee_terms	write	\N	Create fee terms	2026-07-29 18:33:31.097	2026-07-29 18:33:31.097
16ec9837-3448-43d4-853f-9518be3dc378	fee-terms:edit	fee_terms	edit	\N	Edit fee terms	2026-07-29 18:33:31.097	2026-07-29 18:33:31.097
9a33e5c1-29ba-44cc-9be3-3e80e9d30fb1	fee-terms:delete	fee_terms	delete	\N	Delete fee terms	2026-07-29 18:33:31.097	2026-07-29 18:33:31.097
a3d7e721-8e31-4e19-b482-13c8df7f2a04	section-fees:read	section_fees	read	\N	View section fees	2026-07-29 18:33:31.098	2026-07-29 18:33:31.098
a3339fa9-8c81-470a-bd03-058ff519b0ec	section-fees:write	section_fees	write	\N	Configure section fees	2026-07-29 18:33:31.098	2026-07-29 18:33:31.098
f10aa139-60be-4052-937c-ac7d19fef243	section-fees:delete	section_fees	delete	\N	Remove section fees	2026-07-29 18:33:31.099	2026-07-29 18:33:31.099
bb5af5e8-eb7c-48e3-8893-950d8c66c2c9	student-fees:read	student_fees	read	\N	View student fees	2026-07-29 18:33:31.099	2026-07-29 18:33:31.099
2156550f-196a-4067-b7d2-6ee3dce117af	student-fees:read:own	student_fees	read	own	View own child fees	2026-07-29 18:33:31.099	2026-07-29 18:33:31.099
3379cee0-34ae-4409-a26d-d97e44abaf15	student-fees:write	student_fees	write	\N	Assign fees to students	2026-07-29 18:33:31.1	2026-07-29 18:33:31.1
df005ac9-b73a-4f38-a8e8-34a63446eb01	fee-payments:read	fee_payments	read	\N	View fee payments	2026-07-29 18:33:31.1	2026-07-29 18:33:31.1
16366cb8-f976-4b93-b838-ec4f3298a9b6	fee-payments:collect	fee_payments	collect	\N	Collect fee payments	2026-07-29 18:33:31.101	2026-07-29 18:33:31.101
37e8d089-88fd-4c6a-8cc9-2cfc28f88e5c	fee-payments:read:own	fee_payments	read	own	View own child payments	2026-07-29 18:33:31.101	2026-07-29 18:33:31.101
ced6f36f-9e59-4fe9-aaf9-8d48d60fb716	fee-refunds:read	fee_refunds	read	\N	View fee refunds	2026-07-29 18:33:31.101	2026-07-29 18:33:31.101
453fe702-89bc-49fc-93f5-28dfd2eae482	fee-refunds:process	fee_refunds	process	\N	Process fee refunds	2026-07-29 18:33:31.102	2026-07-29 18:33:31.102
7a95d8de-836d-4ea6-aa4b-ac9a56fb5152	payroll:read	payroll	read	\N	View payroll	2026-07-29 18:33:31.102	2026-07-29 18:33:31.102
d2009d89-baf4-4e09-b425-bde745e71faf	payroll:process	payroll	process	\N	Process payroll batches	2026-07-29 18:33:31.102	2026-07-29 18:33:31.102
ba450eb8-63d4-43df-91fd-0d4a7b0a6ea6	salary-components:read	salary_components	read	\N	View salary components	2026-07-29 18:33:31.103	2026-07-29 18:33:31.103
989aec07-b49b-479d-b152-1621cc175af8	salary-components:write	salary_components	write	\N	Create salary components	2026-07-29 18:33:31.103	2026-07-29 18:33:31.103
36b65ce7-3724-4f20-a053-fce0b8b2bd17	compensation:read	compensation	read	\N	View employee compensation	2026-07-29 18:33:31.104	2026-07-29 18:33:31.104
bde6a970-bd47-4013-98eb-663d396c9a8d	compensation:write	compensation	write	\N	Configure employee compensation	2026-07-29 18:33:31.104	2026-07-29 18:33:31.104
c54a5176-ce07-4237-a9ba-03f3f1c047ca	accounts:read	accounts	read	\N	View chart of accounts	2026-07-29 18:33:31.104	2026-07-29 18:33:31.104
ad15962c-0c6b-4ce6-a81d-610e81c72e1a	accounts:write	accounts	write	\N	Create account entries	2026-07-29 18:33:31.105	2026-07-29 18:33:31.105
daa9c048-751a-49be-b635-78f8abe206ce	accounts:edit	accounts	edit	\N	Edit account entries	2026-07-29 18:33:31.105	2026-07-29 18:33:31.105
35f356c2-4831-4c1f-a1e1-89f148ac7de4	transactions:read	transactions	read	\N	View transactions	2026-07-29 18:33:31.105	2026-07-29 18:33:31.105
3069dc76-8272-42b3-a475-5916e6fa086b	transactions:write	transactions	write	\N	Record transactions	2026-07-29 18:33:31.106	2026-07-29 18:33:31.106
6a12c73e-d065-4660-8933-452f3ddb7801	timetable:read	timetable	read	\N	View timetable	2026-07-29 18:33:31.106	2026-07-29 18:33:31.106
e188f296-172c-4bb8-a85a-b291f36fb237	timetable:write	timetable	write	\N	Create timetable entries	2026-07-29 18:33:31.106	2026-07-29 18:33:31.106
5f4b41d1-9a0a-4232-b301-9ea73e34205c	timetable:edit	timetable	edit	\N	Edit timetable	2026-07-29 18:33:31.107	2026-07-29 18:33:31.107
9c871cfd-9e87-49a2-976a-0d9a5c404354	timetable:delete	timetable	delete	\N	Delete timetable entries	2026-07-29 18:33:31.107	2026-07-29 18:33:31.107
d1d4bbb0-c943-4d6f-8ea1-d22ca7a159d3	timetable-structures:read	timetable_structures	read	\N	View timetable structures	2026-07-29 18:33:31.108	2026-07-29 18:33:31.108
6e106c3b-ffe9-4985-9656-7e2eed85f153	timetable-structures:write	timetable_structures	write	\N	Create timetable structures	2026-07-29 18:33:31.108	2026-07-29 18:33:31.108
d0463cc0-d744-46a6-9b40-09ea606e1496	timetable-periods:read	timetable_periods	read	\N	View periods	2026-07-29 18:33:31.108	2026-07-29 18:33:31.108
3e19cafb-e9f5-45d3-8785-ba888a7ee048	timetable-periods:write	timetable_periods	write	\N	Create periods	2026-07-29 18:33:31.109	2026-07-29 18:33:31.109
909f646f-d873-4ab8-9666-414d13dc5f1c	teacher-assignments:read	teacher_assignments	read	\N	View teacher assignments	2026-07-29 18:33:31.109	2026-07-29 18:33:31.109
3a663e85-1d76-4e08-977d-322407354a3c	teacher-assignments:write	teacher_assignments	write	\N	Assign teachers	2026-07-29 18:33:31.109	2026-07-29 18:33:31.109
eda4c65b-08bc-42c2-b45e-f5b1be7bfb4d	teacher-capabilities:read	teacher_capabilities	read	\N	View teacher capabilities	2026-07-29 18:33:31.11	2026-07-29 18:33:31.11
fdb6e7b8-e95f-4e66-8497-ea05e73ea0a9	teacher-capabilities:write	teacher_capabilities	write	\N	Manage teacher capabilities	2026-07-29 18:33:31.11	2026-07-29 18:33:31.11
6a0b0512-31e9-48bd-b9d2-b06bc6ef832a	teacher-availability:read	teacher_availability	read	\N	View teacher availability	2026-07-29 18:33:31.11	2026-07-29 18:33:31.11
cf7ca4ca-549f-482f-ab44-f283d10d3127	teacher-availability:write	teacher_availability	write	\N	Set teacher availability	2026-07-29 18:33:31.111	2026-07-29 18:33:31.111
a5e8c0e7-7736-4b20-aab3-0d3041216243	leave:read	leave	read	\N	View leave requests	2026-07-29 18:33:31.111	2026-07-29 18:33:31.111
991355c8-8bdc-4b5f-a96f-376fbc88124f	leave:read:own	leave	read	own	View own leave requests	2026-07-29 18:33:31.111	2026-07-29 18:33:31.111
17c3c129-39cd-4812-a518-0d8e0755fedc	leave:apply	leave	apply	\N	Apply for leave	2026-07-29 18:33:31.111	2026-07-29 18:33:31.111
d7324a90-0af5-4fbb-b258-da6ea92ab911	leave:approve	leave	approve	\N	Approve leave requests	2026-07-29 18:33:31.112	2026-07-29 18:33:31.112
61907099-d26c-49f4-a4cf-a942a54bbc17	leave:manage	leave	manage	\N	Manage leave categories and configuration	2026-07-29 18:33:31.112	2026-07-29 18:33:31.112
779a4ece-7c6f-413e-a320-a122628decf3	holidays:read	holidays	read	\N	View holidays	2026-07-29 18:33:31.112	2026-07-29 18:33:31.112
bc26d72e-3a56-4f0b-81fe-024998c50272	holidays:write	holidays	write	\N	Create holidays	2026-07-29 18:33:31.113	2026-07-29 18:33:31.113
57f97d8c-6ca4-4be6-ae6e-8d56263253db	holidays:edit	holidays	edit	\N	Edit holidays	2026-07-29 18:33:31.113	2026-07-29 18:33:31.113
d2114434-52a1-4ac0-b7b8-2c54bcc49017	holidays:delete	holidays	delete	\N	Delete holidays	2026-07-29 18:33:31.113	2026-07-29 18:33:31.113
170918a7-0a18-48a1-b1eb-cc7cfb68bb17	parents:read	parents	read	\N	View parents	2026-07-29 18:33:31.113	2026-07-29 18:33:31.113
dfb34eec-dfc7-4b37-bbfa-0f5e7b4b6fb4	parents:write	parents	write	\N	Register parents	2026-07-29 18:33:31.114	2026-07-29 18:33:31.114
f63cf170-c0b9-437a-b96e-ef669fca53a8	parents:edit	parents	edit	\N	Edit parents	2026-07-29 18:33:31.114	2026-07-29 18:33:31.114
22152c27-4fef-4c58-9074-ac785294f97c	parent-portal:access	parent_portal	access	\N	Access parent portal features	2026-07-29 18:33:31.114	2026-07-29 18:33:31.114
b62a88a6-6bbd-425d-b44d-21b6ee7a88b4	transport:read	transport	read	\N	View transport data	2026-07-29 18:33:31.115	2026-07-29 18:33:31.115
37232516-4810-49d9-b7f5-0d3ce98128c3	transport:read:assigned	transport	read	assigned	View assigned routes	2026-07-29 18:33:31.115	2026-07-29 18:33:31.115
29f5b57a-021b-401f-a643-35db5171a122	transport:write	transport	write	\N	Manage vehicles and routes	2026-07-29 18:33:31.115	2026-07-29 18:33:31.115
1f8bb6e9-6013-43ce-8a13-33ad600b519e	transport:assign	transport	assign	\N	Assign students to transport	2026-07-29 18:33:31.116	2026-07-29 18:33:31.116
9d6710ec-26ee-44e3-bd1f-f1351d2649ba	infrastructure:read	infrastructure	read	\N	View buildings, floors, rooms	2026-07-29 18:33:31.116	2026-07-29 18:33:31.116
25fd3010-c55f-4250-9820-f0140a3754ed	infrastructure:write	infrastructure	write	\N	Create infrastructure records	2026-07-29 18:33:31.116	2026-07-29 18:33:31.116
f152b413-c94d-40d0-aa41-14f96c6b35ba	infrastructure:edit	infrastructure	edit	\N	Edit infrastructure	2026-07-29 18:33:31.116	2026-07-29 18:33:31.116
b37c6a38-65ed-4418-bfe0-62bfbf3cd5c9	infrastructure:delete	infrastructure	delete	\N	Delete infrastructure	2026-07-29 18:33:31.117	2026-07-29 18:33:31.117
8d6e805e-6fe2-401d-b483-22027a213103	store:read	store	read	\N	View store items	2026-07-29 18:33:31.117	2026-07-29 18:33:31.117
434395ab-d9cb-4a69-85f2-6322fca8ae2e	store:write	store	write	\N	Manage store inventory	2026-07-29 18:33:31.117	2026-07-29 18:33:31.117
288dfe5a-9d56-4be7-8396-fbe667350f91	store:order	store	order	\N	Place store orders	2026-07-29 18:33:31.118	2026-07-29 18:33:31.118
0cd597b8-110a-4035-9626-b6d28ef21214	store:order:own	store	order	own	Place orders for own child	2026-07-29 18:33:31.118	2026-07-29 18:33:31.118
2a701cfc-d94d-49e4-b094-9c67b68554e3	store:process	store	process	\N	Process store orders, dues, returns	2026-07-29 18:33:31.118	2026-07-29 18:33:31.118
b96200c2-6f2d-4c1f-87e4-709fd224272c	visitors:read	visitors	read	\N	View visitors	2026-07-29 18:33:31.118	2026-07-29 18:33:31.118
a6b9b320-2fed-4995-b7cf-63450f27e507	visitors:write	visitors	write	\N	Register visitors	2026-07-29 18:33:31.119	2026-07-29 18:33:31.119
cd51dd8c-af5b-4acc-a25a-8f8ee1a32335	visitors:approve	visitors	approve	\N	Approve visitor access	2026-07-29 18:33:31.119	2026-07-29 18:33:31.119
53ced1cc-b76f-41dd-bf9e-fc7819448bc9	visitors:check-in	visitors	check_in	\N	Check in visitors	2026-07-29 18:33:31.119	2026-07-29 18:33:31.119
56bf5cd7-b8c3-41ff-9fb8-aa482c0ac58e	imports:execute	imports	execute	\N	Import data (students, teachers, etc.)	2026-07-29 18:33:31.119	2026-07-29 18:33:31.119
8d22e538-a252-4852-a08e-e39091484b1e	settings:read	settings	read	\N	View settings	2026-07-29 18:33:31.12	2026-07-29 18:33:31.12
ab561b6c-8a43-4910-99e5-8730b176e3af	settings:write	settings	write	\N	Update settings	2026-07-29 18:33:31.12	2026-07-29 18:33:31.12
d19d84fb-13f8-43d8-a054-53c70d7fe33c	academic-years:read	academic_years	read	\N	View academic years	2026-07-29 18:33:31.12	2026-07-29 18:33:31.12
70b902ee-e90f-4648-9b6e-fa0df628494c	academic-years:write	academic_years	write	\N	Create academic years	2026-07-29 18:33:31.121	2026-07-29 18:33:31.121
4abbbfc4-1f53-4fd8-aa8a-005f80bde9b7	academic-years:edit	academic_years	edit	\N	Edit academic years	2026-07-29 18:33:31.121	2026-07-29 18:33:31.121
60151a46-3ee1-4282-8ead-92e9917aafbf	tenants:read	tenants	read	\N	View tenants (company-level)	2026-07-29 18:33:31.121	2026-07-29 18:33:31.121
4f47e2ad-f107-4c18-b601-9307f65794f4	tenants:write	tenants	write	\N	Create tenants (company-level)	2026-07-29 18:33:31.121	2026-07-29 18:33:31.121
5e135748-1249-42ab-beb6-7787fbe91b1f	reports:view	reports	view	\N	View reports	2026-07-29 18:33:31.122	2026-07-29 18:33:31.122
b55ef862-1f23-46d0-ac07-af9652183566	reports:export	reports	export	\N	Export reports	2026-07-29 18:33:31.122	2026-07-29 18:33:31.122
ee4f7f31-f1fd-461f-9e60-56736172da1b	query-bot:ask	query-bot	ask	\N	Use AI-powered natural language queries to fetch data	2026-07-29 18:33:31.122	2026-07-29 18:33:31.122
7a867121-9d0b-429e-8641-4647cc2a48ee	hostel:read	hostel	read	\N	View hostel blocks, floors, rooms, room types, and sections	2026-07-29 18:33:31.122	2026-07-29 18:33:31.122
5d0c8871-e5fe-4087-a573-22819a9b803d	hostel:manage	hostel	manage	\N	Create, edit, and delete hostel blocks, floors, rooms, room types, and sections	2026-07-29 18:33:31.123	2026-07-29 18:33:31.123
a6b7c418-7301-49ab-8aea-718c19f97356	hostel:assign-staff	hostel	assign-staff	\N	Assign wardens, in-charges, cooks, mates, and other staff to hostel blocks	2026-07-29 18:33:31.123	2026-07-29 18:33:31.123
61d4efe9-fe1b-40ca-b56a-63f6a1f4c8c4	hostel:allocate	hostel	allocate	\N	Allocate students to hostel rooms and manage allocations	2026-07-29 18:33:31.123	2026-07-29 18:33:31.123
1ad0e50d-0548-4a65-a20c-862f3297ed26	admin:super	admin	super	\N	Full system access (wildcard)	2026-07-29 18:33:31.124	2026-07-29 18:33:31.124
\.


--
-- Data for Name: pickup_points; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pickup_points (id, "tenantId", name, address, latitude, longitude, "isActive", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
493b2e4e-598b-43a6-8b85-e586eeff6a91	765730a3-b25d-4883-ab96-6fc8651b4703	NTR Circle	\N	12.91	77.59	t	\N	\N	2026-08-05 17:25:34.459	2026-08-05 17:25:34.459
\.


--
-- Data for Name: publication_revisions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.publication_revisions (id, "tenantId", "publicationId", revision, title, content, "changedById", "changeSummary", "createdAt") FROM stdin;
\.


--
-- Data for Name: publications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.publications (id, "tenantId", type, title, content, "circularNumber", attachments, "targetUserIds", "targetRoles", "targetGroups", "targetGrades", "targetSections", "targetEmployeeTypes", "targetAudience", "publishDate", "expiryDate", priority, "isPinned", "requireAcknowledgement", "sendNotification", status, "submittedAt", "submittedById", "approvedAt", "approvedById", "approvalRemarks", "rejectedAt", "rejectedById", "rejectionReason", "publishedAt", "archivedAt", "withdrawnAt", revision, "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: role_groups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.role_groups ("roleId", "groupId", "tenantId", "createdAt") FROM stdin;
567be319-a9a7-48c7-a080-9233eff20eed	0a6b2fba-1ba5-43a0-956c-80205b857c05	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.89
c5112950-3319-4e5f-9c7e-7e71be21f3b9	0a6b2fba-1ba5-43a0-956c-80205b857c05	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.945
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	161f2551-3d52-4b36-84f9-949062875c1d	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.97
57ba5326-145a-4cfa-9570-f8689fa5f7fd	f6149011-8c04-472e-9238-36013d5d4ce3	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.977
1cb54f66-24d6-4485-b8fc-b6d658c38703	f6149011-8c04-472e-9238-36013d5d4ce3	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.985
4db2356c-e025-4966-bfc8-e2c05799774d	5f477df4-b18f-40da-bc0f-3403046db2dd	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.998
2e766121-e182-48ec-8698-8e3639178292	0a6b2fba-1ba5-43a0-956c-80205b857c05	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.004
75383efe-6cd0-443b-8a28-73f48f0452a1	c53038a5-d703-45fe-a650-a62449a8edbe	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.009
46b44233-6cee-4804-b205-c8adc7716771	878afd3d-bdf0-4963-bff1-6666924a99f5	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.012
9bb39abc-dd02-40b2-a5e9-6530fe2d2e72	878afd3d-bdf0-4963-bff1-6666924a99f5	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.017
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.role_permissions ("roleId", "permissionId", "tenantId", "createdAt") FROM stdin;
567be319-a9a7-48c7-a080-9233eff20eed	1ad0e50d-0548-4a65-a20c-862f3297ed26	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.886
c5112950-3319-4e5f-9c7e-7e71be21f3b9	1d839a11-9358-4280-9d05-1f437b9698c9	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.892
c5112950-3319-4e5f-9c7e-7e71be21f3b9	5cac3634-2546-44f5-9a86-21201583488c	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.892
c5112950-3319-4e5f-9c7e-7e71be21f3b9	0115c870-2656-4a37-b9b6-ebbebfee8901	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.893
c5112950-3319-4e5f-9c7e-7e71be21f3b9	cf11ddcb-7085-4529-800c-c31ffe9a8563	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.893
c5112950-3319-4e5f-9c7e-7e71be21f3b9	28f633fa-080d-4ec3-b1b0-1815eeb69cc8	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.894
c5112950-3319-4e5f-9c7e-7e71be21f3b9	67ebe7ff-cb32-480e-976b-dd580a1a4008	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.895
c5112950-3319-4e5f-9c7e-7e71be21f3b9	993aa072-ef5a-48de-a467-b2fbeea7daca	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.896
c5112950-3319-4e5f-9c7e-7e71be21f3b9	f503c7c6-11d1-4553-9871-d43d2f1fb9c1	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.897
c5112950-3319-4e5f-9c7e-7e71be21f3b9	11adb936-bbc6-415e-89b3-3658c9daa9c2	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.898
c5112950-3319-4e5f-9c7e-7e71be21f3b9	b4131e89-2c5e-4e9a-8b92-2fe822af5c2d	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.898
c5112950-3319-4e5f-9c7e-7e71be21f3b9	24ae3cac-70ad-41bd-a459-58ba373d7cd6	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.899
c5112950-3319-4e5f-9c7e-7e71be21f3b9	a0ee95c3-8df7-49d9-bf3b-1af921e4b73f	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.899
c5112950-3319-4e5f-9c7e-7e71be21f3b9	e1b7b8ae-3b84-498e-8c16-70e5ad1e0e21	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.9
c5112950-3319-4e5f-9c7e-7e71be21f3b9	b087d4d3-fbb9-4af8-b7b4-e9a93895b75a	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.901
c5112950-3319-4e5f-9c7e-7e71be21f3b9	6edf2316-181d-4715-b62c-0cbf8f724ed7	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.901
c5112950-3319-4e5f-9c7e-7e71be21f3b9	dc493e43-524c-4c3c-aaee-e5a1adcddd1d	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.902
c5112950-3319-4e5f-9c7e-7e71be21f3b9	3bbecf49-76ef-402c-8291-de896242bdaf	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.902
c5112950-3319-4e5f-9c7e-7e71be21f3b9	a27d7941-848a-47c6-80c3-0f28714333b8	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.903
c5112950-3319-4e5f-9c7e-7e71be21f3b9	00071ac1-35da-44f4-b971-60c8647fdc39	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.903
c5112950-3319-4e5f-9c7e-7e71be21f3b9	bf2ba494-ca7c-4e74-b28c-eab506813d83	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.904
c5112950-3319-4e5f-9c7e-7e71be21f3b9	29dbce88-67ef-43c8-88ac-52accef54aee	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.904
c5112950-3319-4e5f-9c7e-7e71be21f3b9	974a9db2-9727-4a23-b909-2d3749b322e9	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.904
c5112950-3319-4e5f-9c7e-7e71be21f3b9	74eecad0-a2db-46fd-b41e-71f1e54025aa	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.905
c5112950-3319-4e5f-9c7e-7e71be21f3b9	27d9d7a0-3d14-42b8-b51f-973327f92894	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.906
c5112950-3319-4e5f-9c7e-7e71be21f3b9	d9d78ce3-1612-4e88-ac0f-6715ae9f4fa6	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.906
c5112950-3319-4e5f-9c7e-7e71be21f3b9	375d5d54-b8a0-4304-bbb8-d3c76b97e4eb	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.907
c5112950-3319-4e5f-9c7e-7e71be21f3b9	2ec7f37d-80b5-4dea-8ee5-b0b58a740aa9	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.907
c5112950-3319-4e5f-9c7e-7e71be21f3b9	f96c58f6-3168-48e0-aee3-ef4774773374	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.908
c5112950-3319-4e5f-9c7e-7e71be21f3b9	eb8632e1-5953-4ea0-b992-15e7c37565a4	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.909
c5112950-3319-4e5f-9c7e-7e71be21f3b9	2e770c82-073e-4edd-b52e-5fc651fa9be8	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.909
c5112950-3319-4e5f-9c7e-7e71be21f3b9	244ebef0-ec86-47dc-80bd-1de17404f4c8	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.91
c5112950-3319-4e5f-9c7e-7e71be21f3b9	a2a63af2-4366-4baf-a137-b44c6d216f05	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.91
c5112950-3319-4e5f-9c7e-7e71be21f3b9	25471d10-5029-4ff4-bd61-48a9954fec41	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.911
c5112950-3319-4e5f-9c7e-7e71be21f3b9	3185119b-3c49-450d-a04a-5e1afefacdc2	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.911
c5112950-3319-4e5f-9c7e-7e71be21f3b9	d1bbe994-e08b-479d-b569-02b5b2c2b855	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.911
c5112950-3319-4e5f-9c7e-7e71be21f3b9	9bd66370-d719-4450-a38a-e594b7462aff	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.912
c5112950-3319-4e5f-9c7e-7e71be21f3b9	a09b9a6e-900f-4ce9-8b5e-744696150ab0	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.912
c5112950-3319-4e5f-9c7e-7e71be21f3b9	5dce5c42-3fec-452c-9b79-e0034355fbe1	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.913
c5112950-3319-4e5f-9c7e-7e71be21f3b9	fe4afc99-03c1-4d22-8241-0580ce854da8	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.913
c5112950-3319-4e5f-9c7e-7e71be21f3b9	59c27a78-011e-4ca8-9e4a-26656a8fa238	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.914
c5112950-3319-4e5f-9c7e-7e71be21f3b9	5997fecc-5055-443c-b33d-b2828272e55d	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.914
c5112950-3319-4e5f-9c7e-7e71be21f3b9	d448ff40-6bef-494a-bbf3-da653391011c	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.915
c5112950-3319-4e5f-9c7e-7e71be21f3b9	be0e3601-d536-4642-9ba7-1ff285ddaf7a	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.915
c5112950-3319-4e5f-9c7e-7e71be21f3b9	e2363afa-81d0-457b-9076-04dc08d9e7bc	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.916
c5112950-3319-4e5f-9c7e-7e71be21f3b9	b0fc6ce6-1b0e-4f2e-91c0-bbf9ad2df40d	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.916
c5112950-3319-4e5f-9c7e-7e71be21f3b9	272d8835-99a4-439b-b9b3-f6a347f3deb5	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.917
c5112950-3319-4e5f-9c7e-7e71be21f3b9	74bd7ecd-5e8a-46a0-83af-b3e3af8500e7	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.917
c5112950-3319-4e5f-9c7e-7e71be21f3b9	c5db2f9a-8f8c-4411-8fe8-c3bc54d2170c	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.918
c5112950-3319-4e5f-9c7e-7e71be21f3b9	8db7d26d-a804-4653-9a43-050a58fce354	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.918
c5112950-3319-4e5f-9c7e-7e71be21f3b9	a5588fed-86eb-4dae-9ed1-8cc0e4ecd056	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.919
c5112950-3319-4e5f-9c7e-7e71be21f3b9	5332c5bf-1afc-4750-8680-60788ebbb589	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.919
c5112950-3319-4e5f-9c7e-7e71be21f3b9	4efac29f-a0a0-4456-94a6-2cbde4927a2b	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.92
c5112950-3319-4e5f-9c7e-7e71be21f3b9	ee7f62cd-859e-47c1-955a-14ea6f890bdf	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.92
c5112950-3319-4e5f-9c7e-7e71be21f3b9	b2efbcf3-b03e-459d-b436-7fe55f0b84e4	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.92
c5112950-3319-4e5f-9c7e-7e71be21f3b9	a3d7e721-8e31-4e19-b482-13c8df7f2a04	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.921
c5112950-3319-4e5f-9c7e-7e71be21f3b9	bb5af5e8-eb7c-48e3-8893-950d8c66c2c9	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.922
c5112950-3319-4e5f-9c7e-7e71be21f3b9	df005ac9-b73a-4f38-a8e8-34a63446eb01	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.923
c5112950-3319-4e5f-9c7e-7e71be21f3b9	ced6f36f-9e59-4fe9-aaf9-8d48d60fb716	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.923
c5112950-3319-4e5f-9c7e-7e71be21f3b9	c54a5176-ce07-4237-a9ba-03f3f1c047ca	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.924
c5112950-3319-4e5f-9c7e-7e71be21f3b9	35f356c2-4831-4c1f-a1e1-89f148ac7de4	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.924
c5112950-3319-4e5f-9c7e-7e71be21f3b9	6a12c73e-d065-4660-8933-452f3ddb7801	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.925
c5112950-3319-4e5f-9c7e-7e71be21f3b9	e188f296-172c-4bb8-a85a-b291f36fb237	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.925
c5112950-3319-4e5f-9c7e-7e71be21f3b9	5f4b41d1-9a0a-4232-b301-9ea73e34205c	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.926
c5112950-3319-4e5f-9c7e-7e71be21f3b9	d1d4bbb0-c943-4d6f-8ea1-d22ca7a159d3	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.926
c5112950-3319-4e5f-9c7e-7e71be21f3b9	6e106c3b-ffe9-4985-9656-7e2eed85f153	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.926
c5112950-3319-4e5f-9c7e-7e71be21f3b9	d0463cc0-d744-46a6-9b40-09ea606e1496	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.927
c5112950-3319-4e5f-9c7e-7e71be21f3b9	3e19cafb-e9f5-45d3-8785-ba888a7ee048	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.928
c5112950-3319-4e5f-9c7e-7e71be21f3b9	909f646f-d873-4ab8-9666-414d13dc5f1c	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.928
c5112950-3319-4e5f-9c7e-7e71be21f3b9	3a663e85-1d76-4e08-977d-322407354a3c	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.928
c5112950-3319-4e5f-9c7e-7e71be21f3b9	eda4c65b-08bc-42c2-b45e-f5b1be7bfb4d	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.929
c5112950-3319-4e5f-9c7e-7e71be21f3b9	fdb6e7b8-e95f-4e66-8497-ea05e73ea0a9	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.93
c5112950-3319-4e5f-9c7e-7e71be21f3b9	6a0b0512-31e9-48bd-b9d2-b06bc6ef832a	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.93
c5112950-3319-4e5f-9c7e-7e71be21f3b9	cf7ca4ca-549f-482f-ab44-f283d10d3127	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.931
c5112950-3319-4e5f-9c7e-7e71be21f3b9	a5e8c0e7-7736-4b20-aab3-0d3041216243	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.931
c5112950-3319-4e5f-9c7e-7e71be21f3b9	d7324a90-0af5-4fbb-b258-da6ea92ab911	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.932
c5112950-3319-4e5f-9c7e-7e71be21f3b9	61907099-d26c-49f4-a4cf-a942a54bbc17	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.932
c5112950-3319-4e5f-9c7e-7e71be21f3b9	779a4ece-7c6f-413e-a320-a122628decf3	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.933
c5112950-3319-4e5f-9c7e-7e71be21f3b9	bc26d72e-3a56-4f0b-81fe-024998c50272	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.933
c5112950-3319-4e5f-9c7e-7e71be21f3b9	57f97d8c-6ca4-4be6-ae6e-8d56263253db	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.933
c5112950-3319-4e5f-9c7e-7e71be21f3b9	170918a7-0a18-48a1-b1eb-cc7cfb68bb17	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.934
c5112950-3319-4e5f-9c7e-7e71be21f3b9	dfb34eec-dfc7-4b37-bbfa-0f5e7b4b6fb4	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.934
c5112950-3319-4e5f-9c7e-7e71be21f3b9	f63cf170-c0b9-437a-b96e-ef669fca53a8	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.935
c5112950-3319-4e5f-9c7e-7e71be21f3b9	b62a88a6-6bbd-425d-b44d-21b6ee7a88b4	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.935
c5112950-3319-4e5f-9c7e-7e71be21f3b9	29f5b57a-021b-401f-a643-35db5171a122	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.936
c5112950-3319-4e5f-9c7e-7e71be21f3b9	1f8bb6e9-6013-43ce-8a13-33ad600b519e	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.936
c5112950-3319-4e5f-9c7e-7e71be21f3b9	9d6710ec-26ee-44e3-bd1f-f1351d2649ba	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.937
c5112950-3319-4e5f-9c7e-7e71be21f3b9	25fd3010-c55f-4250-9820-f0140a3754ed	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.937
c5112950-3319-4e5f-9c7e-7e71be21f3b9	f152b413-c94d-40d0-aa41-14f96c6b35ba	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.938
c5112950-3319-4e5f-9c7e-7e71be21f3b9	8d6e805e-6fe2-401d-b483-22027a213103	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.938
c5112950-3319-4e5f-9c7e-7e71be21f3b9	434395ab-d9cb-4a69-85f2-6322fca8ae2e	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.939
c5112950-3319-4e5f-9c7e-7e71be21f3b9	288dfe5a-9d56-4be7-8396-fbe667350f91	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.939
c5112950-3319-4e5f-9c7e-7e71be21f3b9	2a701cfc-d94d-49e4-b094-9c67b68554e3	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.94
c5112950-3319-4e5f-9c7e-7e71be21f3b9	b96200c2-6f2d-4c1f-87e4-709fd224272c	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.94
c5112950-3319-4e5f-9c7e-7e71be21f3b9	a6b9b320-2fed-4995-b7cf-63450f27e507	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.941
c5112950-3319-4e5f-9c7e-7e71be21f3b9	cd51dd8c-af5b-4acc-a25a-8f8ee1a32335	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.941
c5112950-3319-4e5f-9c7e-7e71be21f3b9	53ced1cc-b76f-41dd-bf9e-fc7819448bc9	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.941
c5112950-3319-4e5f-9c7e-7e71be21f3b9	56bf5cd7-b8c3-41ff-9fb8-aa482c0ac58e	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.942
c5112950-3319-4e5f-9c7e-7e71be21f3b9	8d22e538-a252-4852-a08e-e39091484b1e	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.943
c5112950-3319-4e5f-9c7e-7e71be21f3b9	d19d84fb-13f8-43d8-a054-53c70d7fe33c	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.943
c5112950-3319-4e5f-9c7e-7e71be21f3b9	70b902ee-e90f-4648-9b6e-fa0df628494c	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.943
c5112950-3319-4e5f-9c7e-7e71be21f3b9	4abbbfc4-1f53-4fd8-aa8a-005f80bde9b7	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.944
c5112950-3319-4e5f-9c7e-7e71be21f3b9	5e135748-1249-42ab-beb6-7787fbe91b1f	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.944
c5112950-3319-4e5f-9c7e-7e71be21f3b9	b55ef862-1f23-46d0-ac07-af9652183566	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.944
c5112950-3319-4e5f-9c7e-7e71be21f3b9	ee4f7f31-f1fd-461f-9e60-56736172da1b	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.945
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	1d839a11-9358-4280-9d05-1f437b9698c9	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.946
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	11adb936-bbc6-415e-89b3-3658c9daa9c2	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.947
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	b4131e89-2c5e-4e9a-8b92-2fe822af5c2d	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.948
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	24ae3cac-70ad-41bd-a459-58ba373d7cd6	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.948
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	b087d4d3-fbb9-4af8-b7b4-e9a93895b75a	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.949
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	6edf2316-181d-4715-b62c-0cbf8f724ed7	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.949
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	dc493e43-524c-4c3c-aaee-e5a1adcddd1d	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.949
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	3bbecf49-76ef-402c-8291-de896242bdaf	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.95
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	a27d7941-848a-47c6-80c3-0f28714333b8	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.95
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	00071ac1-35da-44f4-b971-60c8647fdc39	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.951
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	bf2ba494-ca7c-4e74-b28c-eab506813d83	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.951
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	29dbce88-67ef-43c8-88ac-52accef54aee	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.951
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	974a9db2-9727-4a23-b909-2d3749b322e9	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.952
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	74eecad0-a2db-46fd-b41e-71f1e54025aa	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.952
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	27d9d7a0-3d14-42b8-b51f-973327f92894	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.953
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	d9d78ce3-1612-4e88-ac0f-6715ae9f4fa6	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.953
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	375d5d54-b8a0-4304-bbb8-d3c76b97e4eb	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.954
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	2ec7f37d-80b5-4dea-8ee5-b0b58a740aa9	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.954
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	f96c58f6-3168-48e0-aee3-ef4774773374	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.955
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	eb8632e1-5953-4ea0-b992-15e7c37565a4	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.955
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	2e770c82-073e-4edd-b52e-5fc651fa9be8	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.956
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	244ebef0-ec86-47dc-80bd-1de17404f4c8	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.956
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	a09b9a6e-900f-4ce9-8b5e-744696150ab0	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.957
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	5dce5c42-3fec-452c-9b79-e0034355fbe1	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.957
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	fe4afc99-03c1-4d22-8241-0580ce854da8	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.958
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	5997fecc-5055-443c-b33d-b2828272e55d	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.959
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	d448ff40-6bef-494a-bbf3-da653391011c	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.959
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	be0e3601-d536-4642-9ba7-1ff285ddaf7a	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.959
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	e2363afa-81d0-457b-9076-04dc08d9e7bc	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.96
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	b0fc6ce6-1b0e-4f2e-91c0-bbf9ad2df40d	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.96
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	272d8835-99a4-439b-b9b3-f6a347f3deb5	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.961
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	74bd7ecd-5e8a-46a0-83af-b3e3af8500e7	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.961
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	c5db2f9a-8f8c-4411-8fe8-c3bc54d2170c	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.961
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	6a12c73e-d065-4660-8933-452f3ddb7801	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.962
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	e188f296-172c-4bb8-a85a-b291f36fb237	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.962
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	5f4b41d1-9a0a-4232-b301-9ea73e34205c	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.963
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	d1d4bbb0-c943-4d6f-8ea1-d22ca7a159d3	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.963
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	6e106c3b-ffe9-4985-9656-7e2eed85f153	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.964
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	d0463cc0-d744-46a6-9b40-09ea606e1496	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.964
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	3e19cafb-e9f5-45d3-8785-ba888a7ee048	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.965
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	909f646f-d873-4ab8-9666-414d13dc5f1c	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.965
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	3a663e85-1d76-4e08-977d-322407354a3c	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.965
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	eda4c65b-08bc-42c2-b45e-f5b1be7bfb4d	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.966
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	fdb6e7b8-e95f-4e66-8497-ea05e73ea0a9	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.966
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	6a0b0512-31e9-48bd-b9d2-b06bc6ef832a	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.967
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	779a4ece-7c6f-413e-a320-a122628decf3	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.967
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	bc26d72e-3a56-4f0b-81fe-024998c50272	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.967
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	57f97d8c-6ca4-4be6-ae6e-8d56263253db	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.968
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	d19d84fb-13f8-43d8-a054-53c70d7fe33c	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.968
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	70b902ee-e90f-4648-9b6e-fa0df628494c	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.968
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	4abbbfc4-1f53-4fd8-aa8a-005f80bde9b7	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.969
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	5e135748-1249-42ab-beb6-7787fbe91b1f	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.97
57ba5326-145a-4cfa-9570-f8689fa5f7fd	1d839a11-9358-4280-9d05-1f437b9698c9	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.971
57ba5326-145a-4cfa-9570-f8689fa5f7fd	c622a77b-9d6d-49d3-8afe-d46343055dc4	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.972
57ba5326-145a-4cfa-9570-f8689fa5f7fd	285da0d8-1d02-4c85-844a-be496326b08b	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.972
57ba5326-145a-4cfa-9570-f8689fa5f7fd	109f25b1-9f34-4076-bd20-e0ca3a5e3366	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.973
57ba5326-145a-4cfa-9570-f8689fa5f7fd	150d2aed-af07-4545-a4ee-97e3b9635226	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.973
57ba5326-145a-4cfa-9570-f8689fa5f7fd	e4a2e1e9-d8b6-4533-9fa7-fabf30d085dc	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.973
57ba5326-145a-4cfa-9570-f8689fa5f7fd	6a0b0512-31e9-48bd-b9d2-b06bc6ef832a	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.974
57ba5326-145a-4cfa-9570-f8689fa5f7fd	cf7ca4ca-549f-482f-ab44-f283d10d3127	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.974
57ba5326-145a-4cfa-9570-f8689fa5f7fd	991355c8-8bdc-4b5f-a96f-376fbc88124f	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.975
57ba5326-145a-4cfa-9570-f8689fa5f7fd	17c3c129-39cd-4812-a518-0d8e0755fedc	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.975
57ba5326-145a-4cfa-9570-f8689fa5f7fd	779a4ece-7c6f-413e-a320-a122628decf3	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.976
57ba5326-145a-4cfa-9570-f8689fa5f7fd	6a12c73e-d065-4660-8933-452f3ddb7801	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.976
57ba5326-145a-4cfa-9570-f8689fa5f7fd	909f646f-d873-4ab8-9666-414d13dc5f1c	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.976
57ba5326-145a-4cfa-9570-f8689fa5f7fd	5e135748-1249-42ab-beb6-7787fbe91b1f	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.977
1cb54f66-24d6-4485-b8fc-b6d658c38703	1d839a11-9358-4280-9d05-1f437b9698c9	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.978
1cb54f66-24d6-4485-b8fc-b6d658c38703	c622a77b-9d6d-49d3-8afe-d46343055dc4	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.979
1cb54f66-24d6-4485-b8fc-b6d658c38703	285da0d8-1d02-4c85-844a-be496326b08b	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.979
1cb54f66-24d6-4485-b8fc-b6d658c38703	109f25b1-9f34-4076-bd20-e0ca3a5e3366	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.98
1cb54f66-24d6-4485-b8fc-b6d658c38703	150d2aed-af07-4545-a4ee-97e3b9635226	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.98
1cb54f66-24d6-4485-b8fc-b6d658c38703	e4a2e1e9-d8b6-4533-9fa7-fabf30d085dc	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.981
1cb54f66-24d6-4485-b8fc-b6d658c38703	6a0b0512-31e9-48bd-b9d2-b06bc6ef832a	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.982
1cb54f66-24d6-4485-b8fc-b6d658c38703	cf7ca4ca-549f-482f-ab44-f283d10d3127	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.982
1cb54f66-24d6-4485-b8fc-b6d658c38703	991355c8-8bdc-4b5f-a96f-376fbc88124f	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.982
1cb54f66-24d6-4485-b8fc-b6d658c38703	17c3c129-39cd-4812-a518-0d8e0755fedc	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.983
1cb54f66-24d6-4485-b8fc-b6d658c38703	779a4ece-7c6f-413e-a320-a122628decf3	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.983
1cb54f66-24d6-4485-b8fc-b6d658c38703	6a12c73e-d065-4660-8933-452f3ddb7801	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.984
1cb54f66-24d6-4485-b8fc-b6d658c38703	909f646f-d873-4ab8-9666-414d13dc5f1c	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.984
1cb54f66-24d6-4485-b8fc-b6d658c38703	5e135748-1249-42ab-beb6-7787fbe91b1f	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.984
4db2356c-e025-4966-bfc8-e2c05799774d	1d839a11-9358-4280-9d05-1f437b9698c9	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.986
4db2356c-e025-4966-bfc8-e2c05799774d	ee7f62cd-859e-47c1-955a-14ea6f890bdf	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.986
4db2356c-e025-4966-bfc8-e2c05799774d	4ed4154c-8d2a-4d2c-a07e-905a9fc3267e	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.987
4db2356c-e025-4966-bfc8-e2c05799774d	0fada222-cc3e-4fca-988a-0c200f29d229	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.987
4db2356c-e025-4966-bfc8-e2c05799774d	bd4a0227-0de2-4b65-aa0f-0dd934952871	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.987
4db2356c-e025-4966-bfc8-e2c05799774d	b2efbcf3-b03e-459d-b436-7fe55f0b84e4	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.988
4db2356c-e025-4966-bfc8-e2c05799774d	02019e2e-c7b4-460e-8d11-351b627a50ba	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.988
4db2356c-e025-4966-bfc8-e2c05799774d	16ec9837-3448-43d4-853f-9518be3dc378	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.989
4db2356c-e025-4966-bfc8-e2c05799774d	9a33e5c1-29ba-44cc-9be3-3e80e9d30fb1	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.989
4db2356c-e025-4966-bfc8-e2c05799774d	a3d7e721-8e31-4e19-b482-13c8df7f2a04	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.99
4db2356c-e025-4966-bfc8-e2c05799774d	a3339fa9-8c81-470a-bd03-058ff519b0ec	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.99
4db2356c-e025-4966-bfc8-e2c05799774d	f10aa139-60be-4052-937c-ac7d19fef243	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.991
4db2356c-e025-4966-bfc8-e2c05799774d	bb5af5e8-eb7c-48e3-8893-950d8c66c2c9	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.991
4db2356c-e025-4966-bfc8-e2c05799774d	3379cee0-34ae-4409-a26d-d97e44abaf15	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.991
4db2356c-e025-4966-bfc8-e2c05799774d	df005ac9-b73a-4f38-a8e8-34a63446eb01	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.992
4db2356c-e025-4966-bfc8-e2c05799774d	16366cb8-f976-4b93-b838-ec4f3298a9b6	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.993
4db2356c-e025-4966-bfc8-e2c05799774d	ced6f36f-9e59-4fe9-aaf9-8d48d60fb716	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.993
4db2356c-e025-4966-bfc8-e2c05799774d	453fe702-89bc-49fc-93f5-28dfd2eae482	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.993
4db2356c-e025-4966-bfc8-e2c05799774d	c54a5176-ce07-4237-a9ba-03f3f1c047ca	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.994
4db2356c-e025-4966-bfc8-e2c05799774d	ad15962c-0c6b-4ce6-a81d-610e81c72e1a	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.995
4db2356c-e025-4966-bfc8-e2c05799774d	daa9c048-751a-49be-b635-78f8abe206ce	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.995
4db2356c-e025-4966-bfc8-e2c05799774d	35f356c2-4831-4c1f-a1e1-89f148ac7de4	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.996
4db2356c-e025-4966-bfc8-e2c05799774d	3069dc76-8272-42b3-a475-5916e6fa086b	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.996
4db2356c-e025-4966-bfc8-e2c05799774d	11adb936-bbc6-415e-89b3-3658c9daa9c2	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.997
4db2356c-e025-4966-bfc8-e2c05799774d	5e135748-1249-42ab-beb6-7787fbe91b1f	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.997
4db2356c-e025-4966-bfc8-e2c05799774d	b55ef862-1f23-46d0-ac07-af9652183566	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.998
2e766121-e182-48ec-8698-8e3639178292	1d839a11-9358-4280-9d05-1f437b9698c9	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:55.999
2e766121-e182-48ec-8698-8e3639178292	11adb936-bbc6-415e-89b3-3658c9daa9c2	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56
2e766121-e182-48ec-8698-8e3639178292	b4131e89-2c5e-4e9a-8b92-2fe822af5c2d	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56
2e766121-e182-48ec-8698-8e3639178292	b96200c2-6f2d-4c1f-87e4-709fd224272c	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56
2e766121-e182-48ec-8698-8e3639178292	a6b9b320-2fed-4995-b7cf-63450f27e507	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.001
2e766121-e182-48ec-8698-8e3639178292	cd51dd8c-af5b-4acc-a25a-8f8ee1a32335	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.001
2e766121-e182-48ec-8698-8e3639178292	53ced1cc-b76f-41dd-bf9e-fc7819448bc9	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.002
2e766121-e182-48ec-8698-8e3639178292	56bf5cd7-b8c3-41ff-9fb8-aa482c0ac58e	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.002
2e766121-e182-48ec-8698-8e3639178292	170918a7-0a18-48a1-b1eb-cc7cfb68bb17	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.003
2e766121-e182-48ec-8698-8e3639178292	779a4ece-7c6f-413e-a320-a122628decf3	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.003
2e766121-e182-48ec-8698-8e3639178292	a5e8c0e7-7736-4b20-aab3-0d3041216243	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.003
75383efe-6cd0-443b-8a28-73f48f0452a1	1d839a11-9358-4280-9d05-1f437b9698c9	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.005
75383efe-6cd0-443b-8a28-73f48f0452a1	a1b99c88-c1db-4f53-a7c4-b5da349839ad	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.005
75383efe-6cd0-443b-8a28-73f48f0452a1	e1fc9ed5-06a8-4fd5-bd58-9fef9f8b1939	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.006
75383efe-6cd0-443b-8a28-73f48f0452a1	a8862e71-138b-42c5-8f63-9f6971995c8e	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.006
75383efe-6cd0-443b-8a28-73f48f0452a1	ae2b3e43-04f9-48c3-ae87-e29594049601	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.006
75383efe-6cd0-443b-8a28-73f48f0452a1	2156550f-196a-4067-b7d2-6ee3dce117af	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.007
75383efe-6cd0-443b-8a28-73f48f0452a1	37e8d089-88fd-4c6a-8cc9-2cfc28f88e5c	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.007
75383efe-6cd0-443b-8a28-73f48f0452a1	991355c8-8bdc-4b5f-a96f-376fbc88124f	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.008
75383efe-6cd0-443b-8a28-73f48f0452a1	0cd597b8-110a-4035-9626-b6d28ef21214	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.008
75383efe-6cd0-443b-8a28-73f48f0452a1	22152c27-4fef-4c58-9074-ac785294f97c	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.009
46b44233-6cee-4804-b205-c8adc7716771	1d839a11-9358-4280-9d05-1f437b9698c9	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.01
46b44233-6cee-4804-b205-c8adc7716771	37232516-4810-49d9-b7f5-0d3ce98128c3	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.01
46b44233-6cee-4804-b205-c8adc7716771	c622a77b-9d6d-49d3-8afe-d46343055dc4	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.011
46b44233-6cee-4804-b205-c8adc7716771	991355c8-8bdc-4b5f-a96f-376fbc88124f	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.011
46b44233-6cee-4804-b205-c8adc7716771	17c3c129-39cd-4812-a518-0d8e0755fedc	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.012
9bb39abc-dd02-40b2-a5e9-6530fe2d2e72	1d839a11-9358-4280-9d05-1f437b9698c9	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.013
9bb39abc-dd02-40b2-a5e9-6530fe2d2e72	b62a88a6-6bbd-425d-b44d-21b6ee7a88b4	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.013
9bb39abc-dd02-40b2-a5e9-6530fe2d2e72	29f5b57a-021b-401f-a643-35db5171a122	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.014
9bb39abc-dd02-40b2-a5e9-6530fe2d2e72	1f8bb6e9-6013-43ce-8a13-33ad600b519e	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.014
9bb39abc-dd02-40b2-a5e9-6530fe2d2e72	11adb936-bbc6-415e-89b3-3658c9daa9c2	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.015
9bb39abc-dd02-40b2-a5e9-6530fe2d2e72	a5e8c0e7-7736-4b20-aab3-0d3041216243	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.015
9bb39abc-dd02-40b2-a5e9-6530fe2d2e72	779a4ece-7c6f-413e-a320-a122628decf3	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.016
9bb39abc-dd02-40b2-a5e9-6530fe2d2e72	5e135748-1249-42ab-beb6-7787fbe91b1f	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-30 00:05:56.016
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (id, "tenantId", "roleName", description, "isDefault", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
567be319-a9a7-48c7-a080-9233eff20eed	765730a3-b25d-4883-ab96-6fc8651b4703	School Admin	Full system access — manage everything within the school	t	\N	\N	2026-07-29 18:35:55.881	2026-07-29 18:35:55.881
c5112950-3319-4e5f-9c7e-7e71be21f3b9	765730a3-b25d-4883-ab96-6fc8651b4703	Principal	Oversees all academic and administrative operations	t	\N	\N	2026-07-29 18:35:55.891	2026-07-29 18:35:55.891
ccb1ee1c-d9b1-484c-9290-16b761a11bf9	765730a3-b25d-4883-ab96-6fc8651b4703	Academic Coordinator	Manages curriculum, teachers, timetables, and academic operations	t	\N	\N	2026-07-29 18:35:55.946	2026-07-29 18:35:55.946
57ba5326-145a-4cfa-9570-f8689fa5f7fd	765730a3-b25d-4883-ab96-6fc8651b4703	Class Teacher	Manages assigned section — attendance, marks, student records	t	\N	\N	2026-07-29 18:35:55.97	2026-07-29 18:35:55.97
1cb54f66-24d6-4485-b8fc-b6d658c38703	765730a3-b25d-4883-ab96-6fc8651b4703	Subject Teacher	Teaches assigned subjects — marks entry, attendance for assigned sections	t	\N	\N	2026-07-29 18:35:55.978	2026-07-29 18:35:55.978
4db2356c-e025-4966-bfc8-e2c05799774d	765730a3-b25d-4883-ab96-6fc8651b4703	Accountant	Manages all financial operations — fees, payments, refunds, accounts	t	\N	\N	2026-07-29 18:35:55.985	2026-07-29 18:35:55.985
2e766121-e182-48ec-8698-8e3639178292	765730a3-b25d-4883-ab96-6fc8651b4703	Receptionist / Clerk	Front-desk operations — student registration, visitor management, data imports	t	\N	\N	2026-07-29 18:35:55.999	2026-07-29 18:35:55.999
75383efe-6cd0-443b-8a28-73f48f0452a1	765730a3-b25d-4883-ab96-6fc8651b4703	Parent	View own children — attendance, marks, results, fees, store orders	t	\N	\N	2026-07-29 18:35:56.004	2026-07-29 18:35:56.004
46b44233-6cee-4804-b205-c8adc7716771	765730a3-b25d-4883-ab96-6fc8651b4703	Driver	View assigned routes and students on their vehicle	t	\N	\N	2026-07-29 18:35:56.009	2026-07-29 18:35:56.009
9bb39abc-dd02-40b2-a5e9-6530fe2d2e72	765730a3-b25d-4883-ab96-6fc8651b4703	Transport Manager	Manages all transport operations — vehicles, routes, driver assignments	t	\N	\N	2026-07-29 18:35:56.012	2026-07-29 18:35:56.012
\.


--
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rooms (id, "tenantId", "floorId", "roomNumber", "roomName", "roomType", "roomCategory", capacity, status, "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: salary_components; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.salary_components (id, "tenantId", name, description, type, "isActive", "sortOrder", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: section_fee_heads; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.section_fee_heads (id, "tenantId", "sectionFeeId", "feeHeadId", amount, "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
bdfbb508-427f-42a8-abe8-a6d721bdf779	765730a3-b25d-4883-ab96-6fc8651b4703	4bd45dc6-8db5-4a4f-9b98-8c5e3f3e5de5	90d6921d-2211-4efc-8a6c-3979b76ad4e1	20000.00	\N	\N	2026-08-05 16:56:26.858	2026-08-05 16:56:26.858
63c17b73-65c8-4cd9-aee0-bee15ed7679d	765730a3-b25d-4883-ab96-6fc8651b4703	4bd45dc6-8db5-4a4f-9b98-8c5e3f3e5de5	b7b1efa7-3c9c-4704-be1e-e477c90cc7f9	5000.00	\N	\N	2026-08-05 16:56:26.858	2026-08-05 16:56:26.858
\.


--
-- Data for Name: section_fees; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.section_fees (id, "tenantId", "sectionId", "academicYearId", "termCount", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
4bd45dc6-8db5-4a4f-9b98-8c5e3f3e5de5	765730a3-b25d-4883-ab96-6fc8651b4703	2185f8a7-22ee-44b2-8094-81818fd00727	e5f4dea7-1367-4857-b2f3-c4261158304a	4	\N	\N	2026-08-05 16:56:26.858	2026-08-05 16:56:26.858
\.


--
-- Data for Name: section_subjects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.section_subjects (id, "tenantId", "sectionId", "subjectId", "isElective", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: sections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sections (id, "tenantId", "gradeId", "sectionName", "structureId", "roomId", "sectionInChargeId", "attendanceMode", shifts, "createdAt", "updatedAt") FROM stdin;
2185f8a7-22ee-44b2-8094-81818fd00727	765730a3-b25d-4883-ab96-6fc8651b4703	eb13067e-80e0-41ea-84f0-e0c7c9325cf6	A	\N	\N	\N	period_wise	\N	2026-07-29 18:38:14.817	2026-07-29 18:38:14.817
\.


--
-- Data for Name: staff_attendance; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.staff_attendance (id, "tenantId", "teacherId", date, "checkInTime", "checkOutTime", status, "totalMinutes", "sessionCount", remarks, "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: staff_attendance_sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.staff_attendance_sessions (id, "tenantId", "attendanceId", "checkInTime", "checkInLat", "checkInLng", "checkInAccuracy", "checkInMethod", "checkOutTime", "checkOutLat", "checkOutLng", "checkOutAccuracy", "checkOutMethod", "durationMinutes", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: stock_adjustments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stock_adjustments (id, "tenantId", "itemId", "adjustmentAmount", reason, "borrowerName", "borrowerId", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: store_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_categories (id, "tenantId", name, description, "sortOrder", "isActive", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
8539b2dd-7b1c-4a41-ba95-baab3fd847a1	765730a3-b25d-4883-ab96-6fc8651b4703	Books	Note Books	0	t	\N	\N	2026-08-05 17:11:20.818	2026-08-05 17:11:20.818
7da6d064-9adf-4a92-a904-1ee2c230b7ae	765730a3-b25d-4883-ab96-6fc8651b4703	Text Books	\N	0	t	\N	\N	2026-08-05 17:11:29.247	2026-08-05 17:11:29.247
a400deda-9d8c-4fae-a69d-050e35cc1af1	765730a3-b25d-4883-ab96-6fc8651b4703	Accessories	\N	0	t	\N	\N	2026-08-05 17:11:44.56	2026-08-05 17:11:44.56
\.


--
-- Data for Name: store_due_payments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_due_payments (id, "tenantId", "dueId", amount, "paymentDate", "paymentMethod", "transactionId", remarks, "createdById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: store_dues; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_dues (id, "tenantId", "orderId", "enrollmentId", "customerName", "customerPhone", "customerType", "totalDueAmount", "paidAmount", status, remarks, "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
53b108fb-df40-45e2-bdc5-99683c5d9265	765730a3-b25d-4883-ab96-6fc8651b4703	39513c19-0836-4ffb-bee8-750b47b5c1a5	b13585a1-e0e9-4297-97b1-2c1f1ca28b97	Aarav Sharma	\N	student	190.00	0.00	pending	Due from order 39513c19-0836-4ffb-bee8-750b47b5c1a5	\N	\N	2026-08-05 17:15:49.654	2026-08-05 17:15:49.654
\.


--
-- Data for Name: store_kit_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_kit_items (id, "tenantId", "kitId", "productId", "productName", "categoryName", "unitPrice", quantity, "totalPrice", "createdAt", "updatedAt") FROM stdin;
2f71582f-d6ad-4934-bfbf-767471b0a077	765730a3-b25d-4883-ab96-6fc8651b4703	ace78cec-5703-4874-899e-4d04cdaf6a7b	6c1b5bb6-658f-4d65-ad3f-c98b110aaff1	Maths	Text Books	40.00	1	40.00	2026-08-05 17:14:45.291	2026-08-05 17:14:45.291
bf896048-ee54-4801-99b8-9673b92d5c82	765730a3-b25d-4883-ab96-6fc8651b4703	ace78cec-5703-4874-899e-4d04cdaf6a7b	05c9169f-683d-4525-849e-b48ae86d4020	Note Book Rough 300 Pages Classic	Books	25.00	1	25.00	2026-08-05 17:14:45.291	2026-08-05 17:14:45.291
cd6e51ea-2f54-4cb8-8410-5cf4eedde898	765730a3-b25d-4883-ab96-6fc8651b4703	ace78cec-5703-4874-899e-4d04cdaf6a7b	65da2feb-2e83-4140-976e-ffdd07b324b3	Tie	Accessories	30.00	1	30.00	2026-08-05 17:14:45.291	2026-08-05 17:14:45.291
\.


--
-- Data for Name: store_kit_sections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_kit_sections (id, "tenantId", "kitId", "sectionId", "createdAt") FROM stdin;
2ec73e81-ab08-4cbf-96e2-6c110406ca52	765730a3-b25d-4883-ab96-6fc8651b4703	ace78cec-5703-4874-899e-4d04cdaf6a7b	2185f8a7-22ee-44b2-8094-81818fd00727	2026-08-05 17:14:45.291
\.


--
-- Data for Name: store_kits; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_kits (id, "tenantId", name, description, "totalPrice", "isActive", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
ace78cec-5703-4874-899e-4d04cdaf6a7b	765730a3-b25d-4883-ab96-6fc8651b4703	Class 1 Academic Kit	\N	95.00	t	\N	\N	2026-08-05 17:14:45.291	2026-08-05 17:14:45.291
\.


--
-- Data for Name: store_order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_order_items (id, "tenantId", "orderId", "productId", "kitId", "productName", "unitPrice", quantity, "totalPrice", "kitReferenceId", "isReturned", "returnedAt", "createdAt") FROM stdin;
127d92ca-80b1-497f-9b8c-0b779f333d33	765730a3-b25d-4883-ab96-6fc8651b4703	39513c19-0836-4ffb-bee8-750b47b5c1a5	6c1b5bb6-658f-4d65-ad3f-c98b110aaff1	ace78cec-5703-4874-899e-4d04cdaf6a7b	Maths	40.00	1	40.00	kit_ace78cec-5703-4874-899e-4d04cdaf6a7b_1785950149632_n9y4ev	f	\N	2026-08-05 17:15:49.644
52a81a2e-119c-4aa2-8f19-cad433600fed	765730a3-b25d-4883-ab96-6fc8651b4703	39513c19-0836-4ffb-bee8-750b47b5c1a5	05c9169f-683d-4525-849e-b48ae86d4020	ace78cec-5703-4874-899e-4d04cdaf6a7b	Note Book Rough 300 Pages Classic	25.00	1	25.00	kit_ace78cec-5703-4874-899e-4d04cdaf6a7b_1785950149632_n9y4ev	f	\N	2026-08-05 17:15:49.644
8a732a30-db00-4a45-bd45-4927bb227f2d	765730a3-b25d-4883-ab96-6fc8651b4703	39513c19-0836-4ffb-bee8-750b47b5c1a5	65da2feb-2e83-4140-976e-ffdd07b324b3	ace78cec-5703-4874-899e-4d04cdaf6a7b	Tie	30.00	1	30.00	kit_ace78cec-5703-4874-899e-4d04cdaf6a7b_1785950149632_n9y4ev	f	\N	2026-08-05 17:15:49.644
50a0b787-cc59-4a83-ad28-68e459e3b795	765730a3-b25d-4883-ab96-6fc8651b4703	39513c19-0836-4ffb-bee8-750b47b5c1a5	6c1b5bb6-658f-4d65-ad3f-c98b110aaff1	ace78cec-5703-4874-899e-4d04cdaf6a7b	Maths	40.00	1	40.00	kit_ace78cec-5703-4874-899e-4d04cdaf6a7b_1785950149632_eaiitn	f	\N	2026-08-05 17:15:49.644
a48e1da5-f0fd-49e8-b140-17c4b84e12b3	765730a3-b25d-4883-ab96-6fc8651b4703	39513c19-0836-4ffb-bee8-750b47b5c1a5	05c9169f-683d-4525-849e-b48ae86d4020	ace78cec-5703-4874-899e-4d04cdaf6a7b	Note Book Rough 300 Pages Classic	25.00	1	25.00	kit_ace78cec-5703-4874-899e-4d04cdaf6a7b_1785950149632_eaiitn	f	\N	2026-08-05 17:15:49.644
0832b03d-adab-4594-9ffc-a2fda91585ae	765730a3-b25d-4883-ab96-6fc8651b4703	39513c19-0836-4ffb-bee8-750b47b5c1a5	65da2feb-2e83-4140-976e-ffdd07b324b3	ace78cec-5703-4874-899e-4d04cdaf6a7b	Tie	30.00	1	30.00	kit_ace78cec-5703-4874-899e-4d04cdaf6a7b_1785950149632_eaiitn	f	\N	2026-08-05 17:15:49.644
f5a68064-b36d-4bcd-b2a9-9af3f9ff086a	765730a3-b25d-4883-ab96-6fc8651b4703	39513c19-0836-4ffb-bee8-750b47b5c1a5	6c1b5bb6-658f-4d65-ad3f-c98b110aaff1	ace78cec-5703-4874-899e-4d04cdaf6a7b	Maths	40.00	1	40.00	kit_ace78cec-5703-4874-899e-4d04cdaf6a7b_1785950149632_mbbobd	f	\N	2026-08-05 17:15:49.644
6a3af06c-7870-4a5d-8747-07efe3250164	765730a3-b25d-4883-ab96-6fc8651b4703	39513c19-0836-4ffb-bee8-750b47b5c1a5	05c9169f-683d-4525-849e-b48ae86d4020	ace78cec-5703-4874-899e-4d04cdaf6a7b	Note Book Rough 300 Pages Classic	25.00	1	25.00	kit_ace78cec-5703-4874-899e-4d04cdaf6a7b_1785950149632_mbbobd	f	\N	2026-08-05 17:15:49.644
5f54940e-884c-4324-95cb-cc89e494af3e	765730a3-b25d-4883-ab96-6fc8651b4703	39513c19-0836-4ffb-bee8-750b47b5c1a5	65da2feb-2e83-4140-976e-ffdd07b324b3	ace78cec-5703-4874-899e-4d04cdaf6a7b	Tie	30.00	1	30.00	kit_ace78cec-5703-4874-899e-4d04cdaf6a7b_1785950149632_mbbobd	f	\N	2026-08-05 17:15:49.644
07de8dcf-3607-4ad5-bd99-4a8b768fc355	765730a3-b25d-4883-ab96-6fc8651b4703	39513c19-0836-4ffb-bee8-750b47b5c1a5	05c9169f-683d-4525-849e-b48ae86d4020	\N	Note Book Rough 300 Pages Classic	25.00	1	25.00	\N	f	\N	2026-08-05 17:15:49.644
51482b22-6a4b-48b0-895a-b2f52c88e06e	765730a3-b25d-4883-ab96-6fc8651b4703	376b6a52-d6d8-42df-bd7d-b2fc11ada13f	6da909c5-0cc2-4d82-b450-147d9a01d72f	\N	Trojan war	1.00	2	2.00	\N	f	\N	2026-08-05 17:21:31.879
\.


--
-- Data for Name: store_orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_orders (id, "tenantId", "enrollmentId", "academicYearId", "orderDate", "totalAmount", "actualTotalAmount", "discountAmount", "offeredAmount", "customerName", "customerPhone", "customerType", status, remarks, "paymentMethod", "transactionId", "paymentMode", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
39513c19-0836-4ffb-bee8-750b47b5c1a5	765730a3-b25d-4883-ab96-6fc8651b4703	b13585a1-e0e9-4297-97b1-2c1f1ca28b97	\N	2026-08-05 17:15:49.643	310.00	310.00	0.00	\N	\N	\N	student	collected	\N	cash	\N	full	\N	\N	2026-08-05 17:15:49.644	2026-08-05 17:15:49.644
376b6a52-d6d8-42df-bd7d-b2fc11ada13f	765730a3-b25d-4883-ab96-6fc8651b4703	7c902700-c3f2-4aeb-ac8a-ffd4fa49453c	\N	2026-08-05 17:21:31.878	2.00	2.00	0.00	\N	\N	\N	student	collected	\N	cash	\N	full	\N	\N	2026-08-05 17:21:31.879	2026-08-05 17:21:31.879
\.


--
-- Data for Name: store_pending_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_pending_items (id, "tenantId", "orderItemId", "productId", "productName", quantity, status, "collectedAt", "isPaid", "paidAt", "createdById", "createdAt", "updatedAt") FROM stdin;
33fa0f94-271a-45db-8146-db9af19d9dae	765730a3-b25d-4883-ab96-6fc8651b4703	51482b22-6a4b-48b0-895a-b2f52c88e06e	6da909c5-0cc2-4d82-b450-147d9a01d72f	Trojan war	2	collected	2026-08-05 17:21:43.96	f	\N	\N	2026-08-05 17:21:31.889	2026-08-05 17:21:43.96
\.


--
-- Data for Name: store_product_sections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_product_sections (id, "tenantId", "productId", "sectionId", "createdAt") FROM stdin;
2d6f06c4-fa30-4ac1-9b87-a87b7cca0bf9	765730a3-b25d-4883-ab96-6fc8651b4703	6da909c5-0cc2-4d82-b450-147d9a01d72f	2185f8a7-22ee-44b2-8094-81818fd00727	2026-08-05 17:18:04.485
c1f858d1-ab8d-4e9a-8156-dd38bb8b95cc	765730a3-b25d-4883-ab96-6fc8651b4703	eab4fccf-c94d-4912-b1c5-63668f3aee1b	2185f8a7-22ee-44b2-8094-81818fd00727	2026-08-05 17:19:18.441
\.


--
-- Data for Name: store_products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_products (id, "tenantId", "categoryId", name, description, "basePrice", "isActive", "isGeneral", "stockQuantity", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
6c1b5bb6-658f-4d65-ad3f-c98b110aaff1	765730a3-b25d-4883-ab96-6fc8651b4703	7da6d064-9adf-4a92-a904-1ee2c230b7ae	Maths	\N	40.00	t	t	17	\N	\N	2026-08-05 17:13:09.436	2026-08-05 17:15:49.641
65da2feb-2e83-4140-976e-ffdd07b324b3	765730a3-b25d-4883-ab96-6fc8651b4703	a400deda-9d8c-4fae-a69d-050e35cc1af1	Tie	\N	30.00	t	t	17	\N	\N	2026-08-05 17:13:24.926	2026-08-05 17:15:49.642
05c9169f-683d-4525-849e-b48ae86d4020	765730a3-b25d-4883-ab96-6fc8651b4703	8539b2dd-7b1c-4a41-ba95-baab3fd847a1	Note Book Rough 300 Pages Classic	\N	25.00	t	t	16	\N	\N	2026-08-05 17:12:29.936	2026-08-05 17:15:49.643
a6bae1e5-f3a4-4e29-9d73-090761dbe7a5	765730a3-b25d-4883-ab96-6fc8651b4703	8539b2dd-7b1c-4a41-ba95-baab3fd847a1	White Notes	\N	40.00	t	t	1	\N	\N	2026-08-05 17:16:35.891	2026-08-05 17:16:35.891
6da909c5-0cc2-4d82-b450-147d9a01d72f	765730a3-b25d-4883-ab96-6fc8651b4703	8539b2dd-7b1c-4a41-ba95-baab3fd847a1	Trojan war	\N	1.00	t	f	0	\N	\N	2026-08-05 17:17:40.501	2026-08-05 17:18:04.488
eab4fccf-c94d-4912-b1c5-63668f3aee1b	765730a3-b25d-4883-ab96-6fc8651b4703	7da6d064-9adf-4a92-a904-1ee2c230b7ae	1st Class Physics Text Book	\N	0.00	t	f	0	\N	\N	2026-08-05 17:19:18.441	2026-08-05 17:19:18.441
\.


--
-- Data for Name: store_returns; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_returns (id, "tenantId", "orderItemId", "productId", "productName", quantity, "refundAmount", reason, "returnedAt", "createdById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: student_enrollment_electives; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student_enrollment_electives (id, "tenantId", "enrollmentId", "sectionSubjectId", "createdAt") FROM stdin;
\.


--
-- Data for Name: student_enrollments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student_enrollments (id, "tenantId", "studentId", "academicYearId", "gradeId", "sectionId", "rollNumber", status, "joinedAt", "leftAt", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
b13585a1-e0e9-4297-97b1-2c1f1ca28b97	765730a3-b25d-4883-ab96-6fc8651b4703	3941be0c-1dc4-4d47-b6a0-788983a36540	e5f4dea7-1367-4857-b2f3-c4261158304a	eb13067e-80e0-41ea-84f0-e0c7c9325cf6	2185f8a7-22ee-44b2-8094-81818fd00727	1	active	2026-07-31 18:53:12.078	\N	\N	\N	2026-07-31 18:53:12.078	2026-07-31 18:53:12.119
27b21e4c-87dd-4176-b5f1-6a7bc62e8870	765730a3-b25d-4883-ab96-6fc8651b4703	955ec72e-d503-468d-88d2-bc3bcdf69b62	e5f4dea7-1367-4857-b2f3-c4261158304a	eb13067e-80e0-41ea-84f0-e0c7c9325cf6	2185f8a7-22ee-44b2-8094-81818fd00727	2	active	2026-07-31 18:53:12.096	\N	\N	\N	2026-07-31 18:53:12.096	2026-07-31 18:53:12.119
6943453a-d1bb-4dec-8c95-b68dc1b366e1	765730a3-b25d-4883-ab96-6fc8651b4703	ff44edf2-c118-47e5-adea-098b5b273aa0	e5f4dea7-1367-4857-b2f3-c4261158304a	eb13067e-80e0-41ea-84f0-e0c7c9325cf6	2185f8a7-22ee-44b2-8094-81818fd00727	3	active	2026-07-31 18:53:12.106	\N	\N	\N	2026-07-31 18:53:12.106	2026-07-31 18:53:12.119
90dbe0b3-5db6-47e2-83c8-75ceb8971a4d	765730a3-b25d-4883-ab96-6fc8651b4703	d00cce57-1781-4d56-8ab8-8e6b899d524d	e5f4dea7-1367-4857-b2f3-c4261158304a	eb13067e-80e0-41ea-84f0-e0c7c9325cf6	2185f8a7-22ee-44b2-8094-81818fd00727	4	active	2026-07-31 18:53:12.103	\N	\N	\N	2026-07-31 18:53:12.103	2026-07-31 18:53:12.119
13b97166-dbdf-4bf0-9bb7-07912d86d6b9	765730a3-b25d-4883-ab96-6fc8651b4703	6ab78fcb-dfc2-4ac6-bfdd-fd875093a525	e5f4dea7-1367-4857-b2f3-c4261158304a	eb13067e-80e0-41ea-84f0-e0c7c9325cf6	2185f8a7-22ee-44b2-8094-81818fd00727	5	active	2026-07-31 18:53:12.088	\N	\N	\N	2026-07-31 18:53:12.088	2026-07-31 18:53:12.119
a3cfb059-5014-4c8e-aba9-33aa085d7756	765730a3-b25d-4883-ab96-6fc8651b4703	00593e0a-387a-41f4-86ab-f35ad4a46fbe	e5f4dea7-1367-4857-b2f3-c4261158304a	eb13067e-80e0-41ea-84f0-e0c7c9325cf6	2185f8a7-22ee-44b2-8094-81818fd00727	6	active	2026-07-31 18:53:12.112	\N	\N	\N	2026-07-31 18:53:12.112	2026-07-31 18:53:12.119
e187e2f4-6010-441f-ba31-8ac869a36435	765730a3-b25d-4883-ab96-6fc8651b4703	2c137dd7-d5d9-474e-8f54-623851eb7838	e5f4dea7-1367-4857-b2f3-c4261158304a	eb13067e-80e0-41ea-84f0-e0c7c9325cf6	2185f8a7-22ee-44b2-8094-81818fd00727	7	active	2026-07-31 18:53:12.11	\N	\N	\N	2026-07-31 18:53:12.11	2026-07-31 18:53:12.119
375b52a7-a7d1-47ca-aaeb-7438636b4067	765730a3-b25d-4883-ab96-6fc8651b4703	507a669e-1137-43f5-a15c-d7dba57c514e	e5f4dea7-1367-4857-b2f3-c4261158304a	eb13067e-80e0-41ea-84f0-e0c7c9325cf6	2185f8a7-22ee-44b2-8094-81818fd00727	8	active	2026-07-31 18:53:12.092	\N	\N	\N	2026-07-31 18:53:12.092	2026-07-31 18:53:12.119
8063aeb2-90bf-4935-a57c-2dfeda960cf6	765730a3-b25d-4883-ab96-6fc8651b4703	c6fe62d9-904b-48c7-9ca1-d1ea903c57fd	e5f4dea7-1367-4857-b2f3-c4261158304a	eb13067e-80e0-41ea-84f0-e0c7c9325cf6	2185f8a7-22ee-44b2-8094-81818fd00727	9	active	2026-07-31 18:53:12.108	\N	\N	\N	2026-07-31 18:53:12.108	2026-07-31 18:53:12.119
7c902700-c3f2-4aeb-ac8a-ffd4fa49453c	765730a3-b25d-4883-ab96-6fc8651b4703	2a4d5662-8986-4116-a6c8-61d2ad30b9ba	e5f4dea7-1367-4857-b2f3-c4261158304a	eb13067e-80e0-41ea-84f0-e0c7c9325cf6	2185f8a7-22ee-44b2-8094-81818fd00727	10	active	2026-07-31 18:53:12.1	\N	\N	\N	2026-07-31 18:53:12.1	2026-07-31 18:53:12.119
\.


--
-- Data for Name: student_fee_heads; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student_fee_heads (id, "tenantId", "studentFeeId", "feeHeadId", "actualAmount", "negotiatedAmount", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
6394e163-1efe-4762-bef0-3e6ea9c1e0f3	765730a3-b25d-4883-ab96-6fc8651b4703	bdb2a4fb-2f33-4348-869d-07adc72df137	90d6921d-2211-4efc-8a6c-3979b76ad4e1	20000.00	16000.00	\N	\N	2026-08-05 17:02:24.095	2026-08-05 17:02:24.095
52c65f33-6770-4980-87cf-f190ee5abf56	765730a3-b25d-4883-ab96-6fc8651b4703	bdb2a4fb-2f33-4348-869d-07adc72df137	b7b1efa7-3c9c-4704-be1e-e477c90cc7f9	5000.00	4000.00	\N	\N	2026-08-05 17:02:24.095	2026-08-05 17:02:24.095
\.


--
-- Data for Name: student_fees; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student_fees (id, "tenantId", "enrollmentId", "allocationMethod", "totalActualFee", "totalNegotiatedFee", "discountType", "discountValue", "discountReason", "headWiseDiscounts", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
bdb2a4fb-2f33-4348-869d-07adc72df137	765730a3-b25d-4883-ab96-6fc8651b4703	b13585a1-e0e9-4297-97b1-2c1f1ca28b97	equal	25000.00	20000.00	percentage	5000.00	\N	\N	\N	\N	2026-08-05 17:02:24.095	2026-08-05 17:02:24.095
\.


--
-- Data for Name: student_hostel_allocations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student_hostel_allocations (id, "tenantId", "enrollmentId", "roomId", "sectionId", "academicYearId", "fromDate", "toDate", status, "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: student_parents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student_parents (id, "tenantId", "studentId", "parentId", "isPrimary") FROM stdin;
077f0960-ce47-4f20-a090-13cf8d1541af	765730a3-b25d-4883-ab96-6fc8651b4703	3941be0c-1dc4-4d47-b6a0-788983a36540	da33ceff-2079-42b9-aa87-996254da1952	t
b70ec6c3-e3f8-4554-9d90-c18aec141bee	765730a3-b25d-4883-ab96-6fc8651b4703	3941be0c-1dc4-4d47-b6a0-788983a36540	47ccc89e-3e42-4547-b3ca-4fb9582e92b2	f
f9c125f2-9e0e-4b2c-a204-d2fc70929239	765730a3-b25d-4883-ab96-6fc8651b4703	6ab78fcb-dfc2-4ac6-bfdd-fd875093a525	ed5e6dca-601f-4f4e-9035-2e452a26aa31	t
dbf961f1-0774-41ce-a492-27e096519825	765730a3-b25d-4883-ab96-6fc8651b4703	6ab78fcb-dfc2-4ac6-bfdd-fd875093a525	83f9badf-2f84-4789-9ed1-a4d2b5666d52	f
859e5dca-54e8-4b1c-8a24-fa4ea35bca05	765730a3-b25d-4883-ab96-6fc8651b4703	507a669e-1137-43f5-a15c-d7dba57c514e	408f34b0-4f4b-4335-a2c9-d99067de55e0	t
dcf9fa37-52c2-413f-9ab4-e721b3e4a12a	765730a3-b25d-4883-ab96-6fc8651b4703	507a669e-1137-43f5-a15c-d7dba57c514e	b6b5984a-2e9f-4ebe-8fc1-6ea3da3bd68d	f
11123d71-653c-4a71-b226-b86607895fc2	765730a3-b25d-4883-ab96-6fc8651b4703	955ec72e-d503-468d-88d2-bc3bcdf69b62	5f3391e2-8645-4b17-a530-da7a760188cf	t
a17cf551-92a0-451d-a38f-5919201f71e4	765730a3-b25d-4883-ab96-6fc8651b4703	955ec72e-d503-468d-88d2-bc3bcdf69b62	b3c45a38-12be-4fee-9b27-a5c7ed7d4364	f
7179e999-8d32-4805-9d7d-38f0983e4fed	765730a3-b25d-4883-ab96-6fc8651b4703	955ec72e-d503-468d-88d2-bc3bcdf69b62	d88f7ce7-82dc-44e3-a532-38ae3db86159	f
6015a623-6706-415e-a2af-263ec6e930dc	765730a3-b25d-4883-ab96-6fc8651b4703	2a4d5662-8986-4116-a6c8-61d2ad30b9ba	f5d8b378-04be-4656-9a69-e51273b185f8	t
74cf1e2d-1003-4e47-bbe4-55ff2d0a85d8	765730a3-b25d-4883-ab96-6fc8651b4703	2a4d5662-8986-4116-a6c8-61d2ad30b9ba	69c825a9-5d17-4105-b9ec-aa9266349f42	f
34dba487-3459-4e86-ace3-24c4055d2b23	765730a3-b25d-4883-ab96-6fc8651b4703	d00cce57-1781-4d56-8ab8-8e6b899d524d	302ff336-fe0e-49c0-bc06-3541db7e82e4	t
4162bdf5-85b9-434b-8b40-fb1568ec8582	765730a3-b25d-4883-ab96-6fc8651b4703	d00cce57-1781-4d56-8ab8-8e6b899d524d	8ee2f808-7d74-4ecd-9529-b6c5b826efd9	f
ee9f4495-b0de-40e4-a9e9-2a097d7f5b1d	765730a3-b25d-4883-ab96-6fc8651b4703	ff44edf2-c118-47e5-adea-098b5b273aa0	3241ceeb-40aa-4819-91d3-6877bad03115	t
3e4ef465-32dd-4669-8cb4-f79672174db7	765730a3-b25d-4883-ab96-6fc8651b4703	ff44edf2-c118-47e5-adea-098b5b273aa0	eb0be08e-360a-4351-8851-dfc893ddc3da	f
6e715976-541a-4109-880f-70fc6ee3a48d	765730a3-b25d-4883-ab96-6fc8651b4703	c6fe62d9-904b-48c7-9ca1-d1ea903c57fd	bd26d8c9-d53e-4c2d-8a46-725802c43e67	t
d9af5670-7533-4385-841f-88722b883027	765730a3-b25d-4883-ab96-6fc8651b4703	c6fe62d9-904b-48c7-9ca1-d1ea903c57fd	9935c552-632d-4287-886a-4f11bf1e052e	f
2fce21f8-0245-4f3d-b5b3-aa254fd2f8a4	765730a3-b25d-4883-ab96-6fc8651b4703	2c137dd7-d5d9-474e-8f54-623851eb7838	d8dbad28-8b5f-4234-9e68-ac68319bc07e	t
658820d1-bbc2-4d55-bb93-7dc653c20673	765730a3-b25d-4883-ab96-6fc8651b4703	2c137dd7-d5d9-474e-8f54-623851eb7838	ecb5bdcf-fe66-4c4c-98a8-c540eb45d1db	f
cfe22c09-b0bf-4b1a-bbff-100c97ae595b	765730a3-b25d-4883-ab96-6fc8651b4703	00593e0a-387a-41f4-86ab-f35ad4a46fbe	349684ff-f9f8-4bd2-97e8-9c46664c5279	t
74899152-eb8f-4aeb-9c1f-53a17a8abb27	765730a3-b25d-4883-ab96-6fc8651b4703	00593e0a-387a-41f4-86ab-f35ad4a46fbe	a50d9d52-3f08-4b6f-a2ae-32c599af324c	f
\.


--
-- Data for Name: student_transport_assignments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student_transport_assignments (id, "tenantId", "enrollmentId", "pickupPointId", "vehicleId", "categoryId", "isActive", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
8968e03f-161f-44d2-8cb3-61dd98108593	765730a3-b25d-4883-ab96-6fc8651b4703	b13585a1-e0e9-4297-97b1-2c1f1ca28b97	493b2e4e-598b-43a6-8b85-e586eeff6a91	\N	c36fedfa-9449-44ac-ae08-6c6008e3e297	t	\N	\N	2026-08-05 17:26:00.472	2026-08-05 17:26:00.472
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.students (id, "tenantId", "admissionNumber", pen, "apaarId", "firstName", "middleName", "lastName", "dateOfBirth", gender, "aadhaarNumber", "casteCategory", "subCaste", religion, "motherTongue", "bloodGroup", nationality, "identificationMarks", "fatherName", "fatherOccupation", "fatherPhone", "fatherAadhaar", "motherName", "motherOccupation", "motherPhone", "motherAadhaar", "guardianName", "guardianRelation", "guardianContact", "guardianOccupation", "guardianAadhaar", "classApplyingFor", "mediumOfInstruction", "previousSchoolName", "previousClassAttended", "transferCertificateNo", "dateOfIssueTC", "modeOfTransport", "permanentAddress", state, pincode, "feePaymentMode", "bankAccountDetails", "midDayMealEligibility", "gradeId", "sectionId", status, "deletedAt", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
3941be0c-1dc4-4d47-b6a0-788983a36540	765730a3-b25d-4883-ab96-6fc8651b4703	ADM-2026-001	\N	\N	Aarav	Kumar	Sharma	2018-03-14 18:30:00	Male	\N	General	\N	Hindu	Hindi	O+	Indian	\N	Rajesh Sharma	Engineer	+919876543201	\N	Sunita Sharma	Teacher	+919876543202	\N	\N	\N	\N	\N	\N	\N	\N	English	DPS Delhi	\N	2000-12-31 18:30:00	01/04/2026	Bus	12 MG Road Delhi	Delhi	110001	Online	f	eb13067e-80e0-41ea-84f0-e0c7c9325cf6	2185f8a7-22ee-44b2-8094-81818fd00727	active	\N	\N	\N	2026-07-31 18:53:12.071	2026-07-31 18:53:12.071
6ab78fcb-dfc2-4ac6-bfdd-fd875093a525	765730a3-b25d-4883-ab96-6fc8651b4703	ADM-2026-002	\N	\N	Ishita	\N	Gupta	2018-06-21 18:30:00	Female	\N	OBC	\N	Hindu	Hindi	B+	Indian	\N	Vikram Gupta	Businessman	+919876543203	\N	Anita Gupta	Housewife	+919876543204	\N	\N	\N	\N	\N	\N	\N	\N	English	St Xaviers	\N	2001-01-31 18:30:00	02/04/2026	Van	45 Park Street Mumbai	Maharashtra	400001	Online	f	eb13067e-80e0-41ea-84f0-e0c7c9325cf6	2185f8a7-22ee-44b2-8094-81818fd00727	active	\N	\N	\N	2026-07-31 18:53:12.088	2026-07-31 18:53:12.088
507a669e-1137-43f5-a15c-d7dba57c514e	765730a3-b25d-4883-ab96-6fc8651b4703	ADM-2026-003	\N	\N	Rohan	Pratap	Singh	2019-01-04 18:30:00	Male	\N	General	\N	Sikh	Punjabi	A+	Indian	\N	Harpreet Singh	Doctor	+919876543205	\N	Gurpreet Kaur	Nurse	+919876543206	\N	\N	\N	\N	\N	\N	\N	\N	English	\N	\N	2001-02-28 18:30:00	03/04/2026	Bus	78 Lake Road Chandigarh	Punjab	160001	Cash	f	eb13067e-80e0-41ea-84f0-e0c7c9325cf6	2185f8a7-22ee-44b2-8094-81818fd00727	active	\N	\N	\N	2026-07-31 18:53:12.092	2026-07-31 18:53:12.092
955ec72e-d503-468d-88d2-bc3bcdf69b62	765730a3-b25d-4883-ab96-6fc8651b4703	ADM-2026-004	\N	\N	Ananya	\N	Reddy	2018-09-29 18:30:00	Female	\N	SC	\N	Hindu	Telugu	O+	Indian	\N	Suresh Reddy	Farmer	+919876543207	\N	Lakshmi Reddy	\N	+919876543208	\N	Rajesh Reddy	Grandfather	+919876543209	\N	\N	\N	\N	English	\N	\N	2001-03-31 18:30:00	04/04/2026	Bus	12 Gandhi Nagar Hyderabad	Telangana	500001	Online	f	eb13067e-80e0-41ea-84f0-e0c7c9325cf6	2185f8a7-22ee-44b2-8094-81818fd00727	active	\N	\N	\N	2026-07-31 18:53:12.095	2026-07-31 18:53:12.095
2a4d5662-8986-4116-a6c8-61d2ad30b9ba	765730a3-b25d-4883-ab96-6fc8651b4703	ADM-2026-005	\N	\N	Vivaan	\N	Patel	2017-12-11 18:30:00	Male	\N	General	\N	Hindu	Gujarati	B+	Indian	\N	Amit Patel	Pharmacist	+919876543210	\N	Neha Patel	Banker	+919876543211	\N	\N	\N	\N	\N	\N	\N	\N	English	\N	\N	\N	\N	\N	Van	34 MG Road Ahmedabad	Gujarat	380001	f	eb13067e-80e0-41ea-84f0-e0c7c9325cf6	2185f8a7-22ee-44b2-8094-81818fd00727	active	\N	\N	\N	2026-07-31 18:53:12.1	2026-07-31 18:53:12.1
d00cce57-1781-4d56-8ab8-8e6b899d524d	765730a3-b25d-4883-ab96-6fc8651b4703	ADM-2026-006	\N	\N	Diya	Elizabeth	Thomas	2018-04-17 18:30:00	Female	\N	Christian	\N	Christian	Malayalam	AB+	Indian	\N	John Thomas	Professor	+919876543212	\N	Mary Thomas	Nurse	+919876543213	\N	\N	\N	\N	\N	\N	\N	\N	English	\N	\N	2001-05-31 18:30:00	06/04/2026	Bus	56 Marine Drive Kochi	Kerala	682001	Online	f	eb13067e-80e0-41ea-84f0-e0c7c9325cf6	2185f8a7-22ee-44b2-8094-81818fd00727	active	\N	\N	\N	2026-07-31 18:53:12.103	2026-07-31 18:53:12.103
ff44edf2-c118-47e5-adea-098b5b273aa0	765730a3-b25d-4883-ab96-6fc8651b4703	ADM-2026-007	\N	\N	Arjun	\N	Nair	2018-07-24 18:30:00	Male	\N	General	\N	Hindu	Malayalam	A+	Indian	\N	Rajeev Nair	Banker	+919876543214	\N	Deepa Nair	Doctor	+919876543215	\N	\N	\N	\N	\N	\N	\N	\N	English	\N	\N	2001-06-30 18:30:00	07/04/2026	Van	89 MG Road Bengaluru	Karnataka	560001	Online	f	eb13067e-80e0-41ea-84f0-e0c7c9325cf6	2185f8a7-22ee-44b2-8094-81818fd00727	active	\N	\N	\N	2026-07-31 18:53:12.105	2026-07-31 18:53:12.105
c6fe62d9-904b-48c7-9ca1-d1ea903c57fd	765730a3-b25d-4883-ab96-6fc8651b4703	ADM-2026-008	\N	\N	Sanya	\N	Khan	2018-11-08 18:30:00	Female	\N	OBC	\N	Muslim	Urdu	B+	Indian	\N	Imran Khan	Engineer	+919876543216	\N	Shabana Khan	Teacher	+919876543217	\N	\N	\N	\N	\N	\N	\N	\N	English	\N	\N	2001-07-31 18:30:00	08/04/2026	Bus	67 Fort Road Lucknow	Uttar Pradesh	226001	Cash	f	eb13067e-80e0-41ea-84f0-e0c7c9325cf6	2185f8a7-22ee-44b2-8094-81818fd00727	active	\N	\N	\N	2026-07-31 18:53:12.108	2026-07-31 18:53:12.108
2c137dd7-d5d9-474e-8f54-623851eb7838	765730a3-b25d-4883-ab96-6fc8651b4703	ADM-2026-009	\N	\N	Reyansh	\N	Choudhary	2019-02-13 18:30:00	Male	\N	OBC	\N	Hindu	Rajasthani	O+	Indian	\N	Mahesh Choudhary	Businessman	+919876543218	\N	Sunita Choudhary	\N	+919876543219	\N	\N	\N	\N	\N	\N	\N	\N	Hindi	\N	\N	2001-08-31 18:30:00	09/04/2026	Bus	23 Hawa Mahal Jaipur	Rajasthan	302001	Online	f	eb13067e-80e0-41ea-84f0-e0c7c9325cf6	2185f8a7-22ee-44b2-8094-81818fd00727	active	\N	\N	\N	2026-07-31 18:53:12.11	2026-07-31 18:53:12.11
00593e0a-387a-41f4-86ab-f35ad4a46fbe	765730a3-b25d-4883-ab96-6fc8651b4703	ADM-2026-010	\N	\N	Myra	\N	Das	2018-08-02 18:30:00	Female	\N	SC	\N	Hindu	Bengali	B+	Indian	\N	Prasenjit Das	Teacher	+919876543220	\N	Priya Das	\N	+919876543221	\N	Anil Das	Father	+919876543220	\N	\N	\N	\N	English	\N	\N	\N	\N	\N	Bus	78 Salt Lake Kolkata	West Bengal	700001	f	eb13067e-80e0-41ea-84f0-e0c7c9325cf6	2185f8a7-22ee-44b2-8094-81818fd00727	active	\N	\N	\N	2026-07-31 18:53:12.112	2026-07-31 18:53:12.112
\.


--
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.subjects (id, "tenantId", "subjectName", "courseId", "isCommon", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: teacher_assignments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.teacher_assignments (id, "tenantId", "academicYearId", "teacherId", "sectionSubjectId", role, "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: teacher_availability; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.teacher_availability (id, "tenantId", "teacherId", "dayOfWeek", "startTime", "endTime", "isAvailable", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: teacher_capabilities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.teacher_capabilities (id, "tenantId", "teacherId", "subjectId", "courseId", "gradeId", "sectionId", "expertiseLevel", "isPrimary", "priorityScore", "canBeClassTeacher", remarks, "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: teacher_employment_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.teacher_employment_history (id, "tenantId", "teacherId", "organizationName", role, "startDate", "endDate", "reasonForLeaving", "experienceYears", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: teacher_qualifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.teacher_qualifications (id, "tenantId", "teacherId", "qualificationName", specialization, institution, score, "yearOfPassing", "documentUrl", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.teachers (id, "tenantId", "userId", "fullName", email, phone, gender, "employeeCode", "employeeType", "registrationToken", "registrationTokenExp", "isRegistered", "profilePhotoUrl", "dateOfBirth", "dateOfJoining", "yearsOfExperience", "governmentIdType", "governmentIdNumber", "governmentIdUrl", "drivingLicenseNumber", "drivingLicenseUrl", "drivingExperienceYears", "vehicleType", "licenseExpiryDate", "medicalCertificateUrl", status, "deletedAt", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
083f6771-fde1-4846-b84c-663793d41ce9	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Rajesh Kumar	rajesh.kumar@school.in	+919876540101	Male	EMP-001	teacher	\N	\N	f	\N	1985-05-14 18:30:00	2015-05-31 18:30:00	10	aadhar	123456789012	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2026-07-29 18:39:23.67	2026-07-29 18:39:23.67
d2a6845e-7d71-443f-919e-e7070d0133de	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Sunita Sharma	sunita.sharma@school.in	+919876540102	Female	EMP-002	teacher	\N	\N	f	\N	1990-09-21 18:30:00	2017-06-14 18:30:00	8	aadhar	234567890123	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2026-07-29 18:39:23.675	2026-07-29 18:39:23.675
00c98178-f480-47b3-9edd-6ebe2c17e3eb	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Vikram Patel	vikram.patel@school.in	+919876540103	Male	EMP-003	admin	\N	\N	f	\N	1982-03-09 18:30:00	2012-03-31 18:30:00	13	pan	ABCDE1234F	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2026-07-29 18:39:23.676	2026-07-29 18:39:23.676
cac41874-9582-40c3-ae65-890a3c3cd7f8	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Anita Desai	anita.desai@school.in	+919876540104	Female	EMP-004	clerk	\N	\N	f	\N	1992-08-04 18:30:00	2019-06-30 18:30:00	6	aadhar	345678901234	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2026-07-29 18:39:23.677	2026-07-29 18:39:23.677
c5a20a0b-6442-40e1-97a7-ada49ccdbca5	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Mohammed Asif	mohammed.asif@school.in	+919876540105	Male	EMP-005	security	\N	\N	f	\N	1980-11-17 18:30:00	2017-12-31 18:30:00	7	voter_id	VOT123456	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2026-07-29 18:39:23.677	2026-07-29 18:39:23.677
3642daa3-4f00-4ecc-bcd4-b79786048d0b	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Priya Banerjee	priya.banerjee@school.in	+919876540106	Female	EMP-006	accountant	\N	\N	f	\N	1988-01-29 18:30:00	2016-08-31 18:30:00	9	pan	FGHIJ5678G	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2026-07-29 18:39:23.678	2026-07-29 18:39:23.678
de14fa41-fba1-47bd-b082-4117c2bf90cc	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Suresh Yadav	suresh.yadav@school.in	+919876540107	Male	EMP-007	driver	\N	\N	f	\N	1983-04-24 18:30:00	2014-02-28 18:30:00	11	aadhar	456789012345	\N	DL-0012345	\N	8	bus	2028-06-14 18:30:00	\N	active	\N	\N	\N	2026-07-29 18:39:23.679	2026-07-29 18:39:23.679
d9b15c00-d867-4939-b13f-6a68befce5ad	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Deepa Nair	deepa.nair@school.in	+919876540108	Female	EMP-008	teacher	\N	\N	f	\N	1991-12-11 18:30:00	2020-06-30 18:30:00	5	aadhar	567890123456	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2026-07-29 18:39:23.679	2026-07-29 18:39:23.679
cc01e6c8-feaa-4f0a-8688-43d00e8179b2	765730a3-b25d-4883-ab96-6fc8651b4703	\N	Kamlesh Tiwari	kamlesh.tiwari@school.in	+919876540109	Male	EMP-009	office_boy	\N	\N	f	\N	1995-01-07 18:30:00	2021-09-30 18:30:00	4	aadhar	678901234567	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2026-07-29 18:39:23.68	2026-07-29 18:39:23.68
a4379069-8f79-488c-9991-574b25a4306c	765730a3-b25d-4883-ab96-6fc8651b4703	f2ee8afd-0771-45d3-a1b5-c3ca8bc54eba	Lakshmi Iyer	lakshmi.iyer@school.in	+919876540110	Female	EMP-010	cleaner	\N	\N	t	\N	1986-06-19 18:30:00	2019-04-30 18:30:00	6	voter_id	VOT789012	\N	\N	\N	\N	\N	\N	\N	active	\N	\N	\N	2026-07-29 18:39:23.68	2026-08-05 16:50:28.697
\.


--
-- Data for Name: tenant_holiday_rules; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tenant_holiday_rules (id, "tenantId", "academicYearId", name, "ruleType", "dayOfWeek", "weekOfMonth", "isActive", remarks, "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: tenant_leave_configurations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tenant_leave_configurations (id, "tenantId", "workingDays", "allowSaturdayHalfDay", "allowLeaveWithoutApproval", "lowBalanceAlertThreshold", "enableLowBalanceAlert", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: tenants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tenants (id, "schoolName", "contactAddress", "contactPhone", "contactEmail", "subscriptionPlan", domain, logo, caption, "defaultTermCount", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
765730a3-b25d-4883-ab96-6fc8651b4703	SSEM	{"zip": "515591", "city": "Bengaluru", "state": "Andhra Pradhesh", "street": "#204, Mythreyi Naimisha apartments"}	+917416557472	admin@school.com	free	http://localhost:3000	https://storage.googleapis.com/school-management-uploads/company/tenants/Screenshot 2026-07-28 at 11.50.07 PM_1785350120385.png	Added For Test	1	\N	\N	2026-07-29 18:35:55.799	2026-07-29 18:35:55.799
\.


--
-- Data for Name: timetable_entries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.timetable_entries (id, "tenantId", "academicYearId", "dayOfWeek", "periodId", "sectionSubjectId", "teacherAssignmentId", room, "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: timetable_periods; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.timetable_periods (id, "tenantId", "structureId", name, type, "startTime", "endTime", "sortOrder", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: timetable_structures; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.timetable_structures (id, "tenantId", name, description, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: token_blacklist; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.token_blacklist (id, token, "expiredAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: uploads; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.uploads (id, "tenantId", "entityType", "entityId", "documentType", "fileUrl", "createdById", "uploadedAt", "updatedAt") FROM stdin;
821de6a4-5dff-4ee6-ade7-fbe8cf4e30f8	\N	tenants	temp-1785350101844	logo	https://storage.googleapis.com/school-management-uploads/company/tenants/Screenshot 2026-07-28 at 11.50.07 PM_1785350120385.png	\N	2026-07-29 18:35:21.289	2026-07-29 18:35:21.289
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_roles ("userId", "roleId", "tenantId", "createdAt") FROM stdin;
ec66aad1-143f-4ae7-8975-a1622087c8c4	567be319-a9a7-48c7-a080-9233eff20eed	765730a3-b25d-4883-ab96-6fc8651b4703	2026-07-29 18:35:56.018
f2ee8afd-0771-45d3-a1b5-c3ca8bc54eba	1cb54f66-24d6-4485-b8fc-b6d658c38703	765730a3-b25d-4883-ab96-6fc8651b4703	2026-08-05 16:51:49.535
f2ee8afd-0771-45d3-a1b5-c3ca8bc54eba	57ba5326-145a-4cfa-9570-f8689fa5f7fd	765730a3-b25d-4883-ab96-6fc8651b4703	2026-08-05 16:51:49.536
21c7c587-89c5-4e08-8328-1aec124b62b8	75383efe-6cd0-443b-8a28-73f48f0452a1	765730a3-b25d-4883-ab96-6fc8651b4703	2026-08-06 17:14:33.016
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, "tenantId", "fullName", email, password, "userType", otp, "otpExpiresAt", "otpPurpose", "isFirstLogin", phone, "permVersion", status, "deletedAt", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
20f0db55-98f8-4582-b115-b4fb8c2d3ccf	\N	Sajid	sajid@gmail.com	$2a$10$RwXoX3sLiTTuLL14lxRwpecwKl0nTrSiLIc7F0oRV6grNW4ykafxy	company	\N	\N	\N	t	\N	0	active	\N	\N	\N	2026-07-29 18:34:37.49	2026-07-29 18:34:37.49
ec66aad1-143f-4ae7-8975-a1622087c8c4	765730a3-b25d-4883-ab96-6fc8651b4703	Mohammed Yaseen	admin@school.com	$2a$10$CQ4PH.lfSQxtkfLxFOQDnOlqifSkODWv6GSUKozsSXKOYfaygKk/W	tenant	\N	\N	\N	t	+917416557472	0	active	\N	\N	\N	2026-07-29 18:35:55.868	2026-07-29 18:35:55.868
f2ee8afd-0771-45d3-a1b5-c3ca8bc54eba	765730a3-b25d-4883-ab96-6fc8651b4703	Lakshmi Iyer	lakshmi.iyer@school.in	$2a$10$w0kFMUBAiMllK4l4NCJ4QOlGlgj9A2GFXUP5umAT1zYx2rvTTVllG	tenant	\N	\N	\N	f	+919876540110	1	active	\N	\N	\N	2026-08-05 16:50:28.686	2026-08-05 16:51:49.536
21c7c587-89c5-4e08-8328-1aec124b62b8	765730a3-b25d-4883-ab96-6fc8651b4703	Imran Khan	imran@gmail.com	$2a$10$0wNQhu9ij1/QZxduPmD2.O.DS2Hgvod2lHaOT9vmu5scJxr4GY3bG	tenant	\N	\N	\N	f	+919876543216	0	active	\N	\N	\N	2026-08-06 17:14:33.013	2026-08-06 17:14:33.013
\.


--
-- Data for Name: vehicle_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.vehicle_categories (id, "tenantId", name, type, occupancy, amenities, description, "isActive", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
c36fedfa-9449-44ac-ae08-6c6008e3e297	765730a3-b25d-4883-ab96-6fc8651b4703	AC Van	van	12	{}	\N	t	\N	\N	2026-08-05 17:23:36.136	2026-08-05 17:23:36.136
\.


--
-- Data for Name: vehicle_driver_assignments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.vehicle_driver_assignments (id, "tenantId", "vehicleId", "driverId", "isPrimaryDriver", "assignedDate", "endDate", status, "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
194ef41d-a150-41b7-9fe6-0b41afe91d2c	765730a3-b25d-4883-ab96-6fc8651b4703	afd91747-c322-4636-8f09-f0c4fb2e803b	00c98178-f480-47b3-9edd-6ebe2c17e3eb	t	2026-08-05 17:24:36.997	\N	active	\N	\N	2026-08-05 17:24:37.038	2026-08-05 17:24:37.038
\.


--
-- Data for Name: vehicles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.vehicles (id, "tenantId", "categoryId", name, "registrationNumber", capacity, description, status, "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
afd91747-c322-4636-8f09-f0c4fb2e803b	765730a3-b25d-4883-ab96-6fc8651b4703	c36fedfa-9449-44ac-ae08-6c6008e3e297	Van 1	KA-04-MZ-5255	12	\N	active	\N	\N	2026-08-05 17:23:57.095	2026-08-05 17:23:57.095
\.


--
-- Data for Name: visitor_notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.visitor_notifications (id, "tenantId", "visitorId", "sentToId", type, message, "isRead", "readAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: visitor_purposes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.visitor_purposes (id, "tenantId", name, description, "requiresApproval", "approvalFrom", "isActive", "sortOrder", "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: visitors; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.visitors (id, "tenantId", "visitorType", "parentId", "visitorName", "visitorPhone", "visitorEmail", "purposeId", description, "pointOfContactId", "approvalStatus", "approvedById", "approvedAt", "rejectionReason", "checkInTime", "checkOutTime", status, "createdById", "updatedById", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: zai_chats; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.zai_chats (id, "tenantId", "userId", title, "createdAt", "updatedAt") FROM stdin;
5519d6ad-7026-433f-ab92-1cbc4fac3f61	765730a3-b25d-4883-ab96-6fc8651b4703	ec66aad1-143f-4ae7-8975-a1622087c8c4	Hi	2026-07-31 19:01:25.966	2026-07-31 19:01:25.966
b1520c56-fbb7-4ca7-a59a-d4ac49647057	765730a3-b25d-4883-ab96-6fc8651b4703	ec66aad1-143f-4ae7-8975-a1622087c8c4	Hello I want to learn about my school would you help me with that?	2026-07-31 19:02:08.044	2026-07-31 19:02:08.044
\.


--
-- Data for Name: zai_messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.zai_messages (id, "chatId", "tenantId", role, content, "queryUsed", "resultData", "resultCount", error, "createdAt") FROM stdin;
777ef321-ebae-4967-9df0-705e36303a07	5519d6ad-7026-433f-ab92-1cbc4fac3f61	765730a3-b25d-4883-ab96-6fc8651b4703	user	Hi	\N	\N	\N	\N	2026-07-31 19:01:25.971
625d1f71-7780-4cc9-9eaf-f57930e93499	5519d6ad-7026-433f-ab92-1cbc4fac3f61	765730a3-b25d-4883-ab96-6fc8651b4703	assistant	Hello! I'm ready to help with your school data. You can ask about students, attendance, exams, fees, staff, schedules, or results.	\N	\N	\N	\N	2026-07-31 19:01:25.973
75d9f37e-c29f-4dd4-88c6-4b7298433699	b1520c56-fbb7-4ca7-a59a-d4ac49647057	765730a3-b25d-4883-ab96-6fc8651b4703	user	Hello I want to learn about my school would you help me with that?	\N	\N	\N	\N	2026-07-31 19:02:08.048
fc3b58e1-b4cb-4a96-994a-4420615e0173	b1520c56-fbb7-4ca7-a59a-d4ac49647057	765730a3-b25d-4883-ab96-6fc8651b4703	assistant	Query execution failed: \nInvalid `modelAccessor.findFirst()` invocation in\n/Users/mohammedyaseen/Documents/GitHub/school-management-application/.next/dev/server/chunks/[root-of-the-server]__54522ea2._.js:75:42\n\n  72     result = await modelAccessor.findMany(sanitizedArgs);\n  73     break;\n  74 case 'findFirst':\n→ 75     result = await modelAccessor.findFirst({\n           where: {\n             id: "765730a3-b25d-4883-ab96-6fc8651b4703",\n             tenantId: "765730a3-b25d-4883-ab96-6fc8651b4703"\n           },\n           include: {\n             schoolName: true,\n             ~~~~~~~~~~\n             contactPhone: true,\n             subscriptionPlan: true,\n             domain: true,\n             logo: true,\n             defaultTermCount: true,\n             academicYears: {\n               select: {\n                 id: true,\n                 startDate: true,\n                 status: true\n               },\n               take: 5\n             },\n             courses: {\n               select: {\n                 id: true,\n                 courseName: true\n               },\n               take: 10\n             },\n             sections: {\n               select: {\n                 id: true,\n                 sectionName: true\n               },\n               take: 10\n             },\n             teachers: {\n               select: {\n                 id: true,\n                 fullName: true,\n                 employeeType: true\n               },\n               take: 10\n             },\n             students: {\n               select: {\n                 id: true,\n                 firstName: true,\n                 lastName: true\n               },\n               take: 10\n             },\n         ?   users?: true,\n         ?   roles?: true,\n         ?   courses?: true,\n         ?   grades?: true,\n         ?   sections?: true,\n         ?   subjects?: true,\n         ?   sectionSubjects?: true,\n         ?   students?: true,\n         ?   inventoryCategories?: true,\n         ?   inventoryItems?: true,\n         ?   stockAdjustments?: true,\n         ?   uploads?: true,\n         ?   academicYears?: true,\n         ?   enrollments?: true,\n         ?   teachers?: true,\n         ?   teacherQualifications?: true,\n         ?   teacherEmploymentHistory?: true,\n         ?   teacherAssignments?: true,\n         ?   teacherCapabilities?: true,\n         ?   timetableStructures?: true,\n         ?   timetablePeriods?: true,\n         ?   timetableEntries?: true,\n         ?   attendanceTypes?: true,\n         ?   attendanceSessions?: true,\n         ?   studentEnrollmentElectives?: true,\n         ?   attendanceMarks?: true,\n         ?   parents?: true,\n         ?   studentParents?: true,\n         ?   exams?: true,\n         ?   examTargetGrades?: true,\n         ?   examTargetSections?: true,\n         ?   examSchedules?: true,\n         ?   examSchedulePapers?: true,\n         ?   examMarks?: true,\n         ?   gradingScales?: true,\n         ?   gradingBands?: true,\n         ?   holidays?: true,\n         ?   holidayCategories?: true,\n         ?   tenantHolidayRules?: true,\n         ?   buildings?: true,\n         ?   floors?: true,\n         ?   rooms?: true,\n         ?   teacherAvailabilities?: true,\n         ?   feeHeads?: true,\n         ?   sectionFees?: true,\n         ?   sectionFeeHeads?: true,\n         ?   feeTerms?: true,\n         ?   studentFees?: true,\n         ?   studentFeeHeads?: true,\n         ?   feePayments?: true,\n         ?   feeRefunds?: true,\n         ?   storeCategories?: true,\n         ?   storeProducts?: true,\n         ?   storeProductSections?: true,\n         ?   storeKits?: true,\n         ?   storeKitItems?: true,\n         ?   storeKitSections?: true,\n         ?   storeOrders?: true,\n         ?   storeOrderItems?: true,\n         ?   storePendingItems?: true,\n         ?   storeDues?: true,\n         ?   storeDuePayments?: true,\n         ?   storeReturns?: true,\n         ?   accountCategories?: true,\n         ?   accountTransactions?: true,\n         ?   salaryComponents?: true,\n         ?   employeeCompensations?: true,\n         ?   compensationComponents?: true,\n         ?   compensationHistory?: true,\n         ?   payrollBatches?: true,\n         ?   payrollRecords?: true,\n         ?   vehicleCategories?: true,\n         ?   vehicles?: true,\n         ?   vehicleDriverAssignments?: true,\n         ?   pickupPoints?: true,\n         ?   studentTransportAssignments?: true,\n         ?   visitorPurposes?: true,\n         ?   visitors?: true,\n         ?   visitorNotifications?: true,\n         ?   staffAttendances?: true,\n         ?   staffAttendanceSessions?: true,\n         ?   leaveCategories?: true,\n         ?   leaveRequests?: true,\n         ?   leaveApprovals?: true,\n         ?   leaveCancellations?: true,\n         ?   leaveAuditLogs?: true,\n         ?   leaveNotifications?: true,\n         ?   employeeLeaveBalances?: true,\n         ?   leaveBalanceTransactions?: true,\n         ?   employeeLeaveLossOfPays?: true,\n         ?   tenantLeaveConfiguration?: true,\n         ?   idSequencePatterns?: true,\n         ?   idSequenceLogs?: true,\n         ?   groups?: true,\n         ?   hostelBlocks?: true,\n         ?   hostelFloors?: true,\n         ?   hostelRoomTypes?: true,\n         ?   hostelRooms?: true,\n         ?   hostelSections?: true,\n         ?   hostelSectionRooms?: true,\n         ?   hostelStaffAssignments?: true,\n         ?   studentHostelAllocations?: true,\n         ?   communications?: true,\n         ?   communicationRecipients?: true,\n         ?   publications?: true,\n         ?   publicationRevisions?: true,\n         ?   notificationTemplates?: true,\n         ?   automationRules?: true,\n         ?   channelConfigurations?: true,\n         ?   zaiChats?: true\n           }\n         })\n\nInvalid scalar field `schoolName` for include statement on model Tenant. Available options are marked with ?.\nNote that include statements only accept relation fields.	{"where": {"id": "__TENANT_ID__"}, "include": {"logo": true, "domain": true, "courses": {"take": 10, "select": {"id": true, "courseName": true}}, "sections": {"take": 10, "select": {"id": true, "sectionName": true}}, "students": {"take": 10, "select": {"id": true, "lastName": true, "firstName": true}}, "teachers": {"take": 10, "select": {"id": true, "fullName": true, "employeeType": true}}, "schoolName": true, "contactPhone": true, "academicYears": {"take": 5, "select": {"id": true, "status": true, "startDate": true}}, "defaultTermCount": true, "subscriptionPlan": true}}	\N	\N	\nInvalid `modelAccessor.findFirst()` invocation in\n/Users/mohammedyaseen/Documents/GitHub/school-management-application/.next/dev/server/chunks/[root-of-the-server]__54522ea2._.js:75:42\n\n  72     result = await modelAccessor.findMany(sanitizedArgs);\n  73     break;\n  74 case 'findFirst':\n→ 75     result = await modelAccessor.findFirst({\n           where: {\n             id: "765730a3-b25d-4883-ab96-6fc8651b4703",\n             tenantId: "765730a3-b25d-4883-ab96-6fc8651b4703"\n           },\n           include: {\n             schoolName: true,\n             ~~~~~~~~~~\n             contactPhone: true,\n             subscriptionPlan: true,\n             domain: true,\n             logo: true,\n             defaultTermCount: true,\n             academicYears: {\n               select: {\n                 id: true,\n                 startDate: true,\n                 status: true\n               },\n               take: 5\n             },\n             courses: {\n               select: {\n                 id: true,\n                 courseName: true\n               },\n               take: 10\n             },\n             sections: {\n               select: {\n                 id: true,\n                 sectionName: true\n               },\n               take: 10\n             },\n             teachers: {\n               select: {\n                 id: true,\n                 fullName: true,\n                 employeeType: true\n               },\n               take: 10\n             },\n             students: {\n               select: {\n                 id: true,\n                 firstName: true,\n                 lastName: true\n               },\n               take: 10\n             },\n         ?   users?: true,\n         ?   roles?: true,\n         ?   courses?: true,\n         ?   grades?: true,\n         ?   sections?: true,\n         ?   subjects?: true,\n         ?   sectionSubjects?: true,\n         ?   students?: true,\n         ?   inventoryCategories?: true,\n         ?   inventoryItems?: true,\n         ?   stockAdjustments?: true,\n         ?   uploads?: true,\n         ?   academicYears?: true,\n         ?   enrollments?: true,\n         ?   teachers?: true,\n         ?   teacherQualifications?: true,\n         ?   teacherEmploymentHistory?: true,\n         ?   teacherAssignments?: true,\n         ?   teacherCapabilities?: true,\n         ?   timetableStructures?: true,\n         ?   timetablePeriods?: true,\n         ?   timetableEntries?: true,\n         ?   attendanceTypes?: true,\n         ?   attendanceSessions?: true,\n         ?   studentEnrollmentElectives?: true,\n         ?   attendanceMarks?: true,\n         ?   parents?: true,\n         ?   studentParents?: true,\n         ?   exams?: true,\n         ?   examTargetGrades?: true,\n         ?   examTargetSections?: true,\n         ?   examSchedules?: true,\n         ?   examSchedulePapers?: true,\n         ?   examMarks?: true,\n         ?   gradingScales?: true,\n         ?   gradingBands?: true,\n         ?   holidays?: true,\n         ?   holidayCategories?: true,\n         ?   tenantHolidayRules?: true,\n         ?   buildings?: true,\n         ?   floors?: true,\n         ?   rooms?: true,\n         ?   teacherAvailabilities?: true,\n         ?   feeHeads?: true,\n         ?   sectionFees?: true,\n         ?   sectionFeeHeads?: true,\n         ?   feeTerms?: true,\n         ?   studentFees?: true,\n         ?   studentFeeHeads?: true,\n         ?   feePayments?: true,\n         ?   feeRefunds?: true,\n         ?   storeCategories?: true,\n         ?   storeProducts?: true,\n         ?   storeProductSections?: true,\n         ?   storeKits?: true,\n         ?   storeKitItems?: true,\n         ?   storeKitSections?: true,\n         ?   storeOrders?: true,\n         ?   storeOrderItems?: true,\n         ?   storePendingItems?: true,\n         ?   storeDues?: true,\n         ?   storeDuePayments?: true,\n         ?   storeReturns?: true,\n         ?   accountCategories?: true,\n         ?   accountTransactions?: true,\n         ?   salaryComponents?: true,\n         ?   employeeCompensations?: true,\n         ?   compensationComponents?: true,\n         ?   compensationHistory?: true,\n         ?   payrollBatches?: true,\n         ?   payrollRecords?: true,\n         ?   vehicleCategories?: true,\n         ?   vehicles?: true,\n         ?   vehicleDriverAssignments?: true,\n         ?   pickupPoints?: true,\n         ?   studentTransportAssignments?: true,\n         ?   visitorPurposes?: true,\n         ?   visitors?: true,\n         ?   visitorNotifications?: true,\n         ?   staffAttendances?: true,\n         ?   staffAttendanceSessions?: true,\n         ?   leaveCategories?: true,\n         ?   leaveRequests?: true,\n         ?   leaveApprovals?: true,\n         ?   leaveCancellations?: true,\n         ?   leaveAuditLogs?: true,\n         ?   leaveNotifications?: true,\n         ?   employeeLeaveBalances?: true,\n         ?   leaveBalanceTransactions?: true,\n         ?   employeeLeaveLossOfPays?: true,\n         ?   tenantLeaveConfiguration?: true,\n         ?   idSequencePatterns?: true,\n         ?   idSequenceLogs?: true,\n         ?   groups?: true,\n         ?   hostelBlocks?: true,\n         ?   hostelFloors?: true,\n         ?   hostelRoomTypes?: true,\n         ?   hostelRooms?: true,\n         ?   hostelSections?: true,\n         ?   hostelSectionRooms?: true,\n         ?   hostelStaffAssignments?: true,\n         ?   studentHostelAllocations?: true,\n         ?   communications?: true,\n         ?   communicationRecipients?: true,\n         ?   publications?: true,\n         ?   publicationRevisions?: true,\n         ?   notificationTemplates?: true,\n         ?   automationRules?: true,\n         ?   channelConfigurations?: true,\n         ?   zaiChats?: true\n           }\n         })\n\nInvalid scalar field `schoolName` for include statement on model Tenant. Available options are marked with ?.\nNote that include statements only accept relation fields.	2026-07-31 19:02:11.676
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: academic_years academic_years_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academic_years
    ADD CONSTRAINT academic_years_pkey PRIMARY KEY (id);


--
-- Name: account_categories account_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_categories
    ADD CONSTRAINT account_categories_pkey PRIMARY KEY (id);


--
-- Name: account_transactions account_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_transactions
    ADD CONSTRAINT account_transactions_pkey PRIMARY KEY (id);


--
-- Name: attendance_marks attendance_marks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_marks
    ADD CONSTRAINT attendance_marks_pkey PRIMARY KEY (id);


--
-- Name: attendance_sessions attendance_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_sessions
    ADD CONSTRAINT attendance_sessions_pkey PRIMARY KEY (id);


--
-- Name: attendance_types attendance_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_types
    ADD CONSTRAINT attendance_types_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: automation_rules automation_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.automation_rules
    ADD CONSTRAINT automation_rules_pkey PRIMARY KEY (id);


--
-- Name: buildings buildings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.buildings
    ADD CONSTRAINT buildings_pkey PRIMARY KEY (id);


--
-- Name: channel_configurations channel_configurations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.channel_configurations
    ADD CONSTRAINT channel_configurations_pkey PRIMARY KEY (id);


--
-- Name: communication_recipients communication_recipients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communication_recipients
    ADD CONSTRAINT communication_recipients_pkey PRIMARY KEY (id);


--
-- Name: communications communications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications
    ADD CONSTRAINT communications_pkey PRIMARY KEY (id);


--
-- Name: compensation_components compensation_components_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compensation_components
    ADD CONSTRAINT compensation_components_pkey PRIMARY KEY (id);


--
-- Name: compensation_history compensation_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compensation_history
    ADD CONSTRAINT compensation_history_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: employee_compensations employee_compensations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_compensations
    ADD CONSTRAINT employee_compensations_pkey PRIMARY KEY (id);


--
-- Name: employee_leave_balances employee_leave_balances_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_leave_balances
    ADD CONSTRAINT employee_leave_balances_pkey PRIMARY KEY (id);


--
-- Name: employee_leave_loss_of_pay employee_leave_loss_of_pay_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_leave_loss_of_pay
    ADD CONSTRAINT employee_leave_loss_of_pay_pkey PRIMARY KEY (id);


--
-- Name: exam_marks exam_marks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_marks
    ADD CONSTRAINT exam_marks_pkey PRIMARY KEY (id);


--
-- Name: exam_schedule_papers exam_schedule_papers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_schedule_papers
    ADD CONSTRAINT exam_schedule_papers_pkey PRIMARY KEY (id);


--
-- Name: exam_schedules exam_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_schedules
    ADD CONSTRAINT exam_schedules_pkey PRIMARY KEY (id);


--
-- Name: exam_target_grades exam_target_grades_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_target_grades
    ADD CONSTRAINT exam_target_grades_pkey PRIMARY KEY (id);


--
-- Name: exam_target_sections exam_target_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_target_sections
    ADD CONSTRAINT exam_target_sections_pkey PRIMARY KEY (id);


--
-- Name: exams exams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_pkey PRIMARY KEY (id);


--
-- Name: fee_heads fee_heads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_heads
    ADD CONSTRAINT fee_heads_pkey PRIMARY KEY (id);


--
-- Name: fee_payments fee_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_payments
    ADD CONSTRAINT fee_payments_pkey PRIMARY KEY (id);


--
-- Name: fee_refunds fee_refunds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_refunds
    ADD CONSTRAINT fee_refunds_pkey PRIMARY KEY (id);


--
-- Name: fee_terms fee_terms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_terms
    ADD CONSTRAINT fee_terms_pkey PRIMARY KEY (id);


--
-- Name: floors floors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.floors
    ADD CONSTRAINT floors_pkey PRIMARY KEY (id);


--
-- Name: grades grades_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_pkey PRIMARY KEY (id);


--
-- Name: grading_bands grading_bands_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grading_bands
    ADD CONSTRAINT grading_bands_pkey PRIMARY KEY (id);


--
-- Name: grading_scales grading_scales_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grading_scales
    ADD CONSTRAINT grading_scales_pkey PRIMARY KEY (id);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: holiday_categories holiday_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.holiday_categories
    ADD CONSTRAINT holiday_categories_pkey PRIMARY KEY (id);


--
-- Name: holidays holidays_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.holidays
    ADD CONSTRAINT holidays_pkey PRIMARY KEY (id);


--
-- Name: hostel_blocks hostel_blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_blocks
    ADD CONSTRAINT hostel_blocks_pkey PRIMARY KEY (id);


--
-- Name: hostel_floors hostel_floors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_floors
    ADD CONSTRAINT hostel_floors_pkey PRIMARY KEY (id);


--
-- Name: hostel_room_types hostel_room_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_room_types
    ADD CONSTRAINT hostel_room_types_pkey PRIMARY KEY (id);


--
-- Name: hostel_rooms hostel_rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_rooms
    ADD CONSTRAINT hostel_rooms_pkey PRIMARY KEY (id);


--
-- Name: hostel_section_rooms hostel_section_rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_section_rooms
    ADD CONSTRAINT hostel_section_rooms_pkey PRIMARY KEY (id);


--
-- Name: hostel_sections hostel_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_sections
    ADD CONSTRAINT hostel_sections_pkey PRIMARY KEY (id);


--
-- Name: hostel_staff_assignments hostel_staff_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_staff_assignments
    ADD CONSTRAINT hostel_staff_assignments_pkey PRIMARY KEY (id);


--
-- Name: id_sequence_logs id_sequence_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.id_sequence_logs
    ADD CONSTRAINT id_sequence_logs_pkey PRIMARY KEY (id);


--
-- Name: id_sequence_patterns id_sequence_patterns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.id_sequence_patterns
    ADD CONSTRAINT id_sequence_patterns_pkey PRIMARY KEY (id);


--
-- Name: inventory_categories inventory_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory_categories
    ADD CONSTRAINT inventory_categories_pkey PRIMARY KEY (id);


--
-- Name: inventory_items inventory_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory_items
    ADD CONSTRAINT inventory_items_pkey PRIMARY KEY (id);


--
-- Name: leave_approvals leave_approvals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_approvals
    ADD CONSTRAINT leave_approvals_pkey PRIMARY KEY (id);


--
-- Name: leave_audit_logs leave_audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_audit_logs
    ADD CONSTRAINT leave_audit_logs_pkey PRIMARY KEY (id);


--
-- Name: leave_balance_transactions leave_balance_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_balance_transactions
    ADD CONSTRAINT leave_balance_transactions_pkey PRIMARY KEY (id);


--
-- Name: leave_cancellations leave_cancellations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_cancellations
    ADD CONSTRAINT leave_cancellations_pkey PRIMARY KEY (id);


--
-- Name: leave_categories leave_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_categories
    ADD CONSTRAINT leave_categories_pkey PRIMARY KEY (id);


--
-- Name: leave_notifications leave_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_notifications
    ADD CONSTRAINT leave_notifications_pkey PRIMARY KEY (id);


--
-- Name: leave_requests leave_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_pkey PRIMARY KEY (id);


--
-- Name: notification_templates notification_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_templates
    ADD CONSTRAINT notification_templates_pkey PRIMARY KEY (id);


--
-- Name: parents parents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parents
    ADD CONSTRAINT parents_pkey PRIMARY KEY (id);


--
-- Name: payroll_batches payroll_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_batches
    ADD CONSTRAINT payroll_batches_pkey PRIMARY KEY (id);


--
-- Name: payroll_records payroll_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_records
    ADD CONSTRAINT payroll_records_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: pickup_points pickup_points_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pickup_points
    ADD CONSTRAINT pickup_points_pkey PRIMARY KEY (id);


--
-- Name: publication_revisions publication_revisions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publication_revisions
    ADD CONSTRAINT publication_revisions_pkey PRIMARY KEY (id);


--
-- Name: publications publications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT publications_pkey PRIMARY KEY (id);


--
-- Name: role_groups role_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_groups
    ADD CONSTRAINT role_groups_pkey PRIMARY KEY ("roleId", "groupId", "tenantId");


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY ("roleId", "permissionId", "tenantId");


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- Name: salary_components salary_components_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.salary_components
    ADD CONSTRAINT salary_components_pkey PRIMARY KEY (id);


--
-- Name: section_fee_heads section_fee_heads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.section_fee_heads
    ADD CONSTRAINT section_fee_heads_pkey PRIMARY KEY (id);


--
-- Name: section_fees section_fees_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.section_fees
    ADD CONSTRAINT section_fees_pkey PRIMARY KEY (id);


--
-- Name: section_subjects section_subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.section_subjects
    ADD CONSTRAINT section_subjects_pkey PRIMARY KEY (id);


--
-- Name: sections sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_pkey PRIMARY KEY (id);


--
-- Name: staff_attendance staff_attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff_attendance
    ADD CONSTRAINT staff_attendance_pkey PRIMARY KEY (id);


--
-- Name: staff_attendance_sessions staff_attendance_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff_attendance_sessions
    ADD CONSTRAINT staff_attendance_sessions_pkey PRIMARY KEY (id);


--
-- Name: stock_adjustments stock_adjustments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_adjustments
    ADD CONSTRAINT stock_adjustments_pkey PRIMARY KEY (id);


--
-- Name: store_categories store_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_categories
    ADD CONSTRAINT store_categories_pkey PRIMARY KEY (id);


--
-- Name: store_due_payments store_due_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_due_payments
    ADD CONSTRAINT store_due_payments_pkey PRIMARY KEY (id);


--
-- Name: store_dues store_dues_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_dues
    ADD CONSTRAINT store_dues_pkey PRIMARY KEY (id);


--
-- Name: store_kit_items store_kit_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_kit_items
    ADD CONSTRAINT store_kit_items_pkey PRIMARY KEY (id);


--
-- Name: store_kit_sections store_kit_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_kit_sections
    ADD CONSTRAINT store_kit_sections_pkey PRIMARY KEY (id);


--
-- Name: store_kits store_kits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_kits
    ADD CONSTRAINT store_kits_pkey PRIMARY KEY (id);


--
-- Name: store_order_items store_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_order_items
    ADD CONSTRAINT store_order_items_pkey PRIMARY KEY (id);


--
-- Name: store_orders store_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_orders
    ADD CONSTRAINT store_orders_pkey PRIMARY KEY (id);


--
-- Name: store_pending_items store_pending_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_pending_items
    ADD CONSTRAINT store_pending_items_pkey PRIMARY KEY (id);


--
-- Name: store_product_sections store_product_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_product_sections
    ADD CONSTRAINT store_product_sections_pkey PRIMARY KEY (id);


--
-- Name: store_products store_products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_products
    ADD CONSTRAINT store_products_pkey PRIMARY KEY (id);


--
-- Name: store_returns store_returns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_returns
    ADD CONSTRAINT store_returns_pkey PRIMARY KEY (id);


--
-- Name: student_enrollment_electives student_enrollment_electives_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_enrollment_electives
    ADD CONSTRAINT student_enrollment_electives_pkey PRIMARY KEY (id);


--
-- Name: student_enrollments student_enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_enrollments
    ADD CONSTRAINT student_enrollments_pkey PRIMARY KEY (id);


--
-- Name: student_fee_heads student_fee_heads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_fee_heads
    ADD CONSTRAINT student_fee_heads_pkey PRIMARY KEY (id);


--
-- Name: student_fees student_fees_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_fees
    ADD CONSTRAINT student_fees_pkey PRIMARY KEY (id);


--
-- Name: student_hostel_allocations student_hostel_allocations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_hostel_allocations
    ADD CONSTRAINT student_hostel_allocations_pkey PRIMARY KEY (id);


--
-- Name: student_parents student_parents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_parents
    ADD CONSTRAINT student_parents_pkey PRIMARY KEY (id);


--
-- Name: student_transport_assignments student_transport_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_transport_assignments
    ADD CONSTRAINT student_transport_assignments_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: subjects subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (id);


--
-- Name: teacher_assignments teacher_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_assignments
    ADD CONSTRAINT teacher_assignments_pkey PRIMARY KEY (id);


--
-- Name: teacher_availability teacher_availability_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_availability
    ADD CONSTRAINT teacher_availability_pkey PRIMARY KEY (id);


--
-- Name: teacher_capabilities teacher_capabilities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_capabilities
    ADD CONSTRAINT teacher_capabilities_pkey PRIMARY KEY (id);


--
-- Name: teacher_employment_history teacher_employment_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_employment_history
    ADD CONSTRAINT teacher_employment_history_pkey PRIMARY KEY (id);


--
-- Name: teacher_qualifications teacher_qualifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_qualifications
    ADD CONSTRAINT teacher_qualifications_pkey PRIMARY KEY (id);


--
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id);


--
-- Name: tenant_holiday_rules tenant_holiday_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_holiday_rules
    ADD CONSTRAINT tenant_holiday_rules_pkey PRIMARY KEY (id);


--
-- Name: tenant_leave_configurations tenant_leave_configurations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_leave_configurations
    ADD CONSTRAINT tenant_leave_configurations_pkey PRIMARY KEY (id);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: timetable_entries timetable_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_entries
    ADD CONSTRAINT timetable_entries_pkey PRIMARY KEY (id);


--
-- Name: timetable_periods timetable_periods_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_periods
    ADD CONSTRAINT timetable_periods_pkey PRIMARY KEY (id);


--
-- Name: timetable_structures timetable_structures_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_structures
    ADD CONSTRAINT timetable_structures_pkey PRIMARY KEY (id);


--
-- Name: token_blacklist token_blacklist_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_blacklist
    ADD CONSTRAINT token_blacklist_pkey PRIMARY KEY (id);


--
-- Name: uploads uploads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.uploads
    ADD CONSTRAINT uploads_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY ("userId", "roleId", "tenantId");


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vehicle_categories vehicle_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicle_categories
    ADD CONSTRAINT vehicle_categories_pkey PRIMARY KEY (id);


--
-- Name: vehicle_driver_assignments vehicle_driver_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicle_driver_assignments
    ADD CONSTRAINT vehicle_driver_assignments_pkey PRIMARY KEY (id);


--
-- Name: vehicles vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (id);


--
-- Name: visitor_notifications visitor_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitor_notifications
    ADD CONSTRAINT visitor_notifications_pkey PRIMARY KEY (id);


--
-- Name: visitor_purposes visitor_purposes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitor_purposes
    ADD CONSTRAINT visitor_purposes_pkey PRIMARY KEY (id);


--
-- Name: visitors visitors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitors
    ADD CONSTRAINT visitors_pkey PRIMARY KEY (id);


--
-- Name: zai_chats zai_chats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.zai_chats
    ADD CONSTRAINT zai_chats_pkey PRIMARY KEY (id);


--
-- Name: zai_messages zai_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.zai_messages
    ADD CONSTRAINT zai_messages_pkey PRIMARY KEY (id);


--
-- Name: academic_years_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "academic_years_id_tenantId_key" ON public.academic_years USING btree (id, "tenantId");


--
-- Name: academic_years_tenantId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "academic_years_tenantId_name_key" ON public.academic_years USING btree ("tenantId", name);


--
-- Name: academic_years_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "academic_years_tenantId_status_idx" ON public.academic_years USING btree ("tenantId", status);


--
-- Name: account_categories_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "account_categories_id_tenantId_key" ON public.account_categories USING btree (id, "tenantId");


--
-- Name: account_categories_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "account_categories_tenantId_idx" ON public.account_categories USING btree ("tenantId");


--
-- Name: account_transactions_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "account_transactions_id_tenantId_key" ON public.account_transactions USING btree (id, "tenantId");


--
-- Name: account_transactions_tenantId_categoryId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "account_transactions_tenantId_categoryId_idx" ON public.account_transactions USING btree ("tenantId", "categoryId");


--
-- Name: account_transactions_tenantId_partyType_partyId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "account_transactions_tenantId_partyType_partyId_idx" ON public.account_transactions USING btree ("tenantId", "partyType", "partyId");


--
-- Name: account_transactions_tenantId_referenceType_referenceId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "account_transactions_tenantId_referenceType_referenceId_idx" ON public.account_transactions USING btree ("tenantId", "referenceType", "referenceId");


--
-- Name: account_transactions_tenantId_transactionDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "account_transactions_tenantId_transactionDate_idx" ON public.account_transactions USING btree ("tenantId", "transactionDate");


--
-- Name: attendance_marks_tenantId_enrollmentId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "attendance_marks_tenantId_enrollmentId_idx" ON public.attendance_marks USING btree ("tenantId", "enrollmentId");


--
-- Name: attendance_marks_tenantId_sessionId_enrollmentId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "attendance_marks_tenantId_sessionId_enrollmentId_key" ON public.attendance_marks USING btree ("tenantId", "sessionId", "enrollmentId");


--
-- Name: attendance_marks_tenantId_sessionId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "attendance_marks_tenantId_sessionId_idx" ON public.attendance_marks USING btree ("tenantId", "sessionId");


--
-- Name: attendance_sessions_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "attendance_sessions_id_tenantId_key" ON public.attendance_sessions USING btree (id, "tenantId");


--
-- Name: attendance_sessions_tenantId_academicYearId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "attendance_sessions_tenantId_academicYearId_idx" ON public.attendance_sessions USING btree ("tenantId", "academicYearId");


--
-- Name: attendance_sessions_tenantId_attendanceTypeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "attendance_sessions_tenantId_attendanceTypeId_idx" ON public.attendance_sessions USING btree ("tenantId", "attendanceTypeId");


--
-- Name: attendance_sessions_tenantId_sectionId_date_attendanceTypeI_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "attendance_sessions_tenantId_sectionId_date_attendanceTypeI_key" ON public.attendance_sessions USING btree ("tenantId", "sectionId", date, "attendanceTypeId", "periodId");


--
-- Name: attendance_sessions_tenantId_sectionId_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "attendance_sessions_tenantId_sectionId_date_idx" ON public.attendance_sessions USING btree ("tenantId", "sectionId", date);


--
-- Name: attendance_sessions_tenantId_takenById_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "attendance_sessions_tenantId_takenById_idx" ON public.attendance_sessions USING btree ("tenantId", "takenById");


--
-- Name: attendance_types_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "attendance_types_id_tenantId_key" ON public.attendance_types USING btree (id, "tenantId");


--
-- Name: attendance_types_tenantId_category_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "attendance_types_tenantId_category_idx" ON public.attendance_types USING btree ("tenantId", category);


--
-- Name: attendance_types_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "attendance_types_tenantId_idx" ON public.attendance_types USING btree ("tenantId");


--
-- Name: attendance_types_tenantId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "attendance_types_tenantId_name_key" ON public.attendance_types USING btree ("tenantId", name);


--
-- Name: audit_logs_action_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_action_idx ON public.audit_logs USING btree (action);


--
-- Name: audit_logs_actorId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "audit_logs_actorId_idx" ON public.audit_logs USING btree ("actorId");


--
-- Name: audit_logs_tenantId_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "audit_logs_tenantId_createdAt_idx" ON public.audit_logs USING btree ("tenantId", "createdAt");


--
-- Name: automation_rules_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "automation_rules_id_tenantId_key" ON public.automation_rules USING btree (id, "tenantId");


--
-- Name: automation_rules_tenantId_isEnabled_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "automation_rules_tenantId_isEnabled_idx" ON public.automation_rules USING btree ("tenantId", "isEnabled");


--
-- Name: automation_rules_tenantId_sourceModule_event_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "automation_rules_tenantId_sourceModule_event_key" ON public.automation_rules USING btree ("tenantId", "sourceModule", event);


--
-- Name: automation_rules_tenantId_sourceModule_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "automation_rules_tenantId_sourceModule_idx" ON public.automation_rules USING btree ("tenantId", "sourceModule");


--
-- Name: buildings_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "buildings_id_tenantId_key" ON public.buildings USING btree (id, "tenantId");


--
-- Name: buildings_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "buildings_tenantId_idx" ON public.buildings USING btree ("tenantId");


--
-- Name: buildings_tenantId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "buildings_tenantId_name_key" ON public.buildings USING btree ("tenantId", name);


--
-- Name: channel_configurations_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "channel_configurations_id_tenantId_key" ON public.channel_configurations USING btree (id, "tenantId");


--
-- Name: channel_configurations_tenantId_channel_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "channel_configurations_tenantId_channel_key" ON public.channel_configurations USING btree ("tenantId", channel);


--
-- Name: communication_recipients_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "communication_recipients_id_tenantId_key" ON public.communication_recipients USING btree (id, "tenantId");


--
-- Name: communication_recipients_tenantId_communicationId_userId_ch_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "communication_recipients_tenantId_communicationId_userId_ch_key" ON public.communication_recipients USING btree ("tenantId", "communicationId", "userId", channel);


--
-- Name: communication_recipients_tenantId_deliveryStatus_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "communication_recipients_tenantId_deliveryStatus_idx" ON public.communication_recipients USING btree ("tenantId", "deliveryStatus");


--
-- Name: communication_recipients_tenantId_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "communication_recipients_tenantId_userId_idx" ON public.communication_recipients USING btree ("tenantId", "userId");


--
-- Name: communications_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "communications_id_tenantId_key" ON public.communications USING btree (id, "tenantId");


--
-- Name: communications_tenantId_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "communications_tenantId_createdAt_idx" ON public.communications USING btree ("tenantId", "createdAt");


--
-- Name: communications_tenantId_senderId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "communications_tenantId_senderId_idx" ON public.communications USING btree ("tenantId", "senderId");


--
-- Name: communications_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "communications_tenantId_status_idx" ON public.communications USING btree ("tenantId", status);


--
-- Name: communications_tenantId_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "communications_tenantId_type_idx" ON public.communications USING btree ("tenantId", type);


--
-- Name: compensation_components_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "compensation_components_id_tenantId_key" ON public.compensation_components USING btree (id, "tenantId");


--
-- Name: compensation_components_tenantId_compensationId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "compensation_components_tenantId_compensationId_idx" ON public.compensation_components USING btree ("tenantId", "compensationId");


--
-- Name: compensation_components_tenantId_compensationId_salaryCompo_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "compensation_components_tenantId_compensationId_salaryCompo_key" ON public.compensation_components USING btree ("tenantId", "compensationId", "salaryComponentId");


--
-- Name: compensation_history_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "compensation_history_id_tenantId_key" ON public.compensation_history USING btree (id, "tenantId");


--
-- Name: compensation_history_tenantId_changedAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "compensation_history_tenantId_changedAt_idx" ON public.compensation_history USING btree ("tenantId", "changedAt");


--
-- Name: compensation_history_tenantId_employeeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "compensation_history_tenantId_employeeId_idx" ON public.compensation_history USING btree ("tenantId", "employeeId");


--
-- Name: courses_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "courses_id_tenantId_key" ON public.courses USING btree (id, "tenantId");


--
-- Name: courses_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "courses_tenantId_idx" ON public.courses USING btree ("tenantId");


--
-- Name: employee_compensations_employeeId_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "employee_compensations_employeeId_tenantId_key" ON public.employee_compensations USING btree ("employeeId", "tenantId");


--
-- Name: employee_compensations_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "employee_compensations_id_tenantId_key" ON public.employee_compensations USING btree (id, "tenantId");


--
-- Name: employee_compensations_tenantId_employeeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "employee_compensations_tenantId_employeeId_idx" ON public.employee_compensations USING btree ("tenantId", "employeeId");


--
-- Name: employee_leave_balances_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "employee_leave_balances_id_tenantId_key" ON public.employee_leave_balances USING btree (id, "tenantId");


--
-- Name: employee_leave_balances_tenantId_academicYearId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "employee_leave_balances_tenantId_academicYearId_idx" ON public.employee_leave_balances USING btree ("tenantId", "academicYearId");


--
-- Name: employee_leave_balances_tenantId_employeeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "employee_leave_balances_tenantId_employeeId_idx" ON public.employee_leave_balances USING btree ("tenantId", "employeeId");


--
-- Name: employee_leave_balances_tenantId_employeeId_leaveCategoryId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "employee_leave_balances_tenantId_employeeId_leaveCategoryId_key" ON public.employee_leave_balances USING btree ("tenantId", "employeeId", "leaveCategoryId", "academicYearId");


--
-- Name: employee_leave_balances_tenantId_leaveCategoryId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "employee_leave_balances_tenantId_leaveCategoryId_idx" ON public.employee_leave_balances USING btree ("tenantId", "leaveCategoryId");


--
-- Name: employee_leave_loss_of_pay_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "employee_leave_loss_of_pay_id_tenantId_key" ON public.employee_leave_loss_of_pay USING btree (id, "tenantId");


--
-- Name: employee_leave_loss_of_pay_tenantId_employeeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "employee_leave_loss_of_pay_tenantId_employeeId_idx" ON public.employee_leave_loss_of_pay USING btree ("tenantId", "employeeId");


--
-- Name: employee_leave_loss_of_pay_tenantId_leaveRequestId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "employee_leave_loss_of_pay_tenantId_leaveRequestId_key" ON public.employee_leave_loss_of_pay USING btree ("tenantId", "leaveRequestId");


--
-- Name: employee_leave_loss_of_pay_tenantId_payrollBatchId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "employee_leave_loss_of_pay_tenantId_payrollBatchId_idx" ON public.employee_leave_loss_of_pay USING btree ("tenantId", "payrollBatchId");


--
-- Name: employee_leave_loss_of_pay_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "employee_leave_loss_of_pay_tenantId_status_idx" ON public.employee_leave_loss_of_pay USING btree ("tenantId", status);


--
-- Name: exam_marks_tenantId_enrollmentId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "exam_marks_tenantId_enrollmentId_idx" ON public.exam_marks USING btree ("tenantId", "enrollmentId");


--
-- Name: exam_marks_tenantId_examPaperId_enrollmentId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "exam_marks_tenantId_examPaperId_enrollmentId_key" ON public.exam_marks USING btree ("tenantId", "examPaperId", "enrollmentId");


--
-- Name: exam_marks_tenantId_examPaperId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "exam_marks_tenantId_examPaperId_idx" ON public.exam_marks USING btree ("tenantId", "examPaperId");


--
-- Name: exam_schedule_papers_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "exam_schedule_papers_id_tenantId_key" ON public.exam_schedule_papers USING btree (id, "tenantId");


--
-- Name: exam_schedule_papers_tenantId_inChargeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "exam_schedule_papers_tenantId_inChargeId_idx" ON public.exam_schedule_papers USING btree ("tenantId", "inChargeId");


--
-- Name: exam_schedule_papers_tenantId_scheduleId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "exam_schedule_papers_tenantId_scheduleId_idx" ON public.exam_schedule_papers USING btree ("tenantId", "scheduleId");


--
-- Name: exam_schedule_papers_tenantId_scheduleId_sectionSubjectId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "exam_schedule_papers_tenantId_scheduleId_sectionSubjectId_key" ON public.exam_schedule_papers USING btree ("tenantId", "scheduleId", "sectionSubjectId");


--
-- Name: exam_schedule_papers_tenantId_sectionSubjectId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "exam_schedule_papers_tenantId_sectionSubjectId_idx" ON public.exam_schedule_papers USING btree ("tenantId", "sectionSubjectId");


--
-- Name: exam_schedules_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "exam_schedules_id_tenantId_key" ON public.exam_schedules USING btree (id, "tenantId");


--
-- Name: exam_schedules_tenantId_examId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "exam_schedules_tenantId_examId_idx" ON public.exam_schedules USING btree ("tenantId", "examId");


--
-- Name: exam_schedules_tenantId_sectionId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "exam_schedules_tenantId_sectionId_idx" ON public.exam_schedules USING btree ("tenantId", "sectionId");


--
-- Name: exam_target_grades_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "exam_target_grades_id_tenantId_key" ON public.exam_target_grades USING btree (id, "tenantId");


--
-- Name: exam_target_grades_tenantId_examId_gradeId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "exam_target_grades_tenantId_examId_gradeId_key" ON public.exam_target_grades USING btree ("tenantId", "examId", "gradeId");


--
-- Name: exam_target_grades_tenantId_examId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "exam_target_grades_tenantId_examId_idx" ON public.exam_target_grades USING btree ("tenantId", "examId");


--
-- Name: exam_target_grades_tenantId_gradeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "exam_target_grades_tenantId_gradeId_idx" ON public.exam_target_grades USING btree ("tenantId", "gradeId");


--
-- Name: exam_target_sections_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "exam_target_sections_id_tenantId_key" ON public.exam_target_sections USING btree (id, "tenantId");


--
-- Name: exam_target_sections_tenantId_examId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "exam_target_sections_tenantId_examId_idx" ON public.exam_target_sections USING btree ("tenantId", "examId");


--
-- Name: exam_target_sections_tenantId_examId_sectionId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "exam_target_sections_tenantId_examId_sectionId_key" ON public.exam_target_sections USING btree ("tenantId", "examId", "sectionId");


--
-- Name: exam_target_sections_tenantId_sectionId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "exam_target_sections_tenantId_sectionId_idx" ON public.exam_target_sections USING btree ("tenantId", "sectionId");


--
-- Name: exams_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "exams_id_tenantId_key" ON public.exams USING btree (id, "tenantId");


--
-- Name: exams_tenantId_academicYearId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "exams_tenantId_academicYearId_idx" ON public.exams USING btree ("tenantId", "academicYearId");


--
-- Name: exams_tenantId_academicYearId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "exams_tenantId_academicYearId_name_key" ON public.exams USING btree ("tenantId", "academicYearId", name);


--
-- Name: exams_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "exams_tenantId_status_idx" ON public.exams USING btree ("tenantId", status);


--
-- Name: fee_heads_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "fee_heads_id_tenantId_key" ON public.fee_heads USING btree (id, "tenantId");


--
-- Name: fee_heads_tenantId_hostelRoomTypeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "fee_heads_tenantId_hostelRoomTypeId_idx" ON public.fee_heads USING btree ("tenantId", "hostelRoomTypeId");


--
-- Name: fee_heads_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "fee_heads_tenantId_idx" ON public.fee_heads USING btree ("tenantId");


--
-- Name: fee_heads_tenantId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "fee_heads_tenantId_name_key" ON public.fee_heads USING btree ("tenantId", name);


--
-- Name: fee_payments_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "fee_payments_id_tenantId_key" ON public.fee_payments USING btree (id, "tenantId");


--
-- Name: fee_payments_tenantId_collectedById_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "fee_payments_tenantId_collectedById_idx" ON public.fee_payments USING btree ("tenantId", "collectedById");


--
-- Name: fee_payments_tenantId_paymentDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "fee_payments_tenantId_paymentDate_idx" ON public.fee_payments USING btree ("tenantId", "paymentDate");


--
-- Name: fee_payments_tenantId_studentFeeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "fee_payments_tenantId_studentFeeId_idx" ON public.fee_payments USING btree ("tenantId", "studentFeeId");


--
-- Name: fee_payments_tenantId_termId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "fee_payments_tenantId_termId_idx" ON public.fee_payments USING btree ("tenantId", "termId");


--
-- Name: fee_refunds_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "fee_refunds_id_tenantId_key" ON public.fee_refunds USING btree (id, "tenantId");


--
-- Name: fee_refunds_tenantId_paymentId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "fee_refunds_tenantId_paymentId_idx" ON public.fee_refunds USING btree ("tenantId", "paymentId");


--
-- Name: fee_terms_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "fee_terms_id_tenantId_key" ON public.fee_terms USING btree (id, "tenantId");


--
-- Name: fee_terms_tenantId_sectionFeeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "fee_terms_tenantId_sectionFeeId_idx" ON public.fee_terms USING btree ("tenantId", "sectionFeeId");


--
-- Name: fee_terms_tenantId_sectionFeeId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "fee_terms_tenantId_sectionFeeId_name_key" ON public.fee_terms USING btree ("tenantId", "sectionFeeId", name);


--
-- Name: floors_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "floors_id_tenantId_key" ON public.floors USING btree (id, "tenantId");


--
-- Name: floors_tenantId_buildingId_floorNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "floors_tenantId_buildingId_floorNumber_key" ON public.floors USING btree ("tenantId", "buildingId", "floorNumber");


--
-- Name: floors_tenantId_buildingId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "floors_tenantId_buildingId_idx" ON public.floors USING btree ("tenantId", "buildingId");


--
-- Name: floors_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "floors_tenantId_idx" ON public.floors USING btree ("tenantId");


--
-- Name: grades_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "grades_id_tenantId_key" ON public.grades USING btree (id, "tenantId");


--
-- Name: grades_tenantId_courseId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "grades_tenantId_courseId_idx" ON public.grades USING btree ("tenantId", "courseId");


--
-- Name: grades_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "grades_tenantId_idx" ON public.grades USING btree ("tenantId");


--
-- Name: grading_bands_tenantId_scaleId_grade_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "grading_bands_tenantId_scaleId_grade_key" ON public.grading_bands USING btree ("tenantId", "scaleId", grade);


--
-- Name: grading_bands_tenantId_scaleId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "grading_bands_tenantId_scaleId_idx" ON public.grading_bands USING btree ("tenantId", "scaleId");


--
-- Name: grading_scales_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "grading_scales_id_tenantId_key" ON public.grading_scales USING btree (id, "tenantId");


--
-- Name: grading_scales_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "grading_scales_tenantId_idx" ON public.grading_scales USING btree ("tenantId");


--
-- Name: grading_scales_tenantId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "grading_scales_tenantId_name_key" ON public.grading_scales USING btree ("tenantId", name);


--
-- Name: groups_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "groups_id_tenantId_key" ON public.groups USING btree (id, "tenantId");


--
-- Name: groups_tenantId_groupName_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "groups_tenantId_groupName_key" ON public.groups USING btree ("tenantId", "groupName");


--
-- Name: groups_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "groups_tenantId_idx" ON public.groups USING btree ("tenantId");


--
-- Name: holiday_categories_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "holiday_categories_id_tenantId_key" ON public.holiday_categories USING btree (id, "tenantId");


--
-- Name: holiday_categories_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "holiday_categories_tenantId_idx" ON public.holiday_categories USING btree ("tenantId");


--
-- Name: holiday_categories_tenantId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "holiday_categories_tenantId_name_key" ON public.holiday_categories USING btree ("tenantId", name);


--
-- Name: holidays_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "holidays_id_tenantId_key" ON public.holidays USING btree (id, "tenantId");


--
-- Name: holidays_tenantId_academicYearId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "holidays_tenantId_academicYearId_idx" ON public.holidays USING btree ("tenantId", "academicYearId");


--
-- Name: holidays_tenantId_categoryId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "holidays_tenantId_categoryId_idx" ON public.holidays USING btree ("tenantId", "categoryId");


--
-- Name: holidays_tenantId_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "holidays_tenantId_date_idx" ON public.holidays USING btree ("tenantId", date);


--
-- Name: holidays_tenantId_date_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "holidays_tenantId_date_name_key" ON public.holidays USING btree ("tenantId", date, name);


--
-- Name: hostel_blocks_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "hostel_blocks_id_tenantId_key" ON public.hostel_blocks USING btree (id, "tenantId");


--
-- Name: hostel_blocks_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "hostel_blocks_tenantId_idx" ON public.hostel_blocks USING btree ("tenantId");


--
-- Name: hostel_blocks_tenantId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "hostel_blocks_tenantId_name_key" ON public.hostel_blocks USING btree ("tenantId", name);


--
-- Name: hostel_blocks_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "hostel_blocks_tenantId_status_idx" ON public.hostel_blocks USING btree ("tenantId", status);


--
-- Name: hostel_floors_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "hostel_floors_id_tenantId_key" ON public.hostel_floors USING btree (id, "tenantId");


--
-- Name: hostel_floors_tenantId_blockId_floorNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "hostel_floors_tenantId_blockId_floorNumber_key" ON public.hostel_floors USING btree ("tenantId", "blockId", "floorNumber");


--
-- Name: hostel_floors_tenantId_blockId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "hostel_floors_tenantId_blockId_idx" ON public.hostel_floors USING btree ("tenantId", "blockId");


--
-- Name: hostel_floors_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "hostel_floors_tenantId_idx" ON public.hostel_floors USING btree ("tenantId");


--
-- Name: hostel_room_types_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "hostel_room_types_id_tenantId_key" ON public.hostel_room_types USING btree (id, "tenantId");


--
-- Name: hostel_room_types_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "hostel_room_types_tenantId_idx" ON public.hostel_room_types USING btree ("tenantId");


--
-- Name: hostel_room_types_tenantId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "hostel_room_types_tenantId_name_key" ON public.hostel_room_types USING btree ("tenantId", name);


--
-- Name: hostel_rooms_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "hostel_rooms_id_tenantId_key" ON public.hostel_rooms USING btree (id, "tenantId");


--
-- Name: hostel_rooms_tenantId_floorId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "hostel_rooms_tenantId_floorId_idx" ON public.hostel_rooms USING btree ("tenantId", "floorId");


--
-- Name: hostel_rooms_tenantId_floorId_roomNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "hostel_rooms_tenantId_floorId_roomNumber_key" ON public.hostel_rooms USING btree ("tenantId", "floorId", "roomNumber");


--
-- Name: hostel_rooms_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "hostel_rooms_tenantId_idx" ON public.hostel_rooms USING btree ("tenantId");


--
-- Name: hostel_rooms_tenantId_roomTypeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "hostel_rooms_tenantId_roomTypeId_idx" ON public.hostel_rooms USING btree ("tenantId", "roomTypeId");


--
-- Name: hostel_rooms_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "hostel_rooms_tenantId_status_idx" ON public.hostel_rooms USING btree ("tenantId", status);


--
-- Name: hostel_section_rooms_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "hostel_section_rooms_id_tenantId_key" ON public.hostel_section_rooms USING btree (id, "tenantId");


--
-- Name: hostel_section_rooms_tenantId_roomId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "hostel_section_rooms_tenantId_roomId_idx" ON public.hostel_section_rooms USING btree ("tenantId", "roomId");


--
-- Name: hostel_section_rooms_tenantId_sectionId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "hostel_section_rooms_tenantId_sectionId_idx" ON public.hostel_section_rooms USING btree ("tenantId", "sectionId");


--
-- Name: hostel_section_rooms_tenantId_sectionId_roomId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "hostel_section_rooms_tenantId_sectionId_roomId_key" ON public.hostel_section_rooms USING btree ("tenantId", "sectionId", "roomId");


--
-- Name: hostel_sections_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "hostel_sections_id_tenantId_key" ON public.hostel_sections USING btree (id, "tenantId");


--
-- Name: hostel_sections_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "hostel_sections_tenantId_idx" ON public.hostel_sections USING btree ("tenantId");


--
-- Name: hostel_sections_tenantId_sectionId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "hostel_sections_tenantId_sectionId_idx" ON public.hostel_sections USING btree ("tenantId", "sectionId");


--
-- Name: hostel_sections_tenantId_sectionId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "hostel_sections_tenantId_sectionId_key" ON public.hostel_sections USING btree ("tenantId", "sectionId");


--
-- Name: hostel_staff_assignments_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "hostel_staff_assignments_id_tenantId_key" ON public.hostel_staff_assignments USING btree (id, "tenantId");


--
-- Name: hostel_staff_assignments_tenantId_blockId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "hostel_staff_assignments_tenantId_blockId_idx" ON public.hostel_staff_assignments USING btree ("tenantId", "blockId");


--
-- Name: hostel_staff_assignments_tenantId_blockId_teacherId_role_fr_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "hostel_staff_assignments_tenantId_blockId_teacherId_role_fr_key" ON public.hostel_staff_assignments USING btree ("tenantId", "blockId", "teacherId", role, "fromDate");


--
-- Name: hostel_staff_assignments_tenantId_role_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "hostel_staff_assignments_tenantId_role_idx" ON public.hostel_staff_assignments USING btree ("tenantId", role);


--
-- Name: hostel_staff_assignments_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "hostel_staff_assignments_tenantId_status_idx" ON public.hostel_staff_assignments USING btree ("tenantId", status);


--
-- Name: hostel_staff_assignments_tenantId_teacherId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "hostel_staff_assignments_tenantId_teacherId_idx" ON public.hostel_staff_assignments USING btree ("tenantId", "teacherId");


--
-- Name: id_sequence_logs_tenantId_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "id_sequence_logs_tenantId_createdAt_idx" ON public.id_sequence_logs USING btree ("tenantId", "createdAt");


--
-- Name: id_sequence_logs_tenantId_entityId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "id_sequence_logs_tenantId_entityId_idx" ON public.id_sequence_logs USING btree ("tenantId", "entityId");


--
-- Name: id_sequence_logs_tenantId_entityType_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "id_sequence_logs_tenantId_entityType_idx" ON public.id_sequence_logs USING btree ("tenantId", "entityType");


--
-- Name: id_sequence_logs_tenantId_generatedValue_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "id_sequence_logs_tenantId_generatedValue_key" ON public.id_sequence_logs USING btree ("tenantId", "generatedValue");


--
-- Name: id_sequence_patterns_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "id_sequence_patterns_id_tenantId_key" ON public.id_sequence_patterns USING btree (id, "tenantId");


--
-- Name: id_sequence_patterns_tenantId_entityType_academicYearId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "id_sequence_patterns_tenantId_entityType_academicYearId_key" ON public.id_sequence_patterns USING btree ("tenantId", "entityType", "academicYearId");


--
-- Name: id_sequence_patterns_tenantId_entityType_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "id_sequence_patterns_tenantId_entityType_idx" ON public.id_sequence_patterns USING btree ("tenantId", "entityType");


--
-- Name: id_sequence_patterns_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "id_sequence_patterns_tenantId_idx" ON public.id_sequence_patterns USING btree ("tenantId");


--
-- Name: inventory_categories_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "inventory_categories_id_tenantId_key" ON public.inventory_categories USING btree (id, "tenantId");


--
-- Name: inventory_categories_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "inventory_categories_tenantId_idx" ON public.inventory_categories USING btree ("tenantId");


--
-- Name: inventory_items_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "inventory_items_id_tenantId_key" ON public.inventory_items USING btree (id, "tenantId");


--
-- Name: inventory_items_tenantId_categoryId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "inventory_items_tenantId_categoryId_idx" ON public.inventory_items USING btree ("tenantId", "categoryId");


--
-- Name: inventory_items_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "inventory_items_tenantId_idx" ON public.inventory_items USING btree ("tenantId");


--
-- Name: leave_approvals_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "leave_approvals_id_tenantId_key" ON public.leave_approvals USING btree (id, "tenantId");


--
-- Name: leave_approvals_tenantId_approverId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leave_approvals_tenantId_approverId_idx" ON public.leave_approvals USING btree ("tenantId", "approverId");


--
-- Name: leave_approvals_tenantId_leaveRequestId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leave_approvals_tenantId_leaveRequestId_idx" ON public.leave_approvals USING btree ("tenantId", "leaveRequestId");


--
-- Name: leave_approvals_tenantId_leaveRequestId_level_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "leave_approvals_tenantId_leaveRequestId_level_key" ON public.leave_approvals USING btree ("tenantId", "leaveRequestId", level);


--
-- Name: leave_approvals_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leave_approvals_tenantId_status_idx" ON public.leave_approvals USING btree ("tenantId", status);


--
-- Name: leave_audit_logs_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "leave_audit_logs_id_tenantId_key" ON public.leave_audit_logs USING btree (id, "tenantId");


--
-- Name: leave_audit_logs_tenantId_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leave_audit_logs_tenantId_createdAt_idx" ON public.leave_audit_logs USING btree ("tenantId", "createdAt");


--
-- Name: leave_audit_logs_tenantId_leaveRequestId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leave_audit_logs_tenantId_leaveRequestId_idx" ON public.leave_audit_logs USING btree ("tenantId", "leaveRequestId");


--
-- Name: leave_balance_transactions_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "leave_balance_transactions_id_tenantId_key" ON public.leave_balance_transactions USING btree (id, "tenantId");


--
-- Name: leave_balance_transactions_tenantId_balanceId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leave_balance_transactions_tenantId_balanceId_idx" ON public.leave_balance_transactions USING btree ("tenantId", "balanceId");


--
-- Name: leave_balance_transactions_tenantId_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leave_balance_transactions_tenantId_createdAt_idx" ON public.leave_balance_transactions USING btree ("tenantId", "createdAt");


--
-- Name: leave_cancellations_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "leave_cancellations_id_tenantId_key" ON public.leave_cancellations USING btree (id, "tenantId");


--
-- Name: leave_cancellations_tenantId_leaveRequestId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leave_cancellations_tenantId_leaveRequestId_idx" ON public.leave_cancellations USING btree ("tenantId", "leaveRequestId");


--
-- Name: leave_cancellations_tenantId_leaveRequestId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "leave_cancellations_tenantId_leaveRequestId_key" ON public.leave_cancellations USING btree ("tenantId", "leaveRequestId");


--
-- Name: leave_cancellations_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leave_cancellations_tenantId_status_idx" ON public.leave_cancellations USING btree ("tenantId", status);


--
-- Name: leave_categories_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "leave_categories_id_tenantId_key" ON public.leave_categories USING btree (id, "tenantId");


--
-- Name: leave_categories_tenantId_applicantType_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leave_categories_tenantId_applicantType_idx" ON public.leave_categories USING btree ("tenantId", "applicantType");


--
-- Name: leave_categories_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leave_categories_tenantId_idx" ON public.leave_categories USING btree ("tenantId");


--
-- Name: leave_categories_tenantId_name_applicantType_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "leave_categories_tenantId_name_applicantType_key" ON public.leave_categories USING btree ("tenantId", name, "applicantType");


--
-- Name: leave_notifications_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "leave_notifications_id_tenantId_key" ON public.leave_notifications USING btree (id, "tenantId");


--
-- Name: leave_notifications_tenantId_isRead_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leave_notifications_tenantId_isRead_idx" ON public.leave_notifications USING btree ("tenantId", "isRead");


--
-- Name: leave_notifications_tenantId_leaveRequestId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leave_notifications_tenantId_leaveRequestId_idx" ON public.leave_notifications USING btree ("tenantId", "leaveRequestId");


--
-- Name: leave_notifications_tenantId_sentToId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leave_notifications_tenantId_sentToId_idx" ON public.leave_notifications USING btree ("tenantId", "sentToId");


--
-- Name: leave_requests_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "leave_requests_id_tenantId_key" ON public.leave_requests USING btree (id, "tenantId");


--
-- Name: leave_requests_tenantId_employeeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leave_requests_tenantId_employeeId_idx" ON public.leave_requests USING btree ("tenantId", "employeeId");


--
-- Name: leave_requests_tenantId_endDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leave_requests_tenantId_endDate_idx" ON public.leave_requests USING btree ("tenantId", "endDate");


--
-- Name: leave_requests_tenantId_leaveCategoryId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leave_requests_tenantId_leaveCategoryId_idx" ON public.leave_requests USING btree ("tenantId", "leaveCategoryId");


--
-- Name: leave_requests_tenantId_startDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leave_requests_tenantId_startDate_idx" ON public.leave_requests USING btree ("tenantId", "startDate");


--
-- Name: leave_requests_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leave_requests_tenantId_status_idx" ON public.leave_requests USING btree ("tenantId", status);


--
-- Name: leave_requests_tenantId_studentId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leave_requests_tenantId_studentId_idx" ON public.leave_requests USING btree ("tenantId", "studentId");


--
-- Name: notification_templates_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "notification_templates_id_tenantId_key" ON public.notification_templates USING btree (id, "tenantId");


--
-- Name: notification_templates_tenantId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "notification_templates_tenantId_name_key" ON public.notification_templates USING btree ("tenantId", name);


--
-- Name: parents_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "parents_id_tenantId_key" ON public.parents USING btree (id, "tenantId");


--
-- Name: parents_registrationToken_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "parents_registrationToken_key" ON public.parents USING btree ("registrationToken");


--
-- Name: parents_tenantId_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "parents_tenantId_email_idx" ON public.parents USING btree ("tenantId", email);


--
-- Name: parents_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "parents_tenantId_idx" ON public.parents USING btree ("tenantId");


--
-- Name: parents_tenantId_phone_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "parents_tenantId_phone_idx" ON public.parents USING btree ("tenantId", phone);


--
-- Name: parents_tenantId_phone_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "parents_tenantId_phone_key" ON public.parents USING btree ("tenantId", phone);


--
-- Name: parents_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "parents_tenantId_status_idx" ON public.parents USING btree ("tenantId", status);


--
-- Name: parents_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "parents_userId_key" ON public.parents USING btree ("userId");


--
-- Name: parents_userId_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "parents_userId_tenantId_key" ON public.parents USING btree ("userId", "tenantId");


--
-- Name: payroll_batches_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "payroll_batches_id_tenantId_key" ON public.payroll_batches USING btree (id, "tenantId");


--
-- Name: payroll_batches_tenantId_month_year_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "payroll_batches_tenantId_month_year_idx" ON public.payroll_batches USING btree ("tenantId", month, year);


--
-- Name: payroll_batches_tenantId_month_year_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "payroll_batches_tenantId_month_year_key" ON public.payroll_batches USING btree ("tenantId", month, year);


--
-- Name: payroll_records_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "payroll_records_id_tenantId_key" ON public.payroll_records USING btree (id, "tenantId");


--
-- Name: payroll_records_tenantId_batchId_employeeId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "payroll_records_tenantId_batchId_employeeId_key" ON public.payroll_records USING btree ("tenantId", "batchId", "employeeId");


--
-- Name: payroll_records_tenantId_batchId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "payroll_records_tenantId_batchId_idx" ON public.payroll_records USING btree ("tenantId", "batchId");


--
-- Name: payroll_records_tenantId_employeeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "payroll_records_tenantId_employeeId_idx" ON public.payroll_records USING btree ("tenantId", "employeeId");


--
-- Name: permissions_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX permissions_code_key ON public.permissions USING btree (code);


--
-- Name: pickup_points_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "pickup_points_id_tenantId_key" ON public.pickup_points USING btree (id, "tenantId");


--
-- Name: pickup_points_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "pickup_points_tenantId_idx" ON public.pickup_points USING btree ("tenantId");


--
-- Name: pickup_points_tenantId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "pickup_points_tenantId_name_key" ON public.pickup_points USING btree ("tenantId", name);


--
-- Name: publication_revisions_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "publication_revisions_id_tenantId_key" ON public.publication_revisions USING btree (id, "tenantId");


--
-- Name: publication_revisions_tenantId_publicationId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "publication_revisions_tenantId_publicationId_idx" ON public.publication_revisions USING btree ("tenantId", "publicationId");


--
-- Name: publication_revisions_tenantId_publicationId_revision_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "publication_revisions_tenantId_publicationId_revision_key" ON public.publication_revisions USING btree ("tenantId", "publicationId", revision);


--
-- Name: publications_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "publications_id_tenantId_key" ON public.publications USING btree (id, "tenantId");


--
-- Name: publications_tenantId_expiryDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "publications_tenantId_expiryDate_idx" ON public.publications USING btree ("tenantId", "expiryDate");


--
-- Name: publications_tenantId_publishDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "publications_tenantId_publishDate_idx" ON public.publications USING btree ("tenantId", "publishDate");


--
-- Name: publications_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "publications_tenantId_status_idx" ON public.publications USING btree ("tenantId", status);


--
-- Name: publications_tenantId_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "publications_tenantId_type_idx" ON public.publications USING btree ("tenantId", type);


--
-- Name: roles_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "roles_id_tenantId_key" ON public.roles USING btree (id, "tenantId");


--
-- Name: roles_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "roles_tenantId_idx" ON public.roles USING btree ("tenantId");


--
-- Name: roles_tenantId_roleName_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "roles_tenantId_roleName_key" ON public.roles USING btree ("tenantId", "roleName");


--
-- Name: rooms_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "rooms_id_tenantId_key" ON public.rooms USING btree (id, "tenantId");


--
-- Name: rooms_tenantId_floorId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "rooms_tenantId_floorId_idx" ON public.rooms USING btree ("tenantId", "floorId");


--
-- Name: rooms_tenantId_floorId_roomNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "rooms_tenantId_floorId_roomNumber_key" ON public.rooms USING btree ("tenantId", "floorId", "roomNumber");


--
-- Name: rooms_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "rooms_tenantId_idx" ON public.rooms USING btree ("tenantId");


--
-- Name: rooms_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "rooms_tenantId_status_idx" ON public.rooms USING btree ("tenantId", status);


--
-- Name: salary_components_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "salary_components_id_tenantId_key" ON public.salary_components USING btree (id, "tenantId");


--
-- Name: salary_components_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "salary_components_tenantId_idx" ON public.salary_components USING btree ("tenantId");


--
-- Name: salary_components_tenantId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "salary_components_tenantId_name_key" ON public.salary_components USING btree ("tenantId", name);


--
-- Name: section_fee_heads_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "section_fee_heads_id_tenantId_key" ON public.section_fee_heads USING btree (id, "tenantId");


--
-- Name: section_fee_heads_tenantId_feeHeadId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "section_fee_heads_tenantId_feeHeadId_idx" ON public.section_fee_heads USING btree ("tenantId", "feeHeadId");


--
-- Name: section_fee_heads_tenantId_sectionFeeId_feeHeadId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "section_fee_heads_tenantId_sectionFeeId_feeHeadId_key" ON public.section_fee_heads USING btree ("tenantId", "sectionFeeId", "feeHeadId");


--
-- Name: section_fee_heads_tenantId_sectionFeeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "section_fee_heads_tenantId_sectionFeeId_idx" ON public.section_fee_heads USING btree ("tenantId", "sectionFeeId");


--
-- Name: section_fees_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "section_fees_id_tenantId_key" ON public.section_fees USING btree (id, "tenantId");


--
-- Name: section_fees_tenantId_academicYearId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "section_fees_tenantId_academicYearId_idx" ON public.section_fees USING btree ("tenantId", "academicYearId");


--
-- Name: section_fees_tenantId_sectionId_academicYearId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "section_fees_tenantId_sectionId_academicYearId_key" ON public.section_fees USING btree ("tenantId", "sectionId", "academicYearId");


--
-- Name: section_fees_tenantId_sectionId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "section_fees_tenantId_sectionId_idx" ON public.section_fees USING btree ("tenantId", "sectionId");


--
-- Name: section_subjects_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "section_subjects_id_tenantId_key" ON public.section_subjects USING btree (id, "tenantId");


--
-- Name: section_subjects_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "section_subjects_tenantId_idx" ON public.section_subjects USING btree ("tenantId");


--
-- Name: section_subjects_tenantId_sectionId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "section_subjects_tenantId_sectionId_idx" ON public.section_subjects USING btree ("tenantId", "sectionId");


--
-- Name: section_subjects_tenantId_sectionId_subjectId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "section_subjects_tenantId_sectionId_subjectId_key" ON public.section_subjects USING btree ("tenantId", "sectionId", "subjectId");


--
-- Name: section_subjects_tenantId_subjectId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "section_subjects_tenantId_subjectId_idx" ON public.section_subjects USING btree ("tenantId", "subjectId");


--
-- Name: sections_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "sections_id_tenantId_key" ON public.sections USING btree (id, "tenantId");


--
-- Name: sections_tenantId_gradeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "sections_tenantId_gradeId_idx" ON public.sections USING btree ("tenantId", "gradeId");


--
-- Name: sections_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "sections_tenantId_idx" ON public.sections USING btree ("tenantId");


--
-- Name: sections_tenantId_roomId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "sections_tenantId_roomId_idx" ON public.sections USING btree ("tenantId", "roomId");


--
-- Name: sections_tenantId_structureId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "sections_tenantId_structureId_idx" ON public.sections USING btree ("tenantId", "structureId");


--
-- Name: staff_attendance_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "staff_attendance_id_tenantId_key" ON public.staff_attendance USING btree (id, "tenantId");


--
-- Name: staff_attendance_sessions_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "staff_attendance_sessions_id_tenantId_key" ON public.staff_attendance_sessions USING btree (id, "tenantId");


--
-- Name: staff_attendance_sessions_tenantId_attendanceId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "staff_attendance_sessions_tenantId_attendanceId_idx" ON public.staff_attendance_sessions USING btree ("tenantId", "attendanceId");


--
-- Name: staff_attendance_tenantId_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "staff_attendance_tenantId_date_idx" ON public.staff_attendance USING btree ("tenantId", date);


--
-- Name: staff_attendance_tenantId_date_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "staff_attendance_tenantId_date_status_idx" ON public.staff_attendance USING btree ("tenantId", date, status);


--
-- Name: staff_attendance_tenantId_teacherId_date_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "staff_attendance_tenantId_teacherId_date_key" ON public.staff_attendance USING btree ("tenantId", "teacherId", date);


--
-- Name: staff_attendance_tenantId_teacherId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "staff_attendance_tenantId_teacherId_idx" ON public.staff_attendance USING btree ("tenantId", "teacherId");


--
-- Name: stock_adjustments_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stock_adjustments_tenantId_idx" ON public.stock_adjustments USING btree ("tenantId");


--
-- Name: stock_adjustments_tenantId_itemId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stock_adjustments_tenantId_itemId_idx" ON public.stock_adjustments USING btree ("tenantId", "itemId");


--
-- Name: store_categories_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "store_categories_id_tenantId_key" ON public.store_categories USING btree (id, "tenantId");


--
-- Name: store_categories_tenantId_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "store_categories_tenantId_name_idx" ON public.store_categories USING btree ("tenantId", name);


--
-- Name: store_due_payments_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "store_due_payments_id_tenantId_key" ON public.store_due_payments USING btree (id, "tenantId");


--
-- Name: store_due_payments_tenantId_dueId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "store_due_payments_tenantId_dueId_idx" ON public.store_due_payments USING btree ("tenantId", "dueId");


--
-- Name: store_dues_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "store_dues_id_tenantId_key" ON public.store_dues USING btree (id, "tenantId");


--
-- Name: store_dues_tenantId_orderId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "store_dues_tenantId_orderId_idx" ON public.store_dues USING btree ("tenantId", "orderId");


--
-- Name: store_dues_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "store_dues_tenantId_status_idx" ON public.store_dues USING btree ("tenantId", status);


--
-- Name: store_kit_items_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "store_kit_items_id_tenantId_key" ON public.store_kit_items USING btree (id, "tenantId");


--
-- Name: store_kit_items_tenantId_kitId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "store_kit_items_tenantId_kitId_idx" ON public.store_kit_items USING btree ("tenantId", "kitId");


--
-- Name: store_kit_sections_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "store_kit_sections_id_tenantId_key" ON public.store_kit_sections USING btree (id, "tenantId");


--
-- Name: store_kit_sections_tenantId_kitId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "store_kit_sections_tenantId_kitId_idx" ON public.store_kit_sections USING btree ("tenantId", "kitId");


--
-- Name: store_kit_sections_tenantId_kitId_sectionId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "store_kit_sections_tenantId_kitId_sectionId_key" ON public.store_kit_sections USING btree ("tenantId", "kitId", "sectionId");


--
-- Name: store_kit_sections_tenantId_sectionId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "store_kit_sections_tenantId_sectionId_idx" ON public.store_kit_sections USING btree ("tenantId", "sectionId");


--
-- Name: store_kits_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "store_kits_id_tenantId_key" ON public.store_kits USING btree (id, "tenantId");


--
-- Name: store_kits_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "store_kits_tenantId_idx" ON public.store_kits USING btree ("tenantId");


--
-- Name: store_order_items_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "store_order_items_id_tenantId_key" ON public.store_order_items USING btree (id, "tenantId");


--
-- Name: store_order_items_tenantId_orderId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "store_order_items_tenantId_orderId_idx" ON public.store_order_items USING btree ("tenantId", "orderId");


--
-- Name: store_orders_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "store_orders_id_tenantId_key" ON public.store_orders USING btree (id, "tenantId");


--
-- Name: store_orders_tenantId_academicYearId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "store_orders_tenantId_academicYearId_idx" ON public.store_orders USING btree ("tenantId", "academicYearId");


--
-- Name: store_orders_tenantId_enrollmentId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "store_orders_tenantId_enrollmentId_idx" ON public.store_orders USING btree ("tenantId", "enrollmentId");


--
-- Name: store_pending_items_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "store_pending_items_id_tenantId_key" ON public.store_pending_items USING btree (id, "tenantId");


--
-- Name: store_pending_items_tenantId_orderItemId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "store_pending_items_tenantId_orderItemId_idx" ON public.store_pending_items USING btree ("tenantId", "orderItemId");


--
-- Name: store_pending_items_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "store_pending_items_tenantId_status_idx" ON public.store_pending_items USING btree ("tenantId", status);


--
-- Name: store_product_sections_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "store_product_sections_id_tenantId_key" ON public.store_product_sections USING btree (id, "tenantId");


--
-- Name: store_product_sections_tenantId_productId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "store_product_sections_tenantId_productId_idx" ON public.store_product_sections USING btree ("tenantId", "productId");


--
-- Name: store_product_sections_tenantId_productId_sectionId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "store_product_sections_tenantId_productId_sectionId_key" ON public.store_product_sections USING btree ("tenantId", "productId", "sectionId");


--
-- Name: store_product_sections_tenantId_sectionId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "store_product_sections_tenantId_sectionId_idx" ON public.store_product_sections USING btree ("tenantId", "sectionId");


--
-- Name: store_products_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "store_products_id_tenantId_key" ON public.store_products USING btree (id, "tenantId");


--
-- Name: store_products_tenantId_categoryId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "store_products_tenantId_categoryId_idx" ON public.store_products USING btree ("tenantId", "categoryId");


--
-- Name: store_products_tenantId_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "store_products_tenantId_name_idx" ON public.store_products USING btree ("tenantId", name);


--
-- Name: store_returns_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "store_returns_id_tenantId_key" ON public.store_returns USING btree (id, "tenantId");


--
-- Name: store_returns_tenantId_orderItemId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "store_returns_tenantId_orderItemId_idx" ON public.store_returns USING btree ("tenantId", "orderItemId");


--
-- Name: student_enrollment_electives_tenantId_enrollmentId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "student_enrollment_electives_tenantId_enrollmentId_idx" ON public.student_enrollment_electives USING btree ("tenantId", "enrollmentId");


--
-- Name: student_enrollment_electives_tenantId_enrollmentId_sectionS_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "student_enrollment_electives_tenantId_enrollmentId_sectionS_key" ON public.student_enrollment_electives USING btree ("tenantId", "enrollmentId", "sectionSubjectId");


--
-- Name: student_enrollment_electives_tenantId_sectionSubjectId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "student_enrollment_electives_tenantId_sectionSubjectId_idx" ON public.student_enrollment_electives USING btree ("tenantId", "sectionSubjectId");


--
-- Name: student_enrollments_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "student_enrollments_id_tenantId_key" ON public.student_enrollments USING btree (id, "tenantId");


--
-- Name: student_enrollments_tenantId_academicYearId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "student_enrollments_tenantId_academicYearId_idx" ON public.student_enrollments USING btree ("tenantId", "academicYearId");


--
-- Name: student_enrollments_tenantId_gradeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "student_enrollments_tenantId_gradeId_idx" ON public.student_enrollments USING btree ("tenantId", "gradeId");


--
-- Name: student_enrollments_tenantId_sectionId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "student_enrollments_tenantId_sectionId_idx" ON public.student_enrollments USING btree ("tenantId", "sectionId");


--
-- Name: student_enrollments_tenantId_studentId_academicYearId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "student_enrollments_tenantId_studentId_academicYearId_key" ON public.student_enrollments USING btree ("tenantId", "studentId", "academicYearId");


--
-- Name: student_fee_heads_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "student_fee_heads_id_tenantId_key" ON public.student_fee_heads USING btree (id, "tenantId");


--
-- Name: student_fee_heads_tenantId_feeHeadId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "student_fee_heads_tenantId_feeHeadId_idx" ON public.student_fee_heads USING btree ("tenantId", "feeHeadId");


--
-- Name: student_fee_heads_tenantId_studentFeeId_feeHeadId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "student_fee_heads_tenantId_studentFeeId_feeHeadId_key" ON public.student_fee_heads USING btree ("tenantId", "studentFeeId", "feeHeadId");


--
-- Name: student_fee_heads_tenantId_studentFeeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "student_fee_heads_tenantId_studentFeeId_idx" ON public.student_fee_heads USING btree ("tenantId", "studentFeeId");


--
-- Name: student_fees_enrollmentId_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "student_fees_enrollmentId_tenantId_key" ON public.student_fees USING btree ("enrollmentId", "tenantId");


--
-- Name: student_fees_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "student_fees_id_tenantId_key" ON public.student_fees USING btree (id, "tenantId");


--
-- Name: student_fees_tenantId_enrollmentId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "student_fees_tenantId_enrollmentId_idx" ON public.student_fees USING btree ("tenantId", "enrollmentId");


--
-- Name: student_hostel_allocations_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "student_hostel_allocations_id_tenantId_key" ON public.student_hostel_allocations USING btree (id, "tenantId");


--
-- Name: student_hostel_allocations_tenantId_academicYearId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "student_hostel_allocations_tenantId_academicYearId_idx" ON public.student_hostel_allocations USING btree ("tenantId", "academicYearId");


--
-- Name: student_hostel_allocations_tenantId_enrollmentId_academicYe_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "student_hostel_allocations_tenantId_enrollmentId_academicYe_key" ON public.student_hostel_allocations USING btree ("tenantId", "enrollmentId", "academicYearId");


--
-- Name: student_hostel_allocations_tenantId_enrollmentId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "student_hostel_allocations_tenantId_enrollmentId_idx" ON public.student_hostel_allocations USING btree ("tenantId", "enrollmentId");


--
-- Name: student_hostel_allocations_tenantId_roomId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "student_hostel_allocations_tenantId_roomId_idx" ON public.student_hostel_allocations USING btree ("tenantId", "roomId");


--
-- Name: student_hostel_allocations_tenantId_sectionId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "student_hostel_allocations_tenantId_sectionId_idx" ON public.student_hostel_allocations USING btree ("tenantId", "sectionId");


--
-- Name: student_hostel_allocations_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "student_hostel_allocations_tenantId_status_idx" ON public.student_hostel_allocations USING btree ("tenantId", status);


--
-- Name: student_parents_tenantId_parentId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "student_parents_tenantId_parentId_idx" ON public.student_parents USING btree ("tenantId", "parentId");


--
-- Name: student_parents_tenantId_studentId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "student_parents_tenantId_studentId_idx" ON public.student_parents USING btree ("tenantId", "studentId");


--
-- Name: student_parents_tenantId_studentId_parentId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "student_parents_tenantId_studentId_parentId_key" ON public.student_parents USING btree ("tenantId", "studentId", "parentId");


--
-- Name: student_transport_assignments_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "student_transport_assignments_id_tenantId_key" ON public.student_transport_assignments USING btree (id, "tenantId");


--
-- Name: student_transport_assignments_tenantId_categoryId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "student_transport_assignments_tenantId_categoryId_idx" ON public.student_transport_assignments USING btree ("tenantId", "categoryId");


--
-- Name: student_transport_assignments_tenantId_enrollmentId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "student_transport_assignments_tenantId_enrollmentId_idx" ON public.student_transport_assignments USING btree ("tenantId", "enrollmentId");


--
-- Name: student_transport_assignments_tenantId_enrollmentId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "student_transport_assignments_tenantId_enrollmentId_key" ON public.student_transport_assignments USING btree ("tenantId", "enrollmentId");


--
-- Name: student_transport_assignments_tenantId_pickupPointId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "student_transport_assignments_tenantId_pickupPointId_idx" ON public.student_transport_assignments USING btree ("tenantId", "pickupPointId");


--
-- Name: student_transport_assignments_tenantId_vehicleId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "student_transport_assignments_tenantId_vehicleId_idx" ON public.student_transport_assignments USING btree ("tenantId", "vehicleId");


--
-- Name: students_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "students_id_tenantId_key" ON public.students USING btree (id, "tenantId");


--
-- Name: students_tenantId_aadhaarNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "students_tenantId_aadhaarNumber_key" ON public.students USING btree ("tenantId", "aadhaarNumber");


--
-- Name: students_tenantId_admissionNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "students_tenantId_admissionNumber_key" ON public.students USING btree ("tenantId", "admissionNumber");


--
-- Name: students_tenantId_apaarId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "students_tenantId_apaarId_key" ON public.students USING btree ("tenantId", "apaarId");


--
-- Name: students_tenantId_gradeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "students_tenantId_gradeId_idx" ON public.students USING btree ("tenantId", "gradeId");


--
-- Name: students_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "students_tenantId_idx" ON public.students USING btree ("tenantId");


--
-- Name: students_tenantId_pen_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "students_tenantId_pen_key" ON public.students USING btree ("tenantId", pen);


--
-- Name: students_tenantId_sectionId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "students_tenantId_sectionId_idx" ON public.students USING btree ("tenantId", "sectionId");


--
-- Name: students_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "students_tenantId_status_idx" ON public.students USING btree ("tenantId", status);


--
-- Name: subjects_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "subjects_id_tenantId_key" ON public.subjects USING btree (id, "tenantId");


--
-- Name: subjects_tenantId_courseId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "subjects_tenantId_courseId_idx" ON public.subjects USING btree ("tenantId", "courseId");


--
-- Name: subjects_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "subjects_tenantId_idx" ON public.subjects USING btree ("tenantId");


--
-- Name: teacher_assignments_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "teacher_assignments_id_tenantId_key" ON public.teacher_assignments USING btree (id, "tenantId");


--
-- Name: teacher_assignments_tenantId_academicYearId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "teacher_assignments_tenantId_academicYearId_idx" ON public.teacher_assignments USING btree ("tenantId", "academicYearId");


--
-- Name: teacher_assignments_tenantId_academicYearId_teacherId_secti_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "teacher_assignments_tenantId_academicYearId_teacherId_secti_key" ON public.teacher_assignments USING btree ("tenantId", "academicYearId", "teacherId", "sectionSubjectId");


--
-- Name: teacher_assignments_tenantId_sectionSubjectId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "teacher_assignments_tenantId_sectionSubjectId_idx" ON public.teacher_assignments USING btree ("tenantId", "sectionSubjectId");


--
-- Name: teacher_assignments_tenantId_teacherId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "teacher_assignments_tenantId_teacherId_idx" ON public.teacher_assignments USING btree ("tenantId", "teacherId");


--
-- Name: teacher_availability_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "teacher_availability_id_tenantId_key" ON public.teacher_availability USING btree (id, "tenantId");


--
-- Name: teacher_availability_tenantId_teacherId_dayOfWeek_startTime_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "teacher_availability_tenantId_teacherId_dayOfWeek_startTime_key" ON public.teacher_availability USING btree ("tenantId", "teacherId", "dayOfWeek", "startTime", "endTime");


--
-- Name: teacher_availability_tenantId_teacherId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "teacher_availability_tenantId_teacherId_idx" ON public.teacher_availability USING btree ("tenantId", "teacherId");


--
-- Name: teacher_capabilities_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "teacher_capabilities_id_tenantId_key" ON public.teacher_capabilities USING btree (id, "tenantId");


--
-- Name: teacher_capabilities_tenantId_courseId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "teacher_capabilities_tenantId_courseId_idx" ON public.teacher_capabilities USING btree ("tenantId", "courseId");


--
-- Name: teacher_capabilities_tenantId_gradeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "teacher_capabilities_tenantId_gradeId_idx" ON public.teacher_capabilities USING btree ("tenantId", "gradeId");


--
-- Name: teacher_capabilities_tenantId_sectionId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "teacher_capabilities_tenantId_sectionId_idx" ON public.teacher_capabilities USING btree ("tenantId", "sectionId");


--
-- Name: teacher_capabilities_tenantId_subjectId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "teacher_capabilities_tenantId_subjectId_idx" ON public.teacher_capabilities USING btree ("tenantId", "subjectId");


--
-- Name: teacher_capabilities_tenantId_teacherId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "teacher_capabilities_tenantId_teacherId_idx" ON public.teacher_capabilities USING btree ("tenantId", "teacherId");


--
-- Name: teacher_employment_history_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "teacher_employment_history_id_tenantId_key" ON public.teacher_employment_history USING btree (id, "tenantId");


--
-- Name: teacher_employment_history_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "teacher_employment_history_tenantId_idx" ON public.teacher_employment_history USING btree ("tenantId");


--
-- Name: teacher_employment_history_tenantId_teacherId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "teacher_employment_history_tenantId_teacherId_idx" ON public.teacher_employment_history USING btree ("tenantId", "teacherId");


--
-- Name: teacher_qualifications_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "teacher_qualifications_id_tenantId_key" ON public.teacher_qualifications USING btree (id, "tenantId");


--
-- Name: teacher_qualifications_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "teacher_qualifications_tenantId_idx" ON public.teacher_qualifications USING btree ("tenantId");


--
-- Name: teacher_qualifications_tenantId_teacherId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "teacher_qualifications_tenantId_teacherId_idx" ON public.teacher_qualifications USING btree ("tenantId", "teacherId");


--
-- Name: teachers_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "teachers_id_tenantId_key" ON public.teachers USING btree (id, "tenantId");


--
-- Name: teachers_registrationToken_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "teachers_registrationToken_key" ON public.teachers USING btree ("registrationToken");


--
-- Name: teachers_tenantId_employeeCode_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "teachers_tenantId_employeeCode_key" ON public.teachers USING btree ("tenantId", "employeeCode");


--
-- Name: teachers_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "teachers_tenantId_idx" ON public.teachers USING btree ("tenantId");


--
-- Name: teachers_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "teachers_tenantId_status_idx" ON public.teachers USING btree ("tenantId", status);


--
-- Name: teachers_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "teachers_userId_key" ON public.teachers USING btree ("userId");


--
-- Name: teachers_userId_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "teachers_userId_tenantId_key" ON public.teachers USING btree ("userId", "tenantId");


--
-- Name: tenant_holiday_rules_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "tenant_holiday_rules_id_tenantId_key" ON public.tenant_holiday_rules USING btree (id, "tenantId");


--
-- Name: tenant_holiday_rules_tenantId_academicYearId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "tenant_holiday_rules_tenantId_academicYearId_idx" ON public.tenant_holiday_rules USING btree ("tenantId", "academicYearId");


--
-- Name: tenant_holiday_rules_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "tenant_holiday_rules_tenantId_idx" ON public.tenant_holiday_rules USING btree ("tenantId");


--
-- Name: tenant_leave_configurations_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "tenant_leave_configurations_id_tenantId_key" ON public.tenant_leave_configurations USING btree (id, "tenantId");


--
-- Name: tenant_leave_configurations_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "tenant_leave_configurations_tenantId_key" ON public.tenant_leave_configurations USING btree ("tenantId");


--
-- Name: tenants_domain_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX tenants_domain_key ON public.tenants USING btree (domain);


--
-- Name: timetable_entries_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "timetable_entries_id_tenantId_key" ON public.timetable_entries USING btree (id, "tenantId");


--
-- Name: timetable_entries_tenantId_academicYearId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "timetable_entries_tenantId_academicYearId_idx" ON public.timetable_entries USING btree ("tenantId", "academicYearId");


--
-- Name: timetable_entries_tenantId_periodId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "timetable_entries_tenantId_periodId_idx" ON public.timetable_entries USING btree ("tenantId", "periodId");


--
-- Name: timetable_entries_tenantId_sectionSubjectId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "timetable_entries_tenantId_sectionSubjectId_idx" ON public.timetable_entries USING btree ("tenantId", "sectionSubjectId");


--
-- Name: timetable_periods_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "timetable_periods_id_tenantId_key" ON public.timetable_periods USING btree (id, "tenantId");


--
-- Name: timetable_periods_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "timetable_periods_tenantId_idx" ON public.timetable_periods USING btree ("tenantId");


--
-- Name: timetable_periods_tenantId_structureId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "timetable_periods_tenantId_structureId_idx" ON public.timetable_periods USING btree ("tenantId", "structureId");


--
-- Name: timetable_periods_tenantId_structureId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "timetable_periods_tenantId_structureId_name_key" ON public.timetable_periods USING btree ("tenantId", "structureId", name);


--
-- Name: timetable_structures_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "timetable_structures_id_tenantId_key" ON public.timetable_structures USING btree (id, "tenantId");


--
-- Name: timetable_structures_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "timetable_structures_tenantId_idx" ON public.timetable_structures USING btree ("tenantId");


--
-- Name: timetable_structures_tenantId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "timetable_structures_tenantId_name_key" ON public.timetable_structures USING btree ("tenantId", name);


--
-- Name: token_blacklist_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX token_blacklist_token_key ON public.token_blacklist USING btree (token);


--
-- Name: uploads_tenantId_entityId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "uploads_tenantId_entityId_idx" ON public.uploads USING btree ("tenantId", "entityId");


--
-- Name: uploads_tenantId_entityType_entityId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "uploads_tenantId_entityType_entityId_idx" ON public.uploads USING btree ("tenantId", "entityType", "entityId");


--
-- Name: uploads_tenantId_entityType_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "uploads_tenantId_entityType_idx" ON public.uploads USING btree ("tenantId", "entityType");


--
-- Name: uploads_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "uploads_tenantId_idx" ON public.uploads USING btree ("tenantId");


--
-- Name: users_email_userType_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "users_email_userType_key" ON public.users USING btree (email, "userType");


--
-- Name: users_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "users_id_tenantId_key" ON public.users USING btree (id, "tenantId");


--
-- Name: users_tenantId_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "users_tenantId_email_key" ON public.users USING btree ("tenantId", email);


--
-- Name: users_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "users_tenantId_idx" ON public.users USING btree ("tenantId");


--
-- Name: users_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "users_tenantId_status_idx" ON public.users USING btree ("tenantId", status);


--
-- Name: vehicle_categories_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "vehicle_categories_id_tenantId_key" ON public.vehicle_categories USING btree (id, "tenantId");


--
-- Name: vehicle_categories_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "vehicle_categories_tenantId_idx" ON public.vehicle_categories USING btree ("tenantId");


--
-- Name: vehicle_categories_tenantId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "vehicle_categories_tenantId_name_key" ON public.vehicle_categories USING btree ("tenantId", name);


--
-- Name: vehicle_driver_assignments_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "vehicle_driver_assignments_id_tenantId_key" ON public.vehicle_driver_assignments USING btree (id, "tenantId");


--
-- Name: vehicle_driver_assignments_tenantId_driverId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "vehicle_driver_assignments_tenantId_driverId_idx" ON public.vehicle_driver_assignments USING btree ("tenantId", "driverId");


--
-- Name: vehicle_driver_assignments_tenantId_vehicleId_driverId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "vehicle_driver_assignments_tenantId_vehicleId_driverId_key" ON public.vehicle_driver_assignments USING btree ("tenantId", "vehicleId", "driverId");


--
-- Name: vehicle_driver_assignments_tenantId_vehicleId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "vehicle_driver_assignments_tenantId_vehicleId_idx" ON public.vehicle_driver_assignments USING btree ("tenantId", "vehicleId");


--
-- Name: vehicles_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "vehicles_id_tenantId_key" ON public.vehicles USING btree (id, "tenantId");


--
-- Name: vehicles_tenantId_categoryId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "vehicles_tenantId_categoryId_idx" ON public.vehicles USING btree ("tenantId", "categoryId");


--
-- Name: vehicles_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "vehicles_tenantId_idx" ON public.vehicles USING btree ("tenantId");


--
-- Name: vehicles_tenantId_registrationNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "vehicles_tenantId_registrationNumber_key" ON public.vehicles USING btree ("tenantId", "registrationNumber");


--
-- Name: visitor_notifications_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "visitor_notifications_id_tenantId_key" ON public.visitor_notifications USING btree (id, "tenantId");


--
-- Name: visitor_notifications_tenantId_isRead_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "visitor_notifications_tenantId_isRead_idx" ON public.visitor_notifications USING btree ("tenantId", "isRead");


--
-- Name: visitor_notifications_tenantId_sentToId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "visitor_notifications_tenantId_sentToId_idx" ON public.visitor_notifications USING btree ("tenantId", "sentToId");


--
-- Name: visitor_notifications_tenantId_visitorId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "visitor_notifications_tenantId_visitorId_idx" ON public.visitor_notifications USING btree ("tenantId", "visitorId");


--
-- Name: visitor_purposes_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "visitor_purposes_id_tenantId_key" ON public.visitor_purposes USING btree (id, "tenantId");


--
-- Name: visitor_purposes_tenantId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "visitor_purposes_tenantId_idx" ON public.visitor_purposes USING btree ("tenantId");


--
-- Name: visitor_purposes_tenantId_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "visitor_purposes_tenantId_name_key" ON public.visitor_purposes USING btree ("tenantId", name);


--
-- Name: visitors_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "visitors_id_tenantId_key" ON public.visitors USING btree (id, "tenantId");


--
-- Name: visitors_tenantId_approvalStatus_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "visitors_tenantId_approvalStatus_idx" ON public.visitors USING btree ("tenantId", "approvalStatus");


--
-- Name: visitors_tenantId_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "visitors_tenantId_createdAt_idx" ON public.visitors USING btree ("tenantId", "createdAt");


--
-- Name: visitors_tenantId_parentId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "visitors_tenantId_parentId_idx" ON public.visitors USING btree ("tenantId", "parentId");


--
-- Name: visitors_tenantId_pointOfContactId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "visitors_tenantId_pointOfContactId_idx" ON public.visitors USING btree ("tenantId", "pointOfContactId");


--
-- Name: visitors_tenantId_purposeId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "visitors_tenantId_purposeId_idx" ON public.visitors USING btree ("tenantId", "purposeId");


--
-- Name: visitors_tenantId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "visitors_tenantId_status_idx" ON public.visitors USING btree ("tenantId", status);


--
-- Name: visitors_tenantId_visitorType_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "visitors_tenantId_visitorType_idx" ON public.visitors USING btree ("tenantId", "visitorType");


--
-- Name: zai_chats_id_tenantId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "zai_chats_id_tenantId_key" ON public.zai_chats USING btree (id, "tenantId");


--
-- Name: zai_chats_tenantId_updatedAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "zai_chats_tenantId_updatedAt_idx" ON public.zai_chats USING btree ("tenantId", "updatedAt");


--
-- Name: zai_chats_tenantId_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "zai_chats_tenantId_userId_idx" ON public.zai_chats USING btree ("tenantId", "userId");


--
-- Name: zai_messages_chatId_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "zai_messages_chatId_createdAt_idx" ON public.zai_messages USING btree ("chatId", "createdAt");


--
-- Name: academic_years academic_years_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academic_years
    ADD CONSTRAINT "academic_years_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: account_categories account_categories_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_categories
    ADD CONSTRAINT "account_categories_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: account_transactions account_transactions_categoryId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_transactions
    ADD CONSTRAINT "account_transactions_categoryId_tenantId_fkey" FOREIGN KEY ("categoryId", "tenantId") REFERENCES public.account_categories(id, "tenantId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: account_transactions account_transactions_createdById_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_transactions
    ADD CONSTRAINT "account_transactions_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: account_transactions account_transactions_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_transactions
    ADD CONSTRAINT "account_transactions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: account_transactions account_transactions_voidedById_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_transactions
    ADD CONSTRAINT "account_transactions_voidedById_tenantId_fkey" FOREIGN KEY ("voidedById", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: attendance_marks attendance_marks_enrollmentId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_marks
    ADD CONSTRAINT "attendance_marks_enrollmentId_tenantId_fkey" FOREIGN KEY ("enrollmentId", "tenantId") REFERENCES public.student_enrollments(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: attendance_marks attendance_marks_sessionId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_marks
    ADD CONSTRAINT "attendance_marks_sessionId_tenantId_fkey" FOREIGN KEY ("sessionId", "tenantId") REFERENCES public.attendance_sessions(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: attendance_marks attendance_marks_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_marks
    ADD CONSTRAINT "attendance_marks_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: attendance_sessions attendance_sessions_academicYearId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_sessions
    ADD CONSTRAINT "attendance_sessions_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES public.academic_years(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: attendance_sessions attendance_sessions_attendanceTypeId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_sessions
    ADD CONSTRAINT "attendance_sessions_attendanceTypeId_tenantId_fkey" FOREIGN KEY ("attendanceTypeId", "tenantId") REFERENCES public.attendance_types(id, "tenantId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: attendance_sessions attendance_sessions_examScheduleId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_sessions
    ADD CONSTRAINT "attendance_sessions_examScheduleId_tenantId_fkey" FOREIGN KEY ("examScheduleId", "tenantId") REFERENCES public.exam_schedules(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: attendance_sessions attendance_sessions_periodId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_sessions
    ADD CONSTRAINT "attendance_sessions_periodId_tenantId_fkey" FOREIGN KEY ("periodId", "tenantId") REFERENCES public.timetable_periods(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: attendance_sessions attendance_sessions_sectionId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_sessions
    ADD CONSTRAINT "attendance_sessions_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES public.sections(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: attendance_sessions attendance_sessions_sectionSubjectId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_sessions
    ADD CONSTRAINT "attendance_sessions_sectionSubjectId_tenantId_fkey" FOREIGN KEY ("sectionSubjectId", "tenantId") REFERENCES public.section_subjects(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: attendance_sessions attendance_sessions_takenById_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_sessions
    ADD CONSTRAINT "attendance_sessions_takenById_tenantId_fkey" FOREIGN KEY ("takenById", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: attendance_sessions attendance_sessions_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_sessions
    ADD CONSTRAINT "attendance_sessions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: attendance_types attendance_types_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_types
    ADD CONSTRAINT "attendance_types_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: automation_rules automation_rules_templateId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.automation_rules
    ADD CONSTRAINT "automation_rules_templateId_tenantId_fkey" FOREIGN KEY ("templateId", "tenantId") REFERENCES public.notification_templates(id, "tenantId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: automation_rules automation_rules_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.automation_rules
    ADD CONSTRAINT "automation_rules_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: buildings buildings_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.buildings
    ADD CONSTRAINT "buildings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: channel_configurations channel_configurations_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.channel_configurations
    ADD CONSTRAINT "channel_configurations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: communication_recipients communication_recipients_communicationId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communication_recipients
    ADD CONSTRAINT "communication_recipients_communicationId_tenantId_fkey" FOREIGN KEY ("communicationId", "tenantId") REFERENCES public.communications(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: communication_recipients communication_recipients_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communication_recipients
    ADD CONSTRAINT "communication_recipients_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: communication_recipients communication_recipients_userId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communication_recipients
    ADD CONSTRAINT "communication_recipients_userId_tenantId_fkey" FOREIGN KEY ("userId", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: communications communications_automationRuleId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications
    ADD CONSTRAINT "communications_automationRuleId_tenantId_fkey" FOREIGN KEY ("automationRuleId", "tenantId") REFERENCES public.automation_rules(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: communications communications_senderId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications
    ADD CONSTRAINT "communications_senderId_tenantId_fkey" FOREIGN KEY ("senderId", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: communications communications_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.communications
    ADD CONSTRAINT "communications_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: compensation_components compensation_components_compensationId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compensation_components
    ADD CONSTRAINT "compensation_components_compensationId_tenantId_fkey" FOREIGN KEY ("compensationId", "tenantId") REFERENCES public.employee_compensations(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: compensation_components compensation_components_salaryComponentId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compensation_components
    ADD CONSTRAINT "compensation_components_salaryComponentId_tenantId_fkey" FOREIGN KEY ("salaryComponentId", "tenantId") REFERENCES public.salary_components(id, "tenantId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: compensation_components compensation_components_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compensation_components
    ADD CONSTRAINT "compensation_components_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: compensation_history compensation_history_changedById_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compensation_history
    ADD CONSTRAINT "compensation_history_changedById_tenantId_fkey" FOREIGN KEY ("changedById", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: compensation_history compensation_history_compensationId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compensation_history
    ADD CONSTRAINT "compensation_history_compensationId_tenantId_fkey" FOREIGN KEY ("compensationId", "tenantId") REFERENCES public.employee_compensations(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: compensation_history compensation_history_employeeId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compensation_history
    ADD CONSTRAINT "compensation_history_employeeId_tenantId_fkey" FOREIGN KEY ("employeeId", "tenantId") REFERENCES public.teachers(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: compensation_history compensation_history_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.compensation_history
    ADD CONSTRAINT "compensation_history_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: courses courses_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT "courses_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: employee_compensations employee_compensations_createdById_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_compensations
    ADD CONSTRAINT "employee_compensations_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: employee_compensations employee_compensations_employeeId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_compensations
    ADD CONSTRAINT "employee_compensations_employeeId_tenantId_fkey" FOREIGN KEY ("employeeId", "tenantId") REFERENCES public.teachers(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: employee_compensations employee_compensations_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_compensations
    ADD CONSTRAINT "employee_compensations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: employee_compensations employee_compensations_updatedById_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_compensations
    ADD CONSTRAINT "employee_compensations_updatedById_tenantId_fkey" FOREIGN KEY ("updatedById", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: employee_leave_balances employee_leave_balances_academicYearId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_leave_balances
    ADD CONSTRAINT "employee_leave_balances_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES public.academic_years(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: employee_leave_balances employee_leave_balances_employeeId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_leave_balances
    ADD CONSTRAINT "employee_leave_balances_employeeId_tenantId_fkey" FOREIGN KEY ("employeeId", "tenantId") REFERENCES public.teachers(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: employee_leave_balances employee_leave_balances_leaveCategoryId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_leave_balances
    ADD CONSTRAINT "employee_leave_balances_leaveCategoryId_tenantId_fkey" FOREIGN KEY ("leaveCategoryId", "tenantId") REFERENCES public.leave_categories(id, "tenantId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: employee_leave_balances employee_leave_balances_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_leave_balances
    ADD CONSTRAINT "employee_leave_balances_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: employee_leave_loss_of_pay employee_leave_loss_of_pay_employeeId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_leave_loss_of_pay
    ADD CONSTRAINT "employee_leave_loss_of_pay_employeeId_tenantId_fkey" FOREIGN KEY ("employeeId", "tenantId") REFERENCES public.teachers(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: employee_leave_loss_of_pay employee_leave_loss_of_pay_leaveRequestId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_leave_loss_of_pay
    ADD CONSTRAINT "employee_leave_loss_of_pay_leaveRequestId_tenantId_fkey" FOREIGN KEY ("leaveRequestId", "tenantId") REFERENCES public.leave_requests(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: employee_leave_loss_of_pay employee_leave_loss_of_pay_payrollBatchId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_leave_loss_of_pay
    ADD CONSTRAINT "employee_leave_loss_of_pay_payrollBatchId_tenantId_fkey" FOREIGN KEY ("payrollBatchId", "tenantId") REFERENCES public.payroll_batches(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: employee_leave_loss_of_pay employee_leave_loss_of_pay_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_leave_loss_of_pay
    ADD CONSTRAINT "employee_leave_loss_of_pay_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: exam_marks exam_marks_enrollmentId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_marks
    ADD CONSTRAINT "exam_marks_enrollmentId_tenantId_fkey" FOREIGN KEY ("enrollmentId", "tenantId") REFERENCES public.student_enrollments(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: exam_marks exam_marks_examPaperId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_marks
    ADD CONSTRAINT "exam_marks_examPaperId_tenantId_fkey" FOREIGN KEY ("examPaperId", "tenantId") REFERENCES public.exam_schedule_papers(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: exam_marks exam_marks_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_marks
    ADD CONSTRAINT "exam_marks_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: exam_schedule_papers exam_schedule_papers_inChargeId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_schedule_papers
    ADD CONSTRAINT "exam_schedule_papers_inChargeId_tenantId_fkey" FOREIGN KEY ("inChargeId", "tenantId") REFERENCES public.teachers(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: exam_schedule_papers exam_schedule_papers_scheduleId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_schedule_papers
    ADD CONSTRAINT "exam_schedule_papers_scheduleId_tenantId_fkey" FOREIGN KEY ("scheduleId", "tenantId") REFERENCES public.exam_schedules(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: exam_schedule_papers exam_schedule_papers_sectionSubjectId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_schedule_papers
    ADD CONSTRAINT "exam_schedule_papers_sectionSubjectId_tenantId_fkey" FOREIGN KEY ("sectionSubjectId", "tenantId") REFERENCES public.section_subjects(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: exam_schedule_papers exam_schedule_papers_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_schedule_papers
    ADD CONSTRAINT "exam_schedule_papers_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: exam_schedules exam_schedules_examId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_schedules
    ADD CONSTRAINT "exam_schedules_examId_tenantId_fkey" FOREIGN KEY ("examId", "tenantId") REFERENCES public.exams(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: exam_schedules exam_schedules_sectionId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_schedules
    ADD CONSTRAINT "exam_schedules_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES public.sections(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: exam_schedules exam_schedules_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_schedules
    ADD CONSTRAINT "exam_schedules_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: exam_target_grades exam_target_grades_examId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_target_grades
    ADD CONSTRAINT "exam_target_grades_examId_tenantId_fkey" FOREIGN KEY ("examId", "tenantId") REFERENCES public.exams(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: exam_target_grades exam_target_grades_gradeId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_target_grades
    ADD CONSTRAINT "exam_target_grades_gradeId_tenantId_fkey" FOREIGN KEY ("gradeId", "tenantId") REFERENCES public.grades(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: exam_target_grades exam_target_grades_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_target_grades
    ADD CONSTRAINT "exam_target_grades_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: exam_target_sections exam_target_sections_examId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_target_sections
    ADD CONSTRAINT "exam_target_sections_examId_tenantId_fkey" FOREIGN KEY ("examId", "tenantId") REFERENCES public.exams(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: exam_target_sections exam_target_sections_sectionId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_target_sections
    ADD CONSTRAINT "exam_target_sections_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES public.sections(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: exam_target_sections exam_target_sections_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_target_sections
    ADD CONSTRAINT "exam_target_sections_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: exams exams_academicYearId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT "exams_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES public.academic_years(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: exams exams_gradingScaleId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT "exams_gradingScaleId_tenantId_fkey" FOREIGN KEY ("gradingScaleId", "tenantId") REFERENCES public.grading_scales(id, "tenantId") ON UPDATE CASCADE;


--
-- Name: exams exams_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT "exams_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fee_heads fee_heads_hostelRoomTypeId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_heads
    ADD CONSTRAINT "fee_heads_hostelRoomTypeId_tenantId_fkey" FOREIGN KEY ("hostelRoomTypeId", "tenantId") REFERENCES public.hostel_room_types(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: fee_heads fee_heads_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_heads
    ADD CONSTRAINT "fee_heads_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fee_payments fee_payments_collectedById_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_payments
    ADD CONSTRAINT "fee_payments_collectedById_tenantId_fkey" FOREIGN KEY ("collectedById", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: fee_payments fee_payments_feeHeadId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_payments
    ADD CONSTRAINT "fee_payments_feeHeadId_tenantId_fkey" FOREIGN KEY ("feeHeadId", "tenantId") REFERENCES public.fee_heads(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: fee_payments fee_payments_studentFeeId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_payments
    ADD CONSTRAINT "fee_payments_studentFeeId_tenantId_fkey" FOREIGN KEY ("studentFeeId", "tenantId") REFERENCES public.student_fees(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fee_payments fee_payments_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_payments
    ADD CONSTRAINT "fee_payments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fee_payments fee_payments_termId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_payments
    ADD CONSTRAINT "fee_payments_termId_tenantId_fkey" FOREIGN KEY ("termId", "tenantId") REFERENCES public.fee_terms(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: fee_refunds fee_refunds_paymentId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_refunds
    ADD CONSTRAINT "fee_refunds_paymentId_tenantId_fkey" FOREIGN KEY ("paymentId", "tenantId") REFERENCES public.fee_payments(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fee_refunds fee_refunds_processedById_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_refunds
    ADD CONSTRAINT "fee_refunds_processedById_tenantId_fkey" FOREIGN KEY ("processedById", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: fee_refunds fee_refunds_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_refunds
    ADD CONSTRAINT "fee_refunds_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fee_terms fee_terms_sectionFeeId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_terms
    ADD CONSTRAINT "fee_terms_sectionFeeId_tenantId_fkey" FOREIGN KEY ("sectionFeeId", "tenantId") REFERENCES public.section_fees(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fee_terms fee_terms_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_terms
    ADD CONSTRAINT "fee_terms_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: floors floors_buildingId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.floors
    ADD CONSTRAINT "floors_buildingId_tenantId_fkey" FOREIGN KEY ("buildingId", "tenantId") REFERENCES public.buildings(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: floors floors_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.floors
    ADD CONSTRAINT "floors_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: grades grades_courseId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT "grades_courseId_tenantId_fkey" FOREIGN KEY ("courseId", "tenantId") REFERENCES public.courses(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: grades grades_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT "grades_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: grading_bands grading_bands_scaleId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grading_bands
    ADD CONSTRAINT "grading_bands_scaleId_tenantId_fkey" FOREIGN KEY ("scaleId", "tenantId") REFERENCES public.grading_scales(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: grading_bands grading_bands_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grading_bands
    ADD CONSTRAINT "grading_bands_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: grading_scales grading_scales_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grading_scales
    ADD CONSTRAINT "grading_scales_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: groups groups_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT "groups_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: holiday_categories holiday_categories_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.holiday_categories
    ADD CONSTRAINT "holiday_categories_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: holidays holidays_academicYearId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.holidays
    ADD CONSTRAINT "holidays_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES public.academic_years(id, "tenantId") ON UPDATE CASCADE;


--
-- Name: holidays holidays_categoryId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.holidays
    ADD CONSTRAINT "holidays_categoryId_tenantId_fkey" FOREIGN KEY ("categoryId", "tenantId") REFERENCES public.holiday_categories(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: holidays holidays_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.holidays
    ADD CONSTRAINT "holidays_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hostel_blocks hostel_blocks_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_blocks
    ADD CONSTRAINT "hostel_blocks_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hostel_floors hostel_floors_blockId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_floors
    ADD CONSTRAINT "hostel_floors_blockId_tenantId_fkey" FOREIGN KEY ("blockId", "tenantId") REFERENCES public.hostel_blocks(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hostel_floors hostel_floors_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_floors
    ADD CONSTRAINT "hostel_floors_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hostel_room_types hostel_room_types_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_room_types
    ADD CONSTRAINT "hostel_room_types_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hostel_rooms hostel_rooms_floorId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_rooms
    ADD CONSTRAINT "hostel_rooms_floorId_tenantId_fkey" FOREIGN KEY ("floorId", "tenantId") REFERENCES public.hostel_floors(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hostel_rooms hostel_rooms_roomTypeId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_rooms
    ADD CONSTRAINT "hostel_rooms_roomTypeId_tenantId_fkey" FOREIGN KEY ("roomTypeId", "tenantId") REFERENCES public.hostel_room_types(id, "tenantId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: hostel_rooms hostel_rooms_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_rooms
    ADD CONSTRAINT "hostel_rooms_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hostel_section_rooms hostel_section_rooms_roomId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_section_rooms
    ADD CONSTRAINT "hostel_section_rooms_roomId_tenantId_fkey" FOREIGN KEY ("roomId", "tenantId") REFERENCES public.hostel_rooms(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hostel_section_rooms hostel_section_rooms_sectionId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_section_rooms
    ADD CONSTRAINT "hostel_section_rooms_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES public.hostel_sections(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hostel_section_rooms hostel_section_rooms_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_section_rooms
    ADD CONSTRAINT "hostel_section_rooms_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hostel_sections hostel_sections_sectionId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_sections
    ADD CONSTRAINT "hostel_sections_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES public.sections(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hostel_sections hostel_sections_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_sections
    ADD CONSTRAINT "hostel_sections_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hostel_staff_assignments hostel_staff_assignments_blockId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_staff_assignments
    ADD CONSTRAINT "hostel_staff_assignments_blockId_tenantId_fkey" FOREIGN KEY ("blockId", "tenantId") REFERENCES public.hostel_blocks(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hostel_staff_assignments hostel_staff_assignments_teacherId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_staff_assignments
    ADD CONSTRAINT "hostel_staff_assignments_teacherId_tenantId_fkey" FOREIGN KEY ("teacherId", "tenantId") REFERENCES public.teachers(id, "tenantId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: hostel_staff_assignments hostel_staff_assignments_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_staff_assignments
    ADD CONSTRAINT "hostel_staff_assignments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: id_sequence_logs id_sequence_logs_patternId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.id_sequence_logs
    ADD CONSTRAINT "id_sequence_logs_patternId_tenantId_fkey" FOREIGN KEY ("patternId", "tenantId") REFERENCES public.id_sequence_patterns(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: id_sequence_logs id_sequence_logs_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.id_sequence_logs
    ADD CONSTRAINT "id_sequence_logs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: id_sequence_patterns id_sequence_patterns_academicYearId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.id_sequence_patterns
    ADD CONSTRAINT "id_sequence_patterns_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES public.academic_years(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: id_sequence_patterns id_sequence_patterns_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.id_sequence_patterns
    ADD CONSTRAINT "id_sequence_patterns_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: inventory_categories inventory_categories_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory_categories
    ADD CONSTRAINT "inventory_categories_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: inventory_items inventory_items_categoryId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory_items
    ADD CONSTRAINT "inventory_items_categoryId_tenantId_fkey" FOREIGN KEY ("categoryId", "tenantId") REFERENCES public.inventory_categories(id, "tenantId") ON UPDATE CASCADE;


--
-- Name: inventory_items inventory_items_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory_items
    ADD CONSTRAINT "inventory_items_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: leave_approvals leave_approvals_leaveRequestId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_approvals
    ADD CONSTRAINT "leave_approvals_leaveRequestId_tenantId_fkey" FOREIGN KEY ("leaveRequestId", "tenantId") REFERENCES public.leave_requests(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: leave_approvals leave_approvals_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_approvals
    ADD CONSTRAINT "leave_approvals_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: leave_audit_logs leave_audit_logs_leaveRequestId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_audit_logs
    ADD CONSTRAINT "leave_audit_logs_leaveRequestId_tenantId_fkey" FOREIGN KEY ("leaveRequestId", "tenantId") REFERENCES public.leave_requests(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: leave_audit_logs leave_audit_logs_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_audit_logs
    ADD CONSTRAINT "leave_audit_logs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: leave_balance_transactions leave_balance_transactions_balanceId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_balance_transactions
    ADD CONSTRAINT "leave_balance_transactions_balanceId_tenantId_fkey" FOREIGN KEY ("balanceId", "tenantId") REFERENCES public.employee_leave_balances(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: leave_balance_transactions leave_balance_transactions_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_balance_transactions
    ADD CONSTRAINT "leave_balance_transactions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: leave_cancellations leave_cancellations_leaveRequestId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_cancellations
    ADD CONSTRAINT "leave_cancellations_leaveRequestId_tenantId_fkey" FOREIGN KEY ("leaveRequestId", "tenantId") REFERENCES public.leave_requests(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: leave_cancellations leave_cancellations_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_cancellations
    ADD CONSTRAINT "leave_cancellations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: leave_categories leave_categories_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_categories
    ADD CONSTRAINT "leave_categories_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: leave_notifications leave_notifications_leaveRequestId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_notifications
    ADD CONSTRAINT "leave_notifications_leaveRequestId_tenantId_fkey" FOREIGN KEY ("leaveRequestId", "tenantId") REFERENCES public.leave_requests(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: leave_notifications leave_notifications_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_notifications
    ADD CONSTRAINT "leave_notifications_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: leave_requests leave_requests_employeeId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT "leave_requests_employeeId_tenantId_fkey" FOREIGN KEY ("employeeId", "tenantId") REFERENCES public.teachers(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: leave_requests leave_requests_enrollmentId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT "leave_requests_enrollmentId_tenantId_fkey" FOREIGN KEY ("enrollmentId", "tenantId") REFERENCES public.student_enrollments(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: leave_requests leave_requests_leaveCategoryId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT "leave_requests_leaveCategoryId_tenantId_fkey" FOREIGN KEY ("leaveCategoryId", "tenantId") REFERENCES public.leave_categories(id, "tenantId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: leave_requests leave_requests_studentId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT "leave_requests_studentId_tenantId_fkey" FOREIGN KEY ("studentId", "tenantId") REFERENCES public.students(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: leave_requests leave_requests_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT "leave_requests_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notification_templates notification_templates_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_templates
    ADD CONSTRAINT "notification_templates_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: parents parents_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parents
    ADD CONSTRAINT "parents_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: parents parents_userId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parents
    ADD CONSTRAINT "parents_userId_tenantId_fkey" FOREIGN KEY ("userId", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: payroll_batches payroll_batches_createdById_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_batches
    ADD CONSTRAINT "payroll_batches_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: payroll_batches payroll_batches_processedById_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_batches
    ADD CONSTRAINT "payroll_batches_processedById_tenantId_fkey" FOREIGN KEY ("processedById", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: payroll_batches payroll_batches_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_batches
    ADD CONSTRAINT "payroll_batches_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payroll_records payroll_records_batchId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_records
    ADD CONSTRAINT "payroll_records_batchId_tenantId_fkey" FOREIGN KEY ("batchId", "tenantId") REFERENCES public.payroll_batches(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payroll_records payroll_records_createdById_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_records
    ADD CONSTRAINT "payroll_records_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: payroll_records payroll_records_employeeId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_records
    ADD CONSTRAINT "payroll_records_employeeId_tenantId_fkey" FOREIGN KEY ("employeeId", "tenantId") REFERENCES public.teachers(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payroll_records payroll_records_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_records
    ADD CONSTRAINT "payroll_records_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pickup_points pickup_points_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pickup_points
    ADD CONSTRAINT "pickup_points_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: publication_revisions publication_revisions_changedById_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publication_revisions
    ADD CONSTRAINT "publication_revisions_changedById_tenantId_fkey" FOREIGN KEY ("changedById", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: publication_revisions publication_revisions_publicationId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publication_revisions
    ADD CONSTRAINT "publication_revisions_publicationId_tenantId_fkey" FOREIGN KEY ("publicationId", "tenantId") REFERENCES public.publications(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: publication_revisions publication_revisions_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publication_revisions
    ADD CONSTRAINT "publication_revisions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: publications publications_approvedById_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT "publications_approvedById_tenantId_fkey" FOREIGN KEY ("approvedById", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: publications publications_rejectedById_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT "publications_rejectedById_tenantId_fkey" FOREIGN KEY ("rejectedById", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: publications publications_submittedById_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT "publications_submittedById_tenantId_fkey" FOREIGN KEY ("submittedById", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: publications publications_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT "publications_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_groups role_groups_groupId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_groups
    ADD CONSTRAINT "role_groups_groupId_tenantId_fkey" FOREIGN KEY ("groupId", "tenantId") REFERENCES public.groups(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_groups role_groups_roleId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_groups
    ADD CONSTRAINT "role_groups_roleId_tenantId_fkey" FOREIGN KEY ("roleId", "tenantId") REFERENCES public.roles(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public.permissions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_roleId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "role_permissions_roleId_tenantId_fkey" FOREIGN KEY ("roleId", "tenantId") REFERENCES public.roles(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: roles roles_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "roles_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: rooms rooms_floorId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT "rooms_floorId_tenantId_fkey" FOREIGN KEY ("floorId", "tenantId") REFERENCES public.floors(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: rooms rooms_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT "rooms_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: salary_components salary_components_createdById_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.salary_components
    ADD CONSTRAINT "salary_components_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: salary_components salary_components_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.salary_components
    ADD CONSTRAINT "salary_components_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: salary_components salary_components_updatedById_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.salary_components
    ADD CONSTRAINT "salary_components_updatedById_tenantId_fkey" FOREIGN KEY ("updatedById", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: section_fee_heads section_fee_heads_feeHeadId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.section_fee_heads
    ADD CONSTRAINT "section_fee_heads_feeHeadId_tenantId_fkey" FOREIGN KEY ("feeHeadId", "tenantId") REFERENCES public.fee_heads(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: section_fee_heads section_fee_heads_sectionFeeId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.section_fee_heads
    ADD CONSTRAINT "section_fee_heads_sectionFeeId_tenantId_fkey" FOREIGN KEY ("sectionFeeId", "tenantId") REFERENCES public.section_fees(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: section_fee_heads section_fee_heads_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.section_fee_heads
    ADD CONSTRAINT "section_fee_heads_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: section_fees section_fees_academicYearId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.section_fees
    ADD CONSTRAINT "section_fees_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES public.academic_years(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: section_fees section_fees_sectionId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.section_fees
    ADD CONSTRAINT "section_fees_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES public.sections(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: section_fees section_fees_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.section_fees
    ADD CONSTRAINT "section_fees_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: section_subjects section_subjects_sectionId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.section_subjects
    ADD CONSTRAINT "section_subjects_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES public.sections(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: section_subjects section_subjects_subjectId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.section_subjects
    ADD CONSTRAINT "section_subjects_subjectId_tenantId_fkey" FOREIGN KEY ("subjectId", "tenantId") REFERENCES public.subjects(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: section_subjects section_subjects_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.section_subjects
    ADD CONSTRAINT "section_subjects_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sections sections_gradeId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT "sections_gradeId_tenantId_fkey" FOREIGN KEY ("gradeId", "tenantId") REFERENCES public.grades(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sections sections_roomId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT "sections_roomId_tenantId_fkey" FOREIGN KEY ("roomId", "tenantId") REFERENCES public.rooms(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sections sections_sectionInChargeId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT "sections_sectionInChargeId_tenantId_fkey" FOREIGN KEY ("sectionInChargeId", "tenantId") REFERENCES public.teachers(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sections sections_structureId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT "sections_structureId_tenantId_fkey" FOREIGN KEY ("structureId", "tenantId") REFERENCES public.timetable_structures(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sections sections_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT "sections_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: staff_attendance_sessions staff_attendance_sessions_attendanceId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff_attendance_sessions
    ADD CONSTRAINT "staff_attendance_sessions_attendanceId_tenantId_fkey" FOREIGN KEY ("attendanceId", "tenantId") REFERENCES public.staff_attendance(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: staff_attendance_sessions staff_attendance_sessions_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff_attendance_sessions
    ADD CONSTRAINT "staff_attendance_sessions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: staff_attendance staff_attendance_teacherId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff_attendance
    ADD CONSTRAINT "staff_attendance_teacherId_tenantId_fkey" FOREIGN KEY ("teacherId", "tenantId") REFERENCES public.teachers(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: staff_attendance staff_attendance_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff_attendance
    ADD CONSTRAINT "staff_attendance_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: stock_adjustments stock_adjustments_itemId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_adjustments
    ADD CONSTRAINT "stock_adjustments_itemId_tenantId_fkey" FOREIGN KEY ("itemId", "tenantId") REFERENCES public.inventory_items(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: stock_adjustments stock_adjustments_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_adjustments
    ADD CONSTRAINT "stock_adjustments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_categories store_categories_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_categories
    ADD CONSTRAINT "store_categories_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_due_payments store_due_payments_createdById_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_due_payments
    ADD CONSTRAINT "store_due_payments_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: store_due_payments store_due_payments_dueId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_due_payments
    ADD CONSTRAINT "store_due_payments_dueId_tenantId_fkey" FOREIGN KEY ("dueId", "tenantId") REFERENCES public.store_dues(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_due_payments store_due_payments_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_due_payments
    ADD CONSTRAINT "store_due_payments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_dues store_dues_createdById_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_dues
    ADD CONSTRAINT "store_dues_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: store_dues store_dues_enrollmentId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_dues
    ADD CONSTRAINT "store_dues_enrollmentId_tenantId_fkey" FOREIGN KEY ("enrollmentId", "tenantId") REFERENCES public.student_enrollments(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: store_dues store_dues_orderId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_dues
    ADD CONSTRAINT "store_dues_orderId_tenantId_fkey" FOREIGN KEY ("orderId", "tenantId") REFERENCES public.store_orders(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_dues store_dues_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_dues
    ADD CONSTRAINT "store_dues_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_dues store_dues_updatedById_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_dues
    ADD CONSTRAINT "store_dues_updatedById_tenantId_fkey" FOREIGN KEY ("updatedById", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: store_kit_items store_kit_items_kitId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_kit_items
    ADD CONSTRAINT "store_kit_items_kitId_tenantId_fkey" FOREIGN KEY ("kitId", "tenantId") REFERENCES public.store_kits(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_kit_items store_kit_items_productId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_kit_items
    ADD CONSTRAINT "store_kit_items_productId_tenantId_fkey" FOREIGN KEY ("productId", "tenantId") REFERENCES public.store_products(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: store_kit_items store_kit_items_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_kit_items
    ADD CONSTRAINT "store_kit_items_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_kit_sections store_kit_sections_kitId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_kit_sections
    ADD CONSTRAINT "store_kit_sections_kitId_tenantId_fkey" FOREIGN KEY ("kitId", "tenantId") REFERENCES public.store_kits(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_kit_sections store_kit_sections_sectionId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_kit_sections
    ADD CONSTRAINT "store_kit_sections_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES public.sections(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_kit_sections store_kit_sections_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_kit_sections
    ADD CONSTRAINT "store_kit_sections_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_kits store_kits_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_kits
    ADD CONSTRAINT "store_kits_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_order_items store_order_items_kitId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_order_items
    ADD CONSTRAINT "store_order_items_kitId_tenantId_fkey" FOREIGN KEY ("kitId", "tenantId") REFERENCES public.store_kits(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: store_order_items store_order_items_orderId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_order_items
    ADD CONSTRAINT "store_order_items_orderId_tenantId_fkey" FOREIGN KEY ("orderId", "tenantId") REFERENCES public.store_orders(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_order_items store_order_items_productId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_order_items
    ADD CONSTRAINT "store_order_items_productId_tenantId_fkey" FOREIGN KEY ("productId", "tenantId") REFERENCES public.store_products(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: store_order_items store_order_items_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_order_items
    ADD CONSTRAINT "store_order_items_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_orders store_orders_academicYearId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_orders
    ADD CONSTRAINT "store_orders_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES public.academic_years(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: store_orders store_orders_createdById_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_orders
    ADD CONSTRAINT "store_orders_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: store_orders store_orders_enrollmentId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_orders
    ADD CONSTRAINT "store_orders_enrollmentId_tenantId_fkey" FOREIGN KEY ("enrollmentId", "tenantId") REFERENCES public.student_enrollments(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: store_orders store_orders_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_orders
    ADD CONSTRAINT "store_orders_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_pending_items store_pending_items_createdById_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_pending_items
    ADD CONSTRAINT "store_pending_items_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: store_pending_items store_pending_items_orderItemId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_pending_items
    ADD CONSTRAINT "store_pending_items_orderItemId_tenantId_fkey" FOREIGN KEY ("orderItemId", "tenantId") REFERENCES public.store_order_items(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_pending_items store_pending_items_productId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_pending_items
    ADD CONSTRAINT "store_pending_items_productId_tenantId_fkey" FOREIGN KEY ("productId", "tenantId") REFERENCES public.store_products(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: store_pending_items store_pending_items_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_pending_items
    ADD CONSTRAINT "store_pending_items_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_product_sections store_product_sections_productId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_product_sections
    ADD CONSTRAINT "store_product_sections_productId_tenantId_fkey" FOREIGN KEY ("productId", "tenantId") REFERENCES public.store_products(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_product_sections store_product_sections_sectionId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_product_sections
    ADD CONSTRAINT "store_product_sections_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES public.sections(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_product_sections store_product_sections_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_product_sections
    ADD CONSTRAINT "store_product_sections_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_products store_products_categoryId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_products
    ADD CONSTRAINT "store_products_categoryId_tenantId_fkey" FOREIGN KEY ("categoryId", "tenantId") REFERENCES public.store_categories(id, "tenantId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: store_products store_products_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_products
    ADD CONSTRAINT "store_products_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_returns store_returns_createdById_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_returns
    ADD CONSTRAINT "store_returns_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: store_returns store_returns_orderItemId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_returns
    ADD CONSTRAINT "store_returns_orderItemId_tenantId_fkey" FOREIGN KEY ("orderItemId", "tenantId") REFERENCES public.store_order_items(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_returns store_returns_productId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_returns
    ADD CONSTRAINT "store_returns_productId_tenantId_fkey" FOREIGN KEY ("productId", "tenantId") REFERENCES public.store_products(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: store_returns store_returns_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_returns
    ADD CONSTRAINT "store_returns_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_enrollment_electives student_enrollment_electives_enrollmentId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_enrollment_electives
    ADD CONSTRAINT "student_enrollment_electives_enrollmentId_tenantId_fkey" FOREIGN KEY ("enrollmentId", "tenantId") REFERENCES public.student_enrollments(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_enrollment_electives student_enrollment_electives_sectionSubjectId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_enrollment_electives
    ADD CONSTRAINT "student_enrollment_electives_sectionSubjectId_tenantId_fkey" FOREIGN KEY ("sectionSubjectId", "tenantId") REFERENCES public.section_subjects(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_enrollment_electives student_enrollment_electives_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_enrollment_electives
    ADD CONSTRAINT "student_enrollment_electives_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_enrollments student_enrollments_academicYearId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_enrollments
    ADD CONSTRAINT "student_enrollments_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES public.academic_years(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_enrollments student_enrollments_gradeId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_enrollments
    ADD CONSTRAINT "student_enrollments_gradeId_tenantId_fkey" FOREIGN KEY ("gradeId", "tenantId") REFERENCES public.grades(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_enrollments student_enrollments_sectionId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_enrollments
    ADD CONSTRAINT "student_enrollments_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES public.sections(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_enrollments student_enrollments_studentId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_enrollments
    ADD CONSTRAINT "student_enrollments_studentId_tenantId_fkey" FOREIGN KEY ("studentId", "tenantId") REFERENCES public.students(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_enrollments student_enrollments_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_enrollments
    ADD CONSTRAINT "student_enrollments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_fee_heads student_fee_heads_feeHeadId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_fee_heads
    ADD CONSTRAINT "student_fee_heads_feeHeadId_tenantId_fkey" FOREIGN KEY ("feeHeadId", "tenantId") REFERENCES public.fee_heads(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_fee_heads student_fee_heads_studentFeeId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_fee_heads
    ADD CONSTRAINT "student_fee_heads_studentFeeId_tenantId_fkey" FOREIGN KEY ("studentFeeId", "tenantId") REFERENCES public.student_fees(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_fee_heads student_fee_heads_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_fee_heads
    ADD CONSTRAINT "student_fee_heads_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_fees student_fees_enrollmentId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_fees
    ADD CONSTRAINT "student_fees_enrollmentId_tenantId_fkey" FOREIGN KEY ("enrollmentId", "tenantId") REFERENCES public.student_enrollments(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_fees student_fees_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_fees
    ADD CONSTRAINT "student_fees_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_hostel_allocations student_hostel_allocations_academicYearId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_hostel_allocations
    ADD CONSTRAINT "student_hostel_allocations_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES public.academic_years(id, "tenantId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_hostel_allocations student_hostel_allocations_enrollmentId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_hostel_allocations
    ADD CONSTRAINT "student_hostel_allocations_enrollmentId_tenantId_fkey" FOREIGN KEY ("enrollmentId", "tenantId") REFERENCES public.student_enrollments(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_hostel_allocations student_hostel_allocations_roomId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_hostel_allocations
    ADD CONSTRAINT "student_hostel_allocations_roomId_tenantId_fkey" FOREIGN KEY ("roomId", "tenantId") REFERENCES public.hostel_rooms(id, "tenantId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_hostel_allocations student_hostel_allocations_sectionId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_hostel_allocations
    ADD CONSTRAINT "student_hostel_allocations_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES public.hostel_sections(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: student_hostel_allocations student_hostel_allocations_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_hostel_allocations
    ADD CONSTRAINT "student_hostel_allocations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_parents student_parents_parentId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_parents
    ADD CONSTRAINT "student_parents_parentId_tenantId_fkey" FOREIGN KEY ("parentId", "tenantId") REFERENCES public.parents(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_parents student_parents_studentId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_parents
    ADD CONSTRAINT "student_parents_studentId_tenantId_fkey" FOREIGN KEY ("studentId", "tenantId") REFERENCES public.students(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_parents student_parents_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_parents
    ADD CONSTRAINT "student_parents_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_transport_assignments student_transport_assignments_categoryId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_transport_assignments
    ADD CONSTRAINT "student_transport_assignments_categoryId_tenantId_fkey" FOREIGN KEY ("categoryId", "tenantId") REFERENCES public.vehicle_categories(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: student_transport_assignments student_transport_assignments_enrollmentId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_transport_assignments
    ADD CONSTRAINT "student_transport_assignments_enrollmentId_tenantId_fkey" FOREIGN KEY ("enrollmentId", "tenantId") REFERENCES public.student_enrollments(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_transport_assignments student_transport_assignments_pickupPointId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_transport_assignments
    ADD CONSTRAINT "student_transport_assignments_pickupPointId_tenantId_fkey" FOREIGN KEY ("pickupPointId", "tenantId") REFERENCES public.pickup_points(id, "tenantId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_transport_assignments student_transport_assignments_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_transport_assignments
    ADD CONSTRAINT "student_transport_assignments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_transport_assignments student_transport_assignments_vehicleId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_transport_assignments
    ADD CONSTRAINT "student_transport_assignments_vehicleId_tenantId_fkey" FOREIGN KEY ("vehicleId", "tenantId") REFERENCES public.vehicles(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: students students_gradeId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT "students_gradeId_tenantId_fkey" FOREIGN KEY ("gradeId", "tenantId") REFERENCES public.grades(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: students students_sectionId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT "students_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES public.sections(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: students students_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT "students_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: subjects subjects_courseId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT "subjects_courseId_tenantId_fkey" FOREIGN KEY ("courseId", "tenantId") REFERENCES public.courses(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: subjects subjects_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT "subjects_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_assignments teacher_assignments_academicYearId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_assignments
    ADD CONSTRAINT "teacher_assignments_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES public.academic_years(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_assignments teacher_assignments_sectionSubjectId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_assignments
    ADD CONSTRAINT "teacher_assignments_sectionSubjectId_tenantId_fkey" FOREIGN KEY ("sectionSubjectId", "tenantId") REFERENCES public.section_subjects(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_assignments teacher_assignments_teacherId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_assignments
    ADD CONSTRAINT "teacher_assignments_teacherId_tenantId_fkey" FOREIGN KEY ("teacherId", "tenantId") REFERENCES public.teachers(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_assignments teacher_assignments_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_assignments
    ADD CONSTRAINT "teacher_assignments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_availability teacher_availability_teacherId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_availability
    ADD CONSTRAINT "teacher_availability_teacherId_tenantId_fkey" FOREIGN KEY ("teacherId", "tenantId") REFERENCES public.teachers(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_availability teacher_availability_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_availability
    ADD CONSTRAINT "teacher_availability_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_capabilities teacher_capabilities_courseId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_capabilities
    ADD CONSTRAINT "teacher_capabilities_courseId_tenantId_fkey" FOREIGN KEY ("courseId", "tenantId") REFERENCES public.courses(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_capabilities teacher_capabilities_gradeId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_capabilities
    ADD CONSTRAINT "teacher_capabilities_gradeId_tenantId_fkey" FOREIGN KEY ("gradeId", "tenantId") REFERENCES public.grades(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_capabilities teacher_capabilities_sectionId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_capabilities
    ADD CONSTRAINT "teacher_capabilities_sectionId_tenantId_fkey" FOREIGN KEY ("sectionId", "tenantId") REFERENCES public.sections(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_capabilities teacher_capabilities_subjectId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_capabilities
    ADD CONSTRAINT "teacher_capabilities_subjectId_tenantId_fkey" FOREIGN KEY ("subjectId", "tenantId") REFERENCES public.subjects(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_capabilities teacher_capabilities_teacherId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_capabilities
    ADD CONSTRAINT "teacher_capabilities_teacherId_tenantId_fkey" FOREIGN KEY ("teacherId", "tenantId") REFERENCES public.teachers(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_capabilities teacher_capabilities_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_capabilities
    ADD CONSTRAINT "teacher_capabilities_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_employment_history teacher_employment_history_teacherId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_employment_history
    ADD CONSTRAINT "teacher_employment_history_teacherId_tenantId_fkey" FOREIGN KEY ("teacherId", "tenantId") REFERENCES public.teachers(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_employment_history teacher_employment_history_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_employment_history
    ADD CONSTRAINT "teacher_employment_history_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_qualifications teacher_qualifications_teacherId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_qualifications
    ADD CONSTRAINT "teacher_qualifications_teacherId_tenantId_fkey" FOREIGN KEY ("teacherId", "tenantId") REFERENCES public.teachers(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_qualifications teacher_qualifications_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_qualifications
    ADD CONSTRAINT "teacher_qualifications_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teachers teachers_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT "teachers_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teachers teachers_userId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT "teachers_userId_tenantId_fkey" FOREIGN KEY ("userId", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: tenant_holiday_rules tenant_holiday_rules_academicYearId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_holiday_rules
    ADD CONSTRAINT "tenant_holiday_rules_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES public.academic_years(id, "tenantId") ON UPDATE CASCADE;


--
-- Name: tenant_holiday_rules tenant_holiday_rules_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_holiday_rules
    ADD CONSTRAINT "tenant_holiday_rules_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tenant_leave_configurations tenant_leave_configurations_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_leave_configurations
    ADD CONSTRAINT "tenant_leave_configurations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: timetable_entries timetable_entries_academicYearId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_entries
    ADD CONSTRAINT "timetable_entries_academicYearId_tenantId_fkey" FOREIGN KEY ("academicYearId", "tenantId") REFERENCES public.academic_years(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: timetable_entries timetable_entries_periodId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_entries
    ADD CONSTRAINT "timetable_entries_periodId_tenantId_fkey" FOREIGN KEY ("periodId", "tenantId") REFERENCES public.timetable_periods(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: timetable_entries timetable_entries_sectionSubjectId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_entries
    ADD CONSTRAINT "timetable_entries_sectionSubjectId_tenantId_fkey" FOREIGN KEY ("sectionSubjectId", "tenantId") REFERENCES public.section_subjects(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: timetable_entries timetable_entries_teacherAssignmentId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_entries
    ADD CONSTRAINT "timetable_entries_teacherAssignmentId_tenantId_fkey" FOREIGN KEY ("teacherAssignmentId", "tenantId") REFERENCES public.teacher_assignments(id, "tenantId") ON UPDATE CASCADE;


--
-- Name: timetable_entries timetable_entries_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_entries
    ADD CONSTRAINT "timetable_entries_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: timetable_periods timetable_periods_structureId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_periods
    ADD CONSTRAINT "timetable_periods_structureId_tenantId_fkey" FOREIGN KEY ("structureId", "tenantId") REFERENCES public.timetable_structures(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: timetable_periods timetable_periods_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_periods
    ADD CONSTRAINT "timetable_periods_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: timetable_structures timetable_structures_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_structures
    ADD CONSTRAINT "timetable_structures_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: uploads uploads_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.uploads
    ADD CONSTRAINT "uploads_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_roles user_roles_roleId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "user_roles_roleId_tenantId_fkey" FOREIGN KEY ("roleId", "tenantId") REFERENCES public.roles(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_roles user_roles_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users users_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vehicle_categories vehicle_categories_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicle_categories
    ADD CONSTRAINT "vehicle_categories_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vehicle_driver_assignments vehicle_driver_assignments_driverId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicle_driver_assignments
    ADD CONSTRAINT "vehicle_driver_assignments_driverId_tenantId_fkey" FOREIGN KEY ("driverId", "tenantId") REFERENCES public.teachers(id, "tenantId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: vehicle_driver_assignments vehicle_driver_assignments_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicle_driver_assignments
    ADD CONSTRAINT "vehicle_driver_assignments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vehicle_driver_assignments vehicle_driver_assignments_vehicleId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicle_driver_assignments
    ADD CONSTRAINT "vehicle_driver_assignments_vehicleId_tenantId_fkey" FOREIGN KEY ("vehicleId", "tenantId") REFERENCES public.vehicles(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vehicles vehicles_categoryId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT "vehicles_categoryId_tenantId_fkey" FOREIGN KEY ("categoryId", "tenantId") REFERENCES public.vehicle_categories(id, "tenantId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: vehicles vehicles_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT "vehicles_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: visitor_notifications visitor_notifications_sentToId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitor_notifications
    ADD CONSTRAINT "visitor_notifications_sentToId_tenantId_fkey" FOREIGN KEY ("sentToId", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: visitor_notifications visitor_notifications_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitor_notifications
    ADD CONSTRAINT "visitor_notifications_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: visitor_notifications visitor_notifications_visitorId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitor_notifications
    ADD CONSTRAINT "visitor_notifications_visitorId_tenantId_fkey" FOREIGN KEY ("visitorId", "tenantId") REFERENCES public.visitors(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: visitor_purposes visitor_purposes_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitor_purposes
    ADD CONSTRAINT "visitor_purposes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: visitors visitors_approvedById_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitors
    ADD CONSTRAINT "visitors_approvedById_tenantId_fkey" FOREIGN KEY ("approvedById", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: visitors visitors_createdById_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitors
    ADD CONSTRAINT "visitors_createdById_tenantId_fkey" FOREIGN KEY ("createdById", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: visitors visitors_parentId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitors
    ADD CONSTRAINT "visitors_parentId_tenantId_fkey" FOREIGN KEY ("parentId", "tenantId") REFERENCES public.parents(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: visitors visitors_pointOfContactId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitors
    ADD CONSTRAINT "visitors_pointOfContactId_tenantId_fkey" FOREIGN KEY ("pointOfContactId", "tenantId") REFERENCES public.teachers(id, "tenantId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: visitors visitors_purposeId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitors
    ADD CONSTRAINT "visitors_purposeId_tenantId_fkey" FOREIGN KEY ("purposeId", "tenantId") REFERENCES public.visitor_purposes(id, "tenantId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: visitors visitors_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visitors
    ADD CONSTRAINT "visitors_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: zai_chats zai_chats_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.zai_chats
    ADD CONSTRAINT "zai_chats_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public.tenants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: zai_chats zai_chats_userId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.zai_chats
    ADD CONSTRAINT "zai_chats_userId_tenantId_fkey" FOREIGN KEY ("userId", "tenantId") REFERENCES public.users(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: zai_messages zai_messages_chatId_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.zai_messages
    ADD CONSTRAINT "zai_messages_chatId_tenantId_fkey" FOREIGN KEY ("chatId", "tenantId") REFERENCES public.zai_chats(id, "tenantId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict joD7drg6PpkPmPXHTC7M0fHnYVgsJ0cs6JH1jILpWwSRvrIKEeCH7vdTgi0e81M

