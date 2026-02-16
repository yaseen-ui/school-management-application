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
import { useDeleteTeacher } from "@/hooks/use-teachers"
import type { Teacher } from "@/lib/api/teachers"

interface DeleteTeacherDialogProps {
  teacher: Teacher
  onClose: () => void
}

export function DeleteTeacherDialog({ teacher, onClose }: DeleteTeacherDialogProps) {
  const deleteTeacher = useDeleteTeacher()

  const handleDelete = () => {
    deleteTeacher.mutate(teacher.id, {
      onSuccess: () => onClose(),
    })
  }

  return (
    <AlertDialog open onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {teacher.firstName} {teacher.lastName}
            </span>
            ? This action cannot be undone and will also delete all associated qualifications and employment history.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleteTeacher.isPending} className="bg-destructive">
            {deleteTeacher.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
