"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Loader2, TrendingUp, Users, UserCheck, UserX, Percent } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { attendanceApi, type StudentAttendanceDetail, ATTENDANCE_STATUSES } from "@/lib/api/attendance"
import { useQuery } from "@tanstack/react-query"

interface StudentAttendanceDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  enrollmentId: string | null
}

export function StudentAttendanceDrawer({ open, onOpenChange, enrollmentId }: StudentAttendanceDrawerProps) {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  const { data, isLoading } = useQuery({
    queryKey: ["attendance-student-detail", enrollmentId, month, year],
    queryFn: () => attendanceApi.getStudentAttendanceDetail(enrollmentId!, month, year),
    enabled: !!enrollmentId,
  })

  const detail = (data as any)?.data as StudentAttendanceDetail | undefined
  const stats = detail?.stats
  const marks = detail?.marks || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Student Attendance Detail</DialogTitle>
          <DialogDescription>Monthly attendance breakdown</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !detail ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Select value={String(month)} onValueChange={(v) => setMonth(parseInt(v))}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <SelectItem key={m} value={String(m)}>{format(new Date(2024, m - 1), "MMMM")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={String(year)} onValueChange={(v) => setYear(parseInt(v))}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2024, 2025, 2026, 2027].map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Card>
                <CardContent className="p-3 flex items-center gap-2">
                  <div className="rounded-full bg-blue-100 p-1.5"><TrendingUp className="h-4 w-4 text-blue-600" /></div>
                  <div><p className="text-xs text-muted-foreground">Total Sessions</p><p className="text-lg font-bold">{stats?.total || 0}</p></div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 flex items-center gap-2">
                  <div className="rounded-full bg-green-100 p-1.5"><UserCheck className="h-4 w-4 text-green-600" /></div>
                  <div><p className="text-xs text-muted-foreground">Present</p><p className="text-lg font-bold text-green-600">{stats?.present || 0}</p></div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 flex items-center gap-2">
                  <div className="rounded-full bg-red-100 p-1.5"><UserX className="h-4 w-4 text-red-600" /></div>
                  <div><p className="text-xs text-muted-foreground">Absent</p><p className="text-lg font-bold text-red-600">{stats?.absent || 0}</p></div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 flex items-center gap-2">
                  <div className="rounded-full bg-purple-100 p-1.5"><Percent className="h-4 w-4 text-purple-600" /></div>
                  <div><p className="text-xs text-muted-foreground">Percentage</p><p className="text-lg font-bold text-purple-600">{stats?.percentage || 0}%</p></div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center py-4">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none"
                    stroke={stats?.percentage && stats.percentage >= 75 ? "#16a34a" : stats?.percentage && stats.percentage >= 50 ? "#f59e0b" : "#dc2626"}
                    strokeWidth="8" strokeDasharray={`${((stats?.percentage || 0) / 100) * 264} 264`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">{stats?.percentage || 0}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-1 max-h-[300px] overflow-y-auto">
              {marks.map((mark, i) => {
                const statusDef = ATTENDANCE_STATUSES.find((s) => s.value === mark.status)
                return (
                  <div key={i} className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 border-b">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{mark.date ? format(new Date(mark.date), "dd MMM yyyy") : "N/A"}</span>
                      {mark.attendanceType && <Badge variant="outline" className="text-[10px]">{mark.attendanceType}</Badge>}
                    </div>
                    <Badge className={statusDef?.color || ""}>{statusDef?.label || mark.status}</Badge>
                  </div>
                )
              })}
              {marks.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">No attendance marks for this month</p>}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}