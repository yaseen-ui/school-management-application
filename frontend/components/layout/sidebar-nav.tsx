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
  UserCheck,
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
    items: [{ title: "Settings", href: "/settings", icon: Settings }],
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
      { title: "Teachers", href: "/teachers", icon: UserCheck },
      { title: "Roles & Permissions", href: "/roles", icon: Shield },
      { title: "Inventory", href: "/inventory", icon: Package },
    ],
  },
  {
    title: "System",
    items: [{ title: "Settings", href: "/settings", icon: Settings }],
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
