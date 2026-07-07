"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Truck, Calendar, Star } from "lucide-react"
import { format } from "date-fns"
import type { DriverAssignment } from "@/lib/api/transportation"

interface ViewDriverAssignmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assignment: DriverAssignment | null
}

export function ViewDriverAssignmentDialog({ open, onOpenChange, assignment }: ViewDriverAssignmentDialogProps) {
  if (!assignment) return null

  const statusColors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    INACTIVE: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    SUSPENDED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Driver Assignment</DialogTitle>
              <DialogDescription>Driver assignment details</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Driver</p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{assignment.driver?.fullName || "—"}</span>
              </div>
              {assignment.driver?.employeeCode && (
                <p className="text-xs text-muted-foreground">Code: {assignment.driver.employeeCode}</p>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Vehicle</p>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{assignment.vehicle?.name || "—"}</span>
              </div>
              {assignment.vehicle?.registrationNumber && (
                <p className="text-xs text-muted-foreground">{assignment.vehicle.registrationNumber}</p>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Assigned Date</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{format(new Date(assignment.assignedDate), "MMM d, yyyy")}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">End Date</p>
              <span className="font-medium">{assignment.endDate ? format(new Date(assignment.endDate), "MMM d, yyyy") : "—"}</span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={statusColors[assignment.status] || ""} variant="outline">
                {assignment.status}
              </Badge>
            </div>
            {assignment.isPrimaryDriver && (
              <div className="flex items-center gap-1 text-sm text-yellow-600">
                <Star className="h-4 w-4 fill-yellow-400" />
                Primary Driver
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
