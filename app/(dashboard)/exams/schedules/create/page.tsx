"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Calendar, Plus, Trash2, Loader2, ArrowLeft, BookOpen, FileText } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/exams">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Exams
          </Link>
        </Button>
      </div>

      <PageHeader
        title="Create Exam Schedule"
        description="Schedule subject-wise exam dates, times, rooms, and invigilators for a section"
      />

      {/* Step 1: Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Step 1: Select Exam, Course, Grade & Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Exam <span className="text-destructive">*</span>
              </Label>
              <Select value={selectedOption} onValueChange={setSelectedOption}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an exam or create custom" />
                </SelectTrigger>
                <SelectContent>
                  {adminExams.length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Admin-Released Exams
                      </div>
                      {adminExams.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id}>
                          {exam.name} ({exam.examType})
                        </SelectItem>
                      ))}
                    </>
                  )}
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-t mt-1 pt-1">
                    Custom
                  </div>
                  <SelectItem value="__custom__">Custom Exam</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Course <span className="text-destructive">*</span>
              </Label>
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course: any) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.courseName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Grade <span className="text-destructive">*</span>
              </Label>
              <Select
                value={selectedGradeId}
                onValueChange={setSelectedGradeId}
                disabled={!selectedCourseId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedCourseId ? "Select grade" : "Select a course first"} />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade: any) => (
                    <SelectItem key={grade.id} value={grade.id}>
                      {grade.gradeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Section <span className="text-destructive">*</span>
              </Label>
              <Select
                value={selectedSectionId}
                onValueChange={setSelectedSectionId}
                disabled={!selectedGradeId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedGradeId ? "Select section" : "Select a grade first"} />
                </SelectTrigger>
                <SelectContent>
                  {sectionsList.map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.sectionName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Schedule Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <Label>
                Schedule Name <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="e.g., Quarterly 2026 - Section A"
                value={scheduleName}
                onChange={(e) => setScheduleName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Optional description"
                value={scheduleDescription}
                onChange={(e) => setScheduleDescription(e.target.value)}
                className="min-h-[38px]"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Start Date <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>
                End Date <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Scheduling Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Step 2: Subject Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedSectionId ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Select a course, grade, and section above to see available subjects.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto mb-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-3 text-sm font-medium text-muted-foreground w-[180px]">Subject</th>
                      <th className="text-left py-3 px-3 text-sm font-medium text-muted-foreground w-[130px]">Date</th>
                      <th className="text-left py-3 px-3 text-sm font-medium text-muted-foreground w-[100px]">From</th>
                      <th className="text-left py-3 px-3 text-sm font-medium text-muted-foreground w-[100px]">To</th>
                      <th className="text-left py-3 px-3 text-sm font-medium text-muted-foreground w-[90px]">Duration</th>
                      <th className="text-left py-3 px-3 text-sm font-medium text-muted-foreground w-[90px]">Max Marks</th>
                      <th className="text-left py-3 px-3 text-sm font-medium text-muted-foreground w-[90px]">Pass Marks</th>
                      <th className="text-left py-3 px-3 text-sm font-medium text-muted-foreground w-[180px]">Classroom</th>
                      <th className="text-left py-3 px-3 text-sm font-medium text-muted-foreground w-[160px]">In-Charge</th>
                      <th className="text-right py-3 px-3 text-sm font-medium text-muted-foreground w-[50px]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paperRows.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="text-center py-8 text-muted-foreground">
                          <p>No subjects added yet. Click "Add Subject Row" to begin.</p>
                        </td>
                      </tr>
                    ) : (
                      paperRows.map((row) => (
                        <tr key={row.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="py-2 px-3">
                            <Select
                              value={row.sectionSubjectId}
                              onValueChange={(value) => handleRowChange(row.id, "sectionSubjectId", value)}
                            >
                              <SelectTrigger className="h-8 w-full">
                                <SelectValue placeholder="Select subject" />
                              </SelectTrigger>
                              <SelectContent>
                                {sectionSubjectsData.map((ss: any) => (
                                  <SelectItem key={ss.id} value={ss.id}>
                                    {ss.subject?.subjectName || "Unknown"}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-2 px-3">
                            <Input
                              type="date"
                              value={row.examDate}
                              onChange={(e) => handleRowChange(row.id, "examDate", e.target.value)}
                              className="h-8 w-full"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <Input
                              type="time"
                              value={row.startTime}
                              onChange={(e) => handleRowChange(row.id, "startTime", e.target.value)}
                              className="h-8 w-full"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <Input
                              type="time"
                              value={row.endTime}
                              onChange={(e) => handleRowChange(row.id, "endTime", e.target.value)}
                              className="h-8 w-full"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <Input
                              type="number"
                              placeholder="Min"
                              value={row.durationMinutes}
                              readOnly
                              className="h-8 w-full bg-muted/50 cursor-not-allowed"
                              tabIndex={-1}
                            />
                          </td>
                          <td className="py-2 px-3">
                            <Input
                              type="number"
                              placeholder="e.g. 100"
                              value={row.maxMarks}
                              onChange={(e) => handleRowChange(row.id, "maxMarks", e.target.value)}
                              className="h-8 w-full"
                              min={1}
                            />
                          </td>
                          <td className="py-2 px-3">
                            <Input
                              type="number"
                              placeholder="e.g. 35"
                              value={row.passMarks}
                              onChange={(e) => handleRowChange(row.id, "passMarks", e.target.value)}
                              className="h-8 w-full"
                              min={1}
                            />
                          </td>
                          <td className="py-2 px-3">
                            <RoomSelectorDialog
                              selectedRoomId={row.roomId}
                              onRoomSelect={(info) => handleRoomSelect(row.id, info)}
                              triggerLabel={row.roomId ? row.roomDisplay : "Select Room"}
                            />
                          </td>
                          <td className="py-2 px-3">
                            <Select
                              value={row.inChargeId}
                              onValueChange={(value) => handleRowChange(row.id, "inChargeId", value)}
                            >
                              <SelectTrigger className="h-8 w-full">
                                <SelectValue placeholder="Select teacher" />
                              </SelectTrigger>
                              <SelectContent>
                                {(teachers || []).map((teacher: any) => (
                                  <SelectItem key={teacher.id} value={teacher.id}>
                                    {teacher.fullName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveRow(row.id)}
                              className="text-destructive hover:text-destructive h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <Button variant="outline" size="sm" onClick={handleAddRow} className="mb-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Subject Row
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" asChild>
          <Link href="/exams">Cancel</Link>
        </Button>
        <Button onClick={handleSubmit} disabled={createSchedule.isPending}>
          {createSchedule.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Schedule
        </Button>
      </div>
    </motion.div>
  )
}
