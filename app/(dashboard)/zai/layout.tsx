"use client";

import type React from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { PermissionProvider } from "@/components/providers/permission-provider";

/**
 * ZAI Chat Layout — Full-height immersive layout
 *
 * Removes the default dashboard padding/header for an immersive
 * chat experience. The sidebar is still visible for navigation.
 */
export default function ZaiLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <PermissionProvider>
        <div className="h-[calc(100vh-7rem)] flex flex-col overflow-hidden bg-background">
          {children}
        </div>
      </PermissionProvider>
    </AuthGuard>
  );
}