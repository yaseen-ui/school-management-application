"use client"

import { Users } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Section } from "@/lib/api/sections"

interface ViewSectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  section: Section | null
}

export function ViewSectionDialog({ open, onOpenChange, section }: ViewSectionDialogProps) {
  if (!section) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Section Details</DialogTitle>
              <DialogDescription>View section information</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Section Name</h4>
            <p className="text-base">{section.sectionName}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Grade</h4>
            <Badge variant="secondary">{section.gradeName || section.gradeId}</Badge>
          </div>

          <div className="pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Created At</span>
              <span className="font-medium">{formatDate(section.createdAt)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Updated</span>
              <span className="font-medium">{formatDate(section.updatedAt)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
