# EduManage - School Management Application

A comprehensive, multi-tenant school management system built with Next.js 14, Prisma ORM, and PostgreSQL.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 14 App Router                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Frontend     │  │  API Routes  │  │  Backend Modules │  │
│  │  (React/UI)   │──│  (Next.js)   │──│  (Express-style) │  │
│  └──────────────┘  └──────────────┘  └────────┬─────────┘  │
│                                                │            │
│                                         ┌──────▼─────────┐ │
│                                         │   Prisma ORM    │ │
│                                         │   PostgreSQL    │ │
│                                         └────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Key Technologies
- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- **State Management**: Zustand (client state), TanStack Query (server state)
- **Backend**: Express-style controllers/services in `lib/backend/modules/`
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: JWT-based with bcrypt password hashing
- **Multi-tenancy**: Domain-based tenant resolution

## Project Structure

```
├── app/
│   ├── (auth)/              # Login, home pages
│   ├── (dashboard)/         # All dashboard pages (grouped by module)
│   │   ├── students/        # Student management
│   │   ├── teachers/        # Teacher management
│   │   ├── courses/         # Course management
│   │   ├── subjects/        # Subject management
│   │   ├── sections/        # Section management
│   │   ├── grades/          # Grade management
│   │   ├── exams/           # Exam management
│   │   ├── timetable/       # Timetable management
│   │   ├── attendance/      # Attendance management
│   │   ├── fees/            # Fee management (heads, terms, payments)
│   │   ├── store/           # Store/inventory management
│   │   ├── payroll/         # Payroll processing
│   │   ├── accounts/        # Accounting/ledger
│   │   ├── infrastructure/  # Buildings, floors, rooms
│   │   ├── users/           # User management
│   │   ├── roles/           # Roles & permissions
│   │   └── tenants/         # Tenant management (company only)
│   └── api/                 # API route handlers
├── components/              # Reusable UI components
│   ├── ui/                  # Base UI components (shadcn)
│   ├── layout/              # Sidebar, header, navigation
│   ├── shared/              # Shared components (data tables, etc.)
│   └── [module]/            # Module-specific components
├── hooks/                   # Custom React hooks
├── lib/
│   ├── api/                 # Frontend API client
│   ├── backend/             # Backend modules
│   │   ├── modules/         # Business logic (controllers + services)
│   │   ├── middleware/      # Auth/permission middleware
│   │   ├── lib/             # Prisma client instance
│   │   └── utils/           # Response handler, etc.
│   ├── config.ts            # App configuration
│   └── utils.ts             # Utility functions
├── stores/                  # Zustand stores
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
└── docs/                    # Documentation
```

## Modules Overview

### 1. Authentication & Multi-tenancy
- JWT-based authentication with token blacklisting
- Domain-based tenant resolution (subdomain → tenant lookup)
- Two user types: `company` (admin) and `tenant` (school staff)
- Password reset with OTP flow

### 2. Academic Structure
- **Courses** → **Grades** → **Sections** (hierarchical)
- **Subjects** managed independently
- **Section-Subjects** mapping (which subjects are taught in which section)
- **Academic Years** with activation status

### 3. Student Management
- Full CRUD with comprehensive student profiles
- Parent/guardian information
- Document uploads (photos, certificates, etc.)
- Auto-enrollment in active academic year
- Transfer certificate tracking

### 4. Teacher Management
- Wizard-based teacher creation
- Teacher qualifications & employment history
- **Teacher Capabilities**: Subjects a teacher can teach
- **Teacher Assignments**: Assigning teachers to section-subjects
- **Teacher Availability**: Weekly availability slots

### 5. Timetable System
- **Timetable Structures**: Define period templates (e.g., 8-period day)
- **Timetable Periods**: Individual time slots within a structure
- **Timetable Entries**: Grid-based scheduling with conflict detection:
  - Teacher double-booking prevention
  - Room conflict detection
  - Teacher availability validation
- Bulk entry creation

### 6. Exam Management
- Exam creation with schedules
- **Papers**: Individual subject papers within exam schedules
- **Marks Entry**: Per-student marks with grid view
- **Results**: Aggregated results with publishing

### 7. Attendance
- Session-based attendance marking
- Bulk mark entry
- Attendance summary/reports
- Per-student attendance tracking

### 8. Fee Management
- **Fee Heads**: Define fee types (tuition, transport, etc.)
- **Section Fees**: Fee structure per section
- **Fee Terms**: Installment/term definitions
- **Student Fees**: Per-student fee allocation
- **Payments**: Fee collection with receipt tracking
- **Refunds**: Refund processing

### 9. Store / Inventory
- **Categories**: Product categorization
- **Products**: Inventory items with stock tracking
- **Kits**: Bundled product sets
- **Orders**: Student purchase orders
- **Distribution**: Bulk distribution tracking
- **Dues**: Outstanding payment tracking
- **Returns**: Product return processing
- **Pending Items**: Items awaiting collection

