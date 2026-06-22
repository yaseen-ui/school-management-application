"use client"
import { Loader2, Building2, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useDeleteBuilding } from "@/hooks/use-buildings"
import type { Building } from "@/lib/api/buildings"

interface DeleteBuildingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  building: Building | null
}

export function DeleteBuildingDialog({ open, onOpenChange, building }: DeleteBuildingDialogProps) {
  const deleteBuilding = useDeleteBuilding()

  const handleDelete = async () => {
    if (!building) return
    await deleteBuilding.mutateAsync(building.id)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <Building2 className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Delete Building</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this building? This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {building && (
          <div className="flex items-start gap-3 rounded-lg border bg-muted/50 p-4">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">{building.name}</p>
              {building.code && <p className="text-muted-foreground">Code: {building.code}</p>}
              <p className="text-muted-foreground mt-1">
                This will also delete all floors and rooms in this building.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteBuilding.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteBuilding.isPending}
          >
            {deleteBuilding.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Building
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
