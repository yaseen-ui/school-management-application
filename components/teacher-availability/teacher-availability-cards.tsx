"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2, User, Clock } from "lucide-react"
import { useTeachers } from "@/hooks/use-teachers"
import { useAllTeacherAvailability } from "@/hooks/use-teacher-availability"
import type { TeacherAvailabilitySlot } from "@/lib/api/teacher-availability"
import { WeeklyPlannerGrid } from "./weekly-planner-grid"
import { cn } from "@/lib/utils"

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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// Generate a consistent color based on the teacher's name
const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-pink-500",
]

function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

// Find the max minutes across all days for a teacher to scale progress bars
function getMaxDayMinutes(dayWise: Record<string, { availableMinutes: number; slotCount: number }>): number {
  return Math.max(...Object.values(dayWise).map((d) => d.availableMinutes), 1)
}

function getBarColor(percentage: number): string {
  if (percentage >= 70) return "bg-emerald-500"
  if (percentage >= 40) return "bg-amber-500"
  return "bg-rose-400"
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const,
    },
  },
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

  // Compute stats
  const totalTeachers = filteredSummaries.length
  const avgHours = totalTeachers > 0
    ? Math.round(filteredSummaries.reduce((sum, s) => sum + s.totalAvailableMinutes, 0) / totalTeachers / 60)
    : 0

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
      {/* Search & Stats bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teachers by name or employee code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
        {!isLoading && totalTeachers > 0 && (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {totalTeachers} teacher{totalTeachers !== 1 ? "s" : ""}
            </span>
            <span className="text-muted-foreground/30">|</span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Avg {avgHours}h/week
            </span>
          </div>
        )}
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
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {filteredSummaries.map((summary) => {
            const maxMinutes = getMaxDayMinutes(summary.dayWise)
            return (
              <motion.div
                key={summary.teacherId}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-lg hover:border-primary/40 transition-all duration-200 h-full"
                  onClick={() => setSelectedTeacherId(summary.teacherId)}
                >
                  <CardContent className="p-5">
                    {/* Header with avatar */}
                    <div className="flex items-start gap-3 mb-4">
                      <div
                        className={cn(
                          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold",
                          getAvatarColor(summary.teacherName),
                        )}
                      >
                        {getInitials(summary.teacherName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{summary.teacherName}</p>
                        {summary.employeeCode && (
                          <p className="text-xs text-muted-foreground">{summary.employeeCode}</p>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatHours(summary.totalAvailableMinutes)}/wk
                      </Badge>
                    </div>

                    {/* Day-wise progress bars */}
                    <div className="space-y-2">
                      {DAYS.map((day) => {
                        const dayInfo = summary.dayWise[day]
                        const percentage = dayInfo
                          ? (dayInfo.availableMinutes / maxMinutes) * 100
                          : 0

                        return (
                          <div key={day} className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground w-7 shrink-0">
                              {day.slice(0, 3)}
                            </span>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              {dayInfo && (
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                                  className={cn("h-full rounded-full", getBarColor(percentage))}
                                />
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground w-14 text-right shrink-0">
                              {dayInfo ? (
                                <>
                                  <span className="text-foreground font-medium">
                                    {formatHours(dayInfo.availableMinutes)}
                                  </span>
                                </>
                              ) : (
                                <span className="italic">—</span>
                              )}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
