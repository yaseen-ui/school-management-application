"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, Loader2, User, Calendar } from "lucide-react"
import { useTeachers } from "@/hooks/use-teachers"
import { useAllTeacherAvailability } from "@/hooks/use-teacher-availability"
import type { TeacherAvailabilitySlot } from "@/lib/api/teacher-availability"
import { WeeklyPlannerGrid } from "./weekly-planner-grid"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const

interface TeacherAvailabilitySummary {
  teacherId: string
  teacherName: string
  employeeCode?: string
  totalAvailableMinutes: number
  dayWise: Record<string, { availableMinutes: number; slotCount: number }>
}

function computeSummary(slots: TeacherAvailabilitySlot[]): Omit<TeacherAvailabilitySummary, "teacherId" | "teacherName" | "employeeCode"> {
  const dayWise: Record<string, { availableMinutes: number; slotCount: number }> = {}
  let totalAvailableMinutes = 0

  for (const slot of slots) {
    if (!slot.isAvailable) continue
    const duration = slot.endTime - slot.startTime
    totalAvailableMinutes += duration
    if (!dayWise[slot.dayOfWeek]) {
      dayWise[slot.dayOfWeek] = { availableMinutes: 0, slotCount: 0 }
    }
    dayWise[slot.dayOfWeek].availableMinutes += duration
    dayWise[slot.dayOfWeek].slotCount += 1
  }

  return { totalAvailableMinutes, dayWise }
}

function formatHours(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function TeacherAvailabilityCards() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null)

  const { data: teachers, isLoading: teachersLoading } = useTeachers()
  const { data: allSlots, isLoading: slotsLoading } = useAllTeacherAvailability()

  const summaries = useMemo(() => {
    if (!teachers || !allSlots) return []

    const slotsByTeacher: Record<string, TeacherAvailabilitySlot[]> = {}
    for (const slot of allSlots) {
      if (!slotsByTeacher[slot.teacherId]) {
        slotsByTeacher[slot.teacherId] = []
      }
      slotsByTeacher[slot.teacherId].push(slot)
    }

    const result: TeacherAvailabilitySummary[] = []
    for (const teacher of teachers) {
      const teacherSlots = slotsByTeacher[teacher.id] || []
      const summary = computeSummary(teacherSlots)
      result.push({
        teacherId: teacher.id,
        teacherName: teacher.fullName,
        employeeCode: teacher.employeeCode,
        ...summary,
      })
    }

    return result
  }, [teachers, allSlots])

  const filteredSummaries = useMemo(() => {
    if (!searchQuery.trim()) return summaries
    const q = searchQuery.toLowerCase()
    return summaries.filter(
      (s) =>
        s.teacherName.toLowerCase().includes(q) ||
        (s.employeeCode && s.employeeCode.toLowerCase().includes(q)),
    )
  }, [summaries, searchQuery])

  if (selectedTeacherId) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedTeacherId(null)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to all teachers
        </button>
        <WeeklyPlannerGrid initialTeacherId={selectedTeacherId} />
      </div>
    )
  }

  const isLoading = teachersLoading || slotsLoading

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search teachers by name or employee code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredSummaries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <User className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <p className="text-lg font-medium text-muted-foreground">
            {searchQuery ? "No teachers match your search" : "No teachers found"}
          </p>
          <p className="text-sm text-muted-foreground/60 mt-1">
            {searchQuery ? "Try a different name or employee code" : "Add teachers to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredSummaries.map((summary) => (
            <Card
              key={summary.teacherId}
              className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/50"
              onClick={() => setSelectedTeacherId(summary.teacherId)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">{summary.teacherName}</CardTitle>
                    {summary.employeeCode && (
                      <p className="text-xs text-muted-foreground mt-0.5">{summary.employeeCode}</p>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatHours(summary.totalAvailableMinutes)}/week
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5">
                  {DAYS.map((day) => {
                    const dayInfo = summary.dayWise[day]
                    return (
                      <div key={day} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span className="font-medium">{day.slice(0, 3)}</span>
                        </div>
                        {dayInfo ? (
                          <span className="text-foreground font-medium">
                            {formatHours(dayInfo.availableMinutes)}
                            <span className="text-muted-foreground font-normal ml-1">
                              ({dayInfo.slotCount} slot{dayInfo.slotCount > 1 ? "s" : ""})
                            </span>
                          </span>
                        ) : (
                          <span className="text-muted-foreground/50 italic">Not set</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
