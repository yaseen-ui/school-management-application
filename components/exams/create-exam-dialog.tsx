"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Loader2, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateExam } from "@/hooks/use-exams"
import { useAcademicYears } from "@/hooks/use-academic-years"
import { useGrades } from "@/hooks/use-grades"
import { useSections } from "@/hooks/use-sections"
import { MultiSelect } from "@/components/ui/multi-select"
import type { CreateExamRequest, ExamType } from "@/lib/api/exams"

interface CreateExamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const examTypes: { value: ExamType; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "half_yearly", label: "Half-Yearly" },
  { value: "annually", label: "Annually" },
]

export function CreateExamDialog({ open, onOpenChange }: CreateExamDialogProps) {
  const [selectedGradeIds, setSelectedGradeIds] = useState<string[]>([])
  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([])

  const createExam = useCreateExam()
  const { data: academicYears } = useAcademicYears()
  const { data: grades } = useGrades()
  const { data: sections } = useSections()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateExamRequest>({
    defaultValues: {
      examType: "quarterly",
    },
  })

  const examType = watch("examType")

  const onSubmit = async (data: CreateExamRequest) => {
    try {
      await createExam.mutateAsync({
        ...data,
        targetGradeIds: selectedGradeIds.length > 0 ? selectedGradeIds : undefined,
        targetSectionIds: selectedSectionIds.length > 0 ? selectedSectionIds : undefined,
      })
      reset()
      setSelectedGradeIds([])
      setSelectedSectionIds([])
      onOpenChange(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleClose = () => {
    reset()
    setSelectedGradeIds([])
    setSelectedSectionIds([])
    onOpenChange(false)
  }

  const activeAcademicYears = (academicYears?.data?.rows || []).filter((ay: any) => ay.status === "active")

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Create New Exam</DialogTitle>
              <DialogDescription>Define a new exam blueprint for your institution</DialogDescription>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Exam Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Quarterly 2026"
                  {...register("name", { required: "Exam name is required" })}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="examType">
                  Exam Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={examType}
                  onValueChange={(value) => setValue("examType", value as ExamType)}
                >
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
                {...register("description")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="academicYearId">
                Academic Year <span className="text-destructive">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue("academicYearId", value)}
              >
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
                  {...register("startDate", { required: "Start date is required" })}
                />
                {errors.startDate && <p className="text-sm text-destructive">{errors.startDate.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">
                  To Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register("endDate", { required: "End date is required" })}
                />
                {errors.endDate && <p className="text-sm text-destructive">{errors.endDate.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Target Grades</Label>
              <MultiSelect
                options={(grades?.rows || []).map((g: any) => ({ label: g.gradeName, value: g.id }))}
                selected={selectedGradeIds}
                onChange={setSelectedGradeIds}
                placeholder="Select grades (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label>Target Sections</Label>
              <MultiSelect
                options={(sections?.data?.rows || []).map((s: any) => ({
                  label: `${s.sectionName} (${s.grade?.gradeName || "N/A"})`,
                  value: s.id,
                }))}
                selected={selectedSectionIds}
                onChange={setSelectedSectionIds}
                placeholder="Select sections (optional)"
              />
            </div>
          </motion.div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createExam.isPending}>
              {createExam.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Exam
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
