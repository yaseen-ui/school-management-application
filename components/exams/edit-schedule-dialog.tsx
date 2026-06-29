"use client"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Loader2, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUpdateExamSchedule } from "@/hooks/use-exams"
import { useSections } from "@/hooks/use-sections"
import type { ExamSchedule, CreateScheduleRequest, ScheduleStatus } from "@/lib/api/exams"

interface EditScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  schedule: ExamSchedule | null
}

const statusOptions: { value: ScheduleStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
]

export function EditScheduleDialog({ open, onOpenChange, schedule }: EditScheduleDialogProps) {
  const updateSchedule = useUpdateExamSchedule()
  const { data: sections } = useSections()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateScheduleRequest>()

  useEffect(() => {
    if (schedule) {
      setValue("name", schedule.name)
      setValue("description", schedule.description || "")
      setValue("sectionId", schedule.sectionId)
      setValue("startDate", schedule.startDate.split("T")[0])
      setValue("endDate", schedule.endDate.split("T")[0])
    }
  }, [schedule, setValue])

  const onSubmit = async (data: CreateScheduleRequest) => {
    if (!schedule) return
    try {
      await updateSchedule.mutateAsync({
        id: schedule.id,
        data,
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

  if (!schedule) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Edit Schedule</DialogTitle>
              <DialogDescription>Update schedule for {schedule.name}</DialogDescription>
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
                {...register("name", { required: "Schedule name is required" })}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sectionId">Section</Label>
              <Select
                onValueChange={(value) => setValue("sectionId", value)}
                defaultValue={schedule.sectionId}
              >
                <SelectTrigger>
                  <SelectValue />
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
              <Textarea id="description" {...register("description")} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" {...register("startDate")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" {...register("endDate")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(value) => setValue("status" as any, value)}
                defaultValue={schedule.status}
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
          </motion.div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateSchedule.isPending}>
              {updateSchedule.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
