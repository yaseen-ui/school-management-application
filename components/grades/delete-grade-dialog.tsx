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
import { useDeleteGrade } from "@/hooks/use-grades"

interface GradeData {
  gradeId: string
  gradeName: string
}

interface DeleteGradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  grade: GradeData | null
}

export function DeleteGradeDialog({ open, onOpenChange, grade }: DeleteGradeDialogProps) {
  const deleteGrade = useDeleteGrade()

  const handleDelete = async () => {
    if (!grade) return

    try {
      await deleteGrade.mutateAsync(grade.gradeId)
      onOpenChange(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  if (!grade) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle>Delete Grade</AlertDialogTitle>
              <AlertDialogDescription>Are you sure you want to delete this grade?</AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-foreground">{grade.gradeName}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            This action cannot be undone. This will permanently delete the grade and may affect related data.
          </p>
        </div>

        <AlertDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteGrade.isPending}>
            {deleteGrade.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Grade
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
