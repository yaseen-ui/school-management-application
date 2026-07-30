"use client"

import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ListChecks,
  Loader2,
  Search,
  Send,
  SlidersHorizontal,
  User,
  X,
} from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

import { attendanceApi, ATTENDANCE_TYPE_CATEGORIES, type AttendanceType } from "@/lib/api/attendance"
import { useAcademicYears } from "@/hooks/use-academic-years"
import { useStudents } from "@/hooks/use-students"
import { toast } from "@/components/ui/sonner"
import { useQuery } from "@tanstack/react-query"
import { enrollmentsApi, type Enrollment } from "@/lib/api/enrollments"
import { HierarchicalFilter } from "@/components/shared/hierarchical-filter"

export function AttendanceMarkingPage() {
  const { data: academicYearsData } = useAcademicYears()
  const { data: studentsData } = useStudents()

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
  const [setupOpen, setSetupOpen] = useState(true)
  const [rosterOpen, setRosterOpen] = useState(false)
  const [rosterSearch, setRosterSearch] = useState("")
  const [rosterFilter, setRosterFilter] = useState<"all" | "unmarked" | "present" | "absent">("all")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submittingRef = useRef(false)

  const activeAcademicYear = useMemo(() => academicYears.find((y: any) => y.status === "active"), [academicYears])

  const { data: typesData, isLoading: typesLoading } = useQuery({
    queryKey: ["attendance-types", "active"],
    queryFn: async () => {
      const res = await attendanceApi.getAllTypes({ isActive: "true" })
      return (res.data as any)?.data || (res.data as any) || []
    },
  })
  const types: AttendanceType[] = Array.isArray(typesData) ? typesData : []
  const selectedType = types.find((t) => t.id === selectedTypeId)

  useEffect(() => {
    if (selectedTypeId && !types.some((type) => type.id === selectedTypeId)) {
      setSelectedTypeId("")
      setSelectedPeriodId("")
      setSelectedExamScheduleId("")
    }
  }, [selectedTypeId, types])

  const { data: contextOptions } = useQuery({
    queryKey: ["context-options", selectedSectionId, selectedTypeId],
    queryFn: () => attendanceApi.getContextOptions(selectedSectionId, selectedTypeId),
    enabled: !!selectedSectionId && !!selectedTypeId && (selectedType?.category === "period" || selectedType?.category === "exam"),
  })
  const options = (contextOptions as any)?.data?.options || (contextOptions as any)?.options || []

  const { data: enrollmentsData } = useQuery({
    queryKey: ["enrollments", selectedSectionId, activeAcademicYear?.id],
    queryFn: async () => {
      const filters: Record<string, string> = { sectionId: selectedSectionId }
      if (activeAcademicYear?.id) filters.academicYearId = activeAcademicYear.id
      const res = await enrollmentsApi.getEnrollments(filters)
      return ((res as any)?.data?.data || (res as any)?.data || []) as Enrollment[]
    },
    enabled: !!selectedSectionId && !!activeAcademicYear?.id,
  })

  const students = useMemo(() => {
    const all: any[] = ((studentsData as any)?.rows as any[]) || (Array.isArray(studentsData) ? (studentsData as any[]) : [])
    if (!selectedSectionId) return []

    const enrollments: Enrollment[] = Array.isArray(enrollmentsData) ? enrollmentsData : []
    const enrollmentByStudent = new Map(enrollments.map((e: any) => [e.studentId, e]))

    return all
      .filter((s: any) => s.sectionId === selectedSectionId)
      .map((s: any) => {
        const enrollment = enrollmentByStudent.get(s.id)
        return {
          id: s.id,
          enrollmentId: enrollment?.id || null,
          firstName: s.firstName,
          lastName: s.lastName,
          rollNumber: enrollment?.rollNumber || s.admissionNumber || "N/A",
          profilePhotoUrl: s.profilePhotoUrl || null,
        }
      })
      .sort((a, b) => {
        const aNum = parseInt(a.rollNumber, 10)
        const bNum = parseInt(b.rollNumber, 10)
        if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum
        return a.rollNumber.localeCompare(b.rollNumber, undefined, { numeric: true })
      })
  }, [studentsData, selectedSectionId, enrollmentsData])

  const currentStudent = students[currentIndex]
  const totalStudents = students.length
  const presentCount = Object.values(marks).filter((s) => s === "present").length
  const absentCount = Object.values(marks).filter((s) => s === "absent").length
  const markedCount = presentCount + absentCount
  const remainingCount = totalStudents - markedCount
  const completionPercent = totalStudents > 0 ? (markedCount / totalStudents) * 100 : 0
  const rosterStudents = useMemo(() => {
    const query = rosterSearch.trim().toLowerCase()

    return students
      .map((student, index) => ({ ...student, index }))
      .filter((student) => {
        const status = marks[student.id] || "unmarked"
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase()
        const matchesSearch = !query || fullName.includes(query) || String(student.rollNumber).toLowerCase().includes(query)
        const matchesStatus = rosterFilter === "all" || status === rosterFilter
        return matchesSearch && matchesStatus
      })
  }, [students, marks, rosterFilter, rosterSearch])

  const setMark = useCallback((status: "present" | "absent") => {
    if (!currentStudent) return
    setMarks((prev) => ({
      ...prev,
      [currentStudent.id]: status,
    }))
    if (currentIndex < totalStudents - 1) {
      setCurrentIndex((i) => i + 1)
    }
  }, [currentStudent?.id, currentIndex, totalStudents])

  const handleSubmit = async () => {
    if (submittingRef.current) return
    if (!activeAcademicYear || !selectedSectionId || !selectedTypeId) {
      toast.error("Please select section and attendance type")
      return
    }
    submittingRef.current = true
    setIsSubmitting(true)
    try {
      const payload: any = {
        academicYearId: activeAcademicYear.id,
        sectionId: selectedSectionId,
        attendanceTypeId: selectedTypeId,
        date: selectedDate,
        marks: Object.entries(marks)
          .map(([studentId, status]) => {
            const student = students.find((s) => s.id === studentId)
            return student?.enrollmentId ? { enrollmentId: student.enrollmentId, status } : null
          })
          .filter(Boolean),
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
      submittingRef.current = false
      setIsSubmitting(false)
    }
  }

  const getInitials = (firstName: string, lastName: string) =>
    `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase()

  const rosterPanel = (
    <>
      <div className="border-b border-border/60 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-2.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ListChecks className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">Attendance roster</p>
              <p className="text-xs text-muted-foreground">{totalStudents} students · quick review</p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
            onClick={() => setRosterOpen(false)}
            aria-label="Close attendance roster"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
        </div>

        <div className="relative mt-2.5">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={rosterSearch}
            onChange={(event) => setRosterSearch(event.target.value)}
            placeholder="Search name or roll..."
            className="h-8 bg-background/80 pl-9 text-xs"
          />
        </div>

        <div className="mt-2 grid grid-cols-4 gap-1 rounded-xl bg-muted/70 p-1">
          {([
            ["all", "All"],
            ["unmarked", "Left"],
            ["present", "Present"],
            ["absent", "Absent"],
          ] as const).map(([value, label]) => (
            <button
              type="button"
              key={value}
              onClick={() => setRosterFilter(value)}
              className={`rounded-lg px-1.5 py-1.5 text-[11px] font-medium transition-colors ${
                rosterFilter === value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ScrollArea className="h-[min(45vh,22rem)] lg:h-[21rem]">
        <div className="space-y-1 p-2">
          {rosterStudents.length === 0 ? (
            <div className="px-3 py-10 text-center">
              <p className="text-sm font-medium">No students found</p>
              <p className="mt-1 text-xs text-muted-foreground">Try another search or status.</p>
            </div>
          ) : (
            rosterStudents.map((student) => {
              const status = marks[student.id]
              const isCurrent = student.index === currentIndex

              return (
                <div
                  key={student.id}
                  className={`flex items-center gap-2 rounded-xl border p-1.5 transition-colors ${
                    isCurrent
                      ? "border-primary/35 bg-primary/10"
                      : "border-transparent bg-muted/30 hover:border-border hover:bg-muted/60"
                  }`}
                >
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    onClick={() => {
                      setCurrentIndex(student.index)
                      setRosterOpen(false)
                    }}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-background text-[10px] font-bold text-primary shadow-sm">
                      {getInitials(student.firstName, student.lastName)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-semibold">
                        {student.firstName} {student.lastName}
                      </span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        Roll {student.rollNumber || "N/A"}
                      </span>
                    </span>
                  </button>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      title="Mark absent"
                      aria-label={`Mark ${student.firstName} absent`}
                      onClick={() => setMarks((previous) => ({ ...previous, [student.id]: "absent" }))}
                      className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors ${
                        status === "absent"
                          ? "border-rose-500 bg-rose-500 text-white"
                          : "border-rose-200 bg-background text-rose-500 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950"
                      }`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Mark present"
                      aria-label={`Mark ${student.firstName} present`}
                      onClick={() => setMarks((previous) => ({ ...previous, [student.id]: "present" }))}
                      className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors ${
                        status === "present"
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-emerald-200 bg-background text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900 dark:hover:bg-emerald-950"
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </ScrollArea>
      <div className="border-t border-border/60 px-3 py-2 text-center text-[11px] text-muted-foreground">
        Select a student to review, or update attendance directly.
      </div>
    </>
  )

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex flex-col gap-3">
      <Card className="overflow-hidden border-border/70 bg-card/95 shadow-sm">
        <button
          type="button"
          onClick={() => setSetupOpen((open) => !open)}
          className="flex w-full items-center gap-3 border-b border-border/60 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-3 py-2.5 text-left sm:px-4"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Attendance setup</p>
            <p className="truncate text-[11px] text-muted-foreground">
              {setupOpen ? "Choose the class, type, and date" : "Tap to review or change selections"}
            </p>
          </div>
          {setupOpen
            ? <ChevronUp className="h-4 w-4 text-muted-foreground lg:hidden" />
            : <ChevronDown className="h-4 w-4 text-muted-foreground lg:hidden" />}
        </button>
        <CardContent
          className={`${setupOpen ? "block" : "hidden"} mx-auto w-full max-w-2xl p-3 sm:p-4 lg:block`}
        >
          <div className="[&>div]:space-y-3 [&_[data-slot=select-trigger]]:h-10 [&_[data-slot=select-trigger]]:w-full [&_label]:text-xs">
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
                setCurrentIndex(0)
                setMarks({})
              }}
            />
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 border-t border-border/60 pt-3">
            <div className="min-w-0">
              <label className="text-xs font-medium text-muted-foreground">Type</label>
              <Select
                value={selectedTypeId}
                disabled={typesLoading || types.length === 0}
                onValueChange={(value) => {
                  setSelectedTypeId(value)
                  setSelectedPeriodId("")
                  setSelectedExamScheduleId("")
                }}
              >
                <SelectTrigger className="mt-1 h-10 w-full">
                  <SelectValue
                    placeholder={typesLoading ? "Loading..." : types.length === 0 ? "No active types" : "Select type"}
                  />
                </SelectTrigger>
                <SelectContent position="popper" align="start" className="max-w-[calc(100vw-2rem)]">
                  {types.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name} ({ATTENDANCE_TYPE_CATEGORIES.find((item) => item.value === type.category)?.label || type.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-0">
              <label className="text-xs font-medium text-muted-foreground">Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="mt-1 h-10 w-full"
              />
            </div>
            {selectedType?.category === "period" && options.length > 0 && (
              <div className="min-w-0">
                <label className="text-xs font-medium text-muted-foreground">Period</label>
                <Select value={selectedPeriodId} onValueChange={setSelectedPeriodId}>
                  <SelectTrigger className="mt-1 h-10 w-full"><SelectValue placeholder="Select period" /></SelectTrigger>
                  <SelectContent>
                    {options.map((option: any) => <SelectItem key={option.id} value={option.id}>{option.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            {selectedType?.category === "exam" && options.length > 0 && (
              <div className="min-w-0">
                <label className="text-xs font-medium text-muted-foreground">Exam</label>
                <Select value={selectedExamScheduleId} onValueChange={setSelectedExamScheduleId}>
                  <SelectTrigger className="mt-1 h-10 w-full"><SelectValue placeholder="Select exam" /></SelectTrigger>
                  <SelectContent>
                    {options.map((option: any) => <SelectItem key={option.id} value={option.id}>{option.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {totalStudents === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center px-5 py-10 text-center sm:py-12">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
              <User className="h-6 w-6 text-muted-foreground/60" />
            </div>
            <p className="text-sm font-medium">Ready to take attendance</p>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              Select a course, grade, and section above to load students.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="order-1">
          <Card className="overflow-hidden border-border/70 shadow-sm">
            <div className="border-b border-border/60 bg-gradient-to-r from-primary/10 via-transparent to-violet-500/5 px-3 py-2.5 sm:px-4">
              <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                <span className="font-medium">Student {currentIndex + 1} of {totalStudents}</span>
                <span className="text-muted-foreground">{markedCount} marked · {remainingCount} left</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500"
                  animate={{ width: `${completionPercent}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStudent?.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/10 via-background to-violet-500/5 p-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 shadow-sm ring-1 ring-primary/15 sm:h-14 sm:w-14">
                      {currentStudent?.profilePhotoUrl ? (
                        <img
                          src={currentStudent.profilePhotoUrl}
                          alt={`${currentStudent.firstName} ${currentStudent.lastName}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-bold text-primary">
                          {currentStudent ? getInitials(currentStudent.firstName, currentStudent.lastName) : ""}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary/80">
                        Current student
                      </p>
                      <h3 className="truncate text-base font-semibold sm:text-lg">
                        {currentStudent?.firstName} {currentStudent?.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">Roll: {currentStudent?.rollNumber || "N/A"}</p>
                    </div>
                    {marks[currentStudent?.id] && (
                      <Badge
                        variant="outline"
                        className={
                          marks[currentStudent.id] === "present"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300"
                        }
                      >
                        {marks[currentStudent.id] === "present" ? "Present" : "Absent"}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setMark("absent")}
                      aria-pressed={marks[currentStudent?.id] === "absent"}
                      className={`flex h-12 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-all active:scale-[0.98] ${
                        marks[currentStudent?.id] === "absent"
                          ? "border-rose-500 bg-rose-500 text-white shadow-md shadow-rose-500/20"
                          : "border-rose-200 bg-rose-50/70 text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
                      }`}
                    >
                      <X className="h-5 w-5" />
                      Absent
                    </button>
                    <button
                      type="button"
                      onClick={() => setMark("present")}
                      aria-pressed={marks[currentStudent?.id] === "present"}
                      className={`flex h-12 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-all active:scale-[0.98] ${
                        marks[currentStudent?.id] === "present"
                          ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                          : "border-emerald-200 bg-emerald-50/70 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                      }`}
                    >
                      <Check className="h-5 w-5" />
                      Present
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={currentIndex === 0}
                      onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={currentIndex === totalStudents - 1}
                      onClick={() => setCurrentIndex((index) => Math.min(totalStudents - 1, index + 1))}
                    >
                      Next
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </motion.div>
            </AnimatePresence>

            <div className="border-t border-border/70">
              {!rosterOpen && (
                <button
                  type="button"
                  onClick={() => setRosterOpen(true)}
                  className="flex w-full items-center justify-between bg-gradient-to-r from-primary/5 via-background to-violet-500/5 px-3 py-3 text-left transition-colors hover:bg-muted/40 lg:hidden"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <ListChecks className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">Review attendance roster</span>
                      <span className="block text-xs text-muted-foreground">
                        {markedCount} marked · {remainingCount} left
                      </span>
                    </span>
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              )}

              {rosterOpen && <div className="lg:hidden">{rosterPanel}</div>}
              <div className="hidden lg:block">
                {rosterPanel}
              </div>
            </div>
          </Card>
          </div>

          <Card className="order-4 sticky bottom-2 z-20 border-border/80 bg-card/95 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/85">
            <CardContent className="flex items-center gap-2 p-2.5 sm:justify-between sm:gap-4">
              <div className="grid min-w-0 flex-1 grid-cols-3 gap-1.5 text-center text-[11px] sm:flex sm:flex-none sm:gap-3 sm:text-sm">
                <div className="rounded-lg bg-emerald-50 px-1.5 py-2 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 sm:px-2">
                  <span className="font-bold">{presentCount}</span><span className="ml-1 min-[430px]:hidden">P</span><span className="ml-1 hidden min-[430px]:inline">Present</span>
                </div>
                <div className="rounded-lg bg-rose-50 px-1.5 py-2 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 sm:px-2">
                  <span className="font-bold">{absentCount}</span><span className="ml-1 min-[430px]:hidden">A</span><span className="ml-1 hidden min-[430px]:inline">Absent</span>
                </div>
                <div className="rounded-lg bg-muted px-1.5 py-2 text-muted-foreground sm:px-2">
                  <span className="font-bold text-foreground">{remainingCount}</span><span className="ml-1 min-[430px]:hidden">L</span><span className="ml-1 hidden min-[430px]:inline">Left</span>
                </div>
              </div>
              <Button
                className="h-10 shrink-0 px-3 shadow-sm sm:px-4"
                onClick={handleSubmit}
                disabled={isSubmitting || totalStudents === 0}
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                <span className="sm:hidden">Save</span>
                <span className="hidden sm:inline">Save attendance</span>
              </Button>
            </CardContent>
          </Card>
        </>
      )}
      </div>
    </div>
  )
}
