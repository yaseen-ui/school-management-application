"use client"
import { Loader2, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useDeleteHostelBlock } from "@/hooks/use-hostel"
import type { HostelBlock } from "@/lib/api/hostel"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  block: HostelBlock
}

export function DeleteBlockDialog({ open, onOpenChange, block }: Props) {
  const del = useDeleteHostelBlock()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Delete Hostel Block</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Are you sure you want to delete <strong>{block.name}</strong>? 
                This will fail if there are active student allocations in this block.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" disabled={del.isPending} onClick={() => del.mutate(block.id, { onSuccess: () => onOpenChange(false) })}>
            {del.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Delete Block
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}