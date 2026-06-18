"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Clock, Eye, Pencil, Trash2, Plus, MoreVertical, Filter } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTimetablePeriods, useDeleteTimetablePeriod } from "@/hooks/use-timetable-periods"
import { useTimetableStructures } from "@/hooks/use-timetable-structures"
import { CreateTimetablePeriodDialog } from "@/components/timetable-periods/create-timetable-period-dialog"
import { ViewTimetablePeriodDialog } from "@/components/timetable-periods/view-timetable-period-dialog"
import { EditTimetablePeriodDialog } from "@/components/timetable-periods/edit-timetable-period-dialog"
import { DeleteTimetablePeriodDialog } from "@/components/timetable-periods/delete-timetable-period-dialog"
import { format } from "date-fns"
import { toast } from "@/components/ui/sonner"
import { minutesToTime, PERIOD_TYPE_LABELS } from "@/lib/api/timetable-periods"
import type { TimetablePeriod } from "@/lib/api/timetable-periods"


export default function TimetablePeriodsPage() {
  const [structureFilter, setStructureFilter] = useState<string>("all")
  const filters = structureFilter && structureFilter !== "all" ? { structureId: structureFilter } : undefined
  const { data: periodsData, isLoading } = useTimetablePeriods(filters)
  const { data: structuresData } = useTimetableStructures()
  const deletePeriod = useDeleteTimetablePeriod()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<TimetablePeriod | null>(null)

  const structures = structuresData || []

  const handleView = (period: TimetablePeriod) => {
    setSelectedPeriod(period)
    setViewDialogOpen(true)
  }

  const handleEdit = (period: TimetablePeriod) => {
    setSelectedPeriod(period)
    setEditDialogOpen(true)
  }

  const handleDelete = (period: TimetablePeriod) => {
    setSelectedPeriod(period)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedPeriod) return
    try {
      await deletePeriod.mutateAsync(selectedPeriod.id)
      toast.success("Timetable period deleted successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to delete timetable period")
    }
    setDeleteDialogOpen(false)
    setSelectedPeriod(null)
  }

  const handleBulkDelete = async (selectedRows: TimetablePeriod[]) => {
    try {
      await Promise.all(selectedRows.map((row) => deletePeriod.mutateAsync(row.id)))
      toast.success(`Successfully deleted ${selectedRows.length} timetable period(s)`)
    } catch (error) {
      toast.error("Failed to delete some timetable periods")
    }
  }

  const defaultColumns = [
    { field: "name", headerName: "Period Name" },
    { field: "type", headerName: "Type" },
    { field: "structure", headerName: "Structure" },
    { field: "startTime", headerName: "Start Time" },
    { field: "endTime", headerName: "End Time" },
    { field: "sortOrder", headerName: "Sort Order" },
    { field: "createdAt", headerName: "Created At" },
  ]


  const periods = periodsData || []

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader title="Timetable Periods" description="Manage time slots (periods) for each timetable structure">
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Period
          </Button>
        </PageHeader>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter by structure:</span>
          <Select value={structureFilter} onValueChange={setStructureFilter}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="All structures" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Structures</SelectItem>
              {structures.map((s: any) => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DynamicDataTable
          data={periods}
          apiColumns={defaultColumns}
          isLoading={isLoading}
          onBulkDelete={handleBulkDelete}
          idField="id"
          renderCell={({ row, field }: { row: TimetablePeriod; field: string }) => {
            if (field === "name") {
              return (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{row.name}</span>
                </div>
              )
            }

            if (field === "type") {
              return <Badge>{PERIOD_TYPE_LABELS[row.type] || row.type}</Badge>
            }

            if (field === "structure") {

              return <Badge variant="outline">{row.structure?.name || "N/A"}</Badge>
            }

            if (field === "startTime") {
              return <span className="font-mono text-sm">{minutesToTime(row.startTime)}</span>
            }

            if (field === "endTime") {
              return <span className="font-mono text-sm">{minutesToTime(row.endTime)}</span>
            }

            if (field === "sortOrder") {
              return <span>{row.sortOrder}</span>
            }

            if (field === "createdAt") {
              return (
                <span className="text-sm text-muted-foreground">
                  {format(new Date(row.createdAt), "MMM d, yyyy")}
                </span>
              )
            }

            return undefined
          }}
          renderActions={(row: TimetablePeriod) => (
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

      <CreateTimetablePeriodDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <ViewTimetablePeriodDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} period={selectedPeriod} />
      <EditTimetablePeriodDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} period={selectedPeriod} />
      <DeleteTimetablePeriodDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        period={selectedPeriod}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
