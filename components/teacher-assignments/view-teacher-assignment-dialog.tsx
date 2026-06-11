"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import type { TeacherAssignment } from "@/lib/api/teacher-assignments"

interface ViewTeacherAssignmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assignment: TeacherAssignment | null
}

export function ViewTeacherAssignmentDialog({ open, onOpenChange, assignment }: ViewTeacherAssignmentDialogProps) {
  if (!assignment) return null

  const roleLabels: Record<string, string> = {
    subject_teacher: "Subject Teacher",
    class_teacher: "Class Teacher",
    assistant_teacher: "Assistant Teacher",
    lab_incharge: "Lab Incharge",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Teacher Assignment Details</DialogTitle>
          <DialogDescription>Detailed information about this teacher assignment</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Teacher</p>
              <p className="text-sm font-medium">{assignment.teacher?.fullName}</p>
              {assignment.teacher?.employeeCode && (
                <p className="text-xs text-muted-foreground">Code: {assignment.teacher.employeeCode}</p>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <Badge variant="secondary">{roleLabels[assignment.role] || assignment.role}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Subject</p>
              <p className="text-sm">{assignment.sectionSubject?.subject?.subjectName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Section</p>
              <p className="text-sm">{assignment.sectionSubject?.section?.sectionName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Grade</p>
              <p className="text-sm">{assignment.sectionSubject?.section?.grade?.gradeName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Academic Year</p>
              <p className="text-sm">{assignment.academicYear?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Is Elective</p>
              <Badge variant={assignment.sectionSubject?.isElective ? "default" : "outline"}>
                {assignment.sectionSubject?.isElective ? "Yes" : "No"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <p className="text-sm">{format(new Date(assignment.createdAt), "MMM d, yyyy")}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
