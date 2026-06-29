"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, FileText, Plus, Trash2, ArrowLeft } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useCreateExam } from "@/hooks/use-exams"
import { useAcademicYears } from "@/hooks/use-academic-years"
import { useCourses } from "@/hooks/use-courses"
import { useGrades } from "@/hooks/use-grades"
import { useSections } from "@/hooks/use-sections"
import { MultiSelect } from "@/components/ui/multi-select"
import { toast } from "@/components/ui/sonner"
import type { CreateExamRequest, ExamType, TargetAudienceRow } from "@/lib/api/exams"
import Link from "next/link"

const examTypes: { value: ExamType; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "half_yearly", label: "Half-Yearly" },
  { value: "annually", label: "Annually" },
]

export default function CreateExamPage() {
  const router = useRouter()
  const createExam = useCreateExam()

  const { data: academicYearsData } = useAcademicYears()
  const { data: coursesData } = useCourses()
  const { data: gradesData } = useGrades()
  const { data: sectionsData } = useSections()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [examType, setExamType] = useState<ExamType>("quarterly")
  const [academicYearId, setAcademicYearId] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isCommon, setIsCommon] = useState(false)
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([])
  const [audienceRows, setAudienceRows] = useState<TargetAudienceRow[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const courses = (coursesData as any)?.data?.rows || (coursesData as any)?.rows || []
  const grades = (gradesData as any)?.rows || []
  const sections = (sectionsData as any)?.data?.rows || (sectionsData as any)?.rows || []
  const activeAcademicYears = ((academicYearsData as any)?.data?.rows || (academicYearsData as any)?.rows || []).filter(
    (ay: any) => ay.status === "active"
  )


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
      // Reset grade and sections when course changes
      updated[index] = { courseId: value, gradeId: "", sectionIds: [] }
    } else if (field === "gradeId") {
      // Reset sections when grade changes
      updated[index] = { ...updated[index], gradeId: value, sectionIds: [] }
    } else {
      updated[index] = { ...updated[index], [field]: value }
    }
    setAudienceRows(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !academicYearId || !startDate || !endDate) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const payload: CreateExamRequest = {
        name,
        description: description || undefined,
        examType,
        academicYearId,
        startDate,
        endDate,
        isCommon,
      }

      if (isCommon) {
        payload.targetCourseIds = selectedCourseIds
      } else {
        // Only send rows that have a course and grade selected
        const validRows = audienceRows.filter((r) => r.courseId && r.gradeId)
        if (validRows.length > 0) {
          payload.targetAudienceRows = validRows
        }
      }

      await createExam.mutateAsync(payload)
      toast.success("Exam created successfully")
      router.push("/exams")
    } catch (error) {
      // Error handled by mutation
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Create Exam" description="Define a new exam blueprint for your institution">
        <Button variant="outline" asChild>
          <Link href="/exams">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Exams
          </Link>
        </Button>
      </PageHeader>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info Section */}
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">Basic Information</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Exam Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Quarterly 2026"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="examType">
                Exam Type <span className="text-destructive">*</span>
              </Label>
              <Select value={examType} onValueChange={(value) => setExamType(value as ExamType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  {examTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional description for this exam"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="academicYearId">
              Academic Year <span className="text-destructive">*</span>
            </Label>
            <Select value={academicYearId} onValueChange={setAcademicYearId}>
              <SelectTrigger>
                <SelectValue placeholder="Select academic year" />
              </SelectTrigger>
              <SelectContent>
                {activeAcademicYears.map((ay: any) => (
                  <SelectItem key={ay.id} value={ay.id}>
                    {ay.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">
                From Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">
                To Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Target Audience Section */}
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Target Audience</h2>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="isCommon" className="text-sm cursor-pointer">
                Common Exam (all grades under selected courses)
              </Label>
              <Checkbox
                id="isCommon"
                checked={isCommon}
                onCheckedChange={(checked) => setIsCommon(checked === true)}
              />
            </div>
          </div>

          {isCommon ? (
            /* Common Mode: Select Courses */
            <div className="space-y-2 pt-2">
              <Label>Select Courses</Label>
              <MultiSelect
                options={courses.map((c: any) => ({ label: c.courseName, value: c.id }))}
                selected={selectedCourseIds}
                onChange={setSelectedCourseIds}
                placeholder="Select courses..."
              />
              <p className="text-xs text-muted-foreground">
                All grades under the selected courses and their sections will be targeted.
              </p>
            </div>
          ) : (
            /* Table Mode: Course > Grade > Sections rows */
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Add rows to specify which grades and sections to target.
                </p>
                <Button type="button" variant="outline" size="sm" onClick={addRow}>
                  <Plus className="mr-1 h-3 w-3" />
                  Add Row
                </Button>
              </div>

              {audienceRows.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground border rounded-lg">
                  No rows added yet. Click "Add Row" to define target audience.
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Header */}
                  <div className="grid grid-cols-12 gap-3 px-2">
                    <div className="col-span-3 text-xs font-medium text-muted-foreground">Course</div>
                    <div className="col-span-3 text-xs font-medium text-muted-foreground">Grade</div>
                    <div className="col-span-5 text-xs font-medium text-muted-foreground">Sections</div>
                    <div className="col-span-1" />
                  </div>

                  {audienceRows.map((row, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 items-start">
                      <div className="col-span-3">
                        <Select
                          value={row.courseId}
                          onValueChange={(value) => updateRow(index, "courseId", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select course" />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map((c: any) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.courseName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="col-span-3">
                        <Select
                          value={row.gradeId}
                          onValueChange={(value) => updateRow(index, "gradeId", value)}
                          disabled={!row.courseId}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                          <SelectContent>
                            {getGradesByCourse(row.courseId).map((g: any) => (
                              <SelectItem key={g.id} value={g.id}>
                                {g.gradeName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="col-span-5">
                        <MultiSelect
                          options={getSectionsByGrade(row.gradeId).map((s: any) => ({
                            label: s.sectionName,
                            value: s.id,
                          }))}
                          selected={row.sectionIds}
                          onChange={(values) => updateRow(index, "sectionIds", values)}
                          placeholder="Select sections"
                          disabled={!row.gradeId}
                        />
                      </div>

                      <div className="col-span-1 pt-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRow(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href="/exams">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Exam
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
