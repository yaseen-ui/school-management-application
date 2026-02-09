"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { X, GraduationCap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { SidebarNav } from "./sidebar-nav"
import { useUIStore } from "@/stores/ui-store"
import { useAuth } from "@/hooks/use-auth"
import { config } from "@/lib/config"

export function MobileSidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore()
  const { tenantName } = useAuth()

  // On mobile, sidebarCollapsed=false means sidebar is OPEN
  const isOpen = !sidebarCollapsed

  const displayName = config.isCompanyHost ? "EduManage Ops" : tenantName || "EduManage"

  // Close sidebar on route change
  useEffect(() => {
    setSidebarCollapsed(true)
  }, [pathname, setSidebarCollapsed])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarCollapsed(true)}
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 z-50 flex h-screen w-[280px] flex-col border-r border-sidebar-border bg-sidebar lg:hidden"
          >
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-sidebar-foreground">{displayName}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-sidebar-foreground/70"
                onClick={() => setSidebarCollapsed(true)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigation */}
            <SidebarNav collapsed={false} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
