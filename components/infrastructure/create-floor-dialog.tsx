"use client"
import { useForm } from "react-hook-form"
import { Loader2, Layers } from "lucide-react"
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
import { useCreateFloor } from "@/hooks/use-buildings"

interface CreateFloorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  buildingId: string
}

interface FormData {
  floorNumber: number
  name: string
}

export function CreateFloorDialog({ open, onOpenChange, buildingId }: CreateFloorDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      floorNumber: 1,
      name: "",
    },
  })

  const createFloor = useCreateFloor()

  const onSubmit = async (data: FormData) => {
    await createFloor.mutateAsync({ ...data, buildingId })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Layers className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Add Floor</DialogTitle>
              <DialogDescription>Add a new floor to this building</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="floorNumber">
                Floor Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="floorNumber"
                type="number"
                min={0}
                placeholder="e.g., 1, 2, 3"
                {...register("floorNumber", {
                  required: "Floor number is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Floor number must be 0 or greater" },
                })}
              />
              {errors.floorNumber && <p className="text-sm text-destructive">{errors.floorNumber.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Floor Name (Optional)</Label>
              <Input
                id="name"
                placeholder="e.g., Ground Floor, First Floor"
                {...register("name")}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createFloor.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createFloor.isPending}>
              {createFloor.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Floor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
