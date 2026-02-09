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
import { Loader2 } from "lucide-react"
import { useActivateAcademicYear } from "@/hooks/use-academic-years"
import type { AcademicYear } from "@/lib/api/academic-years"

interface ActivateAcademicYearDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  academicYear: AcademicYear | null
}

export function ActivateAcademicYearDialog({ open, onOpenChange, academicYear }: ActivateAcademicYearDialogProps) {
  const { mutate: activateAcademicYear, isPending } = useActivateAcademicYear()

  const handleActivate = () => {
    if (!academicYear) return

    activateAcademicYear(academicYear.id, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Activate Academic Year</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Are you sure you want to activate "{academicYear?.name}"?</p>
            <p className="font-medium text-foreground">
              This will automatically archive the currently active academic year and make this year the new active year.
              All new student enrollments will be assigned to this year.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleActivate} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Activate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
