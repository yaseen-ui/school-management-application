"use client"

import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

import { ATTENDANCE_TYPE_CATEGORIES } from "@/lib/api/attendance"

interface CreateAttendanceTypeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    name: string
    category: "shift" | "period" | "exam"
    sortOrder: number
    isActive: boolean
  }) => Promise<void>
  isSubmitting?: boolean
}

export function CreateAttendanceTypeDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: CreateAttendanceTypeDialogProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      category: "shift" as string,
      sortOrder: 0,
      isActive: true,
    },
  })

  const category = watch("category")
  const isActive = watch("isActive")

  const handleFormSubmit = async (data: any) => {
    await onSubmit({
      name: data.name,
      category: data.category as "shift" | "period" | "exam",
      sortOrder: Number(data.sortOrder) || 0,
      isActive: data.isActive,
    })
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Attendance Type</DialogTitle>
          <DialogDescription>
            Add a new attendance type like Morning, Afternoon, Period, etc.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="e.g., Morning" {...register("name", { required: true })} />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setValue("category", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {ATTENDANCE_TYPE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input id="sortOrder" type="number" {...register("sortOrder")} />
          </div>

          <div className="flex items-center gap-2 rounded-lg border p-3">
            <Checkbox
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setValue("isActive", !!checked)}
            />
            <div>
              <Label htmlFor="isActive" className="text-base cursor-pointer">Active</Label>
              <p className="text-sm text-muted-foreground">
                Make this type available for attendance marking
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}