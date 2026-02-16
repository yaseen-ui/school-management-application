"use client"

import { GraduationCap, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SidebarNav } from "./sidebar-nav"
import { useUIStore } from "@/stores/ui-store"
import { useAuth } from "@/hooks/use-auth"
import { config } from "@/lib/config"

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { tenantName } = useAuth()

  const displayName = config.isCompanyHost ? "EduManage Ops" : tenantName || "EduManage"

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={cn(
        "fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-sidebar-border bg-sidebar",
        "hidden lg:flex",
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl gradient-primary">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm font-semibold text-sidebar-foreground truncate"
            >
              {displayName}
            </motion.span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-sidebar-foreground/70 hover:text-sidebar-foreground"
          onClick={toggleSidebar}
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <SidebarNav collapsed={sidebarCollapsed} />

      {/* Footer */}
      {!sidebarCollapsed && (
        <div className="border-t border-sidebar-border p-4">
          <p className="text-xs text-sidebar-foreground/50 text-center">EduManage v1.0.0</p>
        </div>
      )}
    </motion.aside>
  )
}
