"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useUpdateAcademicYear } from "@/hooks/use-academic-years"
import type { AcademicYear, UpdateAcademicYearRequest } from "@/lib/api/academic-years"

interface EditAcademicYearDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  academicYear: AcademicYear | null
}

export function EditAcademicYearDialog({ open, onOpenChange, academicYear }: EditAcademicYearDialogProps) {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)
  const { mutate: updateAcademicYear, isPending } = useUpdateAcademicYear()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateAcademicYearRequest>()

  useEffect(() => {
    if (academicYear && open) {
      reset({
        name: academicYear.name,
        startDate: academicYear.startDate,
        endDate: academicYear.endDate,
      })
      setStartDate(new Date(academicYear.startDate))
      setEndDate(new Date(academicYear.endDate))
    }
  }, [academicYear, open, reset])

  const onSubmit = (data: UpdateAcademicYearRequest) => {
    if (!academicYear || !startDate || !endDate) {
      return
    }

    updateAcademicYear(
      {
        id: academicYear.id,
        data: {
          name: data.name,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[500px]"
        onInteractOutside={(e) => {
          if (startDateOpen || endDateOpen) {
            e.preventDefault()
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit Academic Year</DialogTitle>
          <DialogDescription>Update academic year details. Only draft years can be edited.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Academic Year Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., 2025-26"
              {...register("name", { required: "Academic year name is required" })}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>
                Start Date <span className="text-destructive">*</span>
              </Label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen} modal={true}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" sideOffset={4}>
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date)
                      setStartDateOpen(false)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>
                End Date <span className="text-destructive">*</span>
              </Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen} modal={true}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" sideOffset={4}>
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date)
                      setEndDateOpen(false)
                    }}
                    disabled={(date) => (startDate ? date < startDate : false)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !startDate || !endDate}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Academic Year
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
