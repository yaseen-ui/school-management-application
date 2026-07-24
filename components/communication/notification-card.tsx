"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { AlertCircle, Bell, Clock, AlertTriangle } from "lucide-react"
import type { Communication } from "@/lib/api/communication"

const priorityConfig = {
  0: { color: "text-muted-foreground", bg: "bg-gray-100", icon: Bell, label: "Normal" },
  1: { color: "text-amber-600", bg: "bg-amber-50", icon: AlertTriangle, label: "High" },
  2: { color: "text-red-600", bg: "bg-red-50", icon: AlertCircle, label: "Urgent" },
}

interface NotificationCardProps {
  communication: Communication
  onAcknowledge?: (id: string) => void
  isUnread?: boolean
  showActions?: boolean
}

export function NotificationCard({ communication, onAcknowledge, isUnread, showActions = true }: NotificationCardProps) {
  const priority = priorityConfig[communication.priority as keyof typeof priorityConfig] || priorityConfig[0]
  const Icon = priority.icon

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-sm",
        isUnread && "border-l-4 border-l-primary",
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <div className={cn("rounded-full p-1.5", priority.bg)}>
                <Icon className={cn("h-4 w-4", priority.color)} />
              </div>
              <span className="text-xs font-medium text-muted-foreground capitalize">
                {communication.type?.replace(/_/g, " ")}
              </span>
              <Badge variant="outline" className={cn("text-xs", priority.color)}>
                {priority.label}
              </Badge>
            </div>

            <h3 className="font-semibold text-sm leading-tight">{communication.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{communication.message}</p>

            {communication.actionButton && (
              <Button variant="outline" size="sm" className="mt-1">
                {(communication.actionButton as any).label || "View Details"}
              </Button>
            )}
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {communication.createdAt ? format(new Date(communication.createdAt), "MMM d, HH:mm") : ""}
            </span>
            {showActions && isUnread && onAcknowledge && (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs"
                onClick={() => onAcknowledge(communication.id)}
              >
                Mark read
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}