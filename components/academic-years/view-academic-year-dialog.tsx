"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, Info } from "lucide-react"
import { format } from "date-fns"
import type { AcademicYear } from "@/lib/api/academic-years"

interface ViewAcademicYearDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  academicYear: AcademicYear | null
}

export function ViewAcademicYearDialog({ open, onOpenChange, academicYear }: ViewAcademicYearDialogProps) {
  if (!academicYear) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "draft":
        return <Badge variant="secondary">Draft</Badge>
      case "archived":
        return <Badge variant="outline">Archived</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPP")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Academic Year Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold">{academicYear.name}</h3>
              </div>
              {getStatusBadge(academicYear.status)}
            </div>

            <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium">Start Date</p>
                  <p className="text-sm text-muted-foreground">{formatDate(academicYear.startDate)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium">End Date</p>
                  <p className="text-sm text-muted-foreground">{formatDate(academicYear.endDate)}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-blue-50 dark:bg-blue-950/20 p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Status Information</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {academicYear.status === "active" &&
                      "This is the currently active academic year. All new enrollments will be assigned to this year."}
                    {academicYear.status === "draft" &&
                      "This academic year is in draft status. Activate it to make it the current year."}
                    {academicYear.status === "archived" &&
                      "This academic year has been archived and cannot be modified."}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="font-medium">{formatDate(academicYear.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-medium">{formatDate(academicYear.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
