"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Layers, DoorOpen, Trash2, Plus, X, Building2 } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { HierarchicalFilter } from "@/components/shared/hierarchical-filter"
import { useHostelSections, useCreateHostelSection, useDeleteHostelSection, useBatchAddRoomsToSection, useRemoveRoomFromSection, useHostelRooms, useHostelBlocks, useHostelFloors } from "@/hooks/use-hostel"
import type { HostelSection } from "@/lib/api/hostel"

interface SelectedRoom {
  roomId: string
  roomNumber: string
  roomType: string
  occupancy: string
  blockName: string
  blockId: string
  floorNumber: number
  floorId: string
}

export default function HostelSectionsPage() {
  const { data: hostelData, isLoading } = useHostelSections()
  const blocks = useHostelBlocks()
  const createHostelSection = useCreateHostelSection()
  const deleteHostelSection = useDeleteHostelSection()
  const batchAddRooms = useBatchAddRoomsToSection()
  const removeRoom = useRemoveRoomFromSection()

  const [courseId, setCourseId] = useState("")
  const [gradeId, setGradeId] = useState("")
  const [sectionId, setSectionId] = useState("")

  // Assignment panel state
  const [assignBlockId, setAssignBlockId] = useState("")
  const [assignFloorId, setAssignFloorId] = useState("")
  const [selectedRooms, setSelectedRooms] = useState<SelectedRoom[]>([])
  const [deleteItem, setDeleteItem] = useState<HostelSection | null>(null)

  const floors = useHostelFloors(assignBlockId || undefined)
  const rooms = useHostelRooms(assignFloorId ? { floorId: assignFloorId } : undefined)

  const hostelSections: HostelSection[] = Array.isArray(hostelData?.data) ? hostelData.data : []
  const blockList: any[] = Array.isArray(blocks.data?.data) ? blocks.data!.data : []
  const floorList: any[] = Array.isArray(floors.data?.data) ? floors.data!.data : []
  const roomList: any[] = Array.isArray(rooms.data?.data) ? rooms.data!.data : []

  const currentHostelSection = sectionId
    ? hostelSections.find(hs => (hs as any).sectionId === sectionId || (hs as any).section?.id === sectionId) || null
    : null

  // Get currently assigned room IDs for this section
  const assignedRoomIds = currentHostelSection?.sectionRooms?.map(sr => sr.roomId) || []

  const toggleRoom = (room: any) => {
    const blockName = blockList.find(b => b.id === assignBlockId)?.name || ""
    const idx = selectedRooms.findIndex(r => r.roomId === room.id)
    if (idx >= 0) {
      setSelectedRooms(prev => prev.filter(r => r.roomId !== room.id))
    } else {
      setSelectedRooms(prev => [...prev, {
        roomId: room.id,
        roomNumber: room.roomNumber,
        roomType: room.roomType?.name || "",
        occupancy: `${room._count?.studentAllocations ?? 0}/${room.capacity}`,
        blockName,
        blockId: assignBlockId,
        floorNumber: floorList.find(f => f.id === assignFloorId)?.floorNumber ?? 0,
        floorId: assignFloorId,
      }])
    }
  }

  const isRoomSelected = (roomId: string) => selectedRooms.some(r => r.roomId === roomId)
  const isRoomAssigned = (roomId: string) => assignedRoomIds.includes(roomId)

  const handleAssignAll = async () => {
    if (!sectionId || selectedRooms.length === 0) return
    const roomIds = selectedRooms.map(r => r.roomId)

    // Auto-create HostelSection if not exists
    if (!currentHostelSection) {
      createHostelSection.mutate(
        { sectionId, description: "" } as any,
        {
          onSuccess: (created: any) => {
            const hsId = created?.data?.id || (created as any)?.id
            if (hsId) {
              batchAddRooms.mutate({ sectionId: hsId, roomIds }, {
                onSuccess: () => setSelectedRooms([]),
                onError: () => {},
              })
            }
          },
        }
      )
    } else {
      batchAddRooms.mutate(
        { sectionId: currentHostelSection.id, roomIds },
        { onSuccess: () => setSelectedRooms([]) }
      )
    }
  }

  // Group selected rooms by block
  const groupedSelections: Record<string, SelectedRoom[]> = {}
  selectedRooms.forEach(r => {
    if (!groupedSelections[r.blockName]) groupedSelections[r.blockName] = []
    groupedSelections[r.blockName].push(r)
  })

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <PageHeader title="Hostel Sections" description="Select a school section and assign rooms from any block" />

      {/* Section Selector */}
      <Card className="p-4">
        <HierarchicalFilter
          filters={["courses", "grades", "sections"]}
          values={{ courseId: courseId || undefined, gradeId: gradeId || undefined, sectionId: sectionId || undefined }}
          onChange={({ courseId: c, gradeId: g, sectionId: s }) => {
            setCourseId(c || "")
            setGradeId(g || "")
            setSectionId(s || "")
          }}
        />
      </Card>

      {!sectionId ? (
        !isLoading && <EmptyState icon={Layers} title="Select a section" description="Use the filter to select a school section first." />
      ) : (
        <div className="space-y-4">
          {/* Assignment Panel */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">
              Assign Rooms: {currentHostelSection && (currentHostelSection as any)?.section?.sectionName || "New Section"}
              {currentHostelSection && <span className="text-sm font-normal text-muted-foreground ml-2">({assignedRoomIds.length} rooms currently assigned)</span>}
            </h3>

            {/* Block → Floor → Room cascade */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label>Hostel Block</Label>
                <Select value={assignBlockId} onValueChange={(v) => { setAssignBlockId(v); setAssignFloorId("") }}>
                  <SelectTrigger><SelectValue placeholder="Select block" /></SelectTrigger>
                  <SelectContent>
                    {blockList.map((b: any) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Floor</Label>
                <Select value={assignFloorId} onValueChange={setAssignFloorId} disabled={!assignBlockId}>
                  <SelectTrigger><SelectValue placeholder="Select floor" /></SelectTrigger>
                  <SelectContent>
                    {floorList.map((f: any) => (
                      <SelectItem key={f.id} value={f.id}>Floor {f.floorNumber}{f.name ? ` - ${f.name}` : ""}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Room list with checkboxes */}
            {assignFloorId && (
              <div className="border rounded-lg p-3 max-h-64 overflow-y-auto space-y-2">
                {roomList.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No rooms on this floor.</p>
                ) : (
                  roomList.map((r: any) => (
                    <label key={r.id} className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent ${isRoomAssigned(r.id) ? "opacity-50" : ""}`}>
                      <Checkbox
                        checked={isRoomSelected(r.id) || isRoomAssigned(r.id)}
                        disabled={isRoomAssigned(r.id)}
                        onCheckedChange={() => !isRoomAssigned(r.id) && toggleRoom(r)}
                      />
                      <span className="flex-1 text-sm">
                        {r.roomNumber} ({r.roomType?.name}) — {r._count?.studentAllocations ?? 0}/{r.capacity} occupied
                      </span>
                      {isRoomAssigned(r.id) && <Badge variant="secondary" className="text-xs">Assigned</Badge>}
                    </label>
                  ))
                )}
              </div>
            )}
          </Card>

          {/* Selected Rooms Summary */}
          {selectedRooms.length > 0 && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Selected Rooms ({selectedRooms.length})</h3>
                <Button size="sm" onClick={handleAssignAll} disabled={batchAddRooms.isPending || createHostelSection.isPending}>
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  {batchAddRooms.isPending ? "Assigning..." : "Assign All Rooms"}
                </Button>
              </div>
              <div className="space-y-2">
                {Object.entries(groupedSelections).map(([blockName, rooms]) => (
                  <div key={blockName}>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{blockName}</p>
                    <div className="flex flex-wrap gap-2">
                      {rooms.map(r => (
                        <Badge key={r.roomId} variant="default" className="text-xs cursor-pointer pl-2" onClick={() => setSelectedRooms(prev => prev.filter(s => s.roomId !== r.roomId))}>
                          {r.roomNumber} ({r.roomType}) - Fl{r.floorNumber}
                          <X className="ml-1 h-3 w-3" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Currently Assigned Rooms */}
          {currentHostelSection && currentHostelSection.sectionRooms && currentHostelSection.sectionRooms.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Currently Assigned</h3>
              <div className="flex flex-wrap gap-2">
                {currentHostelSection.sectionRooms.map(sr => (
                  <Badge key={sr.id} variant="secondary" className="text-xs cursor-pointer" onClick={() => removeRoom.mutate({ sectionId: currentHostelSection.id, roomId: sr.roomId })}>
                    {sr.room?.roomNumber} ({sr.room?.roomType?.name}) ×
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Delete Button */}
          {currentHostelSection && (
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setDeleteItem(currentHostelSection)}>
                <Trash2 className="mr-1 h-3.5 w-3.5 text-destructive" /> Remove Hostel Link
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={!!deleteItem} onOpenChange={(v) => { if (!v) setDeleteItem(null) }}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Remove Hostel Link</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Remove <strong>{(deleteItem as any)?.section?.sectionName}</strong> from hostel? All room assignments will be lost.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteItem(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteItem && deleteHostelSection.mutate(deleteItem.id, { onSuccess: () => { setDeleteItem(null); setSectionId("") } })}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}