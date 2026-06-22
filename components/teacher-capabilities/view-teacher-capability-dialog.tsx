"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import type { TeacherCapability } from "@/lib/api/teacher-capabilities"

interface ViewTeacherCapabilityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  capability: TeacherCapability | null
}

export function ViewTeacherCapabilityDialog({ open, onOpenChange, capability }: ViewTeacherCapabilityDialogProps) {
  if (!capability) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Teacher Capability Details</DialogTitle>
          <DialogDescription>Detailed information about this teacher capability</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Teacher</p>
              <p className="text-sm font-medium">{capability.teacher?.fullName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Subject</p>
              <p className="text-sm">{capability.subject?.subjectName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Course</p>
              <p className="text-sm">{capability.course?.courseName || "All Courses"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Grade</p>
              <p className="text-sm">{capability.grade?.gradeName || "All Grades"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Section</p>
              <p className="text-sm">{capability.section?.sectionName || "All Sections"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Expertise Level</p>
              <Badge
                variant={
                  capability.expertiseLevel === "expert"
                    ? "destructive"
                    : capability.expertiseLevel === "advanced"
                      ? "default"
                      : capability.expertiseLevel === "intermediate"
                        ? "secondary"
                        : "outline"
                }
              >
                {capability.expertiseLevel.charAt(0).toUpperCase() + capability.expertiseLevel.slice(1)}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Priority Score</p>
              <p className="text-sm font-medium">{capability.priorityScore}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Primary</p>
              <Badge variant={capability.isPrimary ? "default" : "outline"}>
                {capability.isPrimary ? "Yes" : "No"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Can Be Class Teacher</p>
              <Badge variant={capability.canBeClassTeacher ? "default" : "outline"}>
                {capability.canBeClassTeacher ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Remarks</p>
              <p className="text-sm">{capability.remarks || "No remarks"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <p className="text-sm">{format(new Date(capability.createdAt), "MMM d, yyyy")}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
