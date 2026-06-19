"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { SectionSubject } from "@/lib/api/section-subjects"

interface ViewSectionSubjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sectionSubject: SectionSubject | null
}

export function ViewSectionSubjectDialog({ open, onOpenChange, sectionSubject }: ViewSectionSubjectDialogProps) {
  if (!sectionSubject) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Section Subject Details</DialogTitle>
          <DialogDescription>View the details of the section-subject assignment.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Section</p>
              <p className="text-sm">{sectionSubject.section?.sectionName || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Grade</p>
              <p className="text-sm">{sectionSubject.section?.grade?.gradeName || "N/A"}</p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium text-muted-foreground">Subject</p>
            <p className="text-sm">{sectionSubject.subject?.subjectName || "N/A"}</p>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium text-muted-foreground">Type</p>
            <Badge variant={sectionSubject.isElective ? "secondary" : "default"}>
              {sectionSubject.isElective ? "Elective" : "Core"}
            </Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <p className="text-sm">{new Date(sectionSubject.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Updated At</p>
              <p className="text-sm">{new Date(sectionSubject.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
