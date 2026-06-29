"use client"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Loader2, FolderTree } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useCreateStoreCategory } from "@/hooks/use-store"

interface CreateCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCategoryDialog({ open, onOpenChange }: CreateCategoryDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      sortOrder: 0,
      isActive: true,
    },
  })
  const createCategory = useCreateStoreCategory()
  const isActive = watch("isActive")

  const onSubmit = async (data: any) => {
    try {
      await createCategory.mutateAsync({
        name: data.name,
        description: data.description || undefined,
        sortOrder: Number(data.sortOrder),
        isActive: data.isActive,
      })
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
              <FolderTree className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Create Category</DialogTitle>
              <DialogDescription>Add a new store category (e.g., Accessories, Books, Uniforms).</DialogDescription>
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
                Category Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Accessories, Books"
                {...register("name", { required: "Category name is required" })}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this category"
                {...register("description")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  placeholder="0"
                  {...register("sortOrder", { valueAsNumber: true })}
                />
              </div>

              <div className="flex items-end space-x-2 rounded-lg border p-4">
                <Checkbox
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={(checked) => setValue("isActive", checked === true)}
                />
                <div>
                  <Label htmlFor="isActive" className="text-base font-medium">Active</Label>
                  <p className="text-sm text-muted-foreground">If enabled, category is visible in the store</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createCategory.isPending}>
              {createCategory.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