### 10. Payroll
- **Salary Components**: Define salary structure (basic, HRA, allowances)
- **Employee Compensation**: Per-employee salary configuration
- **Payroll Processing**: Batch-based payroll with:
  - Batch creation & population
  - Bulk updates
  - Submission & approval workflow

### 11. Accounts / Ledger
- Account categories (income, expense, asset, liability)
- Transaction recording
- Account summary/balance

### 12. Infrastructure
- **Buildings** → **Floors** → **Rooms** (hierarchical)
- Room capacity and type tracking

### 13. User & Role Management
- User CRUD within tenants
- Role-based access control (UI exists, code-level enforcement pending)

## Data Flow

```
User Login → JWT Token → API Request (with Bearer token)
                                │
                    ┌───────────▼───────────┐
                    │  Next.js API Route    │
                    │  (app/api/...)        │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │  Backend Controller   │
                    │  (lib/backend/modules) │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │  Backend Service      │
                    │  (Business Logic)     │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │  Prisma ORM           │
                    │  (PostgreSQL)         │
                    └───────────────────────┘
```

## API Endpoints

The project has **143 API route files** covering all modules:

| Module | API Routes |
|--------|-----------|
| Auth | Login, logout, forgot/reset password, verify OTP |
| Academic Years | CRUD + activate |
| Students | CRUD, bulk operations, enrollments |
| Teachers | CRUD, eligible teachers |
| Courses | CRUD |
| Subjects | CRUD |
| Grades | CRUD |
| Sections | CRUD |
| Section Subjects | CRUD |
| Teacher Capabilities | CRUD + bulk |
| Teacher Assignments | CRUD |
| Teacher Availability | CRUD + teacher-specific |
| Timetable Structures | CRUD |
| Timetable Periods | CRUD |
| Timetable Entries | CRUD + bulk + grid view |
| Exams | CRUD |
| Exam Schedules | CRUD + papers + marks |
| Marks Entry | Per-student + grid + results |
| Attendance | Sessions, marks, bulk, summary |
| Fee Heads | CRUD |
| Section Fees | CRUD |
| Fee Terms | CRUD |
| Student Fees | CRUD |
| Fee Payments | CRUD |
| Fee Refunds | CRUD |
| Store | Categories, products, kits, orders, dues, returns, pending items, distribution, stock check |
| Payroll | Salary components, compensation, batches, processing, bulk update |
| Accounts | Categories, transactions, summary |
| Infrastructure | Buildings, floors, rooms |
| Users | CRUD |
| Roles | CRUD |
| Tenants | CRUD |
| Uploads | File uploads to GCP |
| Enrollments | CRUD |

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- pnpm (recommended)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd school-management-application

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Run database migrations
npx prisma migrate dev

# Start development server
pnpm dev
```

### Environment Variables
```env
DATABASE_URL="postgresql://user:password@localhost:5432/school_management"
JWT_SECRET="your-jwt-secret"
NEXT_PUBLIC_COMPANY_HOST="company.example.com"
```

## API Architecture

The application uses a unique hybrid architecture where backend controllers are written in Express-style JavaScript and invoked through a server adapter:

```typescript
// app/api/students/route.ts
import { invokeBackendController } from '@/lib/api/server-adapter'

export async function GET(req: NextRequest) {
  const StudentController = (await import('@backend/modules/students/students.controller.js')).default
  return invokeBackendController(StudentController, 'getAllStudents', req)
}
```

This allows the backend logic to remain framework-agnostic while being served through Next.js API routes.

## Database Schema (Key Models)

- **Tenant** → School/organization
- **User** → Users with role-based access
- **Role** → Role definitions with permissions array
- **Student** → Student profiles with enrollment tracking
- **Teacher** → Staff profiles with qualifications
- **Course** → Academic programs
- **Grade** → Year/level within a course
- **Section** → Classroom divisions
- **Subject** → Academic subjects
- **SectionSubject** → Subject-to-section mapping
- **TeacherAssignment** → Teacher-to-section-subject assignment
- **TimetableEntry** → Scheduled classes
- **Exam** → Exam definitions
- **ExamSchedule** → Exam timetables
- **ExamPaper** → Individual subject papers
- **StudentMark** → Per-student marks
- **AttendanceSession** → Attendance recording sessions
- **AttendanceMark** → Individual attendance records
- **FeeHead** → Fee types
- **SectionFee** → Fee structure per section
- **StudentFee** → Per-student fee allocation
- **FeePayment** → Payment records
- **StoreProduct** → Inventory items
- **StoreOrder** → Purchase orders
- **PayrollBatch** → Payroll processing batches
- **AccountTransaction** → Ledger entries
- **Building/Floor/Room** → Infrastructure hierarchy

## Pending / In Progress

- **Code-level permission enforcement** on API routes
- **Role-based UI filtering** (user-specific screens)
- **Excel import** for bulk student/faculty onboarding
- **Mobile APK build** configuration
- **Timetable entry update** flow completion
