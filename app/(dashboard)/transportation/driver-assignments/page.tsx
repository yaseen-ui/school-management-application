"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { UserCog, Eye, Pencil, Trash2, Plus, MoreVertical } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useDriverAssignments, useDeleteDriverAssignment } from "@/hooks/use-transportation"
import { ViewDriverAssignmentDialog } from "@/components/transportation/driver-assignments/view-driver-assignment-dialog"
import { DeleteDriverAssignmentDialog } from "@/components/transportation/driver-assignments/delete-driver-assignment-dialog"
import { format } from "date-fns"
import { toast } from "@/components/ui/sonner"
import type { DriverAssignment } from "@/lib/api/transportation"
import Link from "next/link"

export default function DriverAssignmentsPage() {
  const { data: assignmentsData, isLoading } = useDriverAssignments()
  const deleteAssignment = useDeleteDriverAssignment()

  const [viewOpen, setViewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<DriverAssignment | null>(null)

  const assignments: DriverAssignment[] = assignmentsData || []

  const handleView = (a: DriverAssignment) => {
    setSelected(a)
    setViewOpen(true)
  }

  const handleDelete = (a: DriverAssignment) => {
    setSelected(a)
    setDeleteOpen(true)
  }

  const handleBulkDelete = async (selectedRows: DriverAssignment[]) => {
    try {
      await Promise.all(selectedRows.map((row) => deleteAssignment.mutateAsync(row.id)))
      toast.success(`Successfully deleted ${selectedRows.length} assignment(s)`)
    } catch {
      toast.error("Failed to delete some assignments")
    }
  }

  const assignmentColumns = [
    { field: "driver", headerName: "Driver" },
    { field: "vehicle", headerName: "Vehicle" },
    { field: "isPrimaryDriver", headerName: "Primary" },
    { field: "status", headerName: "Status" },
    { field: "assignedDate", headerName: "Assigned Date" },
  ]

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Transportation", href: "/transportation" },
          { label: "Driver Assignments" },
        ]}
      />
      <PageHeader title="Driver Assignments" description="Assign drivers to vehicles">
        <Link href="/transportation/driver-assignments/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Assign Driver
          </Button>
        </Link>
      </PageHeader>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <DynamicDataTable
          data={assignments}
          apiColumns={assignmentColumns}
          isLoading={isLoading}
          onBulkDelete={handleBulkDelete}
          idField="id"
          renderCell={({ row, field, value }: { row: DriverAssignment; field: string; value: unknown }) => {
            if (field === "driver") {
              return <span>{row.driver?.fullName || "—"}</span>
            }
            if (field === "vehicle") {
              return <span>{row.vehicle?.name || "—"}</span>
            }
            if (field === "isPrimaryDriver") {
              return <span>{row.isPrimaryDriver ? "Yes" : "No"}</span>
            }
            if (field === "status") {
              return <span className="text-sm font-medium">{row.status}</span>
            }
            if (field === "assignedDate") {
              return (
                <span className="text-sm text-muted-foreground">
                  {format(new Date(row.assignedDate), "MMM d, yyyy")}
                </span>
              )
            }
            return undefined
          }}
          renderActions={(row: DriverAssignment) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleView(row)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/transportation/driver-assignments/${row.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(row)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </motion.div>

      <ViewDriverAssignmentDialog open={viewOpen} onOpenChange={setViewOpen} assignment={selected} />
      <DeleteDriverAssignmentDialog open={deleteOpen} onOpenChange={setDeleteOpen} assignment={selected} />
    </div>
  )
}
