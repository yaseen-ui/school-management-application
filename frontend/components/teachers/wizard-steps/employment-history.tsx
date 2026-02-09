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
import type { EmploymentHistory } from "@/lib/api/teachers"
import { format } from "date-fns"

export function TeacherEmploymentHistory() {
  const { watch } = useFormContext()
  const teacherId = watch("id")
  const employmentHistory = watch("employmentHistory") || []

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<EmploymentHistory | null>(null)
  const [formData, setFormData] = useState({
    institutionName: "",
    designation: "",
    startDate: "",
    endDate: "",
    responsibilities: "",
  })

  const createRecord = useAddEmploymentHistory()
  const updateRecord = useUpdateEmploymentHistory()
  const deleteRecord = useDeleteEmploymentHistory()

  const handleAdd = () => {
    setEditingRecord(null)
    setFormData({ institutionName: "", designation: "", startDate: "", endDate: "", responsibilities: "" })
    setIsDialogOpen(true)
  }

  const handleEdit = (record: EmploymentHistory) => {
    setEditingRecord(record)
    setFormData({
      institutionName: record.institutionName,
      designation: record.designation,
      startDate: record.startDate,
      endDate: record.endDate || "",
      responsibilities: record.responsibilities || "",
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingRecord) {
      updateRecord.mutate({
        teacherId,
        historyId: editingRecord.id,
        data: formData,
      })
    } else {
      createRecord.mutate({ teacherId, data: formData })
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (historyId: string) => {
    if (confirm("Are you sure you want to delete this employment record?")) {
      deleteRecord.mutate({ teacherId, historyId })
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
              <TableHead>Institution</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Responsibilities</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employmentHistory.map((record: EmploymentHistory) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.institutionName}</TableCell>
                <TableCell>{record.designation}</TableCell>
                <TableCell>
                  {format(new Date(record.startDate), "MMM yyyy")} -{" "}
                  {record.endDate ? format(new Date(record.endDate), "MMM yyyy") : "Present"}
                </TableCell>
                <TableCell className="max-w-xs truncate">{record.responsibilities || "—"}</TableCell>
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
                <Label>Institution Name *</Label>
                <Input
                  value={formData.institutionName}
                  onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                  placeholder="School/College name"
                />
              </div>

              <div className="space-y-2">
                <Label>Designation *</Label>
                <Input
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
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
              <Label>Responsibilities</Label>
              <Textarea
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                placeholder="Describe key responsibilities and achievements"
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
              disabled={!formData.institutionName || !formData.designation || !formData.startDate}
            >
              {editingRecord ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
