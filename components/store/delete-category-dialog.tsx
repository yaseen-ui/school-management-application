"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDeleteStoreCategory } from "@/hooks/use-store"
import { Loader2 } from "lucide-react"
import type { StoreCategory } from "@/lib/api/store"

interface DeleteCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: StoreCategory | null
}

export function DeleteCategoryDialog({ open, onOpenChange, category }: DeleteCategoryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const deleteCategory = useDeleteStoreCategory()

  const handleDelete = async () => {
    if (!category) return
    setIsDeleting(true)
    try {
      await deleteCategory.mutateAsync(category.id)
      onOpenChange(false)
    } catch {
      // Error handled by hook
    } finally {
      setIsDeleting(false)
    }
  }

  if (!category) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{category.name}</strong>? This action cannot be undone.
            {category._count && category._count.products > 0 && (
              <p className="mt-2 text-destructive">
                This category has {category._count.products} product(s). You must remove them first.
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting || (category._count?.products ?? 0) > 0}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
