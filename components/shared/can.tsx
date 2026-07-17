"use client";

import React from "react";
import { usePermission } from "@/hooks/use-permission";

interface CanProps {
  /** Permission code required to render children, e.g., "students:read" */
  permission: string;
  /** Optional fallback to render when the user lacks the permission */
  fallback?: React.ReactNode;
  /** Content to render if the user has the permission */
  children: React.ReactNode;
}

/**
 * Declarative permission gate for conditional UI rendering.
 *
 * @example
 *   <Can permission="students:write">
 *     <Button>Add Student</Button>
 *   </Can>
 *
 *   <Can permission="students:delete" fallback={<span>No access</span>}>
 *     <Button variant="destructive">Delete</Button>
 *   </Can>
 */
export function Can({ permission, fallback = null, children }: CanProps) {
  const hasAccess = usePermission(permission);
  if (!hasAccess) return <>{fallback}</>;
  return <>{children}</>;
}

interface CanAnyProps {
  /** Permission codes — user needs at least one */
  permissions: string[];
  /** Optional fallback */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Renders children if the user has ANY of the given permissions.
 *
 * @example
 *   <CanAny permissions={['fee-payments:collect', 'fee-refunds:process']}>
 *     <Button>Process Transaction</Button>
 *   </CanAny>
 */
export function CanAny({ permissions, fallback = null, children }: CanAnyProps) {
  const hasAccess = permissions.some((p) => usePermission(p));
  if (!hasAccess) return <>{fallback}</>;
  return <>{children}</>;
}

interface CanAllProps {
  /** Permission codes — user needs ALL of them */
  permissions: string[];
  /** Optional fallback */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Renders children only if the user has ALL of the given permissions.
 *
 * @example
 *   <CanAll permissions={['students:write', 'students:edit']}>
 *     <Button>Edit Student</Button>
 *   </CanAll>
 */
export function CanAll({ permissions, fallback = null, children }: CanAllProps) {
  const hasAccess = permissions.every((p) => usePermission(p));
  if (!hasAccess) return <>{fallback}</>;
  return <>{children}</>;
}