"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  CalendarClock,
  Plus,
  Trash2,
  Filter,
  GraduationCap,
  BookOpen,
  User,
  MapPin,
  Loader2,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTimetableGrid, useDeleteTimetableEntry } from "@/hooks/use-timetable-entries"
import { useSections } from "@/hooks/use-sections"
import { useAcademicYears } from "@/hooks/use-academic-years"
import { useTimetablePeriods } from "@/hooks/use-timetable-periods"
import { useTimetableStructures } from "@/hooks/use-timetable-structures"
import { DAYS_OF_WEEK, minutesToTime } from "@/lib/api/timetable-periods"


import { toast } from "@/components/ui/sonner"
import { CreateTimetableEntryDialog } from "@/components/timetable/create-timetable-entry-dialog"
import type { TimetableEntry } from "@/lib/api/timetable-entries"

export default function TimetablePage() {
  const { data: sectionsData } = useSections()
  const { data: academicYearsData } = useAcademicYears()
  const { data: structuresData } = useTimetableStructures()
  const deleteEntry = useDeleteTimetableEntry()

  const [selectedSectionId, setSelectedSectionId] = useState<string>("")
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<string>("")
  const [selectedStructureId, setSelectedStructureId] = useState<string>("")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null)

  const sections: any[] = ((sectionsData as any)?.data?.rows as any[]) || (sectionsData as unknown as any[]) || []
  const academicYears: any[] = ((academicYearsData as any)?.data?.rows as any[]) || (academicYearsData as unknown as any[]) || []
  const structures: any[] = (structuresData as any[]) || []



  // Auto-select first active academic year
  const activeAcademicYear = useMemo(() => {
    return academicYears.find((y: any) => y.status === "active")
  }, [academicYears])

  // Set default academic year
  useMemo(() => {
    if (!selectedAcademicYearId && activeAcademicYear) {
      setSelectedAcademicYearId(activeAcademicYear.id)
    }
  }, [activeAcademicYear, selectedAcademicYearId])

  // Get periods for the selected structure
  const structureFilter = selectedStructureId && selectedStructureId !== "all" ? { structureId: selectedStructureId } : undefined
  const { data: periodsData } = useTimetablePeriods(structureFilter)
  const periods = useMemo(() => {
    const p = periodsData || []
    return [...p].sort((a: any, b: any) => a.sortOrder - b.sortOrder)
  }, [periodsData])

  // Get timetable grid data
  const { data: gridData, isLoading: gridLoading } = useTimetableGrid(
    selectedSectionId || null,
    selectedAcademicYearId || null,
  )

  // Build the grid: periods x days
  const grid = useMemo(() => {
    if (!gridData || !periods.length) return { periods: [], days: DAYS_OF_WEEK, entries: [] }

    const entries = Array.isArray(gridData) ? gridData : []

    return {
      periods,
      days: DAYS_OF_WEEK,
      entries,
    }
  }, [gridData, periods])

  const getEntryForCell = (periodId: string, dayOfWeek: number): TimetableEntry | undefined => {
    return grid.entries.find((e: TimetableEntry) => e.periodId === periodId && e.dayOfWeek === dayOfWeek)
  }

  const handleDeleteEntry = async (entry: TimetableEntry) => {
    try {
      await deleteEntry.mutateAsync(entry.id)
      toast.success("Timetable entry removed")
    } catch (error: any) {
      toast.error(error.message || "Failed to delete entry")
    }
  }

  const handleEditEntry = (entry: TimetableEntry) => {
    setEditingEntry(entry)
    setCreateDialogOpen(true)
  }

  const handleCreateEntry = () => {
    setEditingEntry(null)
    setCreateDialogOpen(true)
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader
          title="Timetable"
          description="Visual timetable grid — assign subjects and teachers to periods for each day of the week"
        >
          <Button onClick={handleCreateEntry} disabled={!selectedSectionId || !selectedAcademicYearId}>
            <Plus className="mr-2 h-4 w-4" />
            Add Entry
          </Button>
        </PageHeader>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">Academic Year</label>
                <Select value={selectedAcademicYearId} onValueChange={setSelectedAcademicYearId}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Select academic year" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((y: any) => (
                      <SelectItem key={y.id} value={y.id}>
                        {y.name} {y.status === "active" ? "(Active)" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">Section</label>
                <Select value={selectedSectionId} onValueChange={setSelectedSectionId}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((s: any) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.grade?.gradeName ? `${s.grade.gradeName} - ` : ""}{s.sectionName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">Timetable Structure</label>
                <Select value={selectedStructureId} onValueChange={setSelectedStructureId}>
                  <SelectTrigger className="w-[220px]">
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
            </div>
          </CardContent>
        </Card>

        {/* Timetable Grid */}
        {!selectedSectionId || !selectedAcademicYearId ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <CalendarClock className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">Select a section and academic year</h3>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Choose a section and academic year above to view the timetable
              </p>
            </CardContent>
          </Card>
        ) : gridLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="sticky left-0 z-10 bg-muted/50 px-4 py-3 text-left text-sm font-semibold text-muted-foreground min-w-[140px] border-r">
                    Period / Day
                  </th>
                  {grid.days.map((day) => (
                    <th
                      key={day.value}
                      className="px-4 py-3 text-center text-sm font-semibold text-muted-foreground min-w-[160px] border-r last:border-r-0"
                    >
                      {day.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grid.periods.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                      No periods found. Create periods in the selected timetable structure first.
                    </td>
                  </tr>
                ) : (
                  grid.periods.map((period: any, periodIndex: number) => (
                    <tr
                      key={period.id}
                      className={`border-t transition-colors hover:bg-muted/30 ${periodIndex % 2 === 0 ? "bg-background" : "bg-muted/10"}`}
                    >
                      <td className="sticky left-0 z-10 bg-inherit px-4 py-3 border-r">
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{period.name}</span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {minutesToTime(period.startTime)} - {minutesToTime(period.endTime)}
                          </span>
                        </div>
                      </td>
                      {grid.days.map((day) => {
                        const entry = getEntryForCell(period.id, day.value)
                        return (
                          <td
                            key={`${period.id}-${day.value}`}
                            className="px-2 py-2 border-r last:border-r-0"
                          >
                            {entry ? (
                              <div className="group relative rounded-lg border bg-card p-2.5 hover:shadow-md transition-all cursor-pointer min-h-[80px]">
                                <div className="space-y-1.5">
                                  <div className="flex items-start justify-between gap-1">
                                    <Badge variant="secondary" className="text-xs font-medium truncate max-w-[120px]">
                                      <BookOpen className="h-3 w-3 mr-1 shrink-0" />
                                      {entry.sectionSubject?.subject?.subjectName || "N/A"}
                                    </Badge>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteEntry(entry)
                                      }}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                    >
                                      <Trash2 className="h-3 w-3 text-destructive hover:text-destructive/80" />
                                    </button>
                                  </div>
                                  {entry.teacherAssignment?.teacher && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <User className="h-3 w-3 shrink-0" />
                                      <span className="truncate">{entry.teacherAssignment.teacher.fullName}</span>
                                    </div>
                                  )}
                                  {entry.room && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <MapPin className="h-3 w-3 shrink-0" />
                                      <span className="truncate">{entry.room}</span>
                                    </div>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleEditEntry(entry)}
                                  className="absolute inset-0 rounded-lg"
                                  aria-label="Edit entry"
                                />
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingEntry(null)
                                  setCreateDialogOpen(true)
                                }}
                                className="flex items-center justify-center w-full min-h-[80px] rounded-lg border border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground/50 hover:text-primary/70"
                              >
                                <Plus className="h-5 w-5" />
                              </button>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <CreateTimetableEntryDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        entry={editingEntry}
        defaultSectionId={selectedSectionId}
        defaultAcademicYearId={selectedAcademicYearId}
      />
    </>
  )
}
