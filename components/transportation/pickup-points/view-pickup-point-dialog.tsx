"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Navigation, Users } from "lucide-react"
import { format } from "date-fns"
import type { PickupPoint } from "@/lib/api/transportation"

interface ViewPickupPointDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pickupPoint: PickupPoint | null
}

export function ViewPickupPointDialog({ open, onOpenChange, pickupPoint }: ViewPickupPointDialogProps) {
  if (!pickupPoint) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>{pickupPoint.name}</DialogTitle>
              <DialogDescription>Pickup point details</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="font-medium">{pickupPoint.address || "—"}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Latitude</p>
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium font-mono">{pickupPoint.latitude.toFixed(6)}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Longitude</p>
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-muted-foreground rotate-90" />
                <span className="font-medium font-mono">{pickupPoint.longitude.toFixed(6)}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={pickupPoint.isActive ? "default" : "secondary"}>
              {pickupPoint.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          {pickupPoint._count && (
            <>
              <Separator />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Assigned Students</p>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{pickupPoint._count.transportAssignments} student(s)</span>
                </div>
              </div>
            </>
          )}

          <Separator />
          <div className="text-sm text-muted-foreground">
            <p>Created: {format(new Date(pickupPoint.createdAt), "MMM d, yyyy")}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
