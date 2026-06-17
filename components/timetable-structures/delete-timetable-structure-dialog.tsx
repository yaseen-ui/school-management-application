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
import type { TimetableStructure } from "@/lib/api/timetable-structures"

interface DeleteTimetableStructureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  structure: TimetableStructure | null
  onConfirm: () => void
}

export function DeleteTimetableStructureDialog({ open, onOpenChange, structure, onConfirm }: DeleteTimetableStructureDialogProps) {
  if (!structure) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Timetable Structure</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the timetable structure{" "}
            <strong>{structure.name}</strong>? This action cannot be undone.
            {structure.periodCount > 0 && (
              <p className="mt-2 text-destructive">
                This structure has {structure.periodCount} period(s) assigned. Deleting it will also remove all associated periods.
              </p>
            )}
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
