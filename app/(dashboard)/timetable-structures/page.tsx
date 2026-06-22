"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CalendarClock,
  Eye,
  Pencil,
  Trash2,
  Plus,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Clock,
  Loader2,
  Search,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTimetableStructures, useDeleteTimetableStructure } from "@/hooks/use-timetable-structures"
import { useTimetablePeriods, useDeleteTimetablePeriod } from "@/hooks/use-timetable-periods"
import { CreateTimetableStructureDialog } from "@/components/timetable-structures/create-timetable-structure-dialog"
import { ViewTimetableStructureDialog } from "@/components/timetable-structures/view-timetable-structure-dialog"
import { EditTimetableStructureDialog } from "@/components/timetable-structures/edit-timetable-structure-dialog"
import { DeleteTimetableStructureDialog } from "@/components/timetable-structures/delete-timetable-structure-dialog"
import { CreateTimetablePeriodDialog } from "@/components/timetable-periods/create-timetable-period-dialog"
import { EditTimetablePeriodDialog } from "@/components/timetable-periods/edit-timetable-period-dialog"
import { ViewTimetablePeriodDialog } from "@/components/timetable-periods/view-timetable-period-dialog"
import { DeleteTimetablePeriodDialog } from "@/components/timetable-periods/delete-timetable-period-dialog"
import { format } from "date-fns"
import { toast } from "@/components/ui/sonner"
import { minutesToTime, PERIOD_TYPE_LABELS } from "@/lib/api/timetable-periods"
import type { TimetableStructure } from "@/lib/api/timetable-structures"
import type { TimetablePeriod } from "@/lib/api/timetable-periods"
import { cn } from "@/lib/utils"

