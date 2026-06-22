"use client"
import { useEffect } from "react"
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
import { useUpdateFloor } from "@/hooks/use-buildings"
import type { Floor } from "@/lib/api/buildings"

interface EditFloorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  floor: Floor | null
}

interface FormData {
  floorNumber: number
  name: string
}

export function EditFloorDialog({ open, onOpenChange, floor }: EditFloorDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>()

  const updateFloor = useUpdateFloor()

  useEffect(() => {
    if (floor) {
      reset({
        floorNumber: floor.floorNumber,
        name: floor.name || "",
      })
    }
  }, [floor, reset])

  const onSubmit = async (data: FormData) => {
    if (!floor) return
    await updateFloor.mutateAsync({ id: floor.id, data })
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
              <DialogTitle>Edit Floor</DialogTitle>
              <DialogDescription>Update floor details</DialogDescription>
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
                {...register("floorNumber", {
                  required: "Floor number is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Floor number must be 0 or greater" },
                })}
              />
              {errors.floorNumber && <p className="text-sm text-destructive">{errors.floorNumber.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Floor Name</Label>
              <Input id="name" {...register("name")} />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateFloor.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateFloor.isPending}>
              {updateFloor.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Floor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
