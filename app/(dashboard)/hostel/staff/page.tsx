"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Users, Plus, Pencil, Trash2, Loader2 } from "lucide-react"
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
import { useHostelStaff, useAssignHostelStaff, useUpdateHostelStaff, useDeleteHostelStaff, useHostelBlocks } from "@/hooks/use-hostel"
import { useTeachers } from "@/hooks/use-teachers"
import type { HostelStaffAssignment } from "@/lib/api/hostel"

const ROLE_LABELS: Record<string, string> = { warden: "Warden", in_charge: "In-Charge", cook: "Cook", mate: "Mate", cleaner: "Cleaner", other: "Other" }

export default function HostelStaffPage() {
  const { data, isLoading } = useHostelStaff()
  const blocks = useHostelBlocks()
  const teachers = useTeachers()
  const assign = useAssignHostelStaff()
  const update = useUpdateHostelStaff()
  const del = useDeleteHostelStaff()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<HostelStaffAssignment | null>(null)
  const [deleteItem, setDeleteItem] = useState<HostelStaffAssignment | null>(null)
  const [formBlockId, setFormBlockId] = useState("")
  const [formTeacherId, setFormTeacherId] = useState("")
  const [formRole, setFormRole] = useState("warden")
  const [teacherSearch, setTeacherSearch] = useState("")
  const [showTeacherDropdown, setShowTeacherDropdown] = useState(false)

  const assignments: HostelStaffAssignment[] = Array.isArray(data?.data) ? data!.data : []
  const blockList: any[] = Array.isArray(blocks.data?.data) ? blocks.data!.data : []
  const teacherList: any[] = Array.isArray((teachers as any)?.data?.data?.rows || (teachers as any)?.data?.data || (teachers as any)?.data)
    ? ((teachers as any)?.data?.data?.rows || (teachers as any)?.data?.data || (teachers as any)?.data)
    : []

  // Always array-safe teacher list
  const safeTeacherList: any[] = Array.isArray(teacherList) ? teacherList : []

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (editItem) {
      update.mutate({ id: editItem.id, data: { role: formRole } }, { onSuccess: () => setIsFormOpen(false) })
    } else {
      assign.mutate({ blockId: formBlockId, teacherId: formTeacherId, role: formRole as any }, { onSuccess: () => setIsFormOpen(false) })
    }
  }

  const openCreate = () => {
    setEditItem(null)
    setFormBlockId("")
    setFormTeacherId("")
    setFormRole("warden")
    setTeacherSearch("")
    setIsFormOpen(true)
  }

  const openEdit = (a: HostelStaffAssignment) => {
    setEditItem(a)
    setFormBlockId(a.blockId)
    setFormTeacherId(a.teacherId)
    setFormRole(a.role)
    setTeacherSearch(a.teacher?.fullName || "")
    setIsFormOpen(true)
  }

  const filteredTeachers = safeTeacherList.filter((t: any) =>
    !teacherSearch || t.fullName?.toLowerCase().includes(teacherSearch.toLowerCase())
  )

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <PageHeader title="Hostel Staff" description="Assign wardens, in-charges, cooks, and other staff to hostel blocks">
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Assign Staff</Button>
      </PageHeader>

      {!isLoading && assignments.length === 0 ? (
        <EmptyState icon={Users} title="No staff assigned" description="Start by assigning staff to hostel blocks." action={{ label: "Assign Staff", onClick: openCreate }} />
      ) : (
        <Card>
          <Table>
            <TableHeader><TableRow><TableHead>Staff</TableHead><TableHead>Block</TableHead><TableHead>Role</TableHead><TableHead>From</TableHead><TableHead>Status</TableHead><TableHead className="w-24">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {assignments.map(a => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.teacher?.fullName}</TableCell>
                  <TableCell>{a.block?.name}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs capitalize">{ROLE_LABELS[a.role] || a.role}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(a.fromDate).toLocaleDateString()}</TableCell>
                  <TableCell><span className={`inline-block w-2 h-2 rounded-full ${a.status === "active" ? "bg-green-500" : "bg-gray-400"} mr-2`} />{a.status}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(a)}><Pencil className="h-4 w-4" /></Button>
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
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle>{editItem ? "Edit" : "Assign"} Staff</DialogTitle>
                  <DialogDescription>{editItem ? "Update staff role" : "Assign a staff member to a hostel block"}</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {!editItem && (
                <div className="space-y-2">
                  <Label>Hostel Block <span className="text-destructive">*</span></Label>
                  <Select value={formBlockId} onValueChange={setFormBlockId} required>
                    <SelectTrigger><SelectValue placeholder="Select block" /></SelectTrigger>
                    <SelectContent>{blockList.map((b: any) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              )}

              {!editItem && (
                <div className="space-y-2 relative">
                  <Label>Staff Member <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="Search by name..."
                    value={teacherSearch}
                    onChange={(e) => { setTeacherSearch(e.target.value); setShowTeacherDropdown(true) }}
                    onFocus={() => setShowTeacherDropdown(true)}
                    onBlur={() => setTimeout(() => setShowTeacherDropdown(false), 200)}
                    required={!formTeacherId}
                  />
                  {showTeacherDropdown && filteredTeachers.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 border rounded-md bg-popover shadow-md max-h-48 overflow-y-auto">
                      {filteredTeachers.map((t: any) => (
                        <div
                          key={t.id}
                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-accent ${formTeacherId === t.id ? "bg-primary/10 font-medium" : ""}`}
                          onMouseDown={(e) => { e.preventDefault(); setFormTeacherId(t.id); setTeacherSearch(t.fullName || t.email || ""); setShowTeacherDropdown(false) }}
                        >
                          {t.fullName} — {t.employeeCode || t.email}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label>Role <span className="text-destructive">*</span></Label>
                <Select value={formRole} onValueChange={setFormRole}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(ROLE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={assign.isPending || update.isPending}>
                {assign.isPending || update.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {editItem ? "Save Changes" : "Assign Staff"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteItem} onOpenChange={(v) => { if (!v) setDeleteItem(null) }}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Remove Staff</DialogTitle>
            <DialogDescription>
              Remove <strong>{deleteItem?.teacher?.fullName}</strong> from this block?
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