"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { MobileSidebar } from "@/components/layout/mobile-sidebar"
import { AuthGuard } from "@/components/auth/auth-guard"
import { PermissionProvider } from "@/components/providers/permission-provider"
import { useUIStore } from "@/stores/ui-store"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { sidebarCollapsed } = useUIStore()

  return (
    <AuthGuard>
      <PermissionProvider>
        <div className="min-h-screen bg-background bg-ambient-glow">
          <Sidebar />
          <MobileSidebar />
          <div
            className={cn(
              "transition-all duration-200 min-h-screen",
              sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-[260px]",
            )}
          >
            <Header />
            <motion.main
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              {children}
            </motion.main>
          </div>
        </div>
      </PermissionProvider>
    </AuthGuard>
  )
}
