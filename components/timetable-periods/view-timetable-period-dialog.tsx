"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { minutesToTime } from "@/lib/api/timetable-periods"
import type { TimetablePeriod } from "@/lib/api/timetable-periods"

interface ViewTimetablePeriodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  period: TimetablePeriod | null
}

export function ViewTimetablePeriodDialog({ open, onOpenChange, period }: ViewTimetablePeriodDialogProps) {
  if (!period) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Timetable Period Details</DialogTitle>
          <DialogDescription>Detailed information about this timetable period</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Period Name</p>
              <p className="text-sm font-medium">{period.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Structure</p>
              <Badge variant="outline">{period.structure?.name || "N/A"}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Start Time</p>
              <p className="text-sm">{minutesToTime(period.startTime)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">End Time</p>
              <p className="text-sm">{minutesToTime(period.endTime)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sort Order</p>
              <p className="text-sm">{period.sortOrder}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <p className="text-sm">{format(new Date(period.createdAt), "MMM d, yyyy")}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
