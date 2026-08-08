"use client"

import { useAuthStore } from "@/stores/auth-store"
import { usePermissionStore } from "@/stores/permission-store"
import { usePathname } from "next/navigation"
import { config } from "@/lib/config"
import type React from "react"
import {
  LayoutDashboard,
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  ClipboardList,
  Calendar,
  CalendarClock,
  ClipboardCheck,
  FileText,
  DollarSign,
  Receipt,
  CreditCard,
  Store,
  BookCheck,
  Bus,
  MapPin,
  Route,
  DoorOpen,
  CalendarDays,
  Tag,
  Clock,
  Upload,
  Bell,
  Inbox,
  History,
  FileEdit,
  Zap,
  FileType,
  Trophy,
  Bot,
  CalendarRange,
  LayoutGrid,
  LibraryBig,
  BookUser,
  UsersRound,
  BriefcaseBusiness,
  UserRoundCog,
  CalendarOff,
  WalletCards,
  ListChecks,
  Clock3,
  ChartColumn,
  PanelsTopLeft,
  FileCheck2,
  ListTree,
  CalendarCheck2,
  ClipboardPenLine,
  ChartNoAxesCombined,
  Landmark,
  Tags,
  ReceiptText,
  BadgeIndianRupee,
  Undo2,
  TrendingUp,
  TrendingDown,
  BookOpenCheck,
  Warehouse,
  Package,
  Boxes,
  PackageOpen,
  ShoppingCart,
  Truck,
  BusFront,
  UserRoundCheck,
  Building,
  BedDouble,
  KeyRound,
  School,
  Blocks,
  ContactRound,
  CalendarHeart,
  MessagesSquare,
  Megaphone,
  PanelTop,
  Workflow,
  FileType2,
  ShieldCheck,
  UserCog,
  Contact,
  ScrollText,
  Settings2,
  FileUp,
  SlidersHorizontal,
} from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  badge?: string
  permission?: string
}

export interface NavGroup {
  title: string
  icon?: React.ElementType
  items: NavItem[]
}

