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
import { useDeleteStoreKit } from "@/hooks/use-store"
import { Loader2 } from "lucide-react"
import type { StoreKit } from "@/lib/api/store"

interface DeleteKitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  kit: StoreKit | null
}

export function DeleteKitDialog({ open, onOpenChange, kit }: DeleteKitDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const deleteKit = useDeleteStoreKit()

  const handleDelete = async () => {
    if (!kit) return
    setIsDeleting(true)
    try {
      await deleteKit.mutateAsync(kit.id)
      onOpenChange(false)
    } catch {
      // Error handled by hook
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Kit</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{kit?.name}</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
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
