"use client"
import { Loader2, DoorOpen, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useDeleteRoom } from "@/hooks/use-buildings"
import type { Room } from "@/lib/api/buildings"

interface DeleteRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  room: Room | null
}

export function DeleteRoomDialog({ open, onOpenChange, room }: DeleteRoomDialogProps) {
  const deleteRoom = useDeleteRoom()

  const handleDelete = async () => {
    if (!room) return
    await deleteRoom.mutateAsync(room.id)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <DoorOpen className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Delete Room</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this room? This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {room && (
          <div className="flex items-start gap-3 rounded-lg border bg-muted/50 p-4">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Room {room.roomNumber}{room.roomName ? ` - ${room.roomName}` : ""}</p>
              <p className="text-muted-foreground">Capacity: {room.capacity}</p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteRoom.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteRoom.isPending}
          >
            {deleteRoom.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
