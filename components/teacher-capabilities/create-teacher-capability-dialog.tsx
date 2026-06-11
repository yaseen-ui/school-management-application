"use client"
import { useForm, Controller } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useCreateTeacherCapability } from "@/hooks/use-teacher-capabilities"
import { useTeachers } from "@/hooks/use-teachers"
import { useSubjects } from "@/hooks/use-subjects"
import { useCourses } from "@/hooks/use-courses"
import { useGrades } from "@/hooks/use-grades"
import { Loader2 } from "lucide-react"

interface CreateTeacherCapabilityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FormData {
  teacherId: string
  subjectId: string
  courseId: string
  gradeId: string
  expertiseLevel: string
  isPrimary: boolean
  priorityScore: number
  canBeClassTeacher: boolean
  remarks: string
}

export function CreateTeacherCapabilityDialog({ open, onOpenChange }: CreateTeacherCapabilityDialogProps) {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    defaultValues: {
      isPrimary: false,
      canBeClassTeacher: false,
      expertiseLevel: "intermediate",
      priorityScore: 50,
    },
  })
  const createCapability = useCreateTeacherCapability()
  const { data: teachersData } = useTeachers()
  const { data: subjectsData } = useSubjects()
  const { data: coursesData } = useCourses()
  const { data: gradesData } = useGrades()

  const onSubmit = async (data: FormData) => {
    await createCapability.mutateAsync({
      teacherId: data.teacherId,
      subjectId: data.subjectId,
      courseId: data.courseId || null,
      gradeId: data.gradeId || null,
      expertiseLevel: data.expertiseLevel as any,
      isPrimary: data.isPrimary,
      priorityScore: data.priorityScore,
      canBeClassTeacher: data.canBeClassTeacher,
      remarks: data.remarks || null,
    })
    reset()
    onOpenChange(false)
  }

  const teachers = teachersData || []
  const subjects = subjectsData || []
  const courses = coursesData?.data?.rows || []
  const grades = gradesData?.rows || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Teacher Capability</DialogTitle>
          <DialogDescription>Define a subject and grade a teacher is qualified to teach</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="teacherId">Teacher *</Label>
            <Controller
              name="teacherId"
              control={control}
              rules={{ required: "Teacher is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher: any) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.teacherId && <p className="text-sm text-destructive">{errors.teacherId.message}</p>}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="courseId">Course</Label>
              <Controller
                name="courseId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Optional" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
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

            <div className="space-y-2">
              <Label htmlFor="gradeId">Grade</Label>
              <Controller
                name="gradeId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Optional" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Grades</SelectItem>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="expertiseLevel">Expertise Level *</Label>
            <Controller
              name="expertiseLevel"
              control={control}
              rules={{ required: "Expertise level is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priorityScore">Priority Score (0-100)</Label>
            <Controller
              name="priorityScore"
              control={control}
              render={({ field }) => (
                <Input
                  id="priorityScore"
                  type="number"
                  min={0}
                  max={100}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              )}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="isPrimary"
              control={control}
              render={({ field }) => <Checkbox id="isPrimary" checked={field.value} onCheckedChange={field.onChange} />}
            />
            <Label htmlFor="isPrimary" className="text-sm font-normal cursor-pointer">
              Primary capability for this subject
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="canBeClassTeacher"
              control={control}
              render={({ field }) => (
                <Checkbox id="canBeClassTeacher" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <Label htmlFor="canBeClassTeacher" className="text-sm font-normal cursor-pointer">
              Can be assigned as class teacher
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createCapability.isPending}>
              {createCapability.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Capability
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
