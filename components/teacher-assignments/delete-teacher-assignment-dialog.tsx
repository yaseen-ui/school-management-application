"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { TeacherAssignment } from "@/lib/api/teacher-assignments"

interface DeleteTeacherAssignmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assignment: TeacherAssignment | null
  onConfirm: () => void
}

export function DeleteTeacherAssignmentDialog({ open, onOpenChange, assignment, onConfirm }: DeleteTeacherAssignmentDialogProps) {
  if (!assignment) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Teacher Assignment</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the assignment for{" "}
            <strong>{assignment.teacher?.fullName}</strong> -{" "}
            <strong>{assignment.sectionSubject?.subject?.subjectName}</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
