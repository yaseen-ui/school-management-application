"use client"
import { useForm, Controller } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUpdateTimetablePeriod } from "@/hooks/use-timetable-periods"
import { Loader2 } from "lucide-react"
import type { TimetablePeriod, PeriodType } from "@/lib/api/timetable-periods"
import { PERIOD_TYPE_LABELS } from "@/lib/api/timetable-periods"

interface EditTimetablePeriodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  period: TimetablePeriod | null
}

interface FormData {
  name: string
  type: PeriodType
  startHour: string
  startMinute: string
  endHour: string
  endMinute: string
  sortOrder: string
}


function minutesToHourMinute(minutes: number) {
  return {
    hour: String(Math.floor(minutes / 60)).padStart(2, "0"),
    minute: String(minutes % 60).padStart(2, "0"),
  }
}

export function EditTimetablePeriodDialog({ open, onOpenChange, period }: EditTimetablePeriodDialogProps) {
  const start = period ? minutesToHourMinute(period.startTime) : { hour: "08", minute: "00" }
  const end = period ? minutesToHourMinute(period.endTime) : { hour: "09", minute: "00" }

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    defaultValues: {
      name: period?.name || "",
      type: period?.type || "class",
      startHour: start.hour,
      startMinute: start.minute,
      endHour: end.hour,
      endMinute: end.minute,
      sortOrder: String(period?.sortOrder || 0),
    },

  })
  const updatePeriod = useUpdateTimetablePeriod()

  const onSubmit = async (data: FormData) => {
    if (!period) return
    const startTime = parseInt(data.startHour) * 60 + parseInt(data.startMinute)
    const endTime = parseInt(data.endHour) * 60 + parseInt(data.endMinute)

    await updatePeriod.mutateAsync({
      id: period.id,
      data: {
        name: data.name,
        type: data.type,
        startTime,
        endTime,
        sortOrder: parseInt(data.sortOrder) || 0,
      },
    })

    onOpenChange(false)
  }

  if (!period) return null

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))
  const minutes = ["00", "15", "30", "45"]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Timetable Period</DialogTitle>
          <DialogDescription>
            Update period: {period.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Structure</Label>
            <p className="text-sm font-medium">{period.structure?.name}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Period Name *</Label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Period name is required" }}
              render={({ field }) => (
                <Input id="name" placeholder="e.g., Period 1, Morning Assembly" {...field} />
              )}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Period Type *</Label>
            <Controller
              name="type"
              control={control}
              rules={{ required: "Period type is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period type" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(PERIOD_TYPE_LABELS) as [PeriodType, string][]).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label>Start Time *</Label>
              <div className="grid grid-cols-2 gap-2">
                <Controller
                  name="startHour"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="HH" />
                      </SelectTrigger>
                      <SelectContent className="max-h-48">
                        {hours.map((h) => (
                          <SelectItem key={h} value={h}>{h}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Controller
                  name="startMinute"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        {minutes.map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>End Time *</Label>
              <div className="grid grid-cols-2 gap-2">
                <Controller
                  name="endHour"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="HH" />
                      </SelectTrigger>
                      <SelectContent className="max-h-48">
                        {hours.map((h) => (
                          <SelectItem key={h} value={h}>{h}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Controller
                  name="endMinute"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        {minutes.map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Controller
              name="sortOrder"
              control={control}
              render={({ field }) => (
                <Input
                  id="sortOrder"
                  type="number"
                  min={0}
                  placeholder="e.g., 1, 2, 3"
                  {...field}
                />
              )}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updatePeriod.isPending}>
              {updatePeriod.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Period
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
