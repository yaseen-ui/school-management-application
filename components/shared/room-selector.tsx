"use client"

import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import { Building2, Layers, DoorOpen } from "lucide-react"
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

interface RoomSelectorProps {
  /** The field name in the form to store the selected roomId */
  fieldName?: string
  /** Optional initial roomId to pre-select (for edit mode) */
  initialRoomId?: string
  /** Whether the field is required */
  required?: boolean
  /** Custom labels for the dropdowns */
  labels?: {
    building?: string
    floor?: string
    room?: string
  }
}

export function RoomSelector({
  fieldName = "roomId",
  initialRoomId,
  required = false,
  labels,
}: RoomSelectorProps) {
  const { data: buildingsData, isLoading: buildingsLoading } = useBuildings()
  const { setValue, watch, formState: { errors } } = useFormContext()

  const buildings: Building[] = buildingsData?.data ?? []

  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("")
  const [selectedFloorId, setSelectedFloorId] = useState<string>("")
  const [selectedRoomId, setSelectedRoomId] = useState<string>(initialRoomId ?? "")

  // On mount, if initialRoomId is provided, resolve the building/floor hierarchy
  useEffect(() => {
    if (initialRoomId && buildings.length > 0) {
      // Find which room this is by checking all floors
      for (const building of buildings) {
        for (const floor of building.floors ?? []) {
          const room = floor.rooms?.find((r) => r.id === initialRoomId)
          if (room) {
            setSelectedBuildingId(building.id)
            setSelectedFloorId(floor.id)
            setSelectedRoomId(room.id)
            setValue(fieldName, room.id)
            return
          }
        }
      }
    }
  }, [initialRoomId, buildings, fieldName, setValue])

  const selectedBuilding = buildings.find((b) => b.id === selectedBuildingId)
  const floors: Floor[] = selectedBuilding?.floors ?? []
  const selectedFloor = floors.find((f) => f.id === selectedFloorId)
  const rooms: Room[] = selectedFloor?.rooms ?? []

  const handleBuildingChange = (buildingId: string) => {
    setSelectedBuildingId(buildingId)
    setSelectedFloorId("")
    setSelectedRoomId("")
    setValue(fieldName, "")
  }

  const handleFloorChange = (floorId: string) => {
    setSelectedFloorId(floorId)
    setSelectedRoomId("")
    setValue(fieldName, "")
  }

  const handleRoomChange = (roomId: string) => {
    setSelectedRoomId(roomId)
    setValue(fieldName, roomId, { shouldValidate: true })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span>{labels?.building ?? "Building"}</span>
            {required && <span className="text-destructive">*</span>}
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
            <span>{labels?.floor ?? "Floor"}</span>
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
            <span>{labels?.room ?? "Room"}</span>
            {required && <span className="text-destructive">*</span>}
          </div>
        </Label>
        <Select
          value={selectedRoomId}
          onValueChange={handleRoomChange}
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
        {errors[fieldName] && (
          <p className="text-sm text-destructive">{String(errors[fieldName]?.message ?? "")}</p>
        )}
      </div>
    </div>
  )
}
