"use client";

import { ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <ShieldOff className="h-10 w-10 text-destructive" />
      </div>
      <h2 className="text-xl font-semibold">Access Denied</h2>
      <p className="text-sm text-muted-foreground text-center max-w-md">
        You don't have permission to access this page. Contact your administrator if you believe this is a mistake.
      </p>
      <Button variant="outline" asChild>
        <Link href="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  );
}