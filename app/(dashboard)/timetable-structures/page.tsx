"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CalendarClock, Eye, Pencil, Trash2, Plus, MoreVertical } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTimetableStructures, useDeleteTimetableStructure } from "@/hooks/use-timetable-structures"
import { CreateTimetableStructureDialog } from "@/components/timetable-structures/create-timetable-structure-dialog"
import { ViewTimetableStructureDialog } from "@/components/timetable-structures/view-timetable-structure-dialog"
import { EditTimetableStructureDialog } from "@/components/timetable-structures/edit-timetable-structure-dialog"
import { DeleteTimetableStructureDialog } from "@/components/timetable-structures/delete-timetable-structure-dialog"
import { format } from "date-fns"
import { toast } from "@/components/ui/sonner"
import type { TimetableStructure } from "@/lib/api/timetable-structures"

export default function TimetableStructuresPage() {
  const { data: structuresData, isLoading } = useTimetableStructures()
  const deleteStructure = useDeleteTimetableStructure()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedStructure, setSelectedStructure] = useState<TimetableStructure | null>(null)

  const handleView = (structure: TimetableStructure) => {
    setSelectedStructure(structure)
    setViewDialogOpen(true)
  }

  const handleEdit = (structure: TimetableStructure) => {
    setSelectedStructure(structure)
    setEditDialogOpen(true)
  }

  const handleDelete = (structure: TimetableStructure) => {
    setSelectedStructure(structure)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedStructure) return
    try {
      await deleteStructure.mutateAsync(selectedStructure.id)
      toast.success("Timetable structure deleted successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to delete timetable structure")
    }
    setDeleteDialogOpen(false)
    setSelectedStructure(null)
  }

  const handleBulkDelete = async (selectedRows: TimetableStructure[]) => {
    try {
      await Promise.all(selectedRows.map((row) => deleteStructure.mutateAsync(row.id)))
      toast.success(`Successfully deleted ${selectedRows.length} timetable structure(s)`)
    } catch (error) {
      toast.error("Failed to delete some timetable structures")
    }
  }

  const defaultColumns = [
    { field: "name", headerName: "Name" },
    { field: "description", headerName: "Description" },
    { field: "periodCount", headerName: "Periods" },
    { field: "createdAt", headerName: "Created At" },
    { field: "updatedAt", headerName: "Updated At" },
  ]

  const structures = structuresData || []

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader title="Timetable Structures" description="Manage timetable structures (shifts) for different sections">
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Structure
          </Button>
        </PageHeader>

        <DynamicDataTable
          data={structures}
          apiColumns={defaultColumns}
          isLoading={isLoading}
          onBulkDelete={handleBulkDelete}
          idField="id"
          renderCell={({ row, field }: { row: TimetableStructure; field: string }) => {
            if (field === "name") {
              return (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                    <CalendarClock className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{row.name}</span>
                </div>
              )
            }

            if (field === "description") {
              return <span className="text-muted-foreground">{row.description || "—"}</span>
            }

            if (field === "periodCount") {
              return (
                <Badge variant="secondary">
                  {row.periodCount} period{row.periodCount !== 1 ? "s" : ""}
                </Badge>
              )
            }

            if (field === "createdAt" || field === "updatedAt") {
              return (
                <span className="text-sm text-muted-foreground">
                  {format(new Date(row[field as keyof TimetableStructure] as string), "MMM d, yyyy")}
                </span>
              )
            }

            return undefined
          }}
          renderActions={(row: TimetableStructure) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleView(row)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEdit(row)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(row)} className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </motion.div>

      <CreateTimetableStructureDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <ViewTimetableStructureDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} structure={selectedStructure} />
      <EditTimetableStructureDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} structure={selectedStructure} />
      <DeleteTimetableStructureDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        structure={selectedStructure}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
