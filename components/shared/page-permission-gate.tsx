"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"
import { usePermission, usePermissionsLoaded } from "@/hooks/use-permission"
import { getViewPermission } from "@/lib/rbac/route-permissions"
import { ForbiddenPage } from "@/components/shared/forbidden-page"

/**
 * Layout-level page entry gate.
 * Uses the shared route → permission map; paths with no mapping are allowed
 * (e.g. rare utility pages). Backend still enforces API authz.
 */
export function PagePermissionGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoaded = usePermissionsLoaded()
  const viewPermission = getViewPermission(pathname)
  const canView = usePermission(viewPermission ?? "dashboard:view")

  // No mapping configured → do not block (nav may still hide the link)
  if (!viewPermission) {
    return <>{children}</>
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!canView) {
    return <ForbiddenPage />
  }

  return <>{children}</>
}
