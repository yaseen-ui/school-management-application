"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock } from "lucide-react"

interface ParentStatusBadgeProps {
  isRegistered: boolean
}

export function ParentStatusBadge({ isRegistered }: ParentStatusBadgeProps) {
  if (isRegistered) {
    return (
      <Badge
        variant="outline"
        className="max-w-full shrink-0 gap-1 whitespace-nowrap border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:border-emerald-800/70 dark:bg-emerald-950/40 dark:text-emerald-300"
      >
        <CheckCircle className="h-3 w-3 shrink-0" />
        Registered
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className="max-w-full shrink-0 gap-1 whitespace-nowrap border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:border-amber-800/70 dark:bg-amber-950/40 dark:text-amber-300"
    >
      <Clock className="h-3 w-3 shrink-0" />
      Pending Invite
    </Badge>
  )
}
