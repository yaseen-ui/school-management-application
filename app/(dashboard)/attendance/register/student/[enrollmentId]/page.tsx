"use client"

import { useState, useMemo } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Loader2, ArrowLeft, TrendingUp, Users, UserCheck, UserX, Percent } from "lucide-react"

import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { attendanceApi, type StudentAttendanceDetail, ATTENDANCE_STATUSES } from "@/lib/api/attendance"
import { useQuery } from "@tanstack/react-query"

export default function StudentAttendanceDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const enrollmentId = params.enrollmentId as string

  const [month, setMonth] = useState(() => {
    const m = searchParams.get("month")
    return m ? parseInt(m) : new Date().getMonth() + 1
  })
  const [year, setYear] = useState(() => {
    const y = searchParams.get("year")
    return y ? parseInt(y) : new Date().getFullYear()
  })

  const { data, isLoading } = useQuery({
    queryKey: ["attendance-student-detail", enrollmentId, month, year],
    queryFn: () => attendanceApi.getStudentAttendanceDetail(enrollmentId, month, year),
    enabled: !!enrollmentId,
  })

  const detail = (data as any)?.data as StudentAttendanceDetail | undefined
  const stats = detail?.stats
  const marks = detail?.marks || []

  const handleBack = () => {
    // Go back to register page, preserving filters if any
    const courseId = searchParams.get("courseId")
    const gradeId = searchParams.get("gradeId")
    const sectionId = searchParams.get("sectionId")
    const sp = new URLSearchParams()
    if (month !== new Date().getMonth() + 1) sp.set("month", String(month))
    if (year !== new Date().getFullYear()) sp.set("year", String(year))
    if (courseId) sp.set("courseId", courseId)
    if (gradeId) sp.set("gradeId", gradeId)
    if (sectionId) sp.set("sectionId", sectionId)
    const qs = sp.toString()
    router.push(`/attendance/register${qs ? `?${qs}` : ""}`)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Student Attendance Detail" description="Monthly attendance breakdown">
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Register
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="pt-6">
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
        </CardContent>
      </Card>

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

          <div className="space-y-1">
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
    </motion.div>
  )
}