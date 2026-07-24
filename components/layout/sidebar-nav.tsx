"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  ClipboardList,
  Package,
  Settings,
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

import { config } from "@/lib/config"
import { usePermissionStore } from "@/stores/permission-store"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  badge?: string
  permission?: string  // RBAC v2: permission code required to see this item
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const companyNavGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permission: 'dashboard:view' },
      { title: "AI Assistant", href: "/zai", icon: Sparkles, permission: 'query-bot:ask' },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Tenants", href: "/tenants", icon: Building2, permission: 'tenants:read' },
      { title: "Company Users", href: "/company-users", icon: Users, permission: 'users:read' },
    ],
  },
  {
    title: "System",
    items: [
      { title: "ID Sequences", href: "/settings/id-sequences", icon: Fingerprint, permission: 'settings:read' },
      { title: "Settings", href: "/settings", icon: Settings, permission: 'settings:read' },
    ],
  },
  {
    title: "Parent Portal",
    items: [
      { title: "My Children", href: "/parent-portal", icon: Users, permission: 'parent-portal:access' },
      { title: "Results", href: "/results", icon: Trophy, permission: 'results:read' },
      { title: "Fees", href: "/student-fees", icon: DollarSign, permission: 'student-fees:read' },
      { title: "Store", href: "/store", icon: Store, permission: 'store:order' },
      { title: "Leave", href: "/leave", icon: CalendarClock, permission: 'leave:read' },
    ],
  },
]

const tenantNavGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permission: 'dashboard:view' },
      { title: "AI Assistant", href: "/zai", icon: Sparkles, permission: 'query-bot:ask' },
    ],
  },
  {
    title: "Academics",
    items: [
      { title: "Students", href: "/students", icon: GraduationCap, permission: 'students:read' },
      { title: "Import Data", href: "/imports", icon: Upload, permission: 'imports:execute' },
      { title: "Courses", href: "/courses", icon: BookOpen, permission: 'courses:read' },
      { title: "Subjects", href: "/subjects", icon: Layers, permission: 'subjects:read' },
      { title: "Sections", href: "/sections", icon: ClipboardList, permission: 'sections:read' },
      { title: "Grades", href: "/grades", icon: ClipboardList, permission: 'grades:read' },
      { title: "Academic Years", href: "/academic-years", icon: Calendar, permission: 'academic-years:read' },
    ],
  },
  {
    title: "Administration",
    items: [
      { title: "Users", href: "/users", icon: Users, permission: 'users:read' },
      { title: "Staff & Curriculum", href: "/staff-curriculum", icon: BookHeart, permission: 'teachers:read' },
      { title: "Parents", href: "/parents", icon: Users, permission: 'parents:read' },
      { title: "Visitors", href: "/visitors", icon: DoorOpen, permission: 'visitors:read' },
      { title: "Staff Attendance", href: "/staff-attendance", icon: ClipboardCheck, permission: 'staff-attendance:read' },
      { title: "Roles & Permissions", href: "/roles", icon: Shield, permission: 'roles:read' },
      { title: "Infrastructure", href: "/infrastructure", icon: Building2, permission: 'infrastructure:read' },
      { title: "Inventory", href: "/inventory", icon: Package, permission: 'store:read' },
      { title: "Holidays", href: "/holidays", icon: CalendarDays, permission: 'holidays:read' },
    ],
  },
  {
    title: "Exams & Timetable",
    items: [
      { title: "Exams", href: "/exams", icon: FileText, permission: 'exams:read' },
      { title: "Exam Schedules", href: "/exam-schedules", icon: Calendar, permission: 'exam-schedules:read' },
      { title: "Marks Entry", href: "/marks-entry", icon: PenLine, permission: 'marks:entry' },
      { title: "Results", href: "/results", icon: Trophy, permission: 'results:read' },
      { title: "Timetable", href: "/timetable", icon: CalendarClock, permission: 'timetable:read' },
      { title: "Structures", href: "/timetable-structures", icon: CalendarClock, permission: 'timetable-structures:read' },
      { title: "Attendance", href: "/attendance", icon: ClipboardCheck, permission: 'attendance:read' },
    ],
  },
  {
    title: "Fee Management",
    items: [
      { title: "Fee Heads", href: "/fee-heads", icon: ListOrdered, permission: 'fee-heads:read' },
      { title: "Section Fees", href: "/section-fees", icon: Receipt, permission: 'section-fees:read' },
      { title: "Fee Terms", href: "/fee-terms", icon: CalendarClock, permission: 'fee-terms:read' },
      { title: "Student Fees", href: "/student-fees", icon: DollarSign, permission: 'student-fees:read' },
      { title: "Payments", href: "/fee-payments", icon: CreditCard, permission: 'fee-payments:read' },
      { title: "Refunds", href: "/fee-refunds", icon: Banknote, permission: 'fee-refunds:read' },
    ],

  },
  {
    title: "Store",
    items: [
      { title: "Store", href: "/store", icon: Store, permission: 'store:read' },
    ],
  },
  {
    title: "Transportation",
    items: [
      { title: "Vehicle Categories", href: "/transportation/vehicle-categories", icon: Bus, permission: 'transport:read' },
      { title: "Vehicles", href: "/transportation/vehicles", icon: Bus, permission: 'transport:read' },
      { title: "Driver Assignments", href: "/transportation/driver-assignments", icon: Users, permission: 'transport:read' },
      { title: "Pickup Points", href: "/transportation/pickup-points", icon: MapPin, permission: 'transport:read' },
      { title: "Transport Assignments", href: "/transportation/assignments", icon: Route, permission: 'transport:assign' },
    ],
  },
  {
    title: "Hostel Management",
    items: [
      { title: "Hostel Blocks", href: "/hostel/blocks", icon: Building2, permission: 'hostel:read' },
      { title: "Room Types", href: "/hostel/room-types", icon: Tag, permission: 'hostel:read' },
      { title: "Rooms", href: "/hostel/rooms", icon: DoorOpen, permission: 'hostel:read' },
      { title: "Sections", href: "/hostel/sections", icon: Layers, permission: 'hostel:read' },
      { title: "Staff Assignments", href: "/hostel/staff", icon: Users, permission: 'hostel:read' },
      { title: "Student Allocations", href: "/hostel/allocations", icon: GraduationCap, permission: 'hostel:allocate' },
    ],
  },
  {
    title: "Communication",
    items: [
      { title: "Notifications", href: "/communications/notifications", icon: Bell, permission: 'communication:notifications:write' },
      { title: "History", href: "/communications/notifications/history", icon: History, permission: 'communication:notifications:write' },
      { title: "Inbox", href: "/communications/notifications/inbox", icon: Inbox, permission: 'communication:notifications:write' },
      { title: "Publications", href: "/communications/publications", icon: FileText, permission: 'communication:publications:write' },
      { title: "Drafts", href: "/communications/publications/drafts", icon: FileEdit, permission: 'communication:publications:write' },
      { title: "Pending Approval", href: "/communications/publications/pending", icon: Clock, permission: 'communication:publications:approve' },
      { title: "Automation", href: "/communications/automation", icon: Zap, permission: 'communication:automation:manage' },
      { title: "Templates", href: "/communications/automation/templates", icon: FileType, permission: 'communication:templates:manage' },
      { title: "Channels", href: "/communications/automation/channels", icon: Settings, permission: 'communication:automation:manage' },
    ],
  },
  {
    title: "Leave Management",
    items: [
      { title: "Leave Dashboard", href: "/leave", icon: CalendarClock, permission: 'leave:read' },
      { title: "Apply Leave", href: "/leave/apply", icon: FileText, permission: 'leave:apply' },
      { title: "Leave Requests", href: "/leave/requests", icon: Clock, permission: 'leave:read' },
      { title: "Categories", href: "/leave/categories", icon: Tag, permission: 'leave:manage' },
      { title: "Balances", href: "/leave/balances", icon: Users, permission: 'leave:read' },
    ],
  },
  {
    title: "Payroll",
    items: [
      { title: "Salary Components", href: "/payroll/salary-components", icon: ListOrdered, permission: 'payroll:read' },
      { title: "Employee Compensation", href: "/payroll/compensation", icon: Wallet, permission: 'payroll:read' },
      { title: "Payroll Processing", href: "/payroll/processing", icon: PiggyBank, permission: 'payroll:process' },
    ],
  },
  {
    title: "Accounts",
    items: [
      { title: "Ledger", href: "/accounts", icon: BookCheck, permission: 'accounts:read' },
    ],
  },
  {
    title: "System",
    items: [
      { title: "ID Sequences", href: "/settings/id-sequences", icon: Fingerprint, permission: 'settings:read' },
      { title: "Settings", href: "/settings", icon: Settings, permission: 'settings:read' },
    ],
  },
]

interface SidebarNavProps {
  collapsed?: boolean
}

export function SidebarNav({ collapsed = false }: SidebarNavProps) {
  const pathname = usePathname()
  const navGroups = config.isCompanyHost ? companyNavGroups : tenantNavGroups
  const hasPermission = usePermissionStore((s) => s.hasPermission)
  const isLoaded = usePermissionStore((s) => s.isLoaded)
  const permissions = usePermissionStore((s) => s.permissions)

  // Filter groups and items based on user permissions
  const visibleGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.permission || hasPermission(item.permission)),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <nav className="flex-1 space-y-6 px-3 py-4 overflow-y-auto scrollbar-thin">
      {visibleGroups.map((group) => (
        <div key={group.title} className="space-y-1">
          {!collapsed && (
            <h4 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              {group.title}
            </h4>
          )}
          <div className="space-y-1">
            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-xl bg-primary"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon
                    className={cn(
                      "relative z-10 h-4 w-4 shrink-0",
                      isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground",
                    )}
                  />
                  {!collapsed && <span className="relative z-10 truncate">{item.title}</span>}
                  {!collapsed && item.badge && (
                    <span className="relative z-10 ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )
}