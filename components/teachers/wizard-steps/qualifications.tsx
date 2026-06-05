"use client"

import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { Plus, Trash2, FileText } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileUpload } from "@/components/shared/file-upload"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useAddQualification, useUpdateQualification, useDeleteQualification } from "@/hooks/use-teachers"
import type { TeacherQualification } from "@/lib/api/teachers"

export function TeacherQualifications({ teacherId: propTeacherId }: { teacherId: string }) {
  const { watch } = useFormContext()
  const teacherId = propTeacherId || watch("id")
  const qualifications = watch("qualifications") || []

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingQual, setEditingQual] = useState<TeacherQualification | null>(null)
  const [formData, setFormData] = useState({
    qualificationName: "",
    institution: "",
    yearOfPassing: "",
    documentUrl: "",
  })

  const createQual = useAddQualification()
  const updateQual = useUpdateQualification()
  const deleteQual = useDeleteQualification()

  const handleAdd = () => {
    setEditingQual(null)
    setFormData({ qualificationName: "", institution: "", yearOfPassing: "", documentUrl: "" })
    setIsDialogOpen(true)
  }

  const handleEdit = (qual: TeacherQualification) => {
    setEditingQual(qual)
    setFormData({
      qualificationName: qual.qualificationName,
      institution: qual.institution || "",
      yearOfPassing: qual.yearOfPassing?.toString() || "",
      documentUrl: qual.documentUrl || "",
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    const data = {
      qualificationName: formData.qualificationName,
      institution: formData.institution || undefined,
      yearOfPassing: formData.yearOfPassing ? parseInt(formData.yearOfPassing) : undefined,
      documentUrl: formData.documentUrl || undefined,
    }
    if (editingQual) {
      updateQual.mutate({
        teacherId,
        qualificationId: editingQual.id,
        data,
      })
    } else {
      createQual.mutate({ teacherId, data })
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
              <TableHead>Qualification</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Certificate</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {qualifications.map((qual: TeacherQualification) => (
              <TableRow key={qual.id}>
                <TableCell className="font-medium">{qual.qualificationName}</TableCell>
                <TableCell>{qual.institution}</TableCell>
                <TableCell>{qual.yearOfPassing}</TableCell>
                <TableCell>
                  {qual.documentUrl ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(qual.documentUrl, "_blank")}
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
                <Label>Qualification Name *</Label>
                <Input
                  value={formData.qualificationName}
                  onChange={(e) => setFormData({ ...formData, qualificationName: e.target.value })}
                  placeholder="e.g., B.Ed, M.Sc"
                />
              </div>

              <div className="space-y-2">
                <Label>Year of Passing</Label>
                <Input
                  value={formData.yearOfPassing}
                  onChange={(e) => setFormData({ ...formData, yearOfPassing: e.target.value })}
                  placeholder="e.g., 2020"
                  type="number"
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
                value={formData.documentUrl}
                onUploadComplete={(url) => setFormData({ ...formData, documentUrl: url })}
                accept="application/pdf,image/*"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} disabled={!formData.qualificationName || !formData.institution}>
              {editingQual ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
