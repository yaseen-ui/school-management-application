"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { GraduationCap, Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useHostelAllocations, useCreateHostelAllocation, useUpdateHostelAllocation, useDeleteHostelAllocation, useHostelRooms, useHostelSections, useHostelBlocks, useHostelFloors } from "@/hooks/use-hostel"
import { useAcademicYears } from "@/hooks/use-academic-years"
import { useEnrollments } from "@/hooks/use-enrollments"
import type { StudentHostelAllocation } from "@/lib/api/hostel"

export default function HostelAllocationsPage() {
  const { data, isLoading } = useHostelAllocations()
  const academicYears = useAcademicYears()
  const blocks = useHostelBlocks()
  const sections = useHostelSections()
  const create = useCreateHostelAllocation()
  const update = useUpdateHostelAllocation()
  const del = useDeleteHostelAllocation()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<StudentHostelAllocation | null>(null)
  const [deleteItem, setDeleteItem] = useState<StudentHostelAllocation | null>(null)
  const [formEnrollmentId, setFormEnrollmentId] = useState("")
  const [enrollmentSearch, setEnrollmentSearch] = useState("")
  const [showEnrollmentDropdown, setShowEnrollmentDropdown] = useState(false)

  const enrollments = useEnrollments()
  const enrollmentList: any[] = (() => {
    const e = enrollments as any
    // Try all common API response shapes
    if (Array.isArray(e)) return e
    if (Array.isArray(e?.data)) return e.data
    if (Array.isArray(e?.data?.data)) return e.data.data
    if (Array.isArray(e?.data?.data?.rows)) return e.data.data.rows
    if (typeof e?.data?.data === "object" && e?.data?.data?.rows) return e.data.data.rows
    // Some APIs return { data: { status: "success", data: [...] } }
    if (typeof e?.data === "object" && e?.data?.status === "success" && Array.isArray(e?.data?.data)) return e.data.data
    return []
  })()

  const filteredEnrollments = enrollmentList.filter((e: any) =>
    !enrollmentSearch ||
    `${e.student?.firstName} ${e.student?.lastName}`.toLowerCase().includes(enrollmentSearch.toLowerCase()) ||
    e.rollNumber?.toLowerCase().includes(enrollmentSearch.toLowerCase()) ||
    e.id?.toLowerCase().includes(enrollmentSearch.toLowerCase())
  )
  const [formBlockId, setFormBlockId] = useState("")
  const [formFloorId, setFormFloorId] = useState("")
  const [formRoomId, setFormRoomId] = useState("")
  const [formSectionId, setFormSectionId] = useState("")

  const floors = useHostelFloors(formBlockId || undefined)
  const rooms = useHostelRooms(formFloorId ? { floorId: formFloorId } : undefined)

  const allocations: StudentHostelAllocation[] = Array.isArray(data?.data) ? data!.data : []
  const blockList: any[] = Array.isArray(blocks.data?.data) ? blocks.data!.data : []
  const floorList: any[] = Array.isArray(floors.data?.data) ? floors.data!.data : []
  const roomList: any[] = Array.isArray(rooms.data?.data) ? rooms.data!.data : []

  const activeAcademicYear = useMemo(() => {
    const raw: any = (academicYears as any)?.data?.data || (academicYears as any)?.data
    const list: any[] = Array.isArray(raw) ? raw : Array.isArray(academicYears) ? (academicYears as any) : []
    return list.find((y: any) => y.status === "active") || null
  }, [academicYears])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (editItem) {
      update.mutate({ id: editItem.id, data: { roomId: formRoomId || undefined, sectionId: formSectionId || null } }, { onSuccess: () => setIsFormOpen(false) })
    } else {
      create.mutate({
        enrollmentId: formEnrollmentId,
        roomId: formRoomId,
        sectionId: formSectionId || null,
        academicYearId: activeAcademicYear?.id,
      }, { onSuccess: () => setIsFormOpen(false) })
    }
  }

  const openCreate = () => {
    setEditItem(null)
    setFormEnrollmentId("")
    setFormBlockId("")
    setFormFloorId("")
    setFormRoomId("")
    setFormSectionId("")
    setIsFormOpen(true)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <PageHeader title="Student Allocations" description="Allocate students to hostel rooms">
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Allocate Student</Button>
      </PageHeader>

      {!isLoading && allocations.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No allocations yet" description="Start by allocating students to hostel rooms." action={{ label: "Allocate Student", onClick: openCreate }} />
      ) : (
        <Card>
          <Table>
            <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Room</TableHead><TableHead>Section</TableHead><TableHead>Academic Year</TableHead><TableHead>Status</TableHead><TableHead className="w-24">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {allocations.map(a => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.enrollment?.student?.firstName} {a.enrollment?.student?.lastName}</TableCell>
                  <TableCell>{a.room?.roomNumber} ({a.room?.roomType?.name})</TableCell>
                  <TableCell>{(a as any).section?.section?.sectionName || <span className="text-muted-foreground italic">auto</span>}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.enrollment?.grade?.gradeName} {a.enrollment?.section?.sectionName}</TableCell>
                  <TableCell><span className={`inline-block w-2 h-2 rounded-full ${a.status === "active" ? "bg-green-500" : "bg-gray-400"} mr-2`} />{a.status}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditItem(a); setFormRoomId(a.roomId); setFormSectionId(a.sectionId || ""); setIsFormOpen(true) }}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteItem(a)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle>{editItem ? "Edit" : "New"} Allocation</DialogTitle>
                  <DialogDescription>
                    {editItem ? "Update room or section for this student" : `Allocate student to hostel room • ${activeAcademicYear?.name || "Current Academic Year"}`}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {!editItem && (
                <div className="space-y-2 relative">
                  <Label>Student <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="Search by name, roll number, or enrollment ID..."
                    value={enrollmentSearch}
                    onChange={(e) => { setEnrollmentSearch(e.target.value); setShowEnrollmentDropdown(true) }}
                    onFocus={() => setShowEnrollmentDropdown(true)}
                    onBlur={() => setTimeout(() => setShowEnrollmentDropdown(false), 200)}
                    required={!formEnrollmentId}
                  />
                  {showEnrollmentDropdown && filteredEnrollments.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 border rounded-md bg-popover shadow-md max-h-48 overflow-y-auto">
                      {filteredEnrollments.map((e: any) => {
                        const name = `${e.student?.firstName || ""} ${e.student?.lastName || ""}`.trim() || "Unknown"
                        return (
                          <div
                            key={e.id}
                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-accent ${formEnrollmentId === e.id ? "bg-primary/10 font-medium" : ""}`}
                            onMouseDown={(ev) => { ev.preventDefault(); setFormEnrollmentId(e.id); setEnrollmentSearch(`${name} — ${e.rollNumber || "No Roll"}`); setShowEnrollmentDropdown(false) }}
                          >
                            {name} — {e.rollNumber || "No Roll"}
                            <span className="text-xs text-muted-foreground ml-1">({e.grade?.gradeName} {e.section?.sectionName})</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
              <div className="space-y-2">
                <Label>Hostel Block <span className="text-destructive">*</span></Label>
                <Select value={formBlockId} onValueChange={(v) => { setFormBlockId(v); setFormFloorId(""); setFormRoomId("") }} required>
                  <SelectTrigger><SelectValue placeholder="Select block" /></SelectTrigger>
                  <SelectContent>{blockList.map((b: any) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Floor <span className="text-destructive">*</span></Label>
                <Select value={formFloorId} onValueChange={(v) => { setFormFloorId(v); setFormRoomId("") }} required disabled={!formBlockId}>
                  <SelectTrigger><SelectValue placeholder="Select floor" /></SelectTrigger>
                  <SelectContent>{floorList.map((f: any) => <SelectItem key={f.id} value={f.id}>Floor {f.floorNumber}{f.name ? ` - ${f.name}` : ""} ({f._count?.rooms ?? 0} rooms)</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Room <span className="text-destructive">*</span></Label>
                <Select value={formRoomId} onValueChange={setFormRoomId} required disabled={!formFloorId}>
                  <SelectTrigger><SelectValue placeholder="Select room" /></SelectTrigger>
                  <SelectContent>{roomList.map((r: any) => <SelectItem key={r.id} value={r.id}>{r.roomNumber} ({r.roomType?.name}) — {r._count?.studentAllocations ?? 0}/{r.capacity}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Section (override)</Label>
                <Select value={formSectionId} onValueChange={setFormSectionId}>
                  <SelectTrigger><SelectValue placeholder="Auto (from room)" /></SelectTrigger>
                  <SelectContent>
                    {sections.data?.data && Array.isArray(sections.data.data) && sections.data.data.map((s: any) => (
                      <SelectItem key={s.id} value={s.id}>{(s as any).section?.sectionName || s.sectionName || "—"}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={create.isPending || update.isPending}>
                {(create.isPending || update.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editItem ? "Save Changes" : "Allocate Student"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteItem} onOpenChange={(v) => { if (!v) setDeleteItem(null) }}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Remove Allocation</DialogTitle>
            <DialogDescription>
              Remove <strong>{deleteItem?.enrollment?.student?.firstName} {deleteItem?.enrollment?.student?.lastName}</strong> from hostel?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteItem(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteItem && del.mutate(deleteItem.id, { onSuccess: () => setDeleteItem(null) })}>
              {del.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}