"use client"
import { useEffect } from "react"
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
import { useUpdateBuilding } from "@/hooks/use-buildings"
import type { Building } from "@/lib/api/buildings"

interface EditBuildingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  building: Building | null
}

interface FormData {
  name: string
  code: string
  description: string
}

export function EditBuildingDialog({ open, onOpenChange, building }: EditBuildingDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>()

  const updateBuilding = useUpdateBuilding()

  useEffect(() => {
    if (building) {
      reset({
        name: building.name,
        code: building.code || "",
        description: building.description || "",
      })
    }
  }, [building, reset])

  const onSubmit = async (data: FormData) => {
    if (!building) return
    await updateBuilding.mutateAsync({ id: building.id, data })
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
              <DialogTitle>Edit Building</DialogTitle>
              <DialogDescription>Update building details</DialogDescription>
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
                {...register("name", { required: "Building name is required" })}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Building Code</Label>
              <Input id="code" {...register("code")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description")} />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateBuilding.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateBuilding.isPending}>
              {updateBuilding.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Building
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
