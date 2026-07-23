"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tag, Plus, Pencil, Trash2 } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useHostelRoomTypes, useCreateHostelRoomType, useUpdateHostelRoomType, useDeleteHostelRoomType } from "@/hooks/use-hostel"
import type { HostelRoomType } from "@/lib/api/hostel"

export default function HostelRoomTypesPage() {
  const { data, isLoading } = useHostelRoomTypes()
  const createType = useCreateHostelRoomType()
  const updateType = useUpdateHostelRoomType()
  const deleteType = useDeleteHostelRoomType()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<HostelRoomType | null>(null)
  const [deleteItem, setDeleteItem] = useState<HostelRoomType | null>(null)

  const [formName, setFormName] = useState("")
  const [formDesc, setFormDesc] = useState("")
  const [formCap, setFormCap] = useState(1)
  const [formAmenities, setFormAmenities] = useState("")

  const types: HostelRoomType[] = (data?.data || []) as HostelRoomType[]

  const openCreate = () => { setEditItem(null); setFormName(""); setFormDesc(""); setFormCap(1); setFormAmenities(""); setIsFormOpen(true) }
  const openEdit = (t: HostelRoomType) => {
    setEditItem(t); setFormName(t.name); setFormDesc(t.description || ""); setFormCap(t.defaultCapacity); setFormAmenities((t.amenities || []).join(", ")); setIsFormOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const amenities = formAmenities ? formAmenities.split(",").map(s => s.trim()).filter(Boolean) : undefined
    const payload = { name: formName, description: formDesc || undefined, defaultCapacity: formCap, amenities }
    if (editItem) {
      updateType.mutate({ id: editItem.id, data: payload }, { onSuccess: () => setIsFormOpen(false) })
    } else {
      createType.mutate(payload as any, { onSuccess: () => setIsFormOpen(false) })
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <PageHeader title="Room Types" description="Manage hostel room type configurations">
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Room Type</Button>
      </PageHeader>

      {!isLoading && types.length === 0 ? (
        <EmptyState icon={Tag} title="No room types" description="Create your first hostel room type." action={{ label: "Add Room Type", onClick: openCreate }} />
      ) : (
        <Card>
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Default Capacity</TableHead><TableHead>Amenities</TableHead><TableHead>Rooms</TableHead><TableHead className="w-24">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {types.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell>{t.defaultCapacity}</TableCell>
                  <TableCell><div className="flex gap-1 flex-wrap">{(t.amenities || []).map(a => <Badge variant="secondary" key={a} className="text-xs">{a}</Badge>)}</div></TableCell>
                  <TableCell>{t._count?.rooms ?? 0}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteItem(t)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
        <DialogContent>
          <form onSubmit={handleSave}>
            <DialogHeader><DialogTitle>{editItem ? "Edit" : "Add"} Room Type</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div><Label>Name *</Label><Input value={formName} onChange={e => setFormName(e.target.value)} required /></div>
              <div><Label>Default Capacity</Label><Input type="number" min={1} value={formCap} onChange={e => setFormCap(Number(e.target.value))} /></div>
              <div><Label>Amenities</Label><Input value={formAmenities} onChange={e => setFormAmenities(e.target.value)} placeholder="e.g., AC, WiFi, Attached Bath" /><p className="text-xs text-muted-foreground mt-1">Comma-separated list</p></div>
              <div><Label>Description</Label><Textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} /></div>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button><Button type="submit" disabled={createType.isPending || updateType.isPending}>Save</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteItem} onOpenChange={(v) => { if (!v) setDeleteItem(null) }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Room Type</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Delete <strong>{deleteItem?.name}</strong>? This will fail if rooms use this type.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteItem(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteItem && deleteType.mutate(deleteItem.id, { onSuccess: () => setDeleteItem(null) })}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}