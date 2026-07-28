"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Clock3,
  Copy,
  FileText,
  Loader2,
  Plus,
  Target,
  Trash2,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePickerInput } from "@/components/ui/date-picker"
import { TimePickerInput } from "@/components/ui/time-picker"
import { useExams, useCreateExamSchedule } from "@/hooks/use-exams"
import { useCourses } from "@/hooks/use-courses"
import { useGrades } from "@/hooks/use-grades"
import { useSections } from "@/hooks/use-sections"
import { useSectionSubjects } from "@/hooks/use-section-subjects"
import { useTeachers } from "@/hooks/use-teachers"
import { RoomSelectorDialog } from "@/components/shared/room-selector-dialog"
import { toast } from "@/components/ui/sonner"
import Link from "next/link"
import type { Exam } from "@/lib/api/exams"

interface PaperRow {
  id: string
  sectionSubjectId: string
  examDate: string
  startTime: string
  endTime: string
  durationMinutes: string
  maxMarks: string
  passMarks: string
  roomId: string
  roomDisplay: string
  inChargeId: string
}

/**
 * Calculate duration in minutes between two time strings (HH:mm)
 */
function calculateDuration(startTime: string, endTime: string): string {
  if (!startTime || !endTime) return ""

  const [startH, startM] = startTime.split(":").map(Number)
  const [endH, endM] = endTime.split(":").map(Number)

  if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) return ""

  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM

  if (endMinutes <= startMinutes) return ""

  return String(endMinutes - startMinutes)
}

function parseDateValue(value: string): Date | undefined {
  if (!value) return undefined
  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) return undefined
  return new Date(year, month - 1, day)
}

