"use client"

import { useState, useEffect } from "react"
import { Building2, Layers, DoorOpen, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useBuildings } from "@/hooks/use-buildings"
import type { Building, Floor, Room } from "@/lib/api/buildings"

interface SelectedRoomInfo {
  roomId: string
  display: string // e.g., "Main Building > Floor 1 > Room 101"
}

interface RoomSelectorDialogProps {
  /** Currently selected roomId (for edit mode) */
  selectedRoomId?: string
  /** Callback when a room is selected */
  onRoomSelect: (info: SelectedRoomInfo) => void
  /** Trigger button label */
  triggerLabel?: string
  /** Dialog title */
  title?: string
}

export function RoomSelectorDialog({
  selectedRoomId,
  onRoomSelect,
  triggerLabel = "Select Room",
  title = "Select Classroom",
}: RoomSelectorDialogProps) {
  const [open, setOpen] = useState(false)
  const { data: buildingsData, isLoading: buildingsLoading } = useBuildings()

  const buildings: Building[] = buildingsData?.data ?? []

  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("")
  const [selectedFloorId, setSelectedFloorId] = useState<string>("")
  const [localSelectedRoomId, setLocalSelectedRoomId] = useState<string>("")

  // On mount, if selectedRoomId is provided, resolve the building/floor hierarchy
  useEffect(() => {
    if (selectedRoomId && buildings.length > 0 && open) {
      for (const building of buildings) {
        for (const floor of building.floors ?? []) {
          const room = floor.rooms?.find((r) => r.id === selectedRoomId)
          if (room) {
            setSelectedBuildingId(building.id)
            setSelectedFloorId(floor.id)
            setLocalSelectedRoomId(room.id)
            return
          }
        }
      }
    }
  }, [selectedRoomId, buildings, open])

  // Reset when dialog opens without a pre-selected room
  useEffect(() => {
    if (open && !selectedRoomId) {
      setSelectedBuildingId("")
      setSelectedFloorId("")
      setLocalSelectedRoomId("")
    }
  }, [open, selectedRoomId])

  const selectedBuilding = buildings.find((b) => b.id === selectedBuildingId)
  const floors: Floor[] = selectedBuilding?.floors ?? []
  const selectedFloor = floors.find((f) => f.id === selectedFloorId)
  const rooms: Room[] = selectedFloor?.rooms ?? []

  const handleBuildingChange = (buildingId: string) => {
    setSelectedBuildingId(buildingId)
    setSelectedFloorId("")
    setLocalSelectedRoomId("")
  }

  const handleFloorChange = (floorId: string) => {
    setSelectedFloorId(floorId)
    setLocalSelectedRoomId("")
  }

  const handleConfirm = () => {
    if (!localSelectedRoomId) return

    const building = buildings.find((b) => b.id === selectedBuildingId)
    const floor = building?.floors?.find((f) => f.id === selectedFloorId)
    const room = floor?.rooms?.find((r) => r.id === localSelectedRoomId)

    if (building && floor && room) {
      const display = `${building.name} > ${floor.name ?? `Floor ${floor.floorNumber}`} > ${room.roomNumber}${room.roomName ? ` - ${room.roomName}` : ""}`
      onRoomSelect({ roomId: localSelectedRoomId, display })
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 w-full justify-start text-left font-normal">
          {selectedRoomId ? (
            <span className="truncate text-xs">
              <SelectedRoomDisplay roomId={selectedRoomId} />
            </span>
          ) : (
            <span className="text-muted-foreground text-xs">{triggerLabel}</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>Building</span>
              </div>
            </Label>
            <Select
              value={selectedBuildingId}
              onValueChange={handleBuildingChange}
              disabled={buildingsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={buildingsLoading ? "Loading buildings..." : "Select a building"} />
              </SelectTrigger>
              <SelectContent>
                {buildings.map((building) => (
                  <SelectItem key={building.id} value={building.id}>
                    {building.name}
                    {building.code ? ` (${building.code})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <span>Floor</span>
              </div>
            </Label>
            <Select
              value={selectedFloorId}
              onValueChange={handleFloorChange}
              disabled={!selectedBuildingId}
            >
              <SelectTrigger>
                <SelectValue placeholder={!selectedBuildingId ? "Select a building first" : "Select a floor"} />
              </SelectTrigger>
              <SelectContent>
                {floors.map((floor) => (
                  <SelectItem key={floor.id} value={floor.id}>
                    {floor.name ?? `Floor ${floor.floorNumber}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              <div className="flex items-center gap-2">
                <DoorOpen className="h-4 w-4 text-muted-foreground" />
                <span>Room</span>
              </div>
            </Label>
            <Select
              value={localSelectedRoomId}
              onValueChange={setLocalSelectedRoomId}
              disabled={!selectedFloorId}
            >
              <SelectTrigger>
                <SelectValue placeholder={!selectedFloorId ? "Select a floor first" : "Select a room"} />
              </SelectTrigger>
              <SelectContent>
                {rooms
                  .filter((room) => room.status === "active")
                  .map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.roomNumber}
                      {room.roomName ? ` - ${room.roomName}` : ""}
                      {` (${room.capacity})`}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleConfirm} disabled={!localSelectedRoomId}>
              <Check className="h-4 w-4 mr-1" />
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Helper component to display the selected room's hierarchical name
 * Used inside the trigger button to show the current selection
 */
function SelectedRoomDisplay({ roomId }: { roomId: string }) {
  const { data: buildingsData } = useBuildings()
  const buildings: Building[] = buildingsData?.data ?? []

  for (const building of buildings) {
    for (const floor of building.floors ?? []) {
      const room = floor.rooms?.find((r) => r.id === roomId)
      if (room) {
        return (
          <span>
            {building.name} {">"} {floor.name ?? `Floor ${floor.floorNumber}`} {">"} {room.roomNumber}
          </span>
        )
      }
    }
  }

  return <span className="text-muted-foreground">Room not found</span>
}
