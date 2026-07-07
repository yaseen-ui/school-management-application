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
import { useDeleteVehicleCategory } from "@/hooks/use-transportation"
import type { VehicleCategory } from "@/lib/api/transportation"

interface DeleteVehicleCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: VehicleCategory | null
}

export function DeleteVehicleCategoryDialog({ open, onOpenChange, category }: DeleteVehicleCategoryDialogProps) {
  const deleteCategory = useDeleteVehicleCategory()

  if (!category) return null

  const handleDelete = async () => {
    try {
      await deleteCategory.mutateAsync(category.id)
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
              <DialogTitle>Delete Category</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <strong>{category.name}</strong>? This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {category._count && category._count.vehicles > 0 && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            This category has {category._count.vehicles} vehicle(s). Deleting it may affect them.
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={deleteCategory.isPending}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleteCategory.isPending}>
            {deleteCategory.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Category
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
