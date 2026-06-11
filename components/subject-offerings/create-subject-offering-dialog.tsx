"use client"
import { useForm, Controller } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useCreateSubjectOffering } from "@/hooks/use-subject-offerings"
import { useSubjects } from "@/hooks/use-subjects"
import { useCourses } from "@/hooks/use-courses"
import { useGrades } from "@/hooks/use-grades"
import { Loader2 } from "lucide-react"

interface CreateSubjectOfferingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FormData {
  subjectId: string
  courseId: string
  gradeId: string
  scope: string
  isElective: boolean
  weeklyPeriods: number
  status: string
}

export function CreateSubjectOfferingDialog({ open, onOpenChange }: CreateSubjectOfferingDialogProps) {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      isElective: false,
      scope: "course_grade",
      status: "active",
      weeklyPeriods: 0,
    },
  })
  const createOffering = useCreateSubjectOffering()
  const { data: subjectsData } = useSubjects()
  const { data: coursesData } = useCourses()
  const { data: gradesData } = useGrades()

  const scope = watch("scope")

  const onSubmit = async (data: FormData) => {
    await createOffering.mutateAsync({
      subjectId: data.subjectId,
      courseId: data.courseId || null,
      gradeId: data.gradeId || null,
      scope: data.scope as any,
      isElective: data.isElective,
      weeklyPeriods: data.weeklyPeriods || null,
      status: data.status as any,
    })
    reset()
    onOpenChange(false)
  }

  const subjects = subjectsData || []
  const courses = coursesData?.data?.rows || []
  const grades = gradesData?.rows || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Subject Offering</DialogTitle>
          <DialogDescription>Define which subjects are offered for courses and grades</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="scope">Scope *</Label>
            <Controller
              name="scope"
              control={control}
              rules={{ required: "Scope is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select scope" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_courses_all_grades">All Courses & All Grades</SelectItem>
                    <SelectItem value="course_all_grades">Specific Course - All Grades</SelectItem>
                    <SelectItem value="grade_all_courses">Specific Grade - All Courses</SelectItem>
                    <SelectItem value="course_grade">Specific Course & Grade</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {(scope === "course_all_grades" || scope === "course_grade") && (
            <div className="space-y-2">
              <Label htmlFor="courseId">Course *</Label>
              <Controller
                name="courseId"
                control={control}
                rules={{ required: scope === "course_all_grades" || scope === "course_grade" ? "Course is required" : false }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
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
                )}
              />
            </div>
          )}

          {(scope === "grade_all_courses" || scope === "course_grade") && (
            <div className="space-y-2">
              <Label htmlFor="gradeId">Grade *</Label>
              <Controller
                name="gradeId"
                control={control}
                rules={{ required: scope === "grade_all_courses" || scope === "course_grade" ? "Grade is required" : false }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade: any) => (
                        <SelectItem key={grade.id} value={grade.id}>
                          {grade.gradeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="weeklyPeriods">Weekly Periods</Label>
            <Controller
              name="weeklyPeriods"
              control={control}
              render={({ field }) => (
                <Input
                  id="weeklyPeriods"
                  type="number"
                  min={0}
                  placeholder="e.g., 5"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              )}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="isElective"
              control={control}
              render={({ field }) => <Checkbox id="isElective" checked={field.value} onCheckedChange={field.onChange} />}
            />
            <Label htmlFor="isElective" className="text-sm font-normal cursor-pointer">
              This is an elective subject
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createOffering.isPending}>
              {createOffering.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Offering
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
