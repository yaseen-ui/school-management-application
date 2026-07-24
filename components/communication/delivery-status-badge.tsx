"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const statusColors: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700 border-gray-200",
  sent: "bg-blue-100 text-blue-700 border-blue-200",
  delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
  failed: "bg-red-100 text-red-700 border-red-200",
  viewed: "bg-sky-100 text-sky-700 border-sky-200",
  acknowledged: "bg-violet-100 text-violet-700 border-violet-200",
}

interface DeliveryStatusBadgeProps {
  status: string
}

export function DeliveryStatusBadge({ status }: DeliveryStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn("capitalize", statusColors[status] || "")}>
      {status.replace(/_/g, " ")}
    </Badge>
  )
}