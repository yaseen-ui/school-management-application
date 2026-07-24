"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700 border-gray-200",
  pending_approval: "bg-amber-100 text-amber-700 border-amber-200",
  approved: "bg-blue-100 text-blue-700 border-blue-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  published: "bg-emerald-100 text-emerald-700 border-emerald-200",
  expired: "bg-slate-100 text-slate-600 border-slate-200",
  archived: "bg-slate-100 text-slate-600 border-slate-200",
  withdrawn: "bg-purple-100 text-purple-700 border-purple-200",
}

const typeColors: Record<string, string> = {
  circular: "bg-violet-100 text-violet-700 border-violet-200",
  announcement: "bg-blue-100 text-blue-700 border-blue-200",
  notice_board: "bg-sky-100 text-sky-700 border-sky-200",
  holiday_notice: "bg-amber-100 text-amber-700 border-amber-200",
  event_notice: "bg-emerald-100 text-emerald-700 border-emerald-200",
  academic_notice: "bg-primary/10 text-primary border-primary/20",
}

interface PublicationStatusBadgeProps {
  status: string
}

interface PublicationTypeBadgeProps {
  type: string
}

export function PublicationStatusBadge({ status }: PublicationStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn("capitalize", statusColors[status] || "")}>
      {status.replace(/_/g, " ")}
    </Badge>
  )
}

export function PublicationTypeBadge({ type }: PublicationTypeBadgeProps) {
  return (
    <Badge variant="outline" className={cn("capitalize", typeColors[type] || "")}>
      {type.replace(/_/g, " ")}
    </Badge>
  )
}