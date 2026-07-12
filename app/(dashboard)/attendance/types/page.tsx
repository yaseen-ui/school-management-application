"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Trash2, Tag } from "lucide-react"
import { format } from "date-fns"

import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/shared/data-table"
import { CreateAttendanceTypeDialog } from "@/components/attendance/create-attendance-type-dialog"
import { EditAttendanceTypeDialog } from "@/components/attendance/edit-attendance-type-dialog"
import { DeleteAttendanceTypeDialog } from "@/components/attendance/delete-attendance-type-dialog"
import { toast } from "@/components/ui/sonner"
import { Loader2 } from "lucide-react"

import { attendanceApi, ATTENDANCE_TYPE_CATEGORIES, type AttendanceType, type AttendanceTypeCategory } from "@/lib/api/attendance"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export default function AttendanceTypesPage() {
  const queryClient = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)
  const [editType, setEditType] = useState<AttendanceType | null>(null)
  const [deleteType, setDeleteType] = useState<AttendanceType | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["attendance-types"],
    queryFn: async () => {
      const res = await attendanceApi.getAllTypes()
      return (res.data as any).data || (res.data as any) || []
    },
  })

  const types: AttendanceType[] = Array.isArray(data) ? data : []

  const createMutation = useMutation({
    mutationFn: (d: { name: string; category: AttendanceTypeCategory; sortOrder: number; isActive: boolean }) =>
      attendanceApi.createType(d),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance-types"] })
      setCreateOpen(false)
      toast.success("Attendance type created")
    },
    onError: (e: any) => toast.error(e.message || "Failed to create"),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => attendanceApi.updateType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance-types"] })
      setEditType(null)
      toast.success("Attendance type updated")
    },
    onError: (e: any) => toast.error(e.message || "Failed to update"),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => attendanceApi.deleteType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance-types"] })
      setDeleteType(null)
      toast.success("Attendance type deleted")
    },
    onError: (e: any) => toast.error(e.message || "Failed to delete"),
  })

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Attendance Types" description="Manage attendance types (Morning, Afternoon, Period, Exam, etc.)">
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Type
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Tag className="h-5 w-5" /> All Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : types.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Tag className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No attendance types found</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => setCreateOpen(true)}>
                <Plus className="mr-2 h-3.5 w-3.5" /> Create First Type
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium">Name</th>
                    <th className="text-left py-3 px-2 font-medium">Category</th>
                    <th className="text-left py-3 px-2 font-medium">Sessions</th>
                    <th className="text-left py-3 px-2 font-medium">Sort</th>
                    <th className="text-left py-3 px-2 font-medium">Active</th>
                    <th className="text-right py-3 px-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {types.map((type) => (
                    <tr key={type.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2 font-medium">{type.name}</td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className="text-xs">
                          {ATTENDANCE_TYPE_CATEGORIES.find((c) => c.value === type.category)?.label || type.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground">{type._count?.sessions ?? 0}</td>
                      <td className="py-3 px-2 text-muted-foreground">{type.sortOrder}</td>
                      <td className="py-3 px-2">
                        {type.isActive ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => setEditType(type)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteType(type)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateAttendanceTypeDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={async (d) => { await createMutation.mutateAsync(d) }}
        isSubmitting={createMutation.isPending}
      />

      <EditAttendanceTypeDialog
        open={!!editType}
        onOpenChange={(v) => { if (!v) setEditType(null) }}
        type={editType}
        onSubmit={async (d) => { if (editType) await updateMutation.mutateAsync({ id: editType.id, data: d }) }}
        isSubmitting={updateMutation.isPending}
      />

      <DeleteAttendanceTypeDialog
        open={!!deleteType}
        onOpenChange={(v) => { if (!v) setDeleteType(null) }}
        type={deleteType}
        onConfirm={async () => { if (deleteType) await deleteMutation.mutateAsync(deleteType.id) }}
        isDeleting={deleteMutation.isPending}
      />
    </motion.div>
  )
}