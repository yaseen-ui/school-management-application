"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bus, Eye, Pencil, Trash2, Plus, MoreVertical, Zap } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  useTransportAssignments,
  useDeleteTransportAssignment,
  useAutoAssignVehicles,
} from "@/hooks/use-transportation"
import { ViewTransportAssignmentDialog } from "@/components/transportation/transport-assignments/view-transport-assignment-dialog"
import { DeleteTransportAssignmentDialog } from "@/components/transportation/transport-assignments/delete-transport-assignment-dialog"
import { format } from "date-fns"
import { toast } from "@/components/ui/sonner"
import type { TransportAssignment } from "@/lib/api/transportation"
import Link from "next/link"

export default function TransportAssignmentsPage() {
  const { data: assignmentsData, isLoading } = useTransportAssignments()
  const deleteAssignment = useDeleteTransportAssignment()
  const autoAssign = useAutoAssignVehicles()

  const [viewOpen, setViewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<TransportAssignment | null>(null)

  const assignments: TransportAssignment[] = assignmentsData || []

  const handleView = (a: TransportAssignment) => {
    setSelected(a)
    setViewOpen(true)
  }

  const handleDelete = (a: TransportAssignment) => {
    setSelected(a)
    setDeleteOpen(true)
  }

  const handleBulkDelete = async (selectedRows: TransportAssignment[]) => {
    try {
      await Promise.all(selectedRows.map((row) => deleteAssignment.mutateAsync(row.id)))
      toast.success(`Successfully deleted ${selectedRows.length} assignment(s)`)
    } catch {
      toast.error("Failed to delete some assignments")
    }
  }

  const handleAutoAssign = async () => {
    try {
      await autoAssign.mutateAsync()
    } catch {
      // Error handled by mutation
    }
  }

  const assignmentColumns = [
    { field: "student", headerName: "Student" },
    { field: "pickupPoint", headerName: "Pickup Point" },
    { field: "vehicle", headerName: "Vehicle" },
    { field: "category", headerName: "Category" },
    { field: "isActive", headerName: "Status" },
    { field: "createdAt", headerName: "Created" },
  ]

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Transportation", href: "/transportation" },
          { label: "Assignments" },
        ]}
      />
      <PageHeader title="Transport Assignments" description="Assign students to pickup points and vehicles">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAutoAssign} disabled={autoAssign.isPending}>
            <Zap className="mr-2 h-4 w-4" />
            {autoAssign.isPending ? "Auto-Assigning..." : "Auto-Assign"}
          </Button>
          <Link href="/transportation/assignments/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Assignment
            </Button>
          </Link>
        </div>
      </PageHeader>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <DynamicDataTable
          data={assignments}
          apiColumns={assignmentColumns}
          isLoading={isLoading}
          onBulkDelete={handleBulkDelete}
          idField="id"
          renderCell={({ row, field, value }: { row: TransportAssignment; field: string; value: unknown }) => {
            if (field === "student") {
              return (
                <span>
                  {row.enrollment?.student
                    ? `${row.enrollment.student.firstName} ${row.enrollment.student.lastName}`
                    : "—"}
                </span>
              )
            }
            if (field === "pickupPoint") {
              return <span>{row.pickupPoint?.name || "—"}</span>
            }
            if (field === "vehicle") {
              return <span>{row.vehicle?.name || "Not assigned"}</span>
            }
            if (field === "category") {
              return <span>{row.category?.name || "—"}</span>
            }
            if (field === "isActive") {
              return (
                <span className={`text-sm font-medium ${row.isActive ? "text-green-600" : "text-muted-foreground"}`}>
                  {row.isActive ? "Active" : "Inactive"}
                </span>
              )
            }
            if (field === "createdAt" || field === "updatedAt") {
              return (
                <span className="text-sm text-muted-foreground">
                  {format(new Date(row[field as keyof TransportAssignment] as string), "MMM d, yyyy")}
                </span>
              )
            }
            return undefined
          }}
          renderActions={(row: TransportAssignment) => (
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
                  <Link href={`/transportation/assignments/${row.id}/edit`}>
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

      <ViewTransportAssignmentDialog open={viewOpen} onOpenChange={setViewOpen} assignment={selected} />
      <DeleteTransportAssignmentDialog open={deleteOpen} onOpenChange={setDeleteOpen} assignment={selected} />
    </div>
  )
}
