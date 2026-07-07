"use client"
import { Loader2, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useDeleteTransportAssignment } from "@/hooks/use-transportation"
import type { TransportAssignment } from "@/lib/api/transportation"

interface DeleteTransportAssignmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assignment: TransportAssignment | null
}

export function DeleteTransportAssignmentDialog({ open, onOpenChange, assignment }: DeleteTransportAssignmentDialogProps) {
  const deleteAssignment = useDeleteTransportAssignment()

  if (!assignment) return null

  const studentName = assignment.enrollment?.student
    ? `${assignment.enrollment.student.firstName} ${assignment.enrollment.student.lastName}`
    : "—"

  const handleDelete = async () => {
    try {
      await deleteAssignment.mutateAsync(assignment.id)
      onOpenChange(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Delete Transport Assignment</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this transport assignment? This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="rounded-lg bg-muted p-3 text-sm">
          <p><strong>Student:</strong> {studentName}</p>
          <p><strong>Pickup Point:</strong> {assignment.pickupPoint?.name || "—"}</p>
          <p><strong>Vehicle:</strong> {assignment.vehicle?.name || "Not assigned"}</p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={deleteAssignment.isPending}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleteAssignment.isPending}>
            {deleteAssignment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Assignment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
