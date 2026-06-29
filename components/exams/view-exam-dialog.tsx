"use client"

import { motion } from "framer-motion"
import { FileText, Calendar, BookOpen, Users, Layers } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import type { Exam } from "@/lib/api/exams"

interface ViewExamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  exam: Exam | null
}

const examTypeLabels: Record<string, string> = {
  weekly: "Weekly",
  quarterly: "Quarterly",
  half_yearly: "Half-Yearly",
  annually: "Annually",
}

const statusLabels: Record<string, string> = {
  draft: "Draft",
  published: "Published",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
}

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  published: "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
}

export function ViewExamDialog({ open, onOpenChange, exam }: ViewExamDialogProps) {
  if (!exam) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>{exam.name}</DialogTitle>
              <DialogDescription>Exam details and configuration</DialogDescription>
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
              <p className="text-sm text-muted-foreground">Exam Type</p>
              <p className="font-medium capitalize">{examTypeLabels[exam.examType] || exam.examType}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={statusColors[exam.status] || ""}>
                {statusLabels[exam.status] || exam.status}
              </Badge>
            </div>
          </div>

          {exam.description && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="text-sm">{exam.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Academic Year</p>
              <p className="font-medium">{exam.academicYear?.name || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Source</p>
              <p className="font-medium capitalize">{exam.source === "admin" ? "Admin Created" : "Custom"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-medium">{format(new Date(exam.startDate), "MMM d, yyyy")}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="font-medium">{format(new Date(exam.endDate), "MMM d, yyyy")}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Target Grades</p>
              <div className="flex flex-wrap gap-1">
                {exam.targetGrades && exam.targetGrades.length > 0 ? (
                  exam.targetGrades.map((tg) => (
                    <Badge key={tg.id} variant="secondary" className="text-xs">
                      {tg.grade.gradeName}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">All Grades</p>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Schedules</p>
              <p className="font-medium">{exam._count?.schedules || 0} schedule(s)</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Target Sections</p>
            <div className="flex flex-wrap gap-1">
              {exam.targetSections && exam.targetSections.length > 0 ? (
                exam.targetSections.map((ts) => (
                  <Badge key={ts.id} variant="outline" className="text-xs">
                    {ts.section.sectionName}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">All Sections</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Created At</p>
              <p className="text-sm">{format(new Date(exam.createdAt), "MMM d, yyyy h:mm a")}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Updated At</p>
              <p className="text-sm">{format(new Date(exam.updatedAt), "MMM d, yyyy h:mm a")}</p>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
