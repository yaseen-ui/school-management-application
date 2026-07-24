"use client"

import { useAuthStore } from "@/stores/auth-store"
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
  Shield,
  Calendar,
  BookHeart,
  CalendarClock,
  ClipboardCheck,
  FileText,
  PenLine,
  Trophy,
  DollarSign,
  Receipt,
  CreditCard,
  Banknote,
  ListOrdered,
  Store,
  BookCheck,
  Wallet,
  PiggyBank,
  Bus,
  MapPin,
  Route,
  DoorOpen,
  CalendarDays,
  Tag,
  Clock,
  Fingerprint,
  Upload,
  Sparkles,
  Bell,
  History,
  Inbox,
  FileEdit,
  Zap,
  FileType,
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
      { title: "AI Assistant", href: "/zai", icon: Sparkles, permission: "query-bot:ask" },
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
      { title: "ID Sequences", href: "/settings/id-sequences", icon: Fingerprint, permission: "settings:read" },
      { title: "Settings", href: "/settings", icon: Shield, permission: "settings:read" },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────
// Staff / Admin (tenant-level: teachers, admins, management)
// ─────────────────────────────────────────────────────────────────────
const staffNavGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permission: "dashboard:view" },
      { title: "AI Assistant", href: "/zai", icon: Sparkles, permission: "query-bot:ask" },
    ],
  },
  {
    title: "Academics",
    items: [
      { title: "Students", href: "/students", icon: GraduationCap, permission: "students:read" },
      { title: "Import Data", href: "/imports", icon: Upload, permission: "imports:execute" },
      { title: "Courses", href: "/courses", icon: BookOpen, permission: "courses:read" },
      { title: "Subjects", href: "/subjects", icon: Layers, permission: "subjects:read" },
      { title: "Sections", href: "/sections", icon: ClipboardList, permission: "sections:read" },
      { title: "Grades", href: "/grades", icon: ClipboardList, permission: "grades:read" },
      { title: "Academic Years", href: "/academic-years", icon: Calendar, permission: "academic-years:read" },
    ],
  },
  {
    title: "Administration",
    items: [
      { title: "Users", href: "/users", icon: Users, permission: "users:read" },
      { title: "Staff & Curriculum", href: "/staff-curriculum", icon: BookHeart, permission: "teachers:read" },
      { title: "Parents", href: "/parents", icon: Users, permission: "parents:read" },
      { title: "Visitors", href: "/visitors", icon: DoorOpen, permission: "visitors:read" },
      { title: "Staff Attendance", href: "/staff-attendance", icon: ClipboardCheck, permission: "staff-attendance:read" },
      { title: "Roles & Permissions", href: "/roles", icon: Shield, permission: "roles:read" },
      { title: "Infrastructure", href: "/infrastructure", icon: Building2, permission: "infrastructure:read" },
      { title: "Holidays", href: "/holidays", icon: CalendarDays, permission: "holidays:read" },
    ],
  },
  {
    title: "Exams & Timetable",
    items: [
      { title: "Exams", href: "/exams", icon: FileText, permission: "exams:read" },
      { title: "Exam Schedules", href: "/exam-schedules", icon: Calendar, permission: "exam-schedules:read" },
      { title: "Marks Entry", href: "/marks-entry", icon: PenLine, permission: "marks:entry" },
      { title: "Results", href: "/results", icon: Trophy, permission: "results:read" },
      { title: "Timetable", href: "/timetable", icon: CalendarClock, permission: "timetable:read" },
      { title: "Structures", href: "/timetable-structures", icon: CalendarClock, permission: "timetable-structures:read" },
      { title: "Attendance", href: "/attendance", icon: ClipboardCheck, permission: "attendance:read" },
    ],
  },
  {
    title: "Fee Management",
    items: [
      { title: "Fee Heads", href: "/fee-heads", icon: ListOrdered, permission: "fee-heads:read" },
      { title: "Section Fees", href: "/section-fees", icon: Receipt, permission: "section-fees:read" },
      { title: "Fee Terms", href: "/fee-terms", icon: CalendarClock, permission: "fee-terms:read" },
      { title: "Student Fees", href: "/student-fees", icon: DollarSign, permission: "student-fees:read" },
      { title: "Payments", href: "/fee-payments", icon: CreditCard, permission: "fee-payments:read" },
      { title: "Refunds", href: "/fee-refunds", icon: Banknote, permission: "fee-refunds:read" },
    ],
  },
  {
    title: "Store",
    items: [
      { title: "Store", href: "/store", icon: Store, permission: "store:read" },
    ],
  },
  {
    title: "Transportation",
    items: [
      { title: "Vehicle Categories", href: "/transportation/vehicle-categories", icon: Bus, permission: "transport:read" },
      { title: "Vehicles", href: "/transportation/vehicles", icon: Bus, permission: "transport:read" },
      { title: "Driver Assignments", href: "/transportation/driver-assignments", icon: Users, permission: "transport:read" },
      { title: "Pickup Points", href: "/transportation/pickup-points", icon: MapPin, permission: "transport:read" },
      { title: "Transport Assignments", href: "/transportation/assignments", icon: Route, permission: "transport:assign" },
    ],
  },
  {
    title: "Hostel Management",
    items: [
      { title: "Hostel Blocks", href: "/hostel/blocks", icon: Building2, permission: "hostel:read" },
      { title: "Room Types", href: "/hostel/room-types", icon: Tag, permission: "hostel:read" },
      { title: "Rooms", href: "/hostel/rooms", icon: DoorOpen, permission: "hostel:read" },
      { title: "Sections", href: "/hostel/sections", icon: Layers, permission: "hostel:read" },
      { title: "Staff Assignments", href: "/hostel/staff", icon: Users, permission: "hostel:read" },
      { title: "Student Allocations", href: "/hostel/allocations", icon: GraduationCap, permission: "hostel:allocate" },
    ],
  },
  {
    title: "Communication",
    items: [
      { title: "Notifications", href: "/communications/notifications", icon: Bell, permission: "communication:notifications:write" },
      { title: "History", href: "/communications/notifications/history", icon: History, permission: "communication:notifications:write" },
      { title: "Inbox", href: "/communications/notifications/inbox", icon: Inbox, permission: "communication:notifications:write" },
      { title: "Publications", href: "/communications/publications", icon: FileText, permission: "communication:publications:write" },
      { title: "Drafts", href: "/communications/publications/drafts", icon: FileEdit, permission: "communication:publications:write" },
      { title: "Pending Approval", href: "/communications/publications/pending", icon: Clock, permission: "communication:publications:approve" },
      { title: "Automation", href: "/communications/automation", icon: Zap, permission: "communication:automation:manage" },
      { title: "Templates", href: "/communications/automation/templates", icon: FileType, permission: "communication:templates:manage" },
      { title: "Channels", href: "/communications/automation/channels", icon: Shield, permission: "communication:automation:manage" },
    ],
  },
  {
    title: "Leave Management",
    items: [
      { title: "Leave Dashboard", href: "/leave", icon: CalendarClock, permission: "leave:read" },
      { title: "Apply Leave", href: "/leave/apply", icon: FileText, permission: "leave:apply" },
      { title: "Leave Requests", href: "/leave/requests", icon: Clock, permission: "leave:read" },
      { title: "Categories", href: "/leave/categories", icon: Tag, permission: "leave:manage" },
      { title: "Balances", href: "/leave/balances", icon: Users, permission: "leave:read" },
    ],
  },
  {
    title: "Payroll",
    items: [
      { title: "Salary Components", href: "/payroll/salary-components", icon: ListOrdered, permission: "payroll:read" },
      { title: "Employee Compensation", href: "/payroll/compensation", icon: Wallet, permission: "payroll:read" },
      { title: "Payroll Processing", href: "/payroll/processing", icon: PiggyBank, permission: "payroll:process" },
    ],
  },
  {
    title: "Accounts",
    items: [
      { title: "Ledger", href: "/accounts", icon: BookCheck, permission: "accounts:read" },
    ],
  },
  {
    title: "System",
    items: [
      { title: "ID Sequences", href: "/settings/id-sequences", icon: Fingerprint, permission: "settings:read" },
      { title: "Settings", href: "/settings", icon: Shield, permission: "settings:read" },
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

  // Company host → always company nav
  if (config.isCompanyHost) return NAV_REGISTRY.company

  // Tenant host → resolve by role (not userType — all tenant users have userType: "tenant")
  // Check for Parent role first, default to staff nav
  if (hasRole(user, "Parent")) return NAV_REGISTRY.parent

  return NAV_REGISTRY.staff
}

// Re-export for use in login redirect
export { hasRole }