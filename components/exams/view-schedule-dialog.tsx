"use client"

import { motion } from "framer-motion"
import { Calendar, BookOpen, Users } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import type { ExamSchedule } from "@/lib/api/exams"

interface ViewScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  schedule: ExamSchedule | null
}

const statusColors: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
}

export function ViewScheduleDialog({ open, onOpenChange, schedule }: ViewScheduleDialogProps) {
  if (!schedule) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>{schedule.name}</DialogTitle>
              <DialogDescription>Schedule details</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 pt-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={statusColors[schedule.status] || ""}>
                {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Exam</p>
              <p className="font-medium">{schedule.exam?.name || "Custom Exam"}</p>
            </div>
          </div>

          {schedule.description && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="text-sm">{schedule.description}</p>
            </div>
          )}

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Section</p>
            <p className="font-medium">
              {schedule.section?.sectionName || "—"}
              {schedule.section?.grade && (
                <span className="text-muted-foreground ml-1">({schedule.section.grade.gradeName})</span>
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-medium">{format(new Date(schedule.startDate), "MMM d, yyyy")}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="font-medium">{format(new Date(schedule.endDate), "MMM d, yyyy")}</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Papers</p>
            <p className="font-medium">{schedule.papers?.length || 0} paper(s)</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Created At</p>
              <p className="text-sm">{format(new Date(schedule.createdAt), "MMM d, yyyy h:mm a")}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Updated At</p>
              <p className="text-sm">{format(new Date(schedule.updatedAt), "MMM d, yyyy h:mm a")}</p>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
