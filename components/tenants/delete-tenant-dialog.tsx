"use client"

import { Loader2, AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useDeleteTenant } from "@/hooks/use-tenants"

interface TenantData {
  id: string
  schoolName: string
}

interface DeleteTenantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenant: TenantData | null
}

export function DeleteTenantDialog({ open, onOpenChange, tenant }: DeleteTenantDialogProps) {
  const { mutate: deleteTenant, isPending } = useDeleteTenant()

  const handleDelete = () => {
    if (!tenant) return

    deleteTenant(tenant.id, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  if (!tenant) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Tenant
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete <strong>{tenant.schoolName}</strong>?
            </p>
            <p className="text-destructive">
              This action cannot be undone. All data associated with this tenant including users, students, and records
              will be permanently deleted.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Tenant
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
