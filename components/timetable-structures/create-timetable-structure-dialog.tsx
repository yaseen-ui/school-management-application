"use client"
import { useForm, Controller } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCreateTimetableStructure } from "@/hooks/use-timetable-structures"
import { Loader2 } from "lucide-react"

interface CreateTimetableStructureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FormData {
  name: string
  description: string
}

export function CreateTimetableStructureDialog({ open, onOpenChange }: CreateTimetableStructureDialogProps) {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      description: "",
    },
  })
  const createStructure = useCreateTimetableStructure()

  const onSubmit = async (data: FormData) => {
    await createStructure.mutateAsync({
      name: data.name,
      description: data.description || null,
    })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Timetable Structure</DialogTitle>
          <DialogDescription>Create a new timetable structure (e.g., Primary, Secondary, Pre-Primary)</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Structure Name *</Label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Structure name is required" }}
              render={({ field }) => (
                <Input id="name" placeholder="e.g., Primary, Secondary, Pre-Primary" {...field} />
              )}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="description"
                  placeholder="Optional description of this structure"
                  {...field}
                />
              )}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createStructure.isPending}>
              {createStructure.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Structure
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