function toDateValue(date: Date | null): string {
  if (!date) return ""
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function CreateSchedulePage() {
  const router = useRouter()
  const createSchedule = useCreateExamSchedule()

  // Step 1: Selection - Course > Grade > Section
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [selectedCourseId, setSelectedCourseId] = useState<string>("")
  const [selectedGradeId, setSelectedGradeId] = useState<string>("")
  const [selectedSectionId, setSelectedSectionId] = useState<string>("")

  // Schedule metadata
  const [scheduleName, setScheduleName] = useState("")
  const [scheduleDescription, setScheduleDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Paper rows
  const [paperRows, setPaperRows] = useState<PaperRow[]>([])

  // Data
  const { data: examsData } = useExams()
  const { data: coursesData } = useCourses()
  const { data: gradesData } = useGrades(selectedCourseId)
  const { data: sections } = useSections(selectedGradeId, selectedCourseId)
  const { data: teachers } = useTeachers()

  const exams: Exam[] = examsData || []
  const courses: any[] = (coursesData as any)?.data?.rows || (coursesData as any)?.rows || []
  const grades: any[] = (gradesData as any)?.rows || (gradesData as any) || []
  const sectionsList: any[] = (sections as any)?.data?.rows || (sections as any)?.rows || []

  const sectionSubjects = useSectionSubjects(
    selectedSectionId ? { sectionId: selectedSectionId } : undefined
  )
  const sectionSubjectsData = sectionSubjects.data || []

  // Determine if we're creating a custom exam or using an admin-released one
  const isCustomExam = selectedOption === "__custom__"
  const selectedExam = !isCustomExam && selectedOption
    ? exams.find((e) => e.id === selectedOption)
    : null

  // When an admin exam is selected, auto-fill metadata
  useEffect(() => {
    if (selectedExam) {
      setScheduleName(selectedExam.name + " Schedule")
      setStartDate(selectedExam.startDate?.split("T")[0] || "")
      setEndDate(selectedExam.endDate?.split("T")[0] || "")
    }
  }, [selectedExam])

  // When section changes, pre-populate paper rows with section subjects
  useEffect(() => {
    if (selectedSectionId && sectionSubjectsData.length > 0) {
      const existingSubjectIds = paperRows.map((r) => r.sectionSubjectId)
      const newRows: PaperRow[] = []

      sectionSubjectsData.forEach((ss: any) => {
        if (!existingSubjectIds.includes(ss.id)) {
          newRows.push({
            id: crypto.randomUUID(),
            sectionSubjectId: ss.id,
            examDate: "",
            startTime: "",
            endTime: "",
            durationMinutes: "",
            maxMarks: "",
            passMarks: "",
            roomId: "",
            roomDisplay: "",
            inChargeId: "",
          })
        }
      })

      if (newRows.length > 0) {
        setPaperRows((prev) => [...prev, ...newRows])
      }
    }
  }, [selectedSectionId, sectionSubjectsData])

  // Reset grade when course changes
  useEffect(() => {
    setSelectedGradeId("")
    setSelectedSectionId("")
    setPaperRows([])
  }, [selectedCourseId])

  // Reset section when grade changes
  useEffect(() => {
    setSelectedSectionId("")
    setPaperRows([])
  }, [selectedGradeId])

  const handleAddRow = () => {
    if (!selectedSectionId) {
      toast.error("Please select a section first")
      return
    }
    setPaperRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sectionSubjectId: "",
        examDate: "",
        startTime: "",
        endTime: "",
        durationMinutes: "",
        maxMarks: "",
        passMarks: "",
        roomId: "",
        roomDisplay: "",
        inChargeId: "",
      },
    ])
  }

  const handleRemoveRow = (rowId: string) => {
    setPaperRows((prev) => prev.filter((r) => r.id !== rowId))
  }

  const handleRowChange = (rowId: string, field: keyof PaperRow, value: string) => {
    setPaperRows((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r

        const updated = { ...r, [field]: value }

        // Auto-calculate duration when startTime or endTime changes
        if (field === "startTime" || field === "endTime") {
          updated.durationMinutes = calculateDuration(
            field === "startTime" ? value : r.startTime,
            field === "endTime" ? value : r.endTime
          )
        }

        return updated
      })
    )
  }

  const handleRoomSelect = (rowId: string, info: { roomId: string; display: string }) => {
    setPaperRows((prev) =>
      prev.map((r) =>
        r.id === rowId ? { ...r, roomId: info.roomId, roomDisplay: info.display } : r
      )
    )
  }

  const handleCopyFromAbove = (rowIndex: number) => {
    if (rowIndex < 1) return

    setPaperRows((previousRows) => {
      const source = previousRows[rowIndex - 1]
      if (!source) return previousRows

      return previousRows.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              examDate: source.examDate,
              startTime: source.startTime,
              endTime: source.endTime,
              durationMinutes: source.durationMinutes,
              roomId: source.roomId,
              roomDisplay: source.roomDisplay,
            }
          : row
      )
    })

    toast.success("Date, time, and classroom copied from the row above")
  }

  const handleSubmit = async () => {
    // Validate
    if (!selectedSectionId) {
      toast.error("Please select a section")
      return
    }
    if (!scheduleName) {
      toast.error("Schedule name is required")
      return
    }
    if (!startDate || !endDate) {
      toast.error("Start and end dates are required")
      return
    }

    // Validate paper rows
    const validPapers = paperRows.filter((r) => r.sectionSubjectId && r.examDate)
    if (validPapers.length === 0) {
      toast.error("Please add at least one subject paper with a date")
      return
    }

    try {
      await createSchedule.mutateAsync({
        examId: isCustomExam ? undefined : selectedOption || undefined,
        sectionId: selectedSectionId,
        name: scheduleName,
        description: scheduleDescription || undefined,
        startDate,
        endDate,
        papers: validPapers.map((p) => ({
          sectionSubjectId: p.sectionSubjectId,
          examDate: p.examDate,
          startTime: p.startTime || "",
          endTime: p.endTime || "",
          durationMinutes: p.durationMinutes ? Number.parseInt(p.durationMinutes) : undefined,
          room: p.roomId || undefined,
          inChargeId: p.inChargeId || undefined,
          maxMarks: p.maxMarks ? Number.parseInt(p.maxMarks) : undefined,
          passMarks: p.passMarks ? Number.parseInt(p.passMarks) : undefined,
        })),
      })
      toast.success("Schedule created successfully!")
      router.push("/exams")
    } catch (error) {
      // Error handled by mutation
    }
  }

  const adminExams = exams.filter((e) => e.source === "admin" && e.status !== "cancelled")

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Breadcrumbs
        items={[
          { label: "Exams", href: "/exams" },
          { label: "Exam Schedules", href: "/exams/schedules" },
          { label: "Create Schedule" },
        ]}
      />
      <PageHeader
        title="Create Exam Schedule"
        description="Plan subject dates, times, rooms, and invigilators for a section"
      >
        <Button variant="outline" size="sm" asChild>
          <Link href="/exams">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Exams
          </Link>
        </Button>
      </PageHeader>

      <div className="max-w-[1500px] space-y-4">
        <div className="grid items-stretch gap-4 xl:grid-cols-2">
          <Card className="h-full gap-0 overflow-hidden border-border/70 py-0 shadow-sm">
            <div className="h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <CardHeader className="border-b border-border/60 bg-gradient-to-r from-blue-50/70 to-transparent px-5 py-4 dark:from-blue-950/20">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 ring-1 ring-blue-200/70 dark:from-blue-950/70 dark:to-indigo-950/60 dark:text-blue-400">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base">Exam & Class</CardTitle>
                  <CardDescription className="mt-0.5 text-xs">Choose the exam and target section.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 px-5 py-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Exam <span className="text-destructive">*</span></Label>
                <Select value={selectedOption} onValueChange={setSelectedOption}>
                  <SelectTrigger><SelectValue placeholder="Select exam" /></SelectTrigger>
                  <SelectContent>
                    {adminExams.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Admin-released
                        </div>
                        {adminExams.map((exam) => (
                          <SelectItem key={exam.id} value={exam.id}>
                            {exam.name} ({exam.examType})
                          </SelectItem>
                        ))}
                      </>
                    )}
                    <div className="mt-1 border-t px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Custom
                    </div>
                    <SelectItem value="__custom__">Custom Exam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Course <span className="text-destructive">*</span></Label>
                <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                  <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                  <SelectContent>
                    {courses.map((course: any) => (
                      <SelectItem key={course.id} value={course.id}>{course.courseName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Grade <span className="text-destructive">*</span></Label>
                <Select value={selectedGradeId} onValueChange={setSelectedGradeId} disabled={!selectedCourseId}>
                  <SelectTrigger>
                    <SelectValue placeholder={selectedCourseId ? "Select grade" : "Select course first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade: any) => (
                      <SelectItem key={grade.id} value={grade.id}>{grade.gradeName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Section <span className="text-destructive">*</span></Label>
                <Select value={selectedSectionId} onValueChange={setSelectedSectionId} disabled={!selectedGradeId}>
                  <SelectTrigger>
                    <SelectValue placeholder={selectedGradeId ? "Select section" : "Select grade first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {sectionsList.map((section: any) => (
                      <SelectItem key={section.id} value={section.id}>{section.sectionName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="h-full gap-0 overflow-hidden border-border/70 py-0 shadow-sm">
            <div className="h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
            <CardHeader className="border-b border-border/60 bg-gradient-to-r from-violet-50/70 to-transparent px-5 py-4 dark:from-violet-950/20">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-600 ring-1 ring-violet-200/70 dark:from-violet-950/70 dark:to-fuchsia-950/60 dark:text-violet-400">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base">Schedule Details</CardTitle>
                  <CardDescription className="mt-0.5 text-xs">Name and define the schedule period.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 px-5 py-4">
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
                <div className="space-y-1.5">
                  <Label className="text-xs">Schedule Name <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="e.g., Quarterly 2026 – Section A"
                    value={scheduleName}
                    onChange={(event) => setScheduleName(event.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <Label className="text-xs">Description</Label>
                    <span className="text-[10px] text-muted-foreground">Optional</span>
                  </div>
                  <Textarea
                    rows={1}
                    placeholder="Short note"
                    value={scheduleDescription}
                    onChange={(event) => setScheduleDescription(event.target.value)}
                    className="min-h-9 resize-none py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Start Date <span className="text-destructive">*</span></Label>
                  <DatePickerInput
                    value={parseDateValue(startDate)}
                    onChange={(date) => setStartDate(toDateValue(date))}
                    maxDate={parseDateValue(endDate)}
                    placeholder="Select start date"
                    buttonClassName="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">End Date <span className="text-destructive">*</span></Label>
                  <DatePickerInput
                    value={parseDateValue(endDate)}
                    onChange={(date) => setEndDate(toDateValue(date))}
                    minDate={parseDateValue(startDate)}
                    placeholder="Select end date"
                    buttonClassName="h-9 text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="gap-0 overflow-hidden border-border/70 py-0 shadow-sm">
          <div className="h-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
          <CardHeader
            className="flex-row items-center justify-between gap-3 border-b border-border/60 bg-gradient-to-r from-emerald-50/60 to-transparent px-5 py-4 dark:from-emerald-950/20"
            style={{ display: "flex" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-cyan-100 text-emerald-600 ring-1 ring-emerald-200/70 dark:from-emerald-950/70 dark:to-cyan-950/60 dark:text-emerald-400">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base">Subject Schedule</CardTitle>
                <CardDescription className="mt-0.5 text-xs">
                  Add a date, time, room, and invigilator for each paper.
                </CardDescription>
              </div>
            </div>
            {selectedSectionId && (
              <Button type="button" variant="outline" size="sm" onClick={handleAddRow} className="h-8 shrink-0">
                <Plus className="mr-1 h-3.5 w-3.5" />
                Add subject
              </Button>
            )}
          </CardHeader>
          <CardContent className="px-5 py-4">
            {!selectedSectionId ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-8 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Target className="h-4 w-4" />
                </div>
                <p className="mt-2 text-sm font-medium">Select a class to begin</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Choose the course, grade, and section above to load its subjects.
                </p>
              </div>
            ) : paperRows.length === 0 ? (
              <button
                type="button"
                onClick={handleAddRow}
                className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-border py-7 text-center transition-colors hover:border-primary/40 hover:bg-primary/[0.025]"
              >
                <Plus className="h-5 w-5 text-muted-foreground" />
                <span className="mt-2 text-sm font-medium">Add the first subject</span>
              </button>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border/60 bg-muted/10">
                <div className="space-y-1.5 p-2" style={{ minWidth: 1330 }}>
                  <div
                    className="grid items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
                    style={{
                      gridTemplateColumns:
                        "170px 150px 125px 125px 75px 75px 75px minmax(170px, 1fr) 170px 126px",
                    }}
                  >
                    <span>Subject</span>
                    <span>Date</span>
                    <span>From</span>
                    <span>To</span>
                    <span>Duration</span>
                    <span>Max</span>
                    <span>Pass</span>
                    <span>Classroom</span>
                    <span>In-charge</span>
                    <span className="text-right">Actions</span>
                  </div>
                  {paperRows.map((row, rowIndex) => (
                    <div
                      key={row.id}
                      className="grid items-center gap-2 rounded-lg border border-border/60 bg-background p-2.5 shadow-xs transition-all hover:border-primary/20 hover:shadow-sm"
                      style={{
                        gridTemplateColumns:
                          "170px 150px 125px 125px 75px 75px 75px minmax(170px, 1fr) 170px 126px",
                      }}
                    >
                      <Select
                        value={row.sectionSubjectId}
                        onValueChange={(value) => handleRowChange(row.id, "sectionSubjectId", value)}
                      >
                        <SelectTrigger className="h-9"><SelectValue placeholder="Subject" /></SelectTrigger>
                        <SelectContent>
                          {sectionSubjectsData.map((subject: any) => (
                            <SelectItem key={subject.id} value={subject.id}>
                              {subject.subject?.subjectName || "Unknown"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <DatePickerInput
                        value={parseDateValue(row.examDate)}
                        onChange={(date) => handleRowChange(row.id, "examDate", toDateValue(date))}
                        minDate={parseDateValue(startDate)}
                        maxDate={parseDateValue(endDate)}
                        placeholder="Exam date"
                        buttonClassName="h-9 px-2 text-xs"
                      />
                      <TimePickerInput
                        value={row.startTime}
                        onChange={(value) => handleRowChange(row.id, "startTime", value)}
                        placeholder="Start time"
                        className="px-2 text-xs"
                      />
                      <TimePickerInput
                        value={row.endTime}
                        onChange={(value) => handleRowChange(row.id, "endTime", value)}
                        placeholder="End time"
                        className="px-2 text-xs"
                      />
                      <div
                        className="flex h-9 items-center justify-center rounded-md border border-input bg-muted/40 text-xs text-muted-foreground"
                        title="Calculated automatically"
                      >
                        {row.durationMinutes ? `${row.durationMinutes}m` : "—"}
                      </div>
                      <Input
                        type="number"
                        aria-label="Maximum marks"
                        placeholder="100"
                        value={row.maxMarks}
                        onChange={(event) => handleRowChange(row.id, "maxMarks", event.target.value)}
                        className="h-9 px-2"
                        min={1}
                      />
                      <Input
                        type="number"
                        aria-label="Pass marks"
                        placeholder="35"
                        value={row.passMarks}
                        onChange={(event) => handleRowChange(row.id, "passMarks", event.target.value)}
                        className="h-9 px-2"
                        min={1}
                      />
                      <RoomSelectorDialog
                        selectedRoomId={row.roomId}
                        onRoomSelect={(info) => handleRoomSelect(row.id, info)}
                        triggerLabel={row.roomDisplay || "Select classroom"}
                        triggerClassName="h-9"
                      />
                      <Select
                        value={row.inChargeId}
                        onValueChange={(value) => handleRowChange(row.id, "inChargeId", value)}
                      >
                        <SelectTrigger className="h-9"><SelectValue placeholder="Select teacher" /></SelectTrigger>
                        <SelectContent>
                          {(teachers || []).map((teacher: any) => (
                            <SelectItem key={teacher.id} value={teacher.id}>{teacher.fullName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={rowIndex === 0}
                          onClick={() => handleCopyFromAbove(rowIndex)}
                          className="h-8 px-2 text-[10px] text-muted-foreground hover:text-primary"
                          title={rowIndex === 0 ? "No row above" : "Copy date, time, and classroom from above"}
                          aria-label="Copy date, time, and classroom from above"
                        >
                          <Copy className="mr-1 h-3.5 w-3.5" />
                          Copy above
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveRow(row.id)}
                          className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          aria-label="Remove subject row"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-1.5 px-1 py-1 text-[10px] text-muted-foreground">
                    <Copy className="h-3 w-3" />
                    Use the copy action to reuse the previous row&apos;s date, time, and classroom.
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/80 px-4 py-3 shadow-sm">
          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <Clock3 className="h-3.5 w-3.5" />
            Duration is calculated automatically from the selected times.
          </div>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/exams">Cancel</Link>
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={createSchedule.isPending}>
              {createSchedule.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Schedule
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
