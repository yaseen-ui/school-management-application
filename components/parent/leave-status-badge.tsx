"use client"

import { cn } from "@/lib/utils"
import { CheckCircle2, Clock, XCircle, Ban, AlertTriangle, FileEdit } from "lucide-react"

interface LeaveStatusBadgeProps {
  status: string
}

const statusConfig: Record<string, { icon: React.ElementType; label: string; className: string }> = {
  approved: { icon: CheckCircle2, label: "Approved", className: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" },
  pending: { icon: Clock, label: "Pending", className: "text-amber-600 bg-amber-500/10 border-amber-500/20" },
  rejected: { icon: XCircle, label: "Rejected", className: "text-red-600 bg-red-500/10 border-red-500/20" },
  draft: { icon: FileEdit, label: "Draft", className: "text-muted-foreground bg-muted/50 border-muted-foreground/20" },
  withdrawn: { icon: Ban, label: "Withdrawn", className: "text-muted-foreground bg-muted/40 border-muted-foreground/20" },
  cancelled: { icon: Ban, label: "Cancelled", className: "text-muted-foreground bg-muted/40 border-muted-foreground/20" },
  partially_approved: { icon: AlertTriangle, label: "Partially Approved", className: "text-blue-600 bg-blue-500/10 border-blue-500/20" },
}

export function LeaveStatusBadge({ status }: LeaveStatusBadgeProps) {
  const config = statusConfig[status] || { icon: Clock, label: status, className: "text-muted-foreground bg-muted/40" }
  const Icon = config.icon

  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium", config.className)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  )
}