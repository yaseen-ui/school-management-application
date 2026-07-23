"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Plus, Pencil, Trash2, Layers, DoorOpen, Users } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useHostelBlock, useCreateHostelFloor, useUpdateHostelFloor, useDeleteHostelFloor, useCreateHostelRoom, useDeleteHostelRoom, useHostelRoomTypes, useHostelFloors } from "@/hooks/use-hostel"
import Link from "next/link"
import type { HostelFloor, HostelRoom } from "@/lib/api/hostel"

export default function HostelBlockDetailPage() {
  const { blockId } = useParams<{ blockId: string }>()
  const { data: blockData, isLoading } = useHostelBlock(blockId)
  const roomTypes = useHostelRoomTypes()
  const createFloor = useCreateHostelFloor()
  const updateFloor = useUpdateHostelFloor()
  const deleteFloor = useDeleteHostelFloor()
  const createRoom = useCreateHostelRoom()
  const deleteRoom = useDeleteHostelRoom()

  const block = blockData?.data as any

  const [showFloorForm, setShowFloorForm] = useState(false)
  const [editFloor, setEditFloor] = useState<HostelFloor | null>(null)
  const [floorForm, setFloorForm] = useState({ floorNumber: 1, name: "", gender: "" })
  const [showRoomForm, setShowRoomForm] = useState(false)
  const [selectedFloor, setSelectedFloor] = useState<string>("")
  const [roomForm, setRoomForm] = useState({ roomNumber: "", roomTypeId: "", capacity: 1 })

  if (isLoading) return <div className="animate-pulse p-8">Loading...</div>
  if (!block) return <div className="p-8 text-destructive">Block not found</div>

  const handleFloorSave = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { ...floorForm, blockId: block.id, floorNumber: Number(floorForm.floorNumber), gender: (floorForm.gender || undefined) as any }
    if (editFloor) {
      updateFloor.mutate({ id: editFloor.id, data: payload }, { onSuccess: () => { setShowFloorForm(false); setEditFloor(null) } })
    } else {
      createFloor.mutate(payload as any, { onSuccess: () => setShowFloorForm(false) })
    }
  }

  const handleRoomSave = (e: React.FormEvent) => {
    e.preventDefault()
    createRoom.mutate({ ...roomForm, floorId: selectedFloor, capacity: Number(roomForm.capacity) }, { onSuccess: () => setShowRoomForm(false) })
  }

  const openFloorEdit = (f: HostelFloor) => {
    setEditFloor(f)
    setFloorForm({ floorNumber: f.floorNumber, name: f.name || "", gender: f.gender || "" })
    setShowFloorForm(true)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <PageHeader title={block.name} description={`${block.gender || "Common"} | ${block.code || ""}`}>
        <Link href="/hostel/blocks"><Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button></Link>
      </PageHeader>

      <div className="flex gap-4 text-sm">
        <Badge variant="secondary" className="text-xs">{block._count?.floors ?? 0} Floors</Badge>
        <Badge variant="secondary" className="text-xs">{block._count?.sections ?? 0} Sections</Badge>
        <Badge variant="secondary" className="text-xs">{block._count?.staffAssignments ?? 0} Staff</Badge>
        <Badge variant={block.status === "active" ? "default" : "secondary"}>{block.status}</Badge>
      </div>

      <Tabs defaultValue="floors">
        <TabsList>
          <TabsTrigger value="floors"><Layers className="mr-2 h-4 w-4" /> Floors & Rooms</TabsTrigger>
          <TabsTrigger value="sections"><Users className="mr-2 h-4 w-4" /> Sections</TabsTrigger>
          <TabsTrigger value="staff"><DoorOpen className="mr-2 h-4 w-4" /> Staff</TabsTrigger>
        </TabsList>

        {/* Floors Tab */}
        <TabsContent value="floors" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Floors</h3>
            <Button size="sm" onClick={() => { setEditFloor(null); setFloorForm({ floorNumber: (block.floors?.length || 0) + 1, name: "", gender: "" }); setShowFloorForm(true) }}>
              <Plus className="mr-2 h-3.5 w-3.5" /> Add Floor
            </Button>
          </div>
          <div className="space-y-3">
            {block.floors?.map((floor: any) => (
              <Card key={floor.id}>
                <CardHeader className="flex flex-row items-center justify-between py-3">
                  <CardTitle className="text-base">Floor {floor.floorNumber}{floor.name ? ` - ${floor.name}` : ""}</CardTitle>
                  <div className="flex items-center gap-2">
                    {floor.gender && <Badge variant="secondary" className="text-xs">{floor.gender}</Badge>}
                    <Button variant="ghost" size="icon" onClick={() => openFloorEdit(floor)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteFloor.mutate(floor.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{floor._count?.rooms ?? floor.rooms?.length ?? 0} Rooms</span>
                    <Button size="sm" variant="outline" onClick={() => { setSelectedFloor(floor.id); setRoomForm({ roomNumber: "", roomTypeId: "", capacity: 1 }); setShowRoomForm(true) }}>
                      <Plus className="mr-1 h-3 w-3" /> Add Room
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {floor.rooms?.map((room: any) => (
                      <div key={room.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div>
                          <span className="font-medium text-sm">{room.roomNumber}</span>
                          <span className="text-xs text-muted-foreground ml-2">{room.roomType?.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{room._count?.studentAllocations ?? 0}/{room.capacity}</Badge>
                          <Button variant="ghost" size="icon" onClick={() => deleteRoom.mutate(room.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Sections Tab */}
        <TabsContent value="sections" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Sections</h3>
            <Link href="/hostel/sections"><Button size="sm" variant="outline">Manage Sections</Button></Link>
          </div>
          {block.sections?.length > 0 ? (
            <div className="space-y-2">
              {block.sections.map((s: any) => (
                <Card key={s.id} className="p-4 flex justify-between items-center">
                  <div>
                    <span className="font-medium">{s.sectionName}</span>
                    <span className="text-xs text-muted-foreground ml-2">{s._count?.sectionRooms ?? 0} rooms · {s._count?.studentAllocations ?? 0} students</span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No sections created yet. Go to Sections page to create and assign rooms.</p>
          )}
        </TabsContent>

        {/* Staff Tab */}
        <TabsContent value="staff" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Staff</h3>
            <Link href="/hostel/staff"><Button size="sm" variant="outline">Manage Staff</Button></Link>
          </div>
          {block.staffAssignments?.length > 0 ? (
            <div className="space-y-2">
              {block.staffAssignments.map((sa: any) => (
                <Card key={sa.id} className="p-4 flex justify-between items-center">
                  <div>
                    <span className="font-medium">{sa.teacher?.fullName}</span>
                    <Badge variant="secondary" className="ml-2 text-xs capitalize">{sa.role.replace("_", " ")}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{sa.status}</span>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No staff assigned. Go to Staff page to assign.</p>
          )}
        </TabsContent>
      </Tabs>

      {/* Floor Form Dialog */}
      <Dialog open={showFloorForm} onOpenChange={setShowFloorForm}>
        <DialogContent className="sm:max-w-[480px]">
          <form onSubmit={handleFloorSave}>
            <DialogHeader><DialogTitle>{editFloor ? "Edit" : "Add"} Floor</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div><Label>Floor Number *</Label><Input type="number" min={1} value={floorForm.floorNumber} onChange={e => setFloorForm(f => ({ ...f, floorNumber: Number(e.target.value) }))} required /></div>
              <div><Label>Name</Label><Input value={floorForm.name} onChange={e => setFloorForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div><Label>Gender</Label><Select value={floorForm.gender} onValueChange={v => setFloorForm(f => ({ ...f, gender: v }))}><SelectTrigger><SelectValue placeholder="Inherit from block" /></SelectTrigger><SelectContent><SelectItem value="Male">Boys</SelectItem><SelectItem value="Female">Girls</SelectItem><SelectItem value="Other">Common</SelectItem></SelectContent></Select></div>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setShowFloorForm(false)}>Cancel</Button><Button type="submit">Save</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Room Form Dialog */}
      <Dialog open={showRoomForm} onOpenChange={setShowRoomForm}>
        <DialogContent className="sm:max-w-[480px]">
          <form onSubmit={handleRoomSave}>
            <DialogHeader><DialogTitle>Add Room</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div><Label>Room Number *</Label><Input value={roomForm.roomNumber} onChange={e => setRoomForm(f => ({ ...f, roomNumber: e.target.value }))} required /></div>
              <div><Label>Room Type *</Label><Select value={roomForm.roomTypeId} onValueChange={v => setRoomForm(f => ({ ...f, roomTypeId: v }))} required><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent>{(roomTypes.data?.data || []).map((rt: any) => <SelectItem key={rt.id} value={rt.id}>{rt.name} (Cap: {rt.defaultCapacity})</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Capacity</Label><Input type="number" min={1} value={roomForm.capacity} onChange={e => setRoomForm(f => ({ ...f, capacity: Number(e.target.value) }))} required /></div>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setShowRoomForm(false)}>Cancel</Button><Button type="submit">Save</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}