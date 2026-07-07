"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Truck, Users, Hash, FileText } from "lucide-react"
import { format } from "date-fns"
import type { Vehicle } from "@/lib/api/transportation"

interface ViewVehicleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicle: Vehicle | null
}

export function ViewVehicleDialog({ open, onOpenChange, vehicle }: ViewVehicleDialogProps) {
  if (!vehicle) return null

  const statusColors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    MAINTENANCE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    RETIRED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>{vehicle.name}</DialogTitle>
              <DialogDescription>Vehicle details</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{vehicle.category?.name || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-medium">{vehicle.category?.type || "—"}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Registration Number</p>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{vehicle.registrationNumber || "—"}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Capacity</p>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{vehicle.capacity} seats</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge className={statusColors[vehicle.status] || ""} variant="outline">
              {vehicle.status}
            </Badge>
          </div>

          {vehicle.description && (
            <>
              <Separator />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Description</p>
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <p className="text-sm">{vehicle.description}</p>
                </div>
              </div>
            </>
          )}

          <Separator />
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p>Created</p>
              <p className="font-medium text-foreground">{format(new Date(vehicle.createdAt), "MMM d, yyyy")}</p>
            </div>
            <div>
              <p>Updated</p>
              <p className="font-medium text-foreground">{format(new Date(vehicle.updatedAt), "MMM d, yyyy")}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
