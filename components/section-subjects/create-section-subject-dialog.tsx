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

interface FormData {
  sectionId: string
  subjectId: string
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
  } = useForm<FormData>({
    defaultValues: {
      sectionId: "",
      subjectId: "",
      isElective: false,
    },
  })

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

  const onSubmit = async (data: FormData) => {
    await createMutation.mutateAsync({
      sectionId: data.sectionId,
      subjectId: data.subjectId,
      isElective: data.isElective,
    })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Subject to Section</DialogTitle>
          <DialogDescription>
            Select a section and assign a subject to it. Optionally mark it as an elective.
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

          <div className="space-y-2">
            <Label htmlFor="subjectId">Subject *</Label>
            <Controller
              name="subjectId"
              control={control}
              rules={{ required: "Subject is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject: any) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.subjectName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.subjectId && <p className="text-sm text-destructive">{errors.subjectId.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="isElective"
              control={control}
              render={({ field }) => <Checkbox id="isElective" checked={field.value} onCheckedChange={field.onChange} />}
            />
            <Label htmlFor="isElective" className="text-sm font-normal cursor-pointer">
              Elective subject for this section
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Assign Subject
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
