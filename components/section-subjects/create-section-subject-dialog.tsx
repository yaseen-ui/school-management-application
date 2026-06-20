"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import { useCreateSectionSubject } from "@/hooks/use-section-subjects"
import { useSections } from "@/hooks/use-sections"
import { useSubjects } from "@/hooks/use-subjects"
import { useCourses } from "@/hooks/use-courses"
import { useGrades } from "@/hooks/use-grades"
import { MultiSelect } from "@/components/ui/multi-select"
import type { MultiSelectOption } from "@/components/ui/multi-select"

interface FormData {
  sectionId: string
  subjectIds: string[]
  isElective: boolean
}

interface CreateSectionSubjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateSectionSubjectDialog({ open, onOpenChange }: CreateSectionSubjectDialogProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("")
  const [selectedGradeId, setSelectedGradeId] = useState<string>("")

  const { data: coursesData } = useCourses()
  const { data: gradesData } = useGrades(selectedCourseId || undefined)
  const { data: sectionsData } = useSections(selectedGradeId || undefined, selectedCourseId || undefined)
  const { data: subjectsData } = useSubjects(selectedCourseId || undefined)

  const createMutation = useCreateSectionSubject()

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      sectionId: "",
      subjectIds: [],
      isElective: false,
    },
  })

  const selectedSubjectIds = watch("subjectIds")

  const courses: any[] = (coursesData as any)?.data?.rows || (coursesData as any)?.data || []
  const grades: any[] = (gradesData as any)?.rows || (gradesData as any)?.data?.rows || []
  const sections: any[] = (sectionsData as any)?.data?.rows || (sectionsData as any) || []
  const subjects: any[] = (subjectsData as any) || []

  // Reset filters when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedCourseId("")
      setSelectedGradeId("")
      reset()
    }
  }, [open, reset])

  // Auto-select first course
  useEffect(() => {
    if (!selectedCourseId && courses.length > 0) {
      setSelectedCourseId(courses[0].id)
    }
  }, [courses, selectedCourseId])

  // Reset grade when course changes
  useEffect(() => {
    setSelectedGradeId("")
  }, [selectedCourseId])

  const subjectOptions: MultiSelectOption[] = subjects.map((subject: any) => ({
    value: subject.id,
    label: subject.subjectName,
  }))

  const onSubmit = async (data: FormData) => {
    if (data.subjectIds.length === 0) return

    await createMutation.mutateAsync({
      sectionId: data.sectionId,
      subjectIds: data.subjectIds,
      isElective: data.isElective,
    })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Subjects to Section</DialogTitle>
          <DialogDescription>
            Select a course, grade, and section, then choose one or more subjects to assign.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Course Filter */}
          <div className="space-y-2">
            <Label>Course</Label>
            <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
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

          {/* Grade Filter */}
          <div className="space-y-2">
            <Label>Grade</Label>
            <Select value={selectedGradeId || "all"} onValueChange={(v) => setSelectedGradeId(v === "all" ? "" : v)}>
              <SelectTrigger>
                <SelectValue placeholder="All grades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All grades</SelectItem>
                {grades.map((grade: any) => (
                  <SelectItem key={grade.id} value={grade.id}>
                    {grade.gradeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Section */}
          <div className="space-y-2">
            <Label htmlFor="sectionId">Section *</Label>
            <Controller
              name="sectionId"
              control={control}
              rules={{ required: "Section is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section: any) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.sectionName} ({section.grade?.gradeName || "N/A"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.sectionId && <p className="text-sm text-destructive">{errors.sectionId.message}</p>}
          </div>

          {/* Subjects Multi-Select */}
          <div className="space-y-2">
            <Label htmlFor="subjectIds">Subjects *</Label>
            <Controller
              name="subjectIds"
              control={control}
              rules={{ validate: (v) => v.length > 0 || "At least one subject is required" }}
              render={({ field }) => (
                <MultiSelect
                  options={subjectOptions}
                  selected={field.value}
                  onChange={field.onChange}
                  placeholder="Select subjects..."
                  emptyText="No subjects found for this course."
                />
              )}
            />
            {errors.subjectIds && <p className="text-sm text-destructive">{errors.subjectIds.message}</p>}
          </div>

          {/* Elective Checkbox */}
          <div className="flex items-center space-x-2">
            <Controller
              name="isElective"
              control={control}
              render={({ field }) => <Checkbox id="isElective" checked={field.value} onCheckedChange={field.onChange} />}
            />
            <Label htmlFor="isElective" className="text-sm font-normal cursor-pointer">
              Mark as elective subjects for this section
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Assign Subjects
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
