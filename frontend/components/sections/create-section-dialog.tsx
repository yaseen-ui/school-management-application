"use client"
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
import { useCreateSection } from "@/hooks/use-sections"
import { HierarchicalFilter } from "@/components/shared/hierarchical-filter"

interface CreateSectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FormData {
  sectionName: string
  gradeId: string
  subjectIds: string[]
}

export function CreateSectionDialog({ open, onOpenChange }: CreateSectionDialogProps) {
  const methods = useForm<FormData>({
    defaultValues: {
      sectionName: "",
      gradeId: "",
      subjectIds: [],
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods

  const createSection = useCreateSection()

  const onSubmit = async (data: FormData) => {
    console.log("[v0] Create section form data:", data)
    await createSection.mutateAsync(data)
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Create Section</DialogTitle>
              <DialogDescription>Add a new section to your institute</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <FormProvider {...methods}>
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
                  filters={["courses", "grades", "subjects"]}
                  required={{ courseId: false, gradeId: true, subjectIds: true }}
                  labels={{
                    courseId: "Course (Optional)",
                    gradeId: "Grade",
                    subjectIds: "Subjects",
                  }}
                />
                {errors.gradeId && <p className="text-sm text-destructive">{errors.gradeId.message}</p>}
                {errors.subjectIds && <p className="text-sm text-destructive">At least one subject is required</p>}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createSection.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createSection.isPending}>
                {createSection.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Section
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
