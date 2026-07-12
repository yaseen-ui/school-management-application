"use client"

import { useState, useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import { Check, X, Clock, Moon, AlertCircle, Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ATTENDANCE_STATUSES, type AttendanceStatus, type AttendanceSession } from "@/lib/api/attendance"
import { useAttendanceMarks, useBulkUpsertAttendanceMarks } from "@/hooks/use-attendance"
import { useStudents } from "@/hooks/use-students"
import { toast } from "@/components/ui/sonner"
import { format } from "date-fns"

interface AttendanceMarkingGridProps {
  session: AttendanceSession
}

interface StudentMark {
  enrollmentId: string
  status: AttendanceStatus
  remarks?: string | null
}

export function AttendanceMarkingGrid({ session }: AttendanceMarkingGridProps) {
  const { data: marks, isLoading: marksLoading } = useAttendanceMarks(session.id)
  const { data: studentsData } = useStudents()
  const bulkUpsert = useBulkUpsertAttendanceMarks()

  // Filter students by sectionId and include enrollments
  const students: any[] = useMemo(() => {
    const allStudents: any[] = ((studentsData as any)?.rows as any[]) || (Array.isArray(studentsData) ? studentsData as any[] : [])
    return allStudents.filter((s: any) => s.sectionId === session.sectionId)
  }, [studentsData, session.sectionId])

  // Build initial marks map from existing marks
  const [marksMap, setMarksMap] = useState<Record<string, StudentMark>>({})
  const [hasChanges, setHasChanges] = useState(false)

  // Initialize marks map when data loads
  useMemo(() => {
    if (marks) {
      const map: Record<string, StudentMark> = {}
      for (const mark of marks) {
        map[mark.enrollmentId] = {
          enrollmentId: mark.enrollmentId,
          status: mark.status,
          remarks: mark.remarks,
        }
      }
      setMarksMap(map)
      setHasChanges(false)
    }
  }, [marks])

  const setStudentStatus = useCallback((enrollmentId: string, status: AttendanceStatus) => {
    setMarksMap((prev) => {
      const updated = { ...prev }
      updated[enrollmentId] = {
        enrollmentId,
        status,
        remarks: updated[enrollmentId]?.remarks || null,
      }
      return updated
    })
    setHasChanges(true)
  }, [])

  const handleSave = async () => {
    const marksArray = Object.values(marksMap).map((m) => ({
      enrollmentId: m.enrollmentId,
      status: m.status,
      remarks: m.remarks,
    }))

    try {
      await bulkUpsert.mutateAsync({ sessionId: session.id, marks: marksArray })
      setHasChanges(false)
      toast.success("Attendance saved successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to save attendance")
    }
  }

  // Get status for a student
  const getStudentStatus = (enrollmentId: string): AttendanceStatus => {
    return marksMap[enrollmentId]?.status || "present"
  }

  // Count by status
  const counts = useMemo(() => {
    const c: Record<string, number> = { present: 0, absent: 0, late: 0, half_day: 0, excused: 0 }
    for (const enrollmentId of Object.keys(marksMap)) {
      const status = marksMap[enrollmentId]?.status || "present"
      c[status] = (c[status] || 0) + 1
    }
    return c
  }, [marksMap])

  // Quick action: mark all as present
  const markAllPresent = () => {
    const newMap: Record<string, StudentMark> = {}
    for (const student of students) {
      const enrollmentId = student.enrollments?.[0]?.id
      if (enrollmentId) {
        newMap[enrollmentId] = { enrollmentId, status: "present" }
      }
    }
    setMarksMap((prev) => ({ ...prev, ...newMap }))
    setHasChanges(true)
  }

  if (marksLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  const totalStudents = students.length
  const markedStudents = Object.keys(marksMap).length

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {format(new Date(session.date), "EEEE, MMMM d, yyyy")}
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-3 text-sm">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                P: {counts.present || 0}
              </Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                A: {counts.absent || 0}
              </Badge>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                L: {counts.late || 0}
              </Badge>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                HD: {counts.half_day || 0}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                E: {counts.excused || 0}
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={markAllPresent} disabled={students.length === 0}>
              <Check className="mr-1 h-3.5 w-3.5" />
              All Present
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!hasChanges || bulkUpsert.isPending}>
              {bulkUpsert.isPending ? (
                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="mr-1 h-3.5 w-3.5" />
              )}
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Student grid */}
      {students.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">No students found</h3>
            <p className="text-sm text-muted-foreground/70 mt-1">
              No students are enrolled in this section
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {students.map((student: any, index: number) => {
            const enrollment = student.enrollments?.[0]
            const enrollmentId = enrollment?.id
            const currentStatus = enrollmentId ? getStudentStatus(enrollmentId) : "present"

            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className={`rounded-lg border p-3 transition-all ${
                  currentStatus === "present"
                    ? "border-green-200 bg-green-50/50"
                    : currentStatus === "absent"
                      ? "border-red-200 bg-red-50/50"
                      : currentStatus === "late"
                        ? "border-yellow-200 bg-yellow-50/50"
                        : currentStatus === "half_day"
                          ? "border-orange-200 bg-orange-50/50"
                          : "border-blue-200 bg-blue-50/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {student.firstName} {student.lastName}
                    </p>
                    {enrollment?.rollNumber && (
                      <p className="text-xs text-muted-foreground">Roll: {enrollment.rollNumber}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-1">
                  {ATTENDANCE_STATUSES.map((status) => (
                    <TooltipProvider key={status.value}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => enrollmentId && setStudentStatus(enrollmentId, status.value)}
                            className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-all ${
                              currentStatus === status.value
                                ? `${status.color} ring-1 ring-inset ring-current`
                                : "text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted"
                            }`}
                          >
                            {status.value === "present" ? (
                              <Check className="h-3.5 w-3.5 mx-auto" />
                            ) : status.value === "absent" ? (
                              <X className="h-3.5 w-3.5 mx-auto" />
                            ) : status.value === "late" ? (
                              <Clock className="h-3.5 w-3.5 mx-auto" />
                            ) : status.value === "half_day" ? (
                              <Moon className="h-3.5 w-3.5 mx-auto" />
                            ) : (
                              <AlertCircle className="h-3.5 w-3.5 mx-auto" />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>{status.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
