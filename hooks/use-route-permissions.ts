"use client"

import { usePathname } from "next/navigation"
import { usePermission, usePermissionsLoaded } from "@/hooks/use-permission"
import { usePermissionStore } from "@/stores/permission-store"
import {
  getRoutePermissions,
  type RoutePermissionActions,
} from "@/lib/rbac/route-permissions"

const NONE = "__none__"

/**
 * Permission flags for the current dashboard route (from shared map).
 */
export function useRoutePermissions(): {
  isLoaded: boolean
  map: RoutePermissionActions | null
  canView: boolean
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  /** Check view/create/edit/delete or a named `extra` key from the route map */
  can: (action: "view" | "create" | "edit" | "delete" | string) => boolean
} {
  const pathname = usePathname()
  const isLoaded = usePermissionsLoaded()
  const map = getRoutePermissions(pathname)
  const hasPermission = usePermissionStore((s) => s.hasPermission)

  const canView = usePermission(map?.view ?? NONE)
  const canCreate = usePermission(map?.create ?? NONE)
  const canEdit = usePermission(map?.edit ?? NONE)
  const canDelete = usePermission(map?.delete ?? NONE)

  const can = (action: "view" | "create" | "edit" | "delete" | string): boolean => {
    if (!map) return false
    if (action === "view") return canView
    if (action === "create") return Boolean(map.create) && canCreate
    if (action === "edit") return Boolean(map.edit) && canEdit
    if (action === "delete") return Boolean(map.delete) && canDelete
    const extraCode = map.extra?.[action]
    if (!extraCode) return false
    return hasPermission(extraCode)
  }

  return {
    isLoaded,
    map,
    canView: map ? canView : true,
    canCreate: Boolean(map?.create) && canCreate,
    canEdit: Boolean(map?.edit) && canEdit,
    canDelete: Boolean(map?.delete) && canDelete,
    can,
  }
}

/**
 * Convenience: permission codes for the current route (for <Can permission={...}>).
 */
export function useRoutePermissionCodes(): RoutePermissionActions | null {
  const pathname = usePathname()
  return getRoutePermissions(pathname)
}
