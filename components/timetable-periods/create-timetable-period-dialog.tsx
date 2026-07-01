"use client"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateTimetablePeriod } from "@/hooks/use-timetable-periods"
import { useTimetableStructures } from "@/hooks/use-timetable-structures"
import { Loader2 } from "lucide-react"
import { PERIOD_TYPE_LABELS } from "@/lib/api/timetable-periods"
import type { PeriodType } from "@/lib/api/timetable-periods"

interface CreateTimetablePeriodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  preselectedStructureId?: string
}

interface FormData {
  structureId: string
  name: string
  type: PeriodType
  startHour: string
  startMinute: string
  endHour: string
  endMinute: string
  sortOrder: string
}


export function CreateTimetablePeriodDialog({ open, onOpenChange, preselectedStructureId }: CreateTimetablePeriodDialogProps) {
  const [selectedStructureId, setSelectedStructureId] = useState<string>(preselectedStructureId || "")
  const [selectedType, setSelectedType] = useState<string>("class")
  const [startHour, setStartHour] = useState("08")
  const [startMinute, setStartMinute] = useState("00")
  const [endHour, setEndHour] = useState("09")
  const [endMinute, setEndMinute] = useState("00")

  const createPeriod = useCreateTimetablePeriod()
  const { data: structuresData } = useTimetableStructures()

  const structures = structuresData || []

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedStructureId(preselectedStructureId || "")
      setSelectedType("class")
      setStartHour("08")
      setStartMinute("00")
      setEndHour("09")
      setEndMinute("00")
    }
  }, [open, preselectedStructureId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedStructureId) {
      return
    }

    const startTime = parseInt(startHour) * 60 + parseInt(startMinute)
    const endTime = parseInt(endHour) * 60 + parseInt(endMinute)

    await createPeriod.mutateAsync({
      structureId: selectedStructureId,
      name: (e.target as HTMLFormElement).periodName?.value || "",
      type: selectedType as PeriodType,
      startTime,
      endTime,
      sortOrder: parseInt((e.target as HTMLFormElement).sortOrder?.value) || 0,
    })
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="structureId">Timetable Structure *</Label>
            <Select
              value={selectedStructureId || undefined}
              onValueChange={setSelectedStructureId}
              disabled={!!preselectedStructureId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a structure" />
              </SelectTrigger>
              <SelectContent>
                {structures.length === 0 && (
                  <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                    No structures found. Create one first.
                  </div>
                )}
                {structures.map((s: any) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!selectedStructureId && <p className="text-sm text-destructive">Structure is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="periodName">Period Name *</Label>
            <Input
              id="periodName"
              name="periodName"
              placeholder="e.g., Period 1, Morning Assembly"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Period Type *</Label>
            <Select
              value={selectedType}
              onValueChange={setSelectedType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select period type" />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(PERIOD_TYPE_LABELS) as [PeriodType, string][]).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label>Start Time *</Label>
              <div className="grid grid-cols-2 gap-2">
                <Select value={startHour} onValueChange={setStartHour}>
                  <SelectTrigger>
                    <SelectValue placeholder="HH" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {hours.map((h) => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={startMinute} onValueChange={setStartMinute}>
                  <SelectTrigger>
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>End Time *</Label>
              <div className="grid grid-cols-2 gap-2">
                <Select value={endHour} onValueChange={setEndHour}>
                  <SelectTrigger>
                    <SelectValue placeholder="HH" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {hours.map((h) => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={endMinute} onValueChange={setEndMinute}>
                  <SelectTrigger>
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input
              id="sortOrder"
              name="sortOrder"
              type="number"
              min={0}
              defaultValue="0"
              placeholder="e.g., 1, 2, 3"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createPeriod.isPending || !selectedStructureId}>
              {createPeriod.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Period
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
