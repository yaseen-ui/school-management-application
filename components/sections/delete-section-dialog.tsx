"use client"

import { Loader2, AlertTriangle } from "lucide-react"
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
import { useDeleteSection } from "@/hooks/use-sections"
import type { Section } from "@/lib/api/sections"

interface DeleteSectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  section: Section | null
}

export function DeleteSectionDialog({ open, onOpenChange, section }: DeleteSectionDialogProps) {
  const deleteSection = useDeleteSection()

  const handleDelete = async () => {
    if (!section) return

    await deleteSection.mutateAsync(section.id)
    onOpenChange(false)
  }

  if (!section) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle>Delete Section</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <span className="font-semibold">{section.sectionName}</span>? This
                action cannot be undone.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteSection.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteSection.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleteSection.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
