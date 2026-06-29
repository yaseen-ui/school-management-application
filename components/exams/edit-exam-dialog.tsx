"use client"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Loader2, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUpdateExam } from "@/hooks/use-exams"
import { useGrades } from "@/hooks/use-grades"
import { useSections } from "@/hooks/use-sections"
import { MultiSelect } from "@/components/ui/multi-select"
import type { Exam, UpdateExamRequest, ExamType, ExamStatus } from "@/lib/api/exams"

interface EditExamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  exam: Exam | null
}

const examTypes: { value: ExamType; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "half_yearly", label: "Half-Yearly" },
  { value: "annually", label: "Annually" },
]

const statusOptions: { value: ExamStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
]

export function EditExamDialog({ open, onOpenChange, exam }: EditExamDialogProps) {
  const [selectedGradeIds, setSelectedGradeIds] = useState<string[]>([])
  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([])

  const updateExam = useUpdateExam()
  const { data: grades } = useGrades()
  const { data: sections } = useSections()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UpdateExamRequest>()

  const examType = watch("examType")

  useEffect(() => {
    if (exam) {
      setValue("name", exam.name)
      setValue("description", exam.description || "")
      setValue("examType", exam.examType)
      setValue("startDate", exam.startDate.split("T")[0])
      setValue("endDate", exam.endDate.split("T")[0])
      setValue("status", exam.status)
      setSelectedGradeIds(exam.targetGrades?.map((tg) => tg.grade.id) || [])
      setSelectedSectionIds(exam.targetSections?.map((ts) => ts.section.id) || [])
    }
  }, [exam, setValue])

  const onSubmit = async (data: UpdateExamRequest) => {
    if (!exam) return
    try {
      await updateExam.mutateAsync({
        id: exam.id,
        data: {
          ...data,
          targetGradeIds: selectedGradeIds.length > 0 ? selectedGradeIds : undefined,
          targetSectionIds: selectedSectionIds.length > 0 ? selectedSectionIds : undefined,
        },
      })
      onOpenChange(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  if (!exam) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Edit Exam</DialogTitle>
              <DialogDescription>Update exam details for {exam.name}</DialogDescription>
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
                  {...register("name", { required: "Exam name is required" })}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="examType">Exam Type</Label>
                <Select
                  value={examType}
                  onValueChange={(value) => setValue("examType", value as ExamType)}
                >
                  <SelectTrigger>
                    <SelectValue />
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
              <Textarea id="description" {...register("description")} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">From Date</Label>
                <Input id="startDate" type="date" {...register("startDate")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">To Date</Label>
                <Input id="endDate" type="date" {...register("endDate")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(value) => setValue("status", value as ExamStatus)}
                defaultValue={exam.status}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Button type="submit" disabled={updateExam.isPending}>
              {updateExam.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
