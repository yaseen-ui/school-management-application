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
import { useDeletePickupPoint } from "@/hooks/use-transportation"
import type { PickupPoint } from "@/lib/api/transportation"

interface DeletePickupPointDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pickupPoint: PickupPoint | null
}

export function DeletePickupPointDialog({ open, onOpenChange, pickupPoint }: DeletePickupPointDialogProps) {
  const deletePickupPoint = useDeletePickupPoint()

  if (!pickupPoint) return null

  const handleDelete = async () => {
    try {
      await deletePickupPoint.mutateAsync(pickupPoint.id)
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
              <DialogTitle>Delete Pickup Point</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <strong>{pickupPoint.name}</strong>? This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {pickupPoint._count && pickupPoint._count.transportAssignments > 0 && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            This pickup point has {pickupPoint._count.transportAssignments} student assignment(s). Deleting it may affect them.
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={deletePickupPoint.isPending}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={deletePickupPoint.isPending}>
            {deletePickupPoint.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Pickup Point
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
