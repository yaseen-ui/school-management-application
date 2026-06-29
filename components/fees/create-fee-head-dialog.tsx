"use client"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Loader2, ListOrdered } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useCreateFeeHead } from "@/hooks/use-fees"
import type { CreateFeeHeadRequest } from "@/lib/api/fees"

interface CreateFeeHeadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateFeeHeadDialog({ open, onOpenChange }: CreateFeeHeadDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateFeeHeadRequest>({
    defaultValues: {
      isOptional: false,
      sortOrder: 0,
    },
  })
  const createFeeHead = useCreateFeeHead()
  const isOptional = watch("isOptional")

  const onSubmit = async (data: CreateFeeHeadRequest) => {
    try {
      await createFeeHead.mutateAsync(data)
      reset()
      onOpenChange(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <ListOrdered className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Create New Fee Head</DialogTitle>
              <DialogDescription>Add a new fee head category for your institution</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">
                Fee Head Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Tuition Fee, Admission Fee"
                {...register("name", { required: "Fee head name is required" })}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Brief description of this fee head"
                {...register("description")}
              />
            </div>

            <div className="flex items-center space-x-2 rounded-lg border p-4">
              <Checkbox
                id="isOptional"
                checked={isOptional}
                onCheckedChange={(checked) => setValue("isOptional", checked === true)}
              />
              <div>
                <Label htmlFor="isOptional" className="text-base font-medium">Optional Fee Head</Label>
                <p className="text-sm text-muted-foreground">If enabled, this fee head is optional for students</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input
                id="sortOrder"
                type="number"
                placeholder="0"
                {...register("sortOrder", { valueAsNumber: true })}
              />
            </div>
          </motion.div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createFeeHead.isPending}>
              {createFeeHead.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Fee Head
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
