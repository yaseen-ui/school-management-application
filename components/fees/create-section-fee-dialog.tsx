"use client"
import { useState, useMemo } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { motion } from "framer-motion"
import { Loader2, DollarSign, Plus, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateSectionFee, useFeeHeads } from "@/hooks/use-fees"
import { useSections } from "@/hooks/use-sections"
import { useCourses } from "@/hooks/use-courses"
import { useGrades } from "@/hooks/use-grades"
import { useAcademicYears } from "@/hooks/use-academic-years"
import type { CreateSectionFeeRequest } from "@/lib/api/fees"

interface CreateSectionFeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateSectionFeeDialog({ open, onOpenChange }: CreateSectionFeeDialogProps) {
  const { data: coursesData } = useCourses()
  const { data: academicYearsData } = useAcademicYears()
  const { data: feeHeadsData } = useFeeHeads()
  const createSectionFee = useCreateSectionFee()

  const [selectedCourseId, setSelectedCourseId] = useState("")
  const [selectedGradeId, setSelectedGradeId] = useState("")

  const { data: gradesData } = useGrades(selectedCourseId || undefined)
  const { data: sectionsData } = useSections(selectedGradeId || undefined, selectedCourseId || undefined)

  const courses: any[] = (coursesData as any)?.data?.rows || (coursesData as any)?.data || []
  const grades: any[] = (gradesData as any)?.rows || (gradesData as any)?.data || []
  const sections: any[] = (sectionsData as any)?.data?.rows || (sectionsData as any)?.data || []
  const academicYears: any[] = (academicYearsData as any)?.data?.rows || (academicYearsData as any)?.data || []
  const feeHeads: any[] = feeHeadsData || []

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateSectionFeeRequest>({
    defaultValues: {
      sectionId: "",
      academicYearId: "",
      termCount: 1,
      heads: [{ feeHeadId: "", amount: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "heads",
  })

  const onSubmit = async (data: CreateSectionFeeRequest) => {
    try {
      await createSectionFee.mutateAsync(data)
      reset()
      setSelectedCourseId("")
      setSelectedGradeId("")
      onOpenChange(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleClose = () => {
    reset()
    setSelectedCourseId("")
    setSelectedGradeId("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Create Section Fee</DialogTitle>
              <DialogDescription>Configure fee structure for a section</DialogDescription>
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
            {/* Course Selection */}
            <div className="space-y-2">
              <Label htmlFor="courseId">
                Course <span className="text-destructive">*</span>
              </Label>
              <Select
                value={selectedCourseId}
                onValueChange={(value) => {
                  setSelectedCourseId(value)
                  setSelectedGradeId("")
                  setValue("sectionId", "")
                }}
              >
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

            {/* Grade Selection */}
            <div className="space-y-2">
              <Label htmlFor="gradeId">
                Grade <span className="text-destructive">*</span>
              </Label>
              <Select
                value={selectedGradeId}
                onValueChange={(value) => {
                  setSelectedGradeId(value)
                  setValue("sectionId", "")
                }}
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sectionId">
                  Section <span className="text-destructive">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue("sectionId", value)}
                  disabled={!selectedGradeId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={selectedGradeId ? "Select section" : "Select a grade first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section: any) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.sectionName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="academicYearId">
                  Academic Year <span className="text-destructive">*</span>
                </Label>
                <Select onValueChange={(value) => setValue("academicYearId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((year: any) => (
                      <SelectItem key={year.id} value={year.id}>
                        {year.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="termCount">
                  Number of Terms <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="termCount"
                  type="number"
                  min={1}
                  placeholder="1"
                  {...register("termCount", { valueAsNumber: true, min: 1 })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Fee Heads</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ feeHeadId: "", amount: 0 })}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Add Head
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-2 rounded-lg border p-3">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Fee Head</Label>
                    <Select onValueChange={(value) => setValue(`heads.${index}.feeHeadId`, value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fee head" />
                      </SelectTrigger>
                      <SelectContent>
                        {feeHeads.map((head: any) => (
                          <SelectItem key={head.id} value={head.id}>
                            {head.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32 space-y-1">
                    <Label className="text-xs">Amount</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      {...register(`heads.${index}.amount`, { valueAsNumber: true })}
                    />
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createSectionFee.isPending}>
              {createSectionFee.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Section Fee
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
