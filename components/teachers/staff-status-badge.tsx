"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock } from "lucide-react"

interface StaffStatusBadgeProps {
  isRegistered: boolean
}

export function StaffStatusBadge({ isRegistered }: StaffStatusBadgeProps) {
  if (isRegistered) {
    return (
      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1">
        <CheckCircle className="h-3 w-3" />
        Registered
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1">
      <Clock className="h-3 w-3" />
      Pending Invite
    </Badge>
  )
}