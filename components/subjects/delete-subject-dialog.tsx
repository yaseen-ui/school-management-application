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
import { useDeleteSubject } from "@/hooks/use-subjects"
import { Loader2 } from "lucide-react"
import type { Subject } from "@/lib/api/subjects"

interface DeleteSubjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subject: Subject | null
}

export function DeleteSubjectDialog({ open, onOpenChange, subject }: DeleteSubjectDialogProps) {
  const deleteSubject = useDeleteSubject()

  const handleDelete = async () => {
    if (!subject) return
    await deleteSubject.mutateAsync(subject.id)
    onOpenChange(false)
  }

  if (!subject) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Subject</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{subject.subjectName}</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90"
            disabled={deleteSubject.isPending}
          >
            {deleteSubject.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
