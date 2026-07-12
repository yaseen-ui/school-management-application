"use client"

import { Loader2, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { AttendanceType } from "@/lib/api/attendance"

interface DeleteAttendanceTypeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: AttendanceType | null
  onConfirm: () => Promise<void>
  isDeleting?: boolean
}

export function DeleteAttendanceTypeDialog({
  open,
  onOpenChange,
  type,
  onConfirm,
  isDeleting,
}: DeleteAttendanceTypeDialogProps) {
  if (!type) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Attendance Type
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{type.name}</strong>?
            {type._count && type._count.sessions > 0 && (
              <span className="block mt-2 text-destructive">
                This type has {type._count.sessions} attendance session(s). It cannot be deleted while sessions exist.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting || (type._count ? type._count.sessions > 0 : false)}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}