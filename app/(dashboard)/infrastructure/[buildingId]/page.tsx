"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Building2,
  Layers,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  DoorOpen,
  ArrowLeft,
  Users,
  Snowflake,
  Sparkles,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBuilding } from "@/hooks/use-buildings"
import { CreateFloorDialog } from "@/components/infrastructure/create-floor-dialog"
import { EditFloorDialog } from "@/components/infrastructure/edit-floor-dialog"
import { DeleteFloorDialog } from "@/components/infrastructure/delete-floor-dialog"
import { CreateRoomDialog } from "@/components/infrastructure/create-room-dialog"
import { EditRoomDialog } from "@/components/infrastructure/edit-room-dialog"
import { DeleteRoomDialog } from "@/components/infrastructure/delete-room-dialog"
import type { Floor, Room } from "@/lib/api/buildings"

const ROOM_TYPE_LABELS: Record<string, string> = {
  classroom: "Classroom",
  laboratory: "Laboratory",
  library: "Library",
  auditorium: "Auditorium",
  office: "Office",
  staff_room: "Staff Room",
  computer_lab: "Computer Lab",
  science_lab: "Science Lab",
  language_lab: "Language Lab",
  sports_hall: "Sports Hall",
  art_room: "Art Room",
  music_room: "Music Room",
  seminar_hall: "Seminar Hall",
  conference_room: "Conference Room",
  other: "Other",
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  ac: Snowflake,
  non_ac: Users,
  deluxe: Sparkles,
}

const CATEGORY_LABELS: Record<string, string> = {
  ac: "AC",
  non_ac: "Non-AC",
  deluxe: "Deluxe",
}

export default function BuildingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const buildingId = params.buildingId as string
  const { data, isLoading } = useBuilding(buildingId)

  const building = (data?.data || data) as any

  const [isCreateFloorOpen, setIsCreateFloorOpen] = useState(false)
  const [isEditFloorOpen, setIsEditFloorOpen] = useState(false)
  const [isDeleteFloorOpen, setIsDeleteFloorOpen] = useState(false)
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null)

  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false)
  const [isEditRoomOpen, setIsEditRoomOpen] = useState(false)
  const [isDeleteRoomOpen, setIsDeleteRoomOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [selectedFloorId, setSelectedFloorId] = useState<string>("")

  const handleEditFloor = (floor: Floor) => {
    setSelectedFloor(floor)
    setIsEditFloorOpen(true)
  }

  const handleDeleteFloor = (floor: Floor) => {
    setSelectedFloor(floor)
    setIsDeleteFloorOpen(true)
  }

  const handleCreateRoom = (floorId: string) => {
    setSelectedFloorId(floorId)
    setIsCreateRoomOpen(true)
  }

  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room)
    setIsEditRoomOpen(true)
  }

  const handleDeleteRoom = (room: Room) => {
    setSelectedRoom(room)
    setIsDeleteRoomOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!building) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <p className="text-muted-foreground">Building not found.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PageHeader
        title={building.name}
        description={building.description || `Code: ${building.code || "N/A"}`}
      >
        <Button variant="ghost" onClick={() => router.push("/infrastructure")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Buildings
        </Button>
        <Button onClick={() => setIsCreateFloorOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Floor
        </Button>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Floors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{building.floors?.length || 0}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DoorOpen className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">
                {building.floors?.reduce((sum: number, f: Floor) => sum + (f.rooms?.length || 0), 0) || 0}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">
                {building.floors?.reduce(
                  (sum: number, f: Floor) => sum + (f.rooms?.reduce((s: number, r: Room) => s + r.capacity, 0) || 0),
                  0
                ) || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floors & Rooms */}
      {(!building.floors || building.floors.length === 0) ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Layers className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No floors yet</p>
            <p className="text-sm text-muted-foreground mb-4">Add floors to this building to start organizing rooms.</p>
            <Button onClick={() => setIsCreateFloorOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Floor
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {building.floors.map((floor: Floor) => (
            <motion.div
              key={floor.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Layers className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          Floor {floor.floorNumber}
                          {floor.name && <span className="text-muted-foreground font-normal"> - {floor.name}</span>}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {floor.rooms?.length || 0} rooms
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCreateRoom(floor.id)}
                      >
                        <Plus className="mr-1 h-3.5 w-3.5" />
                        Add Room
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditFloor(floor)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Floor
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteFloor(floor)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Floor
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>

                {floor.rooms && floor.rooms.length > 0 && (
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {floor.rooms.map((room: Room) => {
                        const CategoryIcon = CATEGORY_ICONS[room.roomCategory || "non_ac"] || Users
                        return (
                          <div
                            key={room.id}
                            className="group relative rounded-lg border bg-card p-3 hover:shadow-md transition-all"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2 min-w-0">
                                <DoorOpen className="h-4 w-4 text-primary shrink-0" />
                                <div className="min-w-0">
                                  <p className="font-medium text-sm truncate">{room.roomNumber}</p>
                                  {room.roomName && (
                                    <p className="text-xs text-muted-foreground truncate">{room.roomName}</p>
                                  )}
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditRoom(room)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => handleDeleteRoom(room)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {ROOM_TYPE_LABELS[room.roomType] || room.roomType}
                              </Badge>
                              {room.roomCategory && (
                                <Badge variant="outline" className="text-xs gap-1">
                                  <CategoryIcon className="h-3 w-3" />
                                  {CATEGORY_LABELS[room.roomCategory] || room.roomCategory}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              Capacity: <span className="font-medium">{room.capacity}</span>
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                )}

                {(!floor.rooms || floor.rooms.length === 0) && (
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <DoorOpen className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">No rooms on this floor</p>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => handleCreateRoom(floor.id)}
                      >
                        Add Room
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <CreateFloorDialog
        open={isCreateFloorOpen}
        onOpenChange={setIsCreateFloorOpen}
        buildingId={buildingId}
      />
      <EditFloorDialog
        open={isEditFloorOpen}
        onOpenChange={setIsEditFloorOpen}
        floor={selectedFloor}
      />
      <DeleteFloorDialog
        open={isDeleteFloorOpen}
        onOpenChange={setIsDeleteFloorOpen}
        floor={selectedFloor}
      />
      <CreateRoomDialog
        open={isCreateRoomOpen}
        onOpenChange={setIsCreateRoomOpen}
        floorId={selectedFloorId}
      />
      <EditRoomDialog
        open={isEditRoomOpen}
        onOpenChange={setIsEditRoomOpen}
        room={selectedRoom}
      />
      <DeleteRoomDialog
        open={isDeleteRoomOpen}
        onOpenChange={setIsDeleteRoomOpen}
        room={selectedRoom}
      />
    </motion.div>
  )
}
