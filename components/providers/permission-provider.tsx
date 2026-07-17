"use client";

import { useEffect, useRef } from "react";
import { usePermissionStore } from "@/stores/permission-store";
import { useAuthStore } from "@/stores/auth-store";

/**
 * PermissionProvider loads the user's authorization context (roles, permissions,
 * scopes) from GET /api/auth/permissions once the user is authenticated.
 *
 * It auto-loads on mount if a token exists, re-loads when the token changes
 * (login/logout), and resets when the user logs out.
 *
 * Wrap this around your authenticated route tree. It must sit inside
 * the AuthGuard so that the token is available.
 */
export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticated } = useAuthStore();
  const { load, reset } = usePermissionStore();
  const prevToken = useRef<string | null>(null);

  useEffect(() => {
    // Token changed (login or logout)
    if (token !== prevToken.current) {
      prevToken.current = token;

      if (token && isAuthenticated) {
        load();
      } else if (!token) {
        reset();
      }
    }
  }, [token, isAuthenticated, load, reset]);

  // Also load on initial mount if already authenticated
  useEffect(() => {
    if (token && isAuthenticated) {
      load();
    }
    // Run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}