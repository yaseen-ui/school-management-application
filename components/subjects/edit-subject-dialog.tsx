"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useUpdateSubject } from "@/hooks/use-subjects"
import { Loader2 } from "lucide-react"
import type { Subject } from "@/lib/api/subjects"

interface EditSubjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subject: Subject | null
}

interface FormData {
  subjectName: string
  isCommon: boolean
}

export function EditSubjectDialog({ open, onOpenChange, subject }: EditSubjectDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>()
  const updateSubject = useUpdateSubject()

  useEffect(() => {
    if (subject && open) {
      reset({
        subjectName: subject.subjectName,
        isCommon: subject.isCommon,
      })
    }
  }, [subject, open, reset])

  const onSubmit = async (data: FormData) => {
    if (!subject) return

    console.log("[v0] Updating subject with data:", { ...data, subjectId: subject.id })
    await updateSubject.mutateAsync({
      id: subject.id,
      data: {
        subjectId: subject.id,
        subjectName: data.subjectName,
        isCommon: data.isCommon,
      },
    })
    onOpenChange(false)
  }

  if (!subject) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Subject</DialogTitle>
          <DialogDescription>Update subject information</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subjectName">Subject Name *</Label>
            <Input
              id="subjectName"
              placeholder="e.g., Mathematics, Physics"
              {...register("subjectName", { required: "Subject name is required" })}
            />
            {errors.subjectName && <p className="text-sm text-destructive">{errors.subjectName.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="isCommon"
              control={control}
              render={({ field }) => <Checkbox id="isCommon" checked={field.value} onCheckedChange={field.onChange} />}
            />
            <Label htmlFor="isCommon" className="text-sm font-normal cursor-pointer">
              Common subject (available across all grades)
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateSubject.isPending}>
              {updateSubject.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Subject
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
