"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import { useUpdateSectionSubject } from "@/hooks/use-section-subjects"
import type { SectionSubject } from "@/lib/api/section-subjects"

interface FormData {
  isElective: boolean
}

interface EditSectionSubjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sectionSubject: SectionSubject | null
}

export function EditSectionSubjectDialog({ open, onOpenChange, sectionSubject }: EditSectionSubjectDialogProps) {
  const updateMutation = useUpdateSectionSubject()

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    defaultValues: {
      isElective: false,
    },
  })

  useEffect(() => {
    if (sectionSubject) {
      reset({
        isElective: sectionSubject.isElective,
      })
    }
  }, [sectionSubject, reset])

  const onSubmit = async (data: FormData) => {
    if (!sectionSubject) return
    await updateMutation.mutateAsync({ id: sectionSubject.id, data })
    onOpenChange(false)
  }

  if (!sectionSubject) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Edit Section Subject</DialogTitle>
          <DialogDescription>
            Update the section-subject assignment for {sectionSubject.subject?.subjectName} in{" "}
            {sectionSubject.section?.sectionName}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 rounded-md bg-muted/50 p-3 mb-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Section</p>
            <p className="text-sm font-medium">{sectionSubject.section?.sectionName}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Subject</p>
            <p className="text-sm font-medium">{sectionSubject.subject?.subjectName}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center space-x-2">
            <Controller
              name="isElective"
              control={control}
              render={({ field }) => <Checkbox id="isElective" checked={field.value} onCheckedChange={field.onChange} />}
            />
            <Label htmlFor="isElective" className="text-sm font-normal cursor-pointer">
              Elective subject for this section
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
