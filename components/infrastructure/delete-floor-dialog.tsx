"use client"
import { Loader2, Layers, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useDeleteFloor } from "@/hooks/use-buildings"
import type { Floor } from "@/lib/api/buildings"

interface DeleteFloorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  floor: Floor | null
}

export function DeleteFloorDialog({ open, onOpenChange, floor }: DeleteFloorDialogProps) {
  const deleteFloor = useDeleteFloor()

  const handleDelete = async () => {
    if (!floor) return
    await deleteFloor.mutateAsync(floor.id)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <Layers className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Delete Floor</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this floor? This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {floor && (
          <div className="flex items-start gap-3 rounded-lg border bg-muted/50 p-4">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Floor {floor.floorNumber}{floor.name ? ` - ${floor.name}` : ""}</p>
              <p className="text-muted-foreground mt-1">
                This will also delete all rooms on this floor.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteFloor.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteFloor.isPending}
          >
            {deleteFloor.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Floor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