// ─────────────────────────────────────────────────────────────────────
// Company Portal (super-admin managing multiple tenants)
// ─────────────────────────────────────────────────────────────────────
const companyNavGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permission: "dashboard:view" },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Tenants", href: "/tenants", icon: Building2, permission: "tenants:read" },
      { title: "Company Users", href: "/company-users", icon: Users, permission: "users:read" },
    ],
  },
  {
    title: "System",
    items: [
      { title: "System Grouping", href: "/settings", icon: Settings2, permission: "settings:read" },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────
// Staff / Admin (tenant-level: teachers, admins, management)
// ─────────────────────────────────────────────────────────────────────
const staffNavGroups: NavGroup[] = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permission: "dashboard:view" },
      { title: "AI Assistant", href: "/zai", icon: Bot, permission: "query-bot:ask" },
    ],
  },
  {
    title: "Academic Setup",
    icon: GraduationCap,
    items: [
      { title: "Academic Years", href: "/academic-years", icon: CalendarRange, permission: "academic-years:read" },
      { title: "Courses", href: "/courses", icon: BookOpen, permission: "courses:read" },
      { title: "Grades", href: "/grades", icon: Layers, permission: "grades:read" },
      { title: "Sections", href: "/sections", icon: LayoutGrid, permission: "sections:read" },
      { title: "Subjects", href: "/subjects", icon: LibraryBig, permission: "subjects:read" },
      { title: "Staff Curriculum", href: "/staff-curriculum", icon: BookUser, permission: "teachers:read" },
    ],
  },
  {
    title: "Student Management",
    icon: Users,
    items: [
      { title: "Students", href: "/students", icon: GraduationCap, permission: "students:read" },
      { title: "Parents", href: "/parents", icon: UsersRound, permission: "parents:read" },
    ],
  },
  {
    title: "Faculty & Staff",
    icon: BriefcaseBusiness,
    items: [
      { title: "Staff", href: "/teachers", icon: UserRoundCog, permission: "teachers:read" },
      { title: "Staff Attendance", href: "/staff-attendance", icon: ClipboardCheck, permission: "staff-attendance:read" },
      { title: "Leave Management", href: "/leave", icon: CalendarOff, permission: "leave:read" },
      { title: "Payroll", href: "/payroll/processing", icon: WalletCards, permission: "payroll:read" },
    ],
  },
  {
    title: "Attendance",
    icon: ClipboardCheck,
    items: [
      { title: "Mark Attendance", href: "/attendance", icon: ListChecks, permission: "attendance:read" },
    ],
  },
  {
    title: "Timetable",
    icon: CalendarClock,
    items: [
      { title: "Timetable", href: "/timetable", icon: CalendarDays, permission: "timetable:read" },
      { title: "Timetable Structures", href: "/timetable-structures", icon: PanelsTopLeft, permission: "timetable-structures:read" },
      { title: "Periods", href: "/timetable-periods", icon: Clock3, permission: "timetable-periods:read" },
    ],
  },
  {
    title: "Examinations",
    icon: FileCheck2,
    items: [
      { title: "Exams", href: "/exams", icon: FileText, permission: "exams:read" },
      { title: "Exam Schedule", href: "/exam-schedules", icon: CalendarCheck2, permission: "exam-schedules:read" },
      { title: "Marks Entry", href: "/marks-entry", icon: ClipboardPenLine, permission: "marks:entry" },
      { title: "Results", href: "/results", icon: ChartNoAxesCombined, permission: "results:read" },
    ],
  },
  {
    title: "Finance",
    icon: Landmark,
    items: [
      { title: "Fee Heads", href: "/fee-heads", icon: Tags, permission: "fee-heads:read" },
      { title: "Section Fees", href: "/section-fees", icon: ReceiptText, permission: "section-fees:read" },
      { title: "Fee Terms", href: "/fee-terms", icon: CalendarRange, permission: "fee-terms:read" },
      { title: "Student Fees", href: "/student-fees", icon: BadgeIndianRupee, permission: "student-fees:read" },
      { title: "Payments", href: "/fee-payments", icon: CreditCard, permission: "fee-payments:read" },
      { title: "Refunds", href: "/fee-refunds", icon: Undo2, permission: "fee-refunds:read" },
      { title: "Ledger", href: "/accounts", icon: BookOpenCheck, permission: "accounts:read" },
    ],
  },
  {
    title: "Store & Inventory",
    icon: Warehouse,
    items: [
      { title: "Store", href: "/store", icon: Store, permission: "store:read" },
    ],
  },
  {
    title: "Transportation",
    icon: BusFront,
    items: [
      { title: "Vehicle Categories", href: "/transportation/vehicle-categories", icon: Boxes, permission: "transport:read" },
      { title: "Vehicles", href: "/transportation/vehicles", icon: Bus, permission: "transport:read" },
      { title: "Driver Assignments", href: "/transportation/driver-assignments", icon: UserRoundCheck, permission: "transport:read" },
      { title: "Pickup Points", href: "/transportation/pickup-points", icon: MapPin, permission: "transport:read" },
      { title: "Transport Assignments", href: "/transportation/assignments", icon: Route, permission: "transport:assign" },
    ],
  },
  {
    title: "Hostel Management",
    icon: Building2,
    items: [
      { title: "Hostel Blocks", href: "/hostel/blocks", icon: Building, permission: "hostel:read" },
      { title: "Room Types", href: "/hostel/room-types", icon: Tag, permission: "hostel:read" },
      { title: "Rooms", href: "/hostel/rooms", icon: BedDouble, permission: "hostel:read" },
      { title: "Sections", href: "/hostel/sections", icon: Layers, permission: "hostel:read" },
      { title: "Staff Assignments", href: "/hostel/staff", icon: UserRoundCog, permission: "hostel:read" },
      { title: "Student Allocations", href: "/hostel/allocations", icon: KeyRound, permission: "hostel:allocate" },
    ],
  },
  {
    title: "Campus Operations",
    icon: School,
    items: [
      { title: "Infrastructure", href: "/infrastructure", icon: Blocks, permission: "infrastructure:read" },
      { title: "Visitors", href: "/visitors", icon: ContactRound, permission: "visitors:read" },
      { title: "Holidays", href: "/holidays", icon: CalendarHeart, permission: "holidays:read" },
    ],
  },
  {
    title: "Communication",
    icon: MessagesSquare,
    items: [
      // Prefer :read for list/nav visibility; compose/manage actions are gated on the API + page.
      { title: "Notifications", href: "/communications/notifications", icon: Bell, permission: "communication-notifications:read" },
      { title: "Publications", href: "/communications/publications", icon: Megaphone, permission: "communication-publications:read" },
      { title: "Automation", href: "/communications/automation", icon: Workflow, permission: "communication-automation:manage" },
      { title: "Templates", href: "/communications/automation/templates", icon: FileType2, permission: "communication-templates:manage" },
    ],
  },
  {
    title: "Identity & Access",
    icon: ShieldCheck,
    items: [
      { title: "Users", href: "/users", icon: UserCog, permission: "users:read" },
      { title: "Roles", href: "/roles", icon: Contact, permission: "roles:read" },
    ],
  },
  {
    title: "System",
    icon: Settings2,
    items: [
      { title: "System Grouping", href: "/settings", icon: Settings2, permission: "settings:read" },
      { title: "Import Data", href: "/imports", icon: FileUp, permission: "imports:execute" },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────
// Parent Portal (minimal, child-focused navigation)
// ─────────────────────────────────────────────────────────────────────
const parentNavGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/parent-portal", icon: LayoutDashboard },
      { title: "AI Assistant", href: "/zai", icon: Bot, permission: "query-bot:ask" },
    ],
  },
  {
    title: "My Children",
    items: [
      { title: "Attendance", href: "/parent-portal/attendance", icon: ClipboardCheck },
      { title: "Results", href: "/parent-portal/results", icon: Trophy },
    ],
  },
  {
    title: "Finance",
    items: [
      { title: "Fees", href: "/parent-portal/fees", icon: DollarSign },
      { title: "Store", href: "/parent-portal/store", icon: Store },
    ],
  },
  {
    title: "Leave",
    items: [
      { title: "Leave", href: "/parent-portal/leave", icon: CalendarClock },
    ],
  },
  {
    title: "Communication",
    items: [
      { title: "Inbox", href: "/parent-portal/communications", icon: Inbox },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────
export const NAV_REGISTRY: Record<string, NavGroup[]> = {
  company: companyNavGroups,
  staff: staffNavGroups,
  parent: parentNavGroups,
}

// ─────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────
interface UserRole { id: string; name: string }

function hasRole(user: { roles?: UserRole[]; userType?: string } | null, roleName: string): boolean {
  return user?.roles?.some((r) => r.name === roleName) ?? false
}

// ─────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────
export function useNavGroups(): NavGroup[] {
  const user = useAuthStore((s) => s.user) as { roles?: UserRole[]; userType?: string } | null
  const pathname = usePathname()

  // Subscribe to isLoaded so we re-render when permissions load, but read
  // permissions imperatively via getState() to avoid creating a new value
  // on every snapshot (which would cause an infinite loop).
  const isLoaded = usePermissionStore((s) => s.isLoaded)

  // Company host → always company nav
  if (config.isCompanyHost) return NAV_REGISTRY.company

  // Tenant host → resolve by role (not userType — all tenant users have userType: "tenant")
  // Check for Parent role first
  if (hasRole(user, "Parent")) return NAV_REGISTRY.parent

  // Fallback: if permissions are loaded and include parent-portal:access,
  // treat this user as a parent. We read imperatively to avoid re-render
  // loops; isLoaded already triggers a render when permissions arrive.
  if (isLoaded && usePermissionStore.getState().permissions.has("parent-portal:access")) {
    return NAV_REGISTRY.parent
  }

  // Fallback: if user is on a parent-portal route, show parent nav.
  if (pathname?.startsWith("/parent-portal")) return NAV_REGISTRY.parent

  return NAV_REGISTRY.staff
}

// Re-export for use in login redirect
export { hasRole }
