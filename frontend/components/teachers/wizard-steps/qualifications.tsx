"use client"

import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { Plus, Trash2, FileText } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileUpload } from "@/components/shared/file-upload"
import { DatePickerInput } from "@/components/ui/date-picker"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useAddQualification, useUpdateQualification, useDeleteQualification } from "@/hooks/use-teachers"
import type { Qualification } from "@/lib/api/teachers"

export function TeacherQualifications() {
  const { watch } = useFormContext()
  const teacherId = watch("id")
  const qualifications = watch("qualifications") || []

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingQual, setEditingQual] = useState<Qualification | null>(null)
  const [formData, setFormData] = useState({
    degreeName: "",
    institution: "",
    yearOfCompletion: "",
    certificateUrl: "",
  })

  const createQual = useAddQualification()
  const updateQual = useUpdateQualification()
  const deleteQual = useDeleteQualification()

  const handleAdd = () => {
    setEditingQual(null)
    setFormData({ degreeName: "", institution: "", yearOfCompletion: "", certificateUrl: "" })
    setIsDialogOpen(true)
  }

  const handleEdit = (qual: Qualification) => {
    setEditingQual(qual)
    setFormData({
      degreeName: qual.degreeName,
      institution: qual.institution,
      yearOfCompletion: qual.yearOfCompletion,
      certificateUrl: qual.certificateUrl || "",
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingQual) {
      updateQual.mutate({
        teacherId,
        qualificationId: editingQual.id,
        data: formData,
      })
    } else {
      createQual.mutate({ teacherId, data: formData })
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (qualId: string) => {
    if (confirm("Are you sure you want to delete this qualification?")) {
      deleteQual.mutate({ teacherId, qualificationId: qualId })
    }
  }

  if (!teacherId) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground">
        Please complete Step 1 to add qualifications
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Manage teacher qualifications and certificates</p>
        <Button type="button" onClick={handleAdd} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Qualification
        </Button>
      </div>

      {qualifications.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Degree</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Certificate</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {qualifications.map((qual: Qualification) => (
              <TableRow key={qual.id}>
                <TableCell className="font-medium">{qual.degreeName}</TableCell>
                <TableCell>{qual.institution}</TableCell>
                <TableCell>{qual.yearOfCompletion}</TableCell>
                <TableCell>
                  {qual.certificateUrl ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(qual.certificateUrl, "_blank")}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-sm">No file</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleEdit(qual)}>
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(qual.id)}
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
          <p className="text-muted-foreground">No qualifications added yet</p>
          <Button type="button" variant="link" onClick={handleAdd} className="mt-2">
            Add your first qualification
          </Button>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingQual ? "Edit Qualification" : "Add Qualification"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Degree Name *</Label>
                <Input
                  value={formData.degreeName}
                  onChange={(e) => setFormData({ ...formData, degreeName: e.target.value })}
                  placeholder="e.g., B.Ed, M.Sc"
                />
              </div>

              <div className="space-y-2">
                <Label>Year of Completion *</Label>
                <DatePickerInput
                  value={formData.yearOfCompletion ? new Date(formData.yearOfCompletion) : undefined}
                  onChange={(date) => setFormData({ ...formData, yearOfCompletion: date?.toISOString() || "" })}
                  placeholder="Select year"
                  maxDate={new Date()}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Institution *</Label>
              <Input
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="University/College name"
              />
            </div>

            <div className="space-y-2">
              <Label>Upload Certificate</Label>
              <FileUpload
                category="teachers"
                entityId={teacherId}
                documentType={`qualification_${editingQual?.id || "new"}`}
                value={formData.certificateUrl}
                onUploadComplete={(url) => setFormData({ ...formData, certificateUrl: url })}
                accept="application/pdf,image/*"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} disabled={!formData.degreeName || !formData.institution}>
              {editingQual ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
