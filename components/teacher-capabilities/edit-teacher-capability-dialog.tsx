"use client"
import { useForm, Controller } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useUpdateTeacherCapability } from "@/hooks/use-teacher-capabilities"
import { Loader2 } from "lucide-react"
import type { TeacherCapability } from "@/lib/api/teacher-capabilities"

interface EditTeacherCapabilityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  capability: TeacherCapability | null
}

interface FormData {
  expertiseLevel: string
  isPrimary: boolean
  priorityScore: number
  canBeClassTeacher: boolean
  remarks: string
}

export function EditTeacherCapabilityDialog({ open, onOpenChange, capability }: EditTeacherCapabilityDialogProps) {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    defaultValues: {
      expertiseLevel: capability?.expertiseLevel || "intermediate",
      isPrimary: capability?.isPrimary || false,
      priorityScore: capability?.priorityScore || 50,
      canBeClassTeacher: capability?.canBeClassTeacher || false,
      remarks: capability?.remarks || "",
    },
  })
  const updateCapability = useUpdateTeacherCapability()

  const onSubmit = async (data: FormData) => {
    if (!capability) return
    await updateCapability.mutateAsync({
      id: capability.id,
      data: {
        expertiseLevel: data.expertiseLevel as any,
        isPrimary: data.isPrimary,
        priorityScore: data.priorityScore,
        canBeClassTeacher: data.canBeClassTeacher,
        remarks: data.remarks || null,
      },
    })
    onOpenChange(false)
  }

  if (!capability) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Teacher Capability</DialogTitle>
          <DialogDescription>
            Update capability for {capability.teacher?.fullName} - {capability.subject?.subjectName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Teacher</Label>
            <p className="text-sm font-medium">{capability.teacher?.fullName}</p>
          </div>

          <div className="space-y-2">
            <Label>Subject</Label>
            <p className="text-sm font-medium">{capability.subject?.subjectName}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expertiseLevel">Expertise Level *</Label>
            <Controller
              name="expertiseLevel"
              control={control}
              rules={{ required: "Expertise level is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priorityScore">Priority Score (0-100)</Label>
            <Controller
              name="priorityScore"
              control={control}
              render={({ field }) => (
                <Input
                  id="priorityScore"
                  type="number"
                  min={0}
                  max={100}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              )}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="isPrimary"
              control={control}
              render={({ field }) => <Checkbox id="isPrimary" checked={field.value} onCheckedChange={field.onChange} />}
            />
            <Label htmlFor="isPrimary" className="text-sm font-normal cursor-pointer">
              Primary capability for this subject
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="canBeClassTeacher"
              control={control}
              render={({ field }) => (
                <Checkbox id="canBeClassTeacher" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <Label htmlFor="canBeClassTeacher" className="text-sm font-normal cursor-pointer">
              Can be assigned as class teacher
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateCapability.isPending}>
              {updateCapability.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Capability
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
