"use client"
import { useForm, Controller } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateTimetablePeriod } from "@/hooks/use-timetable-periods"
import { useTimetableStructures } from "@/hooks/use-timetable-structures"
import { Loader2 } from "lucide-react"

interface CreateTimetablePeriodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  preselectedStructureId?: string
}

interface FormData {
  structureId: string
  name: string
  startHour: string
  startMinute: string
  endHour: string
  endMinute: string
  sortOrder: string
}

export function CreateTimetablePeriodDialog({ open, onOpenChange, preselectedStructureId }: CreateTimetablePeriodDialogProps) {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    defaultValues: {
      structureId: preselectedStructureId || "",
      name: "",
      startHour: "08",
      startMinute: "00",
      endHour: "09",
      endMinute: "00",
      sortOrder: "0",
    },
  })
  const createPeriod = useCreateTimetablePeriod()
  const { data: structuresData } = useTimetableStructures()

  const structures = structuresData || []

  const onSubmit = async (data: FormData) => {
    const startTime = parseInt(data.startHour) * 60 + parseInt(data.startMinute)
    const endTime = parseInt(data.endHour) * 60 + parseInt(data.endMinute)

    await createPeriod.mutateAsync({
      structureId: data.structureId,
      name: data.name,
      startTime,
      endTime,
      sortOrder: parseInt(data.sortOrder) || 0,
    })
    reset()
    onOpenChange(false)
  }

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))
  const minutes = ["00", "15", "30", "45"]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Timetable Period</DialogTitle>
          <DialogDescription>Create a new period (time slot) for a timetable structure</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="structureId">Timetable Structure *</Label>
            <Controller
              name="structureId"
              control={control}
              rules={{ required: "Structure is required" }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!!preselectedStructureId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a structure" />
                  </SelectTrigger>
                  <SelectContent>
                    {structures.map((s: any) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.structureId && <p className="text-sm text-destructive">{errors.structureId.message}</p>}
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
            <Button type="submit" disabled={createPeriod.isPending}>
              {createPeriod.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Period
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
