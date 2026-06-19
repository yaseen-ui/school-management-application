"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, AlertTriangle } from "lucide-react"
import { useDeleteSectionSubject } from "@/hooks/use-section-subjects"
import type { SectionSubject } from "@/lib/api/section-subjects"

interface DeleteSectionSubjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sectionSubject: SectionSubject | null
}

export function DeleteSectionSubjectDialog({ open, onOpenChange, sectionSubject }: DeleteSectionSubjectDialogProps) {
  const deleteMutation = useDeleteSectionSubject()

  const handleDelete = async () => {
    if (!sectionSubject) return
    try {
      await deleteMutation.mutateAsync(sectionSubject.id)
      onOpenChange(false)
    } catch {
      // Error handled by mutation
    }
  }

  if (!sectionSubject) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Delete Section Subject</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove this subject from this section?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="rounded-md bg-muted/50 p-3 space-y-1">
          <p className="text-sm">
            <span className="font-medium">Subject:</span> {sectionSubject.subject?.subjectName}
          </p>
          <p className="text-sm">
            <span className="font-medium">Section:</span> {sectionSubject.section?.sectionName}
          </p>
          <p className="text-sm">
            <span className="font-medium">Grade:</span> {sectionSubject.section?.grade?.gradeName || "N/A"}
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          This action cannot be undone. This will also affect related timetable entries, teacher assignments, and exam papers for this section-subject.
        </p>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
