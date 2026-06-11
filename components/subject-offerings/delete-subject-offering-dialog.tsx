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
import type { SubjectOffering } from "@/lib/api/subject-offerings"

interface DeleteSubjectOfferingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  offering: SubjectOffering | null
  onConfirm: () => void
}

export function DeleteSubjectOfferingDialog({ open, onOpenChange, offering, onConfirm }: DeleteSubjectOfferingDialogProps) {
  if (!offering) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Subject Offering</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the subject offering for{" "}
            <strong>{offering.subject?.subjectName}</strong>? This action cannot be undone.
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
