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
import { useDeleteStudent } from "@/hooks/use-students"
import type { Student } from "@/lib/api/students"

interface DeleteStudentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  student: Student | null
}

export function DeleteStudentDialog({ open, onOpenChange, student }: DeleteStudentDialogProps) {
  const { mutate: deleteStudent, isPending } = useDeleteStudent()

  if (!student) return null

  const handleDelete = () => {
    deleteStudent(student.id, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Student</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {student.firstName} {student.lastName}? This action cannot be undone and
            will permanently remove all student records and documents.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
