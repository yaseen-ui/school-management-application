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
import type { TimetablePeriod } from "@/lib/api/timetable-periods"

interface DeleteTimetablePeriodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  period: TimetablePeriod | null
  onConfirm: () => void
}

export function DeleteTimetablePeriodDialog({ open, onOpenChange, period, onConfirm }: DeleteTimetablePeriodDialogProps) {
  if (!period) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Timetable Period</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the timetable period{" "}
            <strong>{period.name}</strong>? This action cannot be undone.
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
