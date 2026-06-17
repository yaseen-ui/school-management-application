"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { format } from "date-fns"
import type { TimetableStructure } from "@/lib/api/timetable-structures"

interface ViewTimetableStructureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  structure: TimetableStructure | null
}

export function ViewTimetableStructureDialog({ open, onOpenChange, structure }: ViewTimetableStructureDialogProps) {
  if (!structure) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Timetable Structure Details</DialogTitle>
          <DialogDescription>Detailed information about this timetable structure</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-sm font-medium">{structure.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Periods</p>
              <p className="text-sm">{structure.periodCount} period(s)</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="text-sm">{structure.description || "No description"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <p className="text-sm">{format(new Date(structure.createdAt), "MMM d, yyyy")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Updated At</p>
              <p className="text-sm">{format(new Date(structure.updatedAt), "MMM d, yyyy")}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
