"use client";

import { usePermissionStore } from "@/stores/permission-store";

/**
 * Check if the current user has a specific permission code.
 *
 * @example
 *   const canReadStudents = usePermission('students:read');
 *   if (canReadStudents) { ... }
 */
export function usePermission(code: string): boolean {
  return usePermissionStore((s) => s.hasPermission(code));
}

/**
 * Check if the current user has any of the given permission codes.
 *
 * @example
 *   const canManageFees = useAnyPermission(['fee-payments:collect', 'fee-refunds:process']);
 */
export function useAnyPermission(codes: string[]): boolean {
  return usePermissionStore((s) => s.hasAnyPermission(codes));
}

/**
 * Check if the current user has all of the given permission codes.
 *
 * @example
 *   const canFullyManage = useAllPermissions(['students:write', 'students:edit', 'students:delete']);
 */
export function useAllPermissions(codes: string[]): boolean {
  return usePermissionStore((s) => s.hasAllPermissions(codes));
}

/**
 * Check if permissions have been loaded from the server.
 */
export function usePermissionsLoaded(): boolean {
  return usePermissionStore((s) => s.isLoaded);
}

/**
 * Check if permissions are currently being fetched.
 */
export function usePermissionsLoading(): boolean {
  return usePermissionStore((s) => s.isLoading);
}

/**
 * Get the full list of roles assigned to the current user.
 */
export function useRoles() {
  return usePermissionStore((s) => s.roles);
}

/**
 * Get the full list of group names the user belongs to.
 */
export function useGroups() {
  return usePermissionStore((s) => s.groups);
}