"use client"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Loader2, FolderTree } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useUpdateStoreCategory } from "@/hooks/use-store"
import type { StoreCategory } from "@/lib/api/store"

interface EditCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: StoreCategory | null
}

export function EditCategoryDialog({ open, onOpenChange, category }: EditCategoryDialogProps) {
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
  const updateCategory = useUpdateStoreCategory()
  const isActive = watch("isActive")

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description || "",
        sortOrder: category.sortOrder,
        isActive: category.isActive,
      })
    }
  }, [category, reset])

  const onSubmit = async (data: any) => {
    if (!category) return
    try {
      await updateCategory.mutateAsync({
        id: category.id,
        data: {
          name: data.name,
          description: data.description || undefined,
          sortOrder: Number(data.sortOrder),
          isActive: data.isActive,
        },
      })
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
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>Update the store category details.</DialogDescription>
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
            <Button type="submit" disabled={updateCategory.isPending}>
              {updateCategory.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
