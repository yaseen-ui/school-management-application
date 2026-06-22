"use client"

import { useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { Loader2, Users } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useUpdateSection } from "@/hooks/use-sections"
import { HierarchicalFilter } from "@/components/shared/hierarchical-filter"
import { RoomSelector } from "@/components/shared/room-selector"
import type { Section } from "@/lib/api/sections"

interface EditSectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  section: Section | null
}

interface FormData {
  sectionName: string
  gradeId: string
  roomId: string
}

export function EditSectionDialog({ open, onOpenChange, section }: EditSectionDialogProps) {
  const form = useForm<FormData>()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form

  const updateSection = useUpdateSection()

  useEffect(() => {
    if (section && open) {
      reset({
        sectionName: section.sectionName,
        gradeId: section.gradeId,
        roomId: section.roomId ?? "",
      })
    }
  }, [section, open, reset])

  const onSubmit = async (data: FormData) => {
    if (!section) return

    console.log("[v0] Update section form data:", data)
    await updateSection.mutateAsync({
      id: section.id,
      data: {
        sectionId: section.id,
        sectionName: data.sectionName,
        gradeId: data.gradeId,
        roomId: data.roomId || undefined,
      },
    })
    onOpenChange(false)
  }

  if (!section) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Edit Section</DialogTitle>
              <DialogDescription>Update section information</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sectionName">
                  Section Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="sectionName"
                  placeholder="e.g., Section A"
                  {...register("sectionName", { required: "Section name is required" })}
                />
                {errors.sectionName && <p className="text-sm text-destructive">{errors.sectionName.message}</p>}
              </div>

              <div className="space-y-2">
                <HierarchicalFilter
                  filters={["courses", "grades"]}
                  required={{ courseId: false, gradeId: true }}
                  labels={{
                    courseId: "Course",
                    gradeId: "Grade",
                  }}
                />
                {errors.gradeId && <p className="text-sm text-destructive">{errors.gradeId.message}</p>}
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Classroom Assignment (Optional)</h4>
                <RoomSelector fieldName="roomId" initialRoomId={section.roomId ?? undefined} />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateSection.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateSection.isPending}>
                {updateSection.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Section
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
