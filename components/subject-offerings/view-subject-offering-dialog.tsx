"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import type { SubjectOffering } from "@/lib/api/subject-offerings"

interface ViewSubjectOfferingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  offering: SubjectOffering | null
}

export function ViewSubjectOfferingDialog({ open, onOpenChange, offering }: ViewSubjectOfferingDialogProps) {
  if (!offering) return null

  const scopeLabels: Record<string, string> = {
    all_courses_all_grades: "All Courses & All Grades",
    course_all_grades: "Specific Course - All Grades",
    grade_all_courses: "Specific Grade - All Courses",
    course_grade: "Specific Course & Grade",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Subject Offering Details</DialogTitle>
          <DialogDescription>Detailed information about this subject offering</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Subject</p>
              <p className="text-sm font-medium">{offering.subject?.subjectName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Course</p>
              <p className="text-sm">{offering.course?.courseName || "All Courses"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Grade</p>
              <p className="text-sm">{offering.grade?.gradeName || "All Grades"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Scope</p>
              <p className="text-sm">{scopeLabels[offering.scope] || offering.scope}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <Badge variant={offering.isElective ? "secondary" : "outline"}>
                {offering.isElective ? "Elective" : "Core"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Weekly Periods</p>
              <p className="text-sm">{offering.weeklyPeriods || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge
                variant={
                  offering.status === "active" ? "default" : offering.status === "inactive" ? "secondary" : "destructive"
                }
              >
                {offering.status.charAt(0).toUpperCase() + offering.status.slice(1)}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <p className="text-sm">{format(new Date(offering.createdAt), "MMM d, yyyy")}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
