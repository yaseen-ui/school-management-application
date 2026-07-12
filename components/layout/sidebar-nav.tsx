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
} from "lucide-react"

import { config } from "@/lib/config"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  badge?: string
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const companyNavGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Management",
    items: [
      { title: "Tenants", href: "/tenants", icon: Building2 },
      { title: "Company Users", href: "/company-users", icon: Users },
    ],
  },
  {
    title: "System",
    items: [
      { title: "ID Sequences", href: "/settings/id-sequences", icon: Fingerprint },
      { title: "Settings", href: "/settings", icon: Settings },
    ],
  },
]

const tenantNavGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Academics",
    items: [
      { title: "Students", href: "/students", icon: GraduationCap },
      { title: "Courses", href: "/courses", icon: BookOpen },
      { title: "Subjects", href: "/subjects", icon: Layers },
      { title: "Sections", href: "/sections", icon: ClipboardList },
      { title: "Grades", href: "/grades", icon: ClipboardList },
      { title: "Academic Years", href: "/academic-years", icon: Calendar },
    ],
  },
  {
    title: "Administration",
    items: [
      { title: "Users", href: "/users", icon: Users },
      { title: "Staff & Curriculum", href: "/staff-curriculum", icon: BookHeart },
      { title: "Parents", href: "/parents", icon: Users },
      { title: "Visitors", href: "/visitors", icon: DoorOpen },
      { title: "Staff Attendance", href: "/staff-attendance", icon: ClipboardCheck },
      { title: "Roles & Permissions", href: "/roles", icon: Shield },
      { title: "Infrastructure", href: "/infrastructure", icon: Building2 },
      { title: "Inventory", href: "/inventory", icon: Package },
      { title: "Holidays", href: "/holidays", icon: CalendarDays },
    ],
  },
  {
    title: "Exams & Timetable",
    items: [
      { title: "Exams", href: "/exams", icon: FileText },
      { title: "Exam Schedules", href: "/exam-schedules", icon: Calendar },
      { title: "Marks Entry", href: "/marks-entry", icon: PenLine },
      { title: "Results", href: "/results", icon: Trophy },
      { title: "Timetable", href: "/timetable", icon: CalendarClock },
      { title: "Structures", href: "/timetable-structures", icon: CalendarClock },
      { title: "Attendance", href: "/attendance", icon: ClipboardCheck },
    ],
  },
  {
    title: "Fee Management",
    items: [
      { title: "Fee Heads", href: "/fee-heads", icon: ListOrdered },
      { title: "Section Fees", href: "/section-fees", icon: Receipt },
      { title: "Fee Terms", href: "/fee-terms", icon: CalendarClock },
      { title: "Student Fees", href: "/student-fees", icon: DollarSign },
      { title: "Payments", href: "/fee-payments", icon: CreditCard },
      { title: "Refunds", href: "/fee-refunds", icon: Banknote },
    ],

  },
  {
    title: "Store",
    items: [
      { title: "Store", href: "/store", icon: Store },
    ],
  },
  {
    title: "Transportation",
    items: [
      { title: "Vehicle Categories", href: "/transportation/vehicle-categories", icon: Bus },
      { title: "Vehicles", href: "/transportation/vehicles", icon: Bus },
      { title: "Driver Assignments", href: "/transportation/driver-assignments", icon: Users },
      { title: "Pickup Points", href: "/transportation/pickup-points", icon: MapPin },
      { title: "Transport Assignments", href: "/transportation/assignments", icon: Route },
    ],
  },
  {
    title: "Leave Management",
    items: [
      { title: "Leave Dashboard", href: "/leave", icon: CalendarClock },
      { title: "Apply Leave", href: "/leave/apply", icon: FileText },
      { title: "Leave Requests", href: "/leave/requests", icon: Clock },
      { title: "Categories", href: "/leave/categories", icon: Tag },
      { title: "Balances", href: "/leave/balances", icon: Users },
    ],
  },
  {
    title: "Payroll",
    items: [
      { title: "Salary Components", href: "/payroll/salary-components", icon: ListOrdered },
      { title: "Employee Compensation", href: "/payroll/compensation", icon: Wallet },
      { title: "Payroll Processing", href: "/payroll/processing", icon: PiggyBank },
    ],
  },
  {
    title: "Accounts",
    items: [
      { title: "Ledger", href: "/accounts", icon: BookCheck },
    ],
  },
  {
    title: "System",
    items: [
      { title: "ID Sequences", href: "/settings/id-sequences", icon: Fingerprint },
      { title: "Settings", href: "/settings", icon: Settings },
    ],
  },
]

interface SidebarNavProps {
  collapsed?: boolean
}

export function SidebarNav({ collapsed = false }: SidebarNavProps) {
  const pathname = usePathname()
  const navGroups = config.isCompanyHost ? companyNavGroups : tenantNavGroups

  return (
    <nav className="flex-1 space-y-6 px-3 py-4 overflow-y-auto scrollbar-thin">
      {navGroups.map((group) => (
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