"use client"
import { useForm, Controller } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useCreateSubject } from "@/hooks/use-subjects"
import { useCourses } from "@/hooks/use-courses"
import { Loader2 } from "lucide-react"

interface CreateSubjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FormData {
  subjectName: string
  courseId: string
  isCommon: boolean
}

export function CreateSubjectDialog({ open, onOpenChange }: CreateSubjectDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      isCommon: false,
    },
  })
  const createSubject = useCreateSubject()
  const { data: coursesData } = useCourses()

  const isCommon = watch("isCommon")

  const onSubmit = async (data: FormData) => {
    console.log("[v0] Creating subject with data:", data)
    await createSubject.mutateAsync({
      subjectName: data.subjectName,
      courseId: data.courseId,
      isCommon: data.isCommon,
    })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
          <DialogDescription>Create a new subject for your institution</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subjectName">Subject Name *</Label>
            <Input
              id="subjectName"
              placeholder="e.g., Mathematics, Physics"
              {...register("subjectName", { required: "Subject name is required" })}
            />
            {errors.subjectName && <p className="text-sm text-destructive">{errors.subjectName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseId">Course *</Label>
            <Controller
              name="courseId"
              control={control}
              rules={{ required: "Course is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {coursesData?.data?.rows?.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.courseName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.courseId && <p className="text-sm text-destructive">{errors.courseId.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="isCommon"
              control={control}
              render={({ field }) => <Checkbox id="isCommon" checked={field.value} onCheckedChange={field.onChange} />}
            />
            <Label htmlFor="isCommon" className="text-sm font-normal cursor-pointer">
              Common subject (available across all grades)
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createSubject.isPending}>
              {createSubject.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Subject
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
