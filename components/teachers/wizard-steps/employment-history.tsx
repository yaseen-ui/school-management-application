"use client"

import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DatePickerInput } from "@/components/ui/date-picker"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useAddEmploymentHistory, useUpdateEmploymentHistory, useDeleteEmploymentHistory } from "@/hooks/use-teachers"
import type { TeacherEmploymentHistory } from "@/lib/api/teachers"
import { format } from "date-fns"

export function TeacherEmploymentHistory({ teacherId: propTeacherId }: { teacherId: string }) {
  const { watch } = useFormContext()
  const teacherId = propTeacherId || watch("id")
  const employmentHistory = watch("employmentHistory") || []

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<TeacherEmploymentHistory | null>(null)
  const [formData, setFormData] = useState({
    organizationName: "",
    role: "",
    startDate: "",
    endDate: "",
    reasonForLeaving: "",
  })

  const createRecord = useAddEmploymentHistory()
  const updateRecord = useUpdateEmploymentHistory()
  const deleteRecord = useDeleteEmploymentHistory()

  const handleAdd = () => {
    setEditingRecord(null)
    setFormData({ organizationName: "", role: "", startDate: "", endDate: "", reasonForLeaving: "" })
    setIsDialogOpen(true)
  }

  const handleEdit = (record: TeacherEmploymentHistory) => {
    setEditingRecord(record)
    setFormData({
      organizationName: record.organizationName,
      role: record.role,
      startDate: record.startDate || "",
      endDate: record.endDate || "",
      reasonForLeaving: record.reasonForLeaving || "",
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    const data = {
      organizationName: formData.organizationName,
      role: formData.role,
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
      reasonForLeaving: formData.reasonForLeaving || undefined,
    }
    if (editingRecord) {
      updateRecord.mutate({
        teacherId,
        employmentHistoryId: editingRecord.id,
        data,
      })
    } else {
      createRecord.mutate({ teacherId, data })
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (employmentHistoryId: string) => {
    if (confirm("Are you sure you want to delete this employment record?")) {
      deleteRecord.mutate({ teacherId, employmentHistoryId })
    }
  }

  if (!teacherId) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground">
        Please complete Step 1 to add employment history
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Track previous employment and experience</p>
        <Button type="button" onClick={handleAdd} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Employment Record
        </Button>
      </div>

      {employmentHistory.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Reason for Leaving</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employmentHistory.map((record: TeacherEmploymentHistory) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.organizationName}</TableCell>
                <TableCell>{record.role}</TableCell>
                <TableCell>
                  {record.startDate ? format(new Date(record.startDate), "MMM yyyy") : "—"} -{" "}
                  {record.endDate ? format(new Date(record.endDate), "MMM yyyy") : "Present"}
                </TableCell>
                <TableCell className="max-w-xs truncate">{record.reasonForLeaving || "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleEdit(record)}>
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(record.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No employment history added yet</p>
          <Button type="button" variant="link" onClick={handleAdd} className="mt-2">
            Add your first employment record
          </Button>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingRecord ? "Edit Employment Record" : "Add Employment Record"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Organization Name *</Label>
                <Input
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  placeholder="School/College name"
                />
              </div>

              <div className="space-y-2">
                <Label>Role *</Label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g., Math Teacher"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <DatePickerInput
                  value={formData.startDate ? new Date(formData.startDate) : undefined}
                  onChange={(date) => setFormData({ ...formData, startDate: date?.toISOString() || "" })}
                  placeholder="Select start date"
                  maxDate={new Date()}
                />
              </div>

              <div className="space-y-2">
                <Label>End Date (Leave empty if current)</Label>
                <DatePickerInput
                  value={formData.endDate ? new Date(formData.endDate) : undefined}
                  onChange={(date) => setFormData({ ...formData, endDate: date?.toISOString() || "" })}
                  placeholder="Select end date"
                  maxDate={new Date()}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Reason for Leaving</Label>
              <Textarea
                value={formData.reasonForLeaving}
                onChange={(e) => setFormData({ ...formData, reasonForLeaving: e.target.value })}
                placeholder="Describe reason for leaving"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!formData.organizationName || !formData.role || !formData.startDate}
            >
              {editingRecord ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
