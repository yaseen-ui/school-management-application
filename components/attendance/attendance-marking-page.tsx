"use client"

import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, User, Loader2, Send } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import { attendanceApi, ATTENDANCE_TYPE_CATEGORIES, type AttendanceType } from "@/lib/api/attendance"
import { useSections } from "@/hooks/use-sections"
import { useAcademicYears } from "@/hooks/use-academic-years"
import { useStudents } from "@/hooks/use-students"
import { useCourses } from "@/hooks/use-courses"
import { useGrades } from "@/hooks/use-grades"
import { toast } from "@/components/ui/sonner"
import { useQuery } from "@tanstack/react-query"

export function AttendanceMarkingPage() {
  const { data: coursesData } = useCourses()
  const { data: gradesData } = useGrades()
  const { data: sectionsData } = useSections()
  const { data: academicYearsData } = useAcademicYears()
  const { data: studentsData } = useStudents()

  const courses: any[] = ((coursesData as any)?.data?.rows as any[]) || (Array.isArray(coursesData) ? (coursesData as any[]) : [])
  const grades: any[] = ((gradesData as any)?.data?.rows as any[]) || (Array.isArray(gradesData) ? (gradesData as any[]) : [])
  const sections: any[] = ((sectionsData as any)?.data?.rows as any[]) || (Array.isArray(sectionsData) ? (sectionsData as any[]) : [])
  const academicYears: any[] = Array.isArray(academicYearsData) ? academicYearsData : ((academicYearsData as any)?.data as any)?.rows || (academicYearsData as any) || []

  const [selectedCourseId, setSelectedCourseId] = useState("")
  const [selectedGradeId, setSelectedGradeId] = useState("")
  const [selectedSectionId, setSelectedSectionId] = useState("")
  const [selectedTypeId, setSelectedTypeId] = useState("")
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [selectedPeriodId, setSelectedPeriodId] = useState("")
  const [selectedExamScheduleId, setSelectedExamScheduleId] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [marks, setMarks] = useState<Record<string, "present" | "absent">>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const activeAcademicYear = useMemo(() => academicYears.find((y: any) => y.status === "active"), [academicYears])

  const filteredGrades = useMemo(() => {
    if (!selectedCourseId) return []
    return grades.filter((g: any) => g.courseId === selectedCourseId)
  }, [grades, selectedCourseId])

  const filteredSections = useMemo(() => {
    if (!selectedGradeId) return []
    return sections.filter((s: any) => s.gradeId === selectedGradeId)
  }, [sections, selectedGradeId])

  const { data: typesData } = useQuery({
    queryKey: ["attendance-types"],
    queryFn: async () => {
      const res = await attendanceApi.getAllTypes({ isActive: "true" })
      return (res.data as any)?.data || (res.data as any) || []
    },
  })
  const types: AttendanceType[] = Array.isArray(typesData) ? typesData : []
  const selectedType = types.find((t) => t.id === selectedTypeId)

  const { data: contextOptions } = useQuery({
    queryKey: ["context-options", selectedSectionId, selectedTypeId],
    queryFn: () => attendanceApi.getContextOptions(selectedSectionId, selectedTypeId),
    enabled: !!selectedSectionId && !!selectedTypeId && (selectedType?.category === "period" || selectedType?.category === "exam"),
  })
  const options = (contextOptions as any)?.data?.options || (contextOptions as any)?.options || []

  const students = useMemo(() => {
    const all: any[] = ((studentsData as any)?.rows as any[]) || (Array.isArray(studentsData) ? (studentsData as any[]) : [])
    if (!selectedSectionId) return []
    return all.filter((s: any) => s.sectionId === selectedSectionId).map((s: any) => {
      const enrollment = s.enrollments?.[0]
      return {
        id: s.id,
        enrollmentId: enrollment?.id,
        firstName: s.firstName,
        lastName: s.lastName,
        rollNumber: enrollment?.rollNumber || s.admissionNumber,
        profilePhotoUrl: s.profilePhotoUrl || null,
      }
    })
  }, [studentsData, selectedSectionId])

  const currentStudent = students[currentIndex]
  const totalStudents = students.length
  const presentCount = Object.values(marks).filter((s) => s === "present").length
  const absentCount = Object.values(marks).filter((s) => s === "absent").length

  const setMark = useCallback((status: "present" | "absent") => {
    if (!currentStudent) return
    setMarks((prev) => ({
      ...prev,
      [currentStudent.enrollmentId]: status,
    }))
    if (currentIndex < totalStudents - 1) {
      setTimeout(() => setCurrentIndex((i) => i + 1), 200)
    }
  }, [currentStudent, currentIndex, totalStudents])

  const handleSubmit = async () => {
    if (!activeAcademicYear || !selectedSectionId || !selectedTypeId) {
      toast.error("Please select section and attendance type")
      return
    }
    setIsSubmitting(true)
    try {
      const payload: any = {
        academicYearId: activeAcademicYear.id,
        sectionId: selectedSectionId,
        attendanceTypeId: selectedTypeId,
        date: selectedDate,
        marks: Object.entries(marks).map(([enrollmentId, status]) => ({ enrollmentId, status })),
      }
      if (selectedPeriodId) payload.periodId = selectedPeriodId
      if (selectedExamScheduleId) payload.examScheduleId = selectedExamScheduleId
      await attendanceApi.markAttendance(payload)
      toast.success("Attendance submitted successfully")
      setMarks({})
      setCurrentIndex(0)
    } catch (e: any) {
      toast.error(e.message || "Failed to submit attendance")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getInitials = (firstName: string, lastName: string) =>
    `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase()

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Course</label>
              <Select value={selectedCourseId} onValueChange={(v) => { setSelectedCourseId(v); setSelectedGradeId(""); setSelectedSectionId(""); setCurrentIndex(0); setMarks({}) }}>
                <SelectTrigger className="h-9 mt-1"><SelectValue placeholder="Select course" /></SelectTrigger>
                <SelectContent>
                  {courses.map((c: any) => (<SelectItem key={c.id} value={c.id}>{c.courseName}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Grade</label>
              <Select value={selectedGradeId} onValueChange={(v) => { setSelectedGradeId(v); setSelectedSectionId(""); setCurrentIndex(0); setMarks({}) }} disabled={!selectedCourseId}>
                <SelectTrigger className="h-9 mt-1"><SelectValue placeholder={selectedCourseId ? "Select grade" : "Select course first"} /></SelectTrigger>
                <SelectContent>
                  {filteredGrades.map((g: any) => (<SelectItem key={g.id} value={g.id}>{g.gradeName}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Section</label>
              <Select value={selectedSectionId} onValueChange={(v) => { setSelectedSectionId(v); setCurrentIndex(0); setMarks({}) }} disabled={!selectedGradeId}>
                <SelectTrigger className="h-9 mt-1"><SelectValue placeholder={selectedGradeId ? "Select section" : "Select grade first"} /></SelectTrigger>
                <SelectContent>
                  {filteredSections.map((s: any) => (<SelectItem key={s.id} value={s.id}>{s.sectionName}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Type</label>
              <Select value={selectedTypeId} onValueChange={(v) => { setSelectedTypeId(v); setSelectedPeriodId(""); setSelectedExamScheduleId("") }}>
                <SelectTrigger className="h-9 mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {types.map((t) => (<SelectItem key={t.id} value={t.id}>{t.name} ({ATTENDANCE_TYPE_CATEGORIES.find((c) => c.value === t.category)?.label || t.category})</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Date</label>
              <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="h-9 mt-1" />
            </div>
            {(selectedType?.category === "period" && options.length > 0) && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">Period</label>
                <Select value={selectedPeriodId} onValueChange={setSelectedPeriodId}>
                  <SelectTrigger className="h-9 mt-1"><SelectValue placeholder="Select period" /></SelectTrigger>
                  <SelectContent>{options.map((o: any) => (<SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            )}
            {(selectedType?.category === "exam" && options.length > 0) && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">Exam</label>
                <Select value={selectedExamScheduleId} onValueChange={setSelectedExamScheduleId}>
                  <SelectTrigger className="h-9 mt-1"><SelectValue placeholder="Select exam" /></SelectTrigger>
                  <SelectContent>{options.map((o: any) => (<SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {totalStudents === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <User className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-sm text-muted-foreground">Select a section to start marking attendance</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-center gap-1.5 flex-wrap">
            {students.map((s: any, i: number) => {
              const status = marks[s.enrollmentId]
              return (
                <button key={s.enrollmentId} onClick={() => setCurrentIndex(i)}
                  className={`w-3 h-3 rounded-full transition-all ${i === currentIndex ? "ring-2 ring-primary scale-125" : ""} ${status === "present" ? "bg-green-500" : status === "absent" ? "bg-red-500" : "bg-muted-foreground/30"}`}
                />
              )
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={currentStudent?.enrollmentId} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.2 }}>
              <Card className={`overflow-hidden border-2 transition-colors ${marks[currentStudent?.enrollmentId] === "present" ? "border-green-500" : marks[currentStudent?.enrollmentId] === "absent" ? "border-red-500" : "border-transparent"}`}>
                <CardContent className="pt-8 pb-6 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4 overflow-hidden">
                    {currentStudent?.profilePhotoUrl ? (
                      <img src={currentStudent.profilePhotoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-muted-foreground">{currentStudent ? getInitials(currentStudent.firstName, currentStudent.lastName) : ""}</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold">{currentStudent?.firstName} {currentStudent?.lastName}</h3>
                  <p className="text-sm text-muted-foreground mb-4">Roll: {currentStudent?.rollNumber || "N/A"}</p>
                  {marks[currentStudent?.enrollmentId] && (
                    <Badge className={`mb-3 ${marks[currentStudent.enrollmentId] === "present" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {marks[currentStudent.enrollmentId] === "present" ? "Present" : "Absent"}
                    </Badge>
                  )}
                  <div className="flex gap-6">
                    <button onClick={() => setMark("absent")}
                      className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all ${marks[currentStudent?.enrollmentId] === "absent" ? "bg-red-500 text-white border-red-500 scale-110" : "border-red-300 text-red-500 hover:bg-red-50"}`}>
                      <X className="h-7 w-7" />
                    </button>
                    <button onClick={() => setMark("present")}
                      className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all ${marks[currentStudent?.enrollmentId] === "present" ? "bg-green-500 text-white border-green-500 scale-110" : "border-green-300 text-green-500 hover:bg-green-50"}`}>
                      <Check className="h-7 w-7" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">Student {currentIndex + 1} of {totalStudents}</p>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
          <Card>
            <CardContent className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Present: {presentCount}</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Absent: {absentCount}</span>
                <span className="text-muted-foreground">| Remaining: {totalStudents - presentCount - absentCount}</span>
              </div>
              <Button onClick={handleSubmit} disabled={isSubmitting || totalStudents === 0}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Submit
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}