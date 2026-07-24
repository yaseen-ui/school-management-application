"use client"

import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Check, Clock, FileEdit, Send, X, Archive, Eye } from "lucide-react"

interface TimelineEvent {
  status: string
  timestamp?: string
  by?: string
  remarks?: string
}

interface PublicationTimelineProps {
  events: TimelineEvent[]
}

const eventConfig: Record<string, { icon: any; label: string; color: string }> = {
  draft: { icon: FileEdit, label: "Draft created", color: "bg-gray-100 text-gray-600" },
  pending_approval: { icon: Send, label: "Submitted for approval", color: "bg-amber-100 text-amber-600" },
  approved: { icon: Check, label: "Approved", color: "bg-blue-100 text-blue-600" },
  rejected: { icon: X, label: "Rejected", color: "bg-red-100 text-red-600" },
  published: { icon: Eye, label: "Published", color: "bg-emerald-100 text-emerald-600" },
  archived: { icon: Archive, label: "Archived", color: "bg-slate-100 text-slate-600" },
  withdrawn: { icon: X, label: "Withdrawn", color: "bg-purple-100 text-purple-600" },
}

export function PublicationTimeline({ events }: PublicationTimelineProps) {
  if (events.length === 0) {
    return <p className="text-sm text-muted-foreground">No activity yet.</p>
  }

  return (
    <div className="space-y-0">
      {events.map((event, index) => {
        const config = eventConfig[event.status] || { icon: Clock, label: event.status, color: "bg-gray-100 text-gray-600" }
        const Icon = config.icon
        const isLast = index === events.length - 1

        return (
          <div key={index} className="relative flex gap-4 pb-6">
            {!isLast && (
              <div className="absolute left-[17px] top-8 bottom-0 w-px bg-border" />
            )}
            <div className={cn("relative z-10 rounded-full p-2", config.color)}>
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <p className="text-sm font-medium">{config.label}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {event.timestamp && <span>{format(new Date(event.timestamp), "MMM d, HH:mm")}</span>}
                {event.by && <span>by {event.by}</span>}
              </div>
              {event.remarks && (
                <p className="text-xs text-muted-foreground mt-1 italic">"{event.remarks}"</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}