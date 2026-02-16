"use client"

import type React from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { MobileSidebar } from "@/components/layout/mobile-sidebar"
import { AuthGuard } from "@/components/auth/auth-guard"
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
      <div className="min-h-screen bg-background">
        <Sidebar />
        <MobileSidebar />
        <div className={cn("transition-all duration-200", sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-[260px]")}>
          <Header />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
}
