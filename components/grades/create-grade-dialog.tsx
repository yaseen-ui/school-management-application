"use client"
import { useForm, Controller } from "react-hook-form"
import { motion } from "framer-motion"
import { Loader2, GraduationCap } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateGrade } from "@/hooks/use-grades"
import { useCourses } from "@/hooks/use-courses"
import type { CreateGradeRequest } from "@/lib/api/grades"

interface CreateGradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateGradeDialog({ open, onOpenChange }: CreateGradeDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateGradeRequest>()
  const createGrade = useCreateGrade()
  const { data: coursesData, isLoading: coursesLoading } = useCourses()

  const onSubmit = async (data: CreateGradeRequest) => {
    console.log("[v0] Creating grade with data:", data)
    try {
      await createGrade.mutateAsync(data)
      reset()
      onOpenChange(false)
    } catch (error) {
      console.log("[v0] Error creating grade:", error)
      // Error handled by mutation
    }
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Create New Grade</DialogTitle>
              <DialogDescription>Add a new grade level to your institution</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="courseId">
                Course <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="courseId"
                control={control}
                rules={{ required: "Course is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={coursesLoading ? "Loading courses..." : "Select a course"} />
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

            <div className="space-y-2">
              <Label htmlFor="gradeName">
                Grade Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="gradeName"
                placeholder="e.g., Class 10"
                {...register("gradeName", { required: "Grade name is required" })}
              />
              {errors.gradeName && <p className="text-sm text-destructive">{errors.gradeName.message}</p>}
            </div>
          </motion.div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createGrade.isPending}>
              {createGrade.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Grade
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
