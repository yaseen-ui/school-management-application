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
import { useDeleteVehicle } from "@/hooks/use-transportation"
import type { Vehicle } from "@/lib/api/transportation"

interface DeleteVehicleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicle: Vehicle | null
}

export function DeleteVehicleDialog({ open, onOpenChange, vehicle }: DeleteVehicleDialogProps) {
  const deleteVehicle = useDeleteVehicle()

  if (!vehicle) return null

  const handleDelete = async () => {
    try {
      await deleteVehicle.mutateAsync(vehicle.id)
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
              <DialogTitle>Delete Vehicle</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <strong>{vehicle.name}</strong>? This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={deleteVehicle.isPending}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleteVehicle.isPending}>
            {deleteVehicle.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Vehicle
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
