"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, MapPin, Truck, Car, GraduationCap } from "lucide-react"
import { format } from "date-fns"
import type { TransportAssignment } from "@/lib/api/transportation"

interface ViewTransportAssignmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assignment: TransportAssignment | null
}

export function ViewTransportAssignmentDialog({ open, onOpenChange, assignment }: ViewTransportAssignmentDialogProps) {
  if (!assignment) return null

  const studentName = assignment.enrollment?.student
    ? `${assignment.enrollment.student.firstName} ${assignment.enrollment.student.lastName}`
    : "—"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Transport Assignment</DialogTitle>
              <DialogDescription>Student transport assignment details</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Student</p>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{studentName}</span>
            </div>
            {assignment.enrollment?.grade && (
              <p className="text-xs text-muted-foreground">
                {assignment.enrollment.grade.gradeName}
                {assignment.enrollment.section ? ` - ${assignment.enrollment.section.sectionName}` : ""}
              </p>
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Pickup Point</p>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{assignment.pickupPoint?.name || "—"}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Vehicle</p>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{assignment.vehicle?.name || "Not assigned"}</span>
              </div>
            </div>
          </div>

          {assignment.category && (
            <>
              <Separator />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Preferred Category</p>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{assignment.category.name}</span>
                  <Badge variant="outline">{assignment.category.type}</Badge>
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={assignment.isActive ? "default" : "secondary"}>
              {assignment.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          <Separator />
          <div className="text-sm text-muted-foreground">
            <p>Created: {format(new Date(assignment.createdAt), "MMM d, yyyy")}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
