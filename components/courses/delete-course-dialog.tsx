"use client"

import { Loader2, AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useDeleteCourse } from "@/hooks/use-courses"
import type { Course } from "@/lib/api/courses"

interface DeleteCourseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  course: Course | null
}

export function DeleteCourseDialog({ open, onOpenChange, course }: DeleteCourseDialogProps) {
  const { mutate: deleteCourse, isPending } = useDeleteCourse()

  const handleDelete = () => {
    if (!course) return

    deleteCourse(course.id, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle>Delete Course</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <strong>{course?.courseName}</strong>?
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <div className="rounded-lg bg-destructive/5 p-4 text-sm text-destructive">
          This action cannot be undone. This will permanently delete the course and may affect associated subjects and
          grades.
        </div>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Course
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
