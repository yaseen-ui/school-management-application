"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Car, Users, Wifi, Snowflake, Tv, Coffee, Shield } from "lucide-react"
import type { VehicleCategory } from "@/lib/api/transportation"

interface ViewVehicleCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: VehicleCategory | null
}

export function ViewVehicleCategoryDialog({ open, onOpenChange, category }: ViewVehicleCategoryDialogProps) {
  if (!category) return null

  const amenityIcons: Record<string, React.ReactNode> = {
    wifi: <Wifi className="h-4 w-4" />,
    ac: <Snowflake className="h-4 w-4" />,
    tv: <Tv className="h-4 w-4" />,
    refreshments: <Coffee className="h-4 w-4" />,
    insurance: <Shield className="h-4 w-4" />,
  }

  const amenities = category.amenities ? category.amenities.split(",").map((a) => a.trim().toLowerCase()) : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>{category.name}</DialogTitle>
              <DialogDescription>Vehicle category details</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Type</p>
              <Badge variant="outline">{category.type}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Occupancy</p>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{category.occupancy} people</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={category.isActive ? "default" : "secondary"}>
              {category.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          {category.description && (
            <>
              <Separator />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-sm">{category.description}</p>
              </div>
            </>
          )}

          {amenities.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                      {amenityIcons[amenity] || null}
                      {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {category._count && (
            <>
              <Separator />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Vehicles</p>
                <p className="font-medium">{category._count.vehicles} vehicle(s)</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
