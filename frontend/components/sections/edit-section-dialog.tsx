"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
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
import { Checkbox } from "@/components/ui/checkbox"
import { useUpdateSection } from "@/hooks/use-sections"
import { useSubjects } from "@/hooks/use-subjects"
import { HierarchicalFilter } from "@/components/shared/hierarchical-filter"
import type { Section } from "@/lib/api/sections"

interface EditSectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  section: Section | null
}

interface FormData {
  sectionName: string
  gradeId: string
  subjectIds: string[]
}

export function EditSectionDialog({ open, onOpenChange, section }: EditSectionDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>()

  const updateSection = useUpdateSection()
  const { data: subjectsData } = useSubjects()

  const subjects = subjectsData || []
  const selectedSubjects = watch("subjectIds")

  useEffect(() => {
    if (section && open) {
      reset({
        sectionName: section.sectionName,
        gradeId: section.gradeId,
        subjectIds: section.subjects?.map((subject: { id: any }) => subject.id) || [],
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
        ...data,
      },
    })
    onOpenChange(false)
  }

  const handleSubjectToggle = (subjectId: string, checked: boolean) => {
    const current = selectedSubjects || []
    if (checked) {
      setValue("subjectIds", [...current, subjectId])
    } else {
      setValue(
        "subjectIds",
        current.filter((id) => id !== subjectId),
      )
    }
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
                control={control}
                filters={["courses", "grades"]}
                required={{ courseId: false, gradeId: true }}
                labels={{
                  courseId: "Course",
                  gradeId: "Grade",
                }}
              />
              {errors.gradeId && <p className="text-sm text-destructive">{errors.gradeId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>
                Subjects <span className="text-destructive">*</span>
              </Label>
              <div className="rounded-lg border p-4 space-y-3 max-h-[200px] overflow-y-auto">
                {subjects.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">No subjects available</p>
                ) : (
                  subjects.map((subject) => (
                    <div key={subject.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={subject.id}
                        checked={selectedSubjects?.includes(subject.id)}
                        onCheckedChange={(checked) => handleSubjectToggle(subject.id, checked as boolean)}
                      />
                      <label
                        htmlFor={subject.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {subject.subjectName}
                      </label>
                    </div>
                  ))
                )}
              </div>
              {errors.subjectIds && <p className="text-sm text-destructive">{errors.subjectIds.message}</p>}
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
      </DialogContent>
    </Dialog>
  )
}
