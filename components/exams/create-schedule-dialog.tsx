"use client"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Loader2, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateExamSchedule, useExam } from "@/hooks/use-exams"
import { useSections } from "@/hooks/use-sections"
import type { CreateScheduleRequest } from "@/lib/api/exams"

interface CreateScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  examId: string
}

export function CreateScheduleDialog({ open, onOpenChange, examId }: CreateScheduleDialogProps) {
  const createSchedule = useCreateExamSchedule()
  const { data: exam } = useExam(examId)
  const { data: sections } = useSections()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateScheduleRequest>({
    defaultValues: {
      examId,
    },
  })

  const onSubmit = async (data: CreateScheduleRequest) => {
    try {
      await createSchedule.mutateAsync({
        ...data,
        examId,
      })
      reset()
      onOpenChange(false)
    } catch (error) {
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
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Create Schedule</DialogTitle>
              <DialogDescription>
                {exam?.data?.name ? `Schedule for ${exam.data.name}` : "Create a new exam schedule"}
              </DialogDescription>
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
              <Label htmlFor="name">
                Schedule Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Section A Schedule"
                {...register("name", { required: "Schedule name is required" })}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sectionId">
                Section <span className="text-destructive">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("sectionId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {(sections?.data?.rows || []).map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.sectionName} {s.grade ? `(${s.grade.gradeName})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description"
                {...register("description")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  Start Date <span className="text-destructive">*</span>
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
                  End Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register("endDate", { required: "End date is required" })}
                />
                {errors.endDate && <p className="text-sm text-destructive">{errors.endDate.message}</p>}
              </div>
            </div>
          </motion.div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createSchedule.isPending}>
              {createSchedule.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Schedule
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
