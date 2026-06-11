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
import type { TeacherCapability } from "@/lib/api/teacher-capabilities"

interface DeleteTeacherCapabilityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  capability: TeacherCapability | null
  onConfirm: () => void
}

export function DeleteTeacherCapabilityDialog({ open, onOpenChange, capability, onConfirm }: DeleteTeacherCapabilityDialogProps) {
  if (!capability) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Teacher Capability</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the capability for{" "}
            <strong>{capability.teacher?.fullName}</strong> - <strong>{capability.subject?.subjectName}</strong>? This action cannot be undone.
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
