"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { BookOpen, Calendar, Building2, CheckCircle2, XCircle } from "lucide-react"
import type { Subject } from "@/lib/api/subjects"

interface ViewSubjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subject: Subject | null
}

export function ViewSubjectDialog({ open, onOpenChange, subject }: ViewSubjectDialogProps) {
  if (!subject) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Subject Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Subject Name</p>
                <p className="text-lg font-semibold">{subject.subjectName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/10">
                <Building2 className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Course ID</p>
                <p className="font-medium">{subject.courseId}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/10">
                {subject.isCommon ? (
                  <CheckCircle2 className="h-5 w-5 text-purple-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-purple-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Availability</p>
                <Badge variant={subject.isCommon ? "default" : "secondary"}>
                  {subject.isCommon ? "Common (All Grades)" : "Specific Grade"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Created {format(new Date(subject.createdAt), "PPP")}</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Updated {format(new Date(subject.updatedAt), "PPP")}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
