"use client"

import { useState, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save, Clock, Trash2, Copy } from "lucide-react"
import { useTeachers } from "@/hooks/use-teachers"
import { useTeacherAvailability, useUpsertTeacherAvailability } from "@/hooks/use-teacher-availability"
import type { TeacherAvailabilitySlot } from "@/lib/api/teacher-availability"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const

// Time slots from 6:00 AM to 6:00 PM in 30-minute increments
const TIME_SLOTS: { label: string; value: number }[] = []
for (let h = 6; h < 18; h++) {
  for (let m = 0; m < 60; m += 30) {
    const label = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
    TIME_SLOTS.push({ label, value: h * 60 + m })
  }
}

interface SlotSelection {
  dayOfWeek: string
  startTime: number
  endTime: number
  isAvailable: boolean
}

interface WeeklyPlannerGridProps {
  initialTeacherId?: string
}

export function WeeklyPlannerGrid({ initialTeacherId }: WeeklyPlannerGridProps = {}) {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(initialTeacherId || "")
  const [slots, setSlots] = useState<SlotSelection[]>([])
  const [isDirty, setIsDirty] = useState(false)

  const { data: teachers, isLoading: teachersLoading } = useTeachers()
  const { data: existingSlots, isLoading: slotsLoading } = useTeacherAvailability(selectedTeacherId || null)
  const upsertMutation = useUpsertTeacherAvailability()

  // Load existing slots when teacher changes
  useEffect(() => {
    if (existingSlots && existingSlots.length > 0) {
      setSlots(
        existingSlots.map((s: TeacherAvailabilitySlot) => ({
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
          isAvailable: s.isAvailable,
        })),
      )
    } else {
      setSlots([])
    }
    setIsDirty(false)
  }, [existingSlots])

  const addSlot = useCallback((dayOfWeek: string) => {
    setSlots((prev) => [
      ...prev,
      { dayOfWeek, startTime: 480, endTime: 510, isAvailable: true }, // default 8:00-8:30
    ])
    setIsDirty(true)
  }, [])

  const updateSlot = useCallback((index: number, updates: Partial<SlotSelection>) => {
    setSlots((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], ...updates }
      return next
    })
    setIsDirty(true)
  }, [])

  const removeSlot = useCallback((index: number) => {
    setSlots((prev) => prev.filter((_, i) => i !== index))
    setIsDirty(true)
  }, [])

  const copyFromPreviousDay = useCallback((day: string) => {
    const dayIndex = DAYS.indexOf(day as typeof DAYS[number])
    if (dayIndex <= 0) return
    const previousDay = DAYS[dayIndex - 1]
    const previousSlots = slots.filter((s) => s.dayOfWeek === previousDay)
    if (previousSlots.length === 0) return

    // Remove existing slots for this day
    const slotsWithoutDay = slots.filter((s) => s.dayOfWeek !== day)
    // Add copies of previous day's slots
    const newSlots = previousSlots.map((s) => ({
      ...s,
      dayOfWeek: day,
    }))
    setSlots([...slotsWithoutDay, ...newSlots])
    setIsDirty(true)
  }, [slots])

  const handleSave = useCallback(() => {
    if (!selectedTeacherId) return
    upsertMutation.mutate({
      teacherId: selectedTeacherId,
      slots: slots.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
        isAvailable: s.isAvailable,
      })),
    })
    setIsDirty(false)
  }, [selectedTeacherId, slots, upsertMutation])

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
  }

  const getSlotsForDay = (day: string) =>
    slots.filter((s) => s.dayOfWeek === day).sort((a, b) => a.startTime - b.startTime)

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Weekly Availability Planner</CardTitle>
          <div className="flex items-center gap-4">
            <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a teacher..." />
              </SelectTrigger>
              <SelectContent>
                {teachersLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading teachers...
                  </SelectItem>
                ) : (
                  teachers?.map((teacher: any) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.fullName} {teacher.employeeCode ? `(${teacher.employeeCode})` : ""}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {selectedTeacherId && (
              <Button onClick={handleSave} disabled={!isDirty || upsertMutation.isPending}>
                {upsertMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!selectedTeacherId ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Clock className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">Select a teacher to plan their availability</p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Define weekly time slots when the teacher is available for classes
            </p>
          </div>
        ) : slotsLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            {DAYS.map((day) => {
              const daySlots = getSlotsForDay(day)
              return (
                <div key={day} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{day}</h3>
                    <div className="flex items-center gap-2">
                      {day !== "Monday" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => copyFromPreviousDay(day)}
                          title={`Copy from ${DAYS[DAYS.indexOf(day as typeof DAYS[number]) - 1]}`}
                        >
                          <Copy className="h-3.5 w-3.5 mr-1" />
                          Copy from {DAYS[DAYS.indexOf(day as typeof DAYS[number]) - 1]}
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => addSlot(day)}>
                        + Add Slot
                      </Button>
                    </div>
                  </div>
                  {daySlots.length === 0 ? (
                    <p className="text-sm text-muted-foreground/60 italic pl-2">No slots configured</p>
                  ) : (
                    <div className="space-y-2">
                      {daySlots.map((slot, idx) => {
                        const globalIdx = slots.indexOf(slot)
                        return (
                          <div
                            key={globalIdx}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                              slot.isAvailable
                                ? "bg-green-50/50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                                : "bg-red-50/50 border-red-200 dark:bg-red-950/20 dark:border-red-800",
                            )}
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <Select
                                value={slot.startTime.toString()}
                                onValueChange={(v) => {
                                  const newStart = Number.parseInt(v)
                                  const duration = slot.endTime - slot.startTime
                                  updateSlot(globalIdx, {
                                    startTime: newStart,
                                    endTime: Math.min(newStart + duration, 1439),
                                  })
                                }}
                              >
                                <SelectTrigger className="w-[110px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {TIME_SLOTS.map((ts) => (
                                    <SelectItem key={ts.value} value={ts.value.toString()}>
                                      {ts.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <span className="text-muted-foreground">to</span>
                              <Select
                                value={slot.endTime.toString()}
                                onValueChange={(v) => updateSlot(globalIdx, { endTime: Number.parseInt(v) })}
                              >
                                <SelectTrigger className="w-[110px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {TIME_SLOTS.filter((ts) => ts.value > slot.startTime).map((ts) => (
                                    <SelectItem key={ts.value} value={ts.value.toString()}>
                                      {ts.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  "px-3",
                                  slot.isAvailable
                                    ? "text-green-600 hover:text-green-700 hover:bg-green-100"
                                    : "text-red-600 hover:text-red-700 hover:bg-red-100",
                                )}
                                onClick={() => updateSlot(globalIdx, { isAvailable: !slot.isAvailable })}
                              >
                                {slot.isAvailable ? "Available" : "Unavailable"}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => removeSlot(globalIdx)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
