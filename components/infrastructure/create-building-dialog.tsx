"use client"
import { useForm } from "react-hook-form"
import { Loader2, Building2 } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useCreateBuilding } from "@/hooks/use-buildings"

interface CreateBuildingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FormData {
  name: string
  code: string
  description: string
}

export function CreateBuildingDialog({ open, onOpenChange }: CreateBuildingDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  })

  const createBuilding = useCreateBuilding()

  const onSubmit = async (data: FormData) => {
    await createBuilding.mutateAsync(data)
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Add Building</DialogTitle>
              <DialogDescription>Add a new building or block to your institute</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Building Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Main Building, Science Block"
                {...register("name", { required: "Building name is required" })}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Building Code</Label>
              <Input
                id="code"
                placeholder="e.g., MB, SB"
                {...register("code")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the building..."
                {...register("description")}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createBuilding.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createBuilding.isPending}>
              {createBuilding.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Building
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