export default function TimetableStructuresPage() {
  const { data: structuresData, isLoading } = useTimetableStructures()
  const deleteStructure = useDeleteTimetableStructure()
  const deletePeriod = useDeleteTimetablePeriod()

  const [searchQuery, setSearchQuery] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Structure CRUD dialogs
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedStructure, setSelectedStructure] = useState<TimetableStructure | null>(null)

  // Period CRUD dialogs
  const [createPeriodDialogOpen, setCreatePeriodDialogOpen] = useState(false)
  const [viewPeriodDialogOpen, setViewPeriodDialogOpen] = useState(false)
  const [editPeriodDialogOpen, setEditPeriodDialogOpen] = useState(false)
  const [deletePeriodDialogOpen, setDeletePeriodDialogOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<TimetablePeriod | null>(null)
  const [periodStructureId, setPeriodStructureId] = useState<string | null>(null)

  const structures = structuresData || []

  // Filter structures by search
  const filteredStructures = structures.filter((s: TimetableStructure) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      s.name.toLowerCase().includes(q) ||
      (s.description || "").toLowerCase().includes(q)
    )
  })

  // Fetch periods for the expanded structure
  const expandedFilters = expandedId ? { structureId: expandedId } : undefined
  const { data: periodsData, isLoading: periodsLoading } = useTimetablePeriods(expandedFilters)
  const periods = periodsData || []

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

  const handleAddPeriod = (structureId: string) => {
    setPeriodStructureId(structureId)
    setCreatePeriodDialogOpen(true)
  }

  const handleViewPeriod = (period: TimetablePeriod) => {
    setSelectedPeriod(period)
    setViewPeriodDialogOpen(true)
  }

  const handleEditPeriod = (period: TimetablePeriod) => {
    setSelectedPeriod(period)
    setEditPeriodDialogOpen(true)
  }

  const handleDeletePeriod = (period: TimetablePeriod) => {
    setSelectedPeriod(period)
    setDeletePeriodDialogOpen(true)
  }

  const handleConfirmDeletePeriod = async () => {
    if (!selectedPeriod) return
    try {
      await deletePeriod.mutateAsync(selectedPeriod.id)
      toast.success("Timetable period deleted successfully")
      setDeletePeriodDialogOpen(false)
      setSelectedPeriod(null)
    } catch (error: any) {
      toast.error(error.message || "Failed to delete timetable period")
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader
          title="Timetable Structures"
          description="Manage timetable structures (shifts) and their time periods"
        >
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Structure
          </Button>
        </PageHeader>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search structures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>

        {/* Structures Table */}
        <div className="overflow-x-auto rounded-xl border border-border/60 bg-card shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/80 bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-[40px]"></TableHead>
                <TableHead className="text-muted-foreground/80 text-[11px] font-semibold uppercase tracking-wider">
                  Name
                </TableHead>
                <TableHead className="text-muted-foreground/80 text-[11px] font-semibold uppercase tracking-wider">
                  Description
                </TableHead>
                <TableHead className="text-muted-foreground/80 text-[11px] font-semibold uppercase tracking-wider">
                  Periods
                </TableHead>
                <TableHead className="text-muted-foreground/80 text-[11px] font-semibold uppercase tracking-wider">
                  Created At
                </TableHead>
                <TableHead className="text-muted-foreground/80 text-[11px] font-semibold uppercase tracking-wider">
                  Updated At
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="text-sm">Loading structures...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredStructures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <CalendarClock className="h-8 w-8 opacity-50" />
                      <span className="text-sm font-medium">No structures found</span>
                      <span className="text-xs">Add a new structure to get started</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStructures.map((structure: TimetableStructure) => {
                  const isExpanded = expandedId === structure.id
                  return (
                    <TableRow key={structure.id} className="group">
                      <TableCell colSpan={7} className="p-0 border-0">
                        {/* Main structure row */}
                        <div
                          className={cn(
                            "flex items-center px-4 py-3 cursor-pointer transition-colors",
                            isExpanded ? "bg-muted/40" : "hover:bg-muted/30",
                          )}
                          onClick={() => toggleExpand(structure.id)}
                        >
                          <div className="w-[40px] shrink-0">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>

                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 shrink-0">
                              <CalendarClock className="h-4 w-4 text-primary" />
                            </div>
                            <span className="font-medium truncate">{structure.name}</span>
                          </div>

                          <div className="flex-1 min-w-0 px-4">
                            <span className="text-muted-foreground text-sm truncate block">
                              {structure.description || "—"}
                            </span>
                          </div>

                          <div className="w-24 shrink-0">
                            <Badge variant="secondary">
                              {structure.periodCount} period{structure.periodCount !== 1 ? "s" : ""}
                            </Badge>
                          </div>

                          <div className="w-32 shrink-0 text-sm text-muted-foreground">
                            {format(new Date(structure.createdAt), "MMM d, yyyy")}
                          </div>

                          <div className="w-32 shrink-0 text-sm text-muted-foreground">
                            {format(new Date(structure.updatedAt), "MMM d, yyyy")}
                          </div>

                          <div className="w-[50px] shrink-0" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleView(structure)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(structure)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(structure)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Expanded periods section */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden border-t border-border/50"
                            >
                              <div className="bg-muted/20 p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Time Periods</span>
                                    <Badge variant="outline" className="text-xs">
                                      {periods.length} period{periods.length !== 1 ? "s" : ""}
                                    </Badge>
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddPeriod(structure.id)}
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Period
                                  </Button>
                                </div>

                                {periodsLoading ? (
                                  <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                  </div>
                                ) : periods.length === 0 ? (
                                  <div className="text-sm text-muted-foreground py-6 border-2 border-dashed rounded-lg text-center">
                                    <Clock className="h-6 w-6 mx-auto mb-1 text-muted-foreground/50" />
                                    <p>No periods defined for this structure.</p>
                                    <p className="text-xs mt-1">
                                      Click "Add Period" to create the first time slot.
                                    </p>
                                  </div>
                                ) : (
                                  <div className="border rounded-md overflow-hidden bg-card">
                                    <Table>
                                      <TableHeader>
                                        <TableRow className="bg-muted/30">
                                          <TableHead className="w-[30px] text-xs">#</TableHead>
                                          <TableHead className="text-xs">Period Name</TableHead>
                                          <TableHead className="text-xs">Type</TableHead>
                                          <TableHead className="text-xs">Start Time</TableHead>
                                          <TableHead className="text-xs">End Time</TableHead>
                                          <TableHead className="text-xs">Sort Order</TableHead>
                                          <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {periods
                                          .sort(
                                            (a: TimetablePeriod, b: TimetablePeriod) =>
                                              a.sortOrder - b.sortOrder,
                                          )
                                          .map((period: TimetablePeriod, index: number) => (
                                            <TableRow key={period.id} className="hover:bg-muted/30">
                                              <TableCell className="text-xs text-muted-foreground">
                                                {index + 1}
                                              </TableCell>
                                              <TableCell className="font-medium text-sm">
                                                {period.name}
                                              </TableCell>
                                              <TableCell>
                                                <Badge variant="outline" className="text-xs">
                                                  {PERIOD_TYPE_LABELS[period.type] || period.type}
                                                </Badge>
                                              </TableCell>
                                              <TableCell className="font-mono text-sm">
                                                {minutesToTime(period.startTime)}
                                              </TableCell>
                                              <TableCell className="font-mono text-sm">
                                                {minutesToTime(period.endTime)}
                                              </TableCell>
                                              <TableCell className="text-sm">
                                                {period.sortOrder}
                                              </TableCell>
                                              <TableCell>
                                                <DropdownMenu>
                                                  <DropdownMenuTrigger asChild>
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      className="h-7 w-7 p-0"
                                                    >
                                                      <MoreVertical className="h-3.5 w-3.5" />
                                                    </Button>
                                                  </DropdownMenuTrigger>
                                                  <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                      onClick={() => handleViewPeriod(period)}
                                                    >
                                                      <Eye className="mr-2 h-4 w-4" />
                                                      View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                      onClick={() => handleEditPeriod(period)}
                                                    >
                                                      <Pencil className="mr-2 h-4 w-4" />
                                                      Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                      onClick={() => handleDeletePeriod(period)}
                                                      className="text-destructive focus:text-destructive"
                                                    >
                                                      <Trash2 className="mr-2 h-4 w-4" />
                                                      Delete
                                                    </DropdownMenuItem>
                                                  </DropdownMenuContent>
                                                </DropdownMenu>
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* Structure CRUD Dialogs */}
      <CreateTimetableStructureDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <ViewTimetableStructureDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        structure={selectedStructure}
      />
      <EditTimetableStructureDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        structure={selectedStructure}
      />
      <DeleteTimetableStructureDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        structure={selectedStructure}
        onConfirm={handleConfirmDelete}
      />

      {/* Period CRUD Dialogs */}
      <CreateTimetablePeriodDialog
        open={createPeriodDialogOpen}
        onOpenChange={setCreatePeriodDialogOpen}
        preselectedStructureId={periodStructureId || undefined}
      />
      <ViewTimetablePeriodDialog
        open={viewPeriodDialogOpen}
        onOpenChange={setViewPeriodDialogOpen}
        period={selectedPeriod}
      />
      <EditTimetablePeriodDialog
        open={editPeriodDialogOpen}
        onOpenChange={setEditPeriodDialogOpen}
        period={selectedPeriod}
      />
      <DeleteTimetablePeriodDialog
        open={deletePeriodDialogOpen}
        onOpenChange={setDeletePeriodDialogOpen}
        period={selectedPeriod}
        onConfirm={handleConfirmDeletePeriod}
      />
    </>
  )
}
