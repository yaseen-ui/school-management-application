"use client"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Loader2, DoorOpen } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUpdateRoom } from "@/hooks/use-buildings"
import type { Room } from "@/lib/api/buildings"

interface EditRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  room: Room | null
}

interface FormData {
  roomNumber: string
  roomName: string
  roomType: string
  roomCategory: string
  capacity: number
  status: string
}

const ROOM_TYPES = [
  { value: "classroom", label: "Classroom" },
  { value: "laboratory", label: "Laboratory" },
  { value: "library", label: "Library" },
  { value: "auditorium", label: "Auditorium" },
  { value: "office", label: "Office" },
  { value: "staff_room", label: "Staff Room" },
  { value: "computer_lab", label: "Computer Lab" },
  { value: "science_lab", label: "Science Lab" },
  { value: "language_lab", label: "Language Lab" },
  { value: "sports_hall", label: "Sports Hall" },
  { value: "art_room", label: "Art Room" },
  { value: "music_room", label: "Music Room" },
  { value: "seminar_hall", label: "Seminar Hall" },
  { value: "conference_room", label: "Conference Room" },
  { value: "other", label: "Other" },
]

const ROOM_CATEGORIES = [
  { value: "ac", label: "AC" },
  { value: "non_ac", label: "Non-AC" },
  { value: "deluxe", label: "Deluxe" },
]

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
]

export function EditRoomDialog({ open, onOpenChange, room }: EditRoomDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>()

  const updateRoom = useUpdateRoom()

  useEffect(() => {
    if (room) {
      reset({
        roomNumber: room.roomNumber,
        roomName: room.roomName || "",
        roomType: room.roomType,
        roomCategory: room.roomCategory || "non_ac",
        capacity: room.capacity,
        status: room.status,
      })
    }
  }, [room, reset])

  const onSubmit = async (data: FormData) => {
    if (!room) return
    await updateRoom.mutateAsync({ id: room.id, data })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <DoorOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Edit Room</DialogTitle>
              <DialogDescription>Update room details</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roomNumber">
                  Room Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="roomNumber"
                  {...register("roomNumber", { required: "Room number is required" })}
                />
                {errors.roomNumber && <p className="text-sm text-destructive">{errors.roomNumber.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomName">Room Name</Label>
                <Input id="roomName" {...register("roomName")} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roomType">Room Type</Label>
                <Select
                  defaultValue={room?.roomType || "classroom"}
                  onValueChange={(v) => setValue("roomType", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOM_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomCategory">Room Category</Label>
                <Select
                  defaultValue={room?.roomCategory || "non_ac"}
                  onValueChange={(v) => setValue("roomCategory", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOM_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">
                  Capacity <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  min={1}
                  {...register("capacity", {
                    required: "Capacity is required",
                    valueAsNumber: true,
                    min: { value: 1, message: "Capacity must be at least 1" },
                  })}
                />
                {errors.capacity && <p className="text-sm text-destructive">{errors.capacity.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  defaultValue={room?.status || "active"}
                  onValueChange={(v) => setValue("status", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateRoom.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateRoom.isPending}>
              {updateRoom.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Room
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
