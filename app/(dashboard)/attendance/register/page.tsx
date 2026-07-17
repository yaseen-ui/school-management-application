"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Loader2, Table, User, Calendar, ChevronLeft, ChevronRight } from "lucide-react"

import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { attendanceApi } from "@/lib/api/attendance"
import { HierarchicalFilter } from "@/components/shared/hierarchical-filter"
import { useQuery } from "@tanstack/react-query"

export default function AttendanceRegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const now = new Date()

  const [selectedCourseId, setSelectedCourseId] = useState(searchParams.get("courseId") || "")
  const [selectedGradeId, setSelectedGradeId] = useState(searchParams.get("gradeId") || "")
  const [selectedSectionId, setSelectedSectionId] = useState(searchParams.get("sectionId") || "")
  const [month, setMonth] = useState(() => {
    const m = searchParams.get("month")
    return m ? parseInt(m) : now.getMonth() + 1
  })
  const [year, setYear] = useState(() => {
    const y = searchParams.get("year")
    return y ? parseInt(y) : now.getFullYear()
  })
  const [view, setView] = useState<"month" | "week">("month")

  const { data: registerData, isLoading } = useQuery({
    queryKey: ["attendance-register", selectedSectionId, month, year],
    queryFn: () => attendanceApi.getAttendanceRegister(selectedSectionId, month, year),
    enabled: !!selectedSectionId,
  })

  const register = (registerData as any)?.data || (registerData as any)
  const enrollments = register?.enrollments || []
  const activeTypes = register?.activeTypes || []
  const attendance = register?.attendance || {}

  const daysInMonth = new Date(year, month, 0).getDate()
  const monthName = format(new Date(year, month - 1), "MMMM yyyy")

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const getStatusCell = (dateStr: string, typeName: string) => {
    const day = attendance[dateStr]?.[typeName]
    if (!day) return { cell: "", className: "bg-muted/30" }
    const enrollmentId = Object.keys(day)[0] // placeholder — actual mapping is per enrollment
    return { cell: "", className: "" } // Will be populated per row below
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Attendance Register" description="Monthly attendance view by section">
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          <Calendar className="mr-2 h-4 w-4" /> Back
        </Button>
      </PageHeader>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <HierarchicalFilter
              filters={["courses", "grades", "sections"]}
              values={{
                courseId: selectedCourseId || undefined,
                gradeId: selectedGradeId || undefined,
                sectionId: selectedSectionId || undefined,
              }}
              onChange={({ courseId, gradeId, sectionId }) => {
                setSelectedCourseId(courseId || "")
                setSelectedGradeId(gradeId || "")
                setSelectedSectionId(sectionId || "")
              }}
            />

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
              <span className="text-sm font-medium min-w-[140px] text-center">{monthName}</span>
              <Button variant="outline" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
            </div>

            <Tabs value={view} onValueChange={(v) => setView(v as "month" | "week")}>
              <TabsList>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Register Grid */}
      <Card>
        <CardContent className="pt-6 overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : !selectedSectionId ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Table className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">Select a section to view attendance</p>
            </div>
          ) : enrollments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <User className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No students enrolled in this section</p>
            </div>
          ) : (
            <div className="min-w-max">
              <table className="text-xs border-collapse w-full">
                <thead>
                  <tr>
                    <th className="sticky left-0 bg-background z-10 text-left py-2 px-2 border-b min-w-[140px]">Student</th>
                    {view === "month" && Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
                      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`
                      return (
                        <th key={d} className="py-2 px-1 border-b text-center" colSpan={activeTypes.length || 1}>
                          <div className="text-[10px] text-muted-foreground">{d}</div>
                          {activeTypes.length > 1 && (
                            <div className="flex justify-center gap-1 mt-0.5">
                              {activeTypes.map((t: string) => (
                                <span key={t} className="text-[8px] text-muted-foreground">{t.charAt(0)}</span>
                              ))}
                            </div>
                          )}
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((e: any) => (
                    <tr
                      key={e.enrollmentId}
                      className="border-b hover:bg-muted/50 cursor-pointer"
                      onClick={() => {
                        const sp = new URLSearchParams()
                        sp.set("month", String(month))
                        sp.set("year", String(year))
                        if (selectedCourseId) sp.set("courseId", selectedCourseId)
                        if (selectedGradeId) sp.set("gradeId", selectedGradeId)
                        if (selectedSectionId) sp.set("sectionId", selectedSectionId)
                        router.push(`/attendance/register/student/${e.enrollmentId}?${sp.toString()}`)
                      }}
                    >
                      <td className="sticky left-0 bg-background z-10 py-2 px-2 border-b">
                        <div className="font-medium truncate max-w-[130px]">{e.studentName}</div>
                        {e.rollNumber && <div className="text-[10px] text-muted-foreground">Roll: {e.rollNumber}</div>}
                      </td>
                      {view === "month" && Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
                        const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`
                        if (activeTypes.length === 0) {
                          return <td key={d} className="py-2 px-1 text-center bg-muted/30" />
                        }
                        return activeTypes.map((typeName: string) => {
                          const status = attendance[dateStr]?.[typeName]?.[e.enrollmentId]
                          let bg = "bg-muted/30"
                          let label = ""
                          if (status === "present") { bg = "bg-green-100"; label = "P" }
                          else if (status === "absent") { bg = "bg-red-100"; label = "A" }
                          else if (status === "late") { bg = "bg-yellow-100"; label = "L" }
                          else if (status === "half_day") { bg = "bg-orange-100"; label = "HD" }
                          return (
                            <td key={`${d}-${typeName}`} className={`py-2 px-0.5 text-center ${bg}`}>
                              <span className="text-[10px] font-medium">{label || ""}</span>
                            </td>
                          )
                        })
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

    </motion.div>
  )
}