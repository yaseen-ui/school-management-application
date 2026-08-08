"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"
import { usePermission, usePermissionsLoaded } from "@/hooks/use-permission"
import { getViewPermission } from "@/lib/rbac/route-permissions"
import { ForbiddenPage } from "@/components/shared/forbidden-page"
import { useAuthStore } from "@/stores/auth-store"
import { config } from "@/lib/config"

/** Dashboard paths company (platform) users may open (#13). */
const COMPANY_ALLOWED_PATH_PREFIXES = [
  "/dashboard",
  "/tenants",
  "/company-users",
  "/settings",
]

function isCompanyAllowedPath(pathname: string | null): boolean {
  if (!pathname) return false
  return COMPANY_ALLOWED_PATH_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  )
}

/**
 * Layout-level page entry gate.
 * Uses the shared route → permission map; paths with no mapping are allowed
 * (e.g. rare utility pages). Backend still enforces API authz.
 *
 * Company users are restricted to platform pages only (#13).
 */
export function PagePermissionGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoaded = usePermissionsLoaded()
  const user = useAuthStore((s) => s.user) as { userType?: string } | null
  const viewPermission = getViewPermission(pathname)
  const canViewMapped = usePermission(viewPermission ?? "dashboard:view")
  // Student Dashboard USP: parents (parent-portal) OR staff (students:read)
  const isStudentDashboard = !!pathname?.startsWith("/student-dashboard")
  const canParentPortal = usePermission("parent-portal:access")
  const canStudentsRead = usePermission("students:read")
  const canView = isStudentDashboard
    ? canParentPortal || canStudentsRead
    : canViewMapped

  const isCompanyUser =
    user?.userType === "company" || config.isCompanyHost

  if (!isLoaded) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // #13 — company never enters tenant product pages (even with admin:super)
  if (isCompanyUser && !isCompanyAllowedPath(pathname)) {
    return <ForbiddenPage />
  }

  // No mapping configured → do not block (nav may still hide the link)
  // Exception: student-dashboard always uses dual check above
  if (!viewPermission && !isStudentDashboard) {
    return <>{children}</>
  }

  if (!canView) {
    return <ForbiddenPage />
  }

  return <>{children}</>
}
