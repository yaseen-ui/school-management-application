"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { motion } from "framer-motion"
import { Loader2, GraduationCap } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUpdateGrade } from "@/hooks/use-grades"
import { useCourses } from "@/hooks/use-courses"
import type { UpdateGradeRequest } from "@/lib/api/grades"

interface GradeData {
  gradeId: string
  tenantId: string
  courseId: string
  gradeName: string
  createdAt: string
  updatedAt: string
  courseName?: string
}

interface EditGradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  grade: GradeData | null
}

export function EditGradeDialog({ open, onOpenChange, grade }: EditGradeDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<UpdateGradeRequest>()
  const updateGrade = useUpdateGrade()
  const { data: coursesData, isLoading: coursesLoading } = useCourses()

  useEffect(() => {
    if (grade && open) {
      reset({
        courseId: grade.courseId,
        gradeName: grade.gradeName,
      })
    }
  }, [grade, open, reset])

  const onSubmit = async (data: UpdateGradeRequest) => {
    if (!grade) return

    console.log("[v0] Updating grade with data:", data)
    try {
      await updateGrade.mutateAsync({ id: grade.gradeId, data })
      reset()
      onOpenChange(false)
    } catch (error) {
      console.log("[v0] Error updating grade:", error)
      // Error handled by mutation
    }
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  if (!grade) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Edit Grade</DialogTitle>
              <DialogDescription>Update grade information</DialogDescription>
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
            <Button type="submit" disabled={updateGrade.isPending}>
              {updateGrade.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Grade
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
