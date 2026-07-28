"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  GraduationCap,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePickerInput } from "@/components/ui/date-picker"
import { useExam, useUpdateExam } from "@/hooks/use-exams"
import { useCourses } from "@/hooks/use-courses"
import { useGrades } from "@/hooks/use-grades"
import { useSections } from "@/hooks/use-sections"
import { MultiSelect } from "@/components/ui/multi-select"
import { toast } from "@/components/ui/sonner"
import type { UpdateExamRequest, ExamType, ExamStatus, TargetAudienceRow } from "@/lib/api/exams"
import Link from "next/link"

const examTypes: { value: ExamType; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "half_yearly", label: "Half-Yearly" },
  { value: "annually", label: "Annually" },
]

const statusOptions: { value: ExamStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
]

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

export default function EditExamPage() {
  const router = useRouter()
  const params = useParams()
  const examId = params.examId as string

  const { data: examData, isLoading: isLoadingExam } = useExam(examId)
  const updateExam = useUpdateExam()

  const { data: coursesData } = useCourses()
  const { data: gradesData, isLoading: isLoadingGrades } = useGrades()
  const { data: sectionsData, isLoading: isLoadingSections } = useSections()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [examType, setExamType] = useState<ExamType>("quarterly")
  const [status, setStatus] = useState<ExamStatus>("draft")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isCommon, setIsCommon] = useState(false)
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([])
  const [audienceRows, setAudienceRows] = useState<TargetAudienceRow[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const initializedExamIdRef = useRef<string | null>(null)

  const exam = (examData as any)?.data || examData

  const courses = useMemo(
    () => (coursesData as any)?.data?.rows || (coursesData as any)?.rows || [],
    [coursesData]
  )
  const grades = useMemo(() => (gradesData as any)?.rows || [], [gradesData])
  const sections = useMemo(
    () => (sectionsData as any)?.data?.rows || (sectionsData as any)?.rows || [],
    [sectionsData]
  )

  // Populate form when exam data loads
  useEffect(() => {
    if (
      exam &&
      !isLoadingGrades &&
      !isLoadingSections &&
      initializedExamIdRef.current !== exam.id
    ) {
      initializedExamIdRef.current = exam.id
      setName(exam.name)
      setDescription(exam.description || "")
      setExamType(exam.examType)
      setStatus(exam.status)
      setStartDate(exam.startDate?.split("T")[0] || "")
      setEndDate(exam.endDate?.split("T")[0] || "")

      // Determine if it was a common exam or table-based
      const targetGradeIds = exam.targetGrades?.map((tg: any) => tg.grade.id) || []
      const targetSectionIds = exam.targetSections?.map((ts: any) => ts.section.id) || []

      if (targetGradeIds.length > 0) {
        // Try to determine if common: check if all grades belong to a few courses
        const gradeCourseMap = new Map<string, string>()
        grades.forEach((g: any) => {
          gradeCourseMap.set(g.id, g.courseId)
        })

        const uniqueCourseIds = [...new Set(targetGradeIds.map((gid: string) => gradeCourseMap.get(gid)).filter(Boolean))]

        if (uniqueCourseIds.length <= 3 && targetSectionIds.length > 0) {
          // Likely common mode - check if sections cover all sections for those grades
          const sectionsForGrades = sections.filter((s: any) => targetGradeIds.includes(s.gradeId))
          const allSectionsCovered = sectionsForGrades.every((s: any) => targetSectionIds.includes(s.id))

          if (allSectionsCovered && uniqueCourseIds.length > 0) {
            setIsCommon(true)
            setSelectedCourseIds(uniqueCourseIds as string[])
            return
          }
        }

        // Table mode: build rows from target data
        setIsCommon(false)
        const rows: TargetAudienceRow[] = []
        const processedGrades = new Set<string>()

        targetGradeIds.forEach((gradeId: string) => {
          if (processedGrades.has(gradeId)) return
          processedGrades.add(gradeId)

          const grade = grades.find((g: any) => g.id === gradeId)
          const courseId = grade?.courseId || ""

          const sectionIdsForGrade = targetSectionIds.filter((sid: string) => {
            const section = sections.find((s: any) => s.id === sid)
            return section?.gradeId === gradeId
          })

          rows.push({
            courseId,
            gradeId,
            sectionIds: sectionIdsForGrade,
          })
        })

        setAudienceRows(rows)
      } else {
        setIsCommon(false)
        setSelectedCourseIds([])
        setAudienceRows([])
      }
    }
  }, [exam, grades, sections, isLoadingGrades, isLoadingSections])

  // Filter grades by selected course for each row
  const getGradesByCourse = (courseId: string) => {
    return grades.filter((g: any) => g.courseId === courseId)
  }

  // Filter sections by selected grade
  const getSectionsByGrade = (gradeId: string) => {
    return sections.filter((s: any) => s.gradeId === gradeId)
  }

  const addRow = () => {
    setAudienceRows([...audienceRows, { courseId: "", gradeId: "", sectionIds: [] }])
  }

  const removeRow = (index: number) => {
    setAudienceRows(audienceRows.filter((_, i) => i !== index))
  }

  const updateRow = (index: number, field: keyof TargetAudienceRow, value: any) => {
    const updated = [...audienceRows]
    if (field === "courseId") {
      updated[index] = { courseId: value, gradeId: "", sectionIds: [] }
    } else if (field === "gradeId") {
      updated[index] = { ...updated[index], gradeId: value, sectionIds: [] }
    } else {
      updated[index] = { ...updated[index], [field]: value }
    }
    setAudienceRows(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !startDate || !endDate) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const payload: UpdateExamRequest = {
        name,
        description: description || undefined,
        examType,
        status,
        startDate,
        endDate,
        isCommon,
      }

      if (isCommon) {
        payload.targetCourseIds = selectedCourseIds
      } else {
        const validRows = audienceRows.filter((r) => r.courseId && r.gradeId)
        if (validRows.length > 0) {
          payload.targetAudienceRows = validRows
        }
      }

      await updateExam.mutateAsync({ id: examId, data: payload })
      toast.success("Exam updated successfully")
      router.push("/exams")
    } catch (error) {
      // Error handled by mutation
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingExam) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!exam) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Exam not found</p>
        <Button variant="outline" asChild className="mt-4">
          <Link href="/exams">Back to Exams</Link>
        </Button>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Breadcrumbs items={[{ label: "Exams", href: "/exams" }, { label: "Edit Exam" }]} />
      <PageHeader title={`Edit ${exam.name}`} description="Update exam details and target audience">
        <Button variant="outline" size="sm" asChild>
          <Link href="/exams">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Exams
          </Link>
        </Button>
      </PageHeader>

      <form onSubmit={handleSubmit} className="max-w-6xl space-y-4">
        <div className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
          <Card className="h-full gap-0 overflow-hidden border-border/70 py-0 shadow-sm">
            <div className="h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <CardHeader className="border-b border-border/60 bg-gradient-to-r from-blue-50/70 to-transparent px-5 py-4 dark:from-blue-950/20">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 ring-1 ring-blue-200/70 dark:from-blue-950/70 dark:to-indigo-950/60 dark:text-blue-400">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base">Exam Information</CardTitle>
                  <CardDescription className="mt-0.5 text-xs">Update the exam name and description.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 px-5 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs">
                  Exam Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Quarterly Examination 2026"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="description" className="text-xs">Description</Label>
                  <span className="text-[10px] text-muted-foreground">Optional</span>
                </div>
                <Textarea
                  id="description"
                  rows={3}
                  placeholder="Add a short note about this exam"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="min-h-[82px] resize-none"
                />
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
                  <CardTitle className="text-base">Exam Settings</CardTitle>
                  <CardDescription className="mt-0.5 text-xs">Type, status, and examination period.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3.5 px-5 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="examType" className="text-xs">
                    Exam Type <span className="text-destructive">*</span>
                  </Label>
                  <Select value={examType} onValueChange={(value) => setExamType(value as ExamType)}>
                    <SelectTrigger id="examType" className="w-full">
                      <SelectValue placeholder="Select exam type" />
                    </SelectTrigger>
                    <SelectContent>
                      {examTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="status" className="text-xs">Status</Label>
                  <Select value={status} onValueChange={(value) => setStatus(value as ExamStatus)}>
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">From <span className="text-destructive">*</span></Label>
                  <DatePickerInput
                    value={parseDateValue(startDate)}
                    onChange={(date) => setStartDate(toDateValue(date))}
                    maxDate={parseDateValue(endDate)}
                    placeholder="Select start date"
                    buttonClassName="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">To <span className="text-destructive">*</span></Label>
                  <DatePickerInput
                    value={parseDateValue(endDate)}
                    onChange={(date) => setEndDate(toDateValue(date))}
                    minDate={parseDateValue(startDate)}
                    placeholder="Select end date"
                    buttonClassName="h-9 text-xs"
                  />
                </div>
              </div>
              {exam.academicYear?.name && (
                <div className="rounded-lg border border-border/60 bg-muted/25 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Academic Year</p>
                  <p className="mt-0.5 text-xs font-medium">{exam.academicYear.name}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="gap-0 overflow-hidden border-border/70 py-0 shadow-sm">
          <div className="h-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
          <CardHeader className="border-b border-border/60 bg-gradient-to-r from-emerald-50/60 to-transparent px-5 py-4 dark:from-emerald-950/20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-cyan-100 text-emerald-600 ring-1 ring-emerald-200/70 dark:from-emerald-950/70 dark:to-cyan-950/60 dark:text-emerald-400">
                  <Target className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base">Target Audience</CardTitle>
                  <CardDescription className="mt-0.5 text-xs">Choose who should take this exam.</CardDescription>
                </div>
              </div>
              <label
                htmlFor="isCommon"
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-border/60 bg-background/80 px-3 py-2 transition-colors hover:bg-muted/40"
              >
                <Checkbox
                  id="isCommon"
                  checked={isCommon}
                  onCheckedChange={(checked) => setIsCommon(checked === true)}
                />
                <span>
                  <span className="block text-xs font-medium">Common exam</span>
                  <span className="block text-[10px] text-muted-foreground">All grades in selected courses</span>
                </span>
              </label>
            </div>
          </CardHeader>
          <CardContent className="px-5 py-4">
            {isCommon ? (
              <div className="max-w-2xl space-y-1.5">
                <Label className="text-xs">Courses</Label>
                <MultiSelect
                  options={courses.map((course: any) => ({ label: course.courseName, value: course.id }))}
                  selected={selectedCourseIds}
                  onChange={setSelectedCourseIds}
                  placeholder="Select one or more courses"
                />
                <p className="text-[10px] text-muted-foreground">
                  Every grade and section under these courses will be included.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground">
                    Add one compact row for each course and grade combination.
                  </p>
                  <Button type="button" variant="outline" size="sm" onClick={addRow} className="h-8">
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    Add target
                  </Button>
                </div>

                {audienceRows.length === 0 ? (
                  <button
                    type="button"
                    onClick={addRow}
                    className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-border px-4 py-5 text-center transition-colors hover:border-primary/40 hover:bg-primary/[0.025]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <span className="mt-2 text-xs font-medium">Add the first target</span>
                    <span className="mt-0.5 text-[10px] text-muted-foreground">
                      Select a course, grade, and optional sections.
                    </span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    {audienceRows.map((row, index) => (
                      <div
                        key={index}
                        className="grid items-end gap-2 rounded-xl border border-border/60 bg-muted/15 p-2.5 md:grid-cols-[minmax(140px,0.8fr)_minmax(130px,0.65fr)_minmax(200px,1.35fr)_32px]"
                      >
                        <div className="min-w-0 space-y-1">
                          <Label className="text-[10px] text-muted-foreground">Course</Label>
                          <Select value={row.courseId} onValueChange={(value) => updateRow(index, "courseId", value)}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Select course" /></SelectTrigger>
                            <SelectContent>
                              {courses.map((course: any) => (
                                <SelectItem key={course.id} value={course.id}>{course.courseName}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="min-w-0 space-y-1">
                          <Label className="text-[10px] text-muted-foreground">Grade</Label>
                          <Select
                            value={row.gradeId}
                            onValueChange={(value) => updateRow(index, "gradeId", value)}
                            disabled={!row.courseId}
                          >
                            <SelectTrigger className="w-full"><SelectValue placeholder="Select grade" /></SelectTrigger>
                            <SelectContent>
                              {getGradesByCourse(row.courseId).map((grade: any) => (
                                <SelectItem key={grade.id} value={grade.id}>{grade.gradeName}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="min-w-0 space-y-1">
                          <Label className="text-[10px] text-muted-foreground">Sections</Label>
                          <MultiSelect
                            options={getSectionsByGrade(row.gradeId).map((section: any) => ({
                              label: section.sectionName,
                              value: section.id,
                            }))}
                            selected={row.sectionIds}
                            onChange={(values) => updateRow(index, "sectionIds", values)}
                            placeholder="All sections"
                            disabled={!row.gradeId}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRow(index)}
                          className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          aria-label="Remove target"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 rounded-xl border border-border/60 bg-card/80 px-4 py-3 shadow-sm">
          <Button type="button" variant="outline" size="sm" asChild>
            <Link href="/exams">Cancel</Link>
          </Button>
          <Button type="submit" size="sm" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
