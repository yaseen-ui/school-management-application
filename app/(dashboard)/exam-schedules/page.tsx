"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Eye, Pencil, Trash2, Plus, FileText } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useExamSchedules, useDeleteExamSchedule } from "@/hooks/use-exams"
import { ViewScheduleDialog } from "@/components/exams/view-schedule-dialog"
import { EditScheduleDialog } from "@/components/exams/edit-schedule-dialog"
import { DeleteScheduleDialog } from "@/components/exams/delete-schedule-dialog"
import { format } from "date-fns"
import { MoreVertical } from "lucide-react"
import { toast } from "@/components/ui/sonner"
import type { ExamSchedule } from "@/lib/api/exams"
import Link from "next/link"

const scheduleStatusColors: Record<string, string> = {
  pending: "text-muted-foreground bg-muted",
  scheduled: "text-blue-600 bg-blue-100",
  completed: "text-green-600 bg-green-100",
  cancelled: "text-red-600 bg-red-100",
}

export default function ExamSchedulesPage() {
  const { data: schedulesData, isLoading } = useExamSchedules({})
  const deleteSchedule = useDeleteExamSchedule()

  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<ExamSchedule | null>(null)

  const schedules: ExamSchedule[] = schedulesData || []

  const handleView = (schedule: ExamSchedule) => {
    setSelectedSchedule(schedule)
    setViewDialogOpen(true)
  }

  const handleEdit = (schedule: ExamSchedule) => {
    setSelectedSchedule(schedule)
    setEditDialogOpen(true)
  }

  const handleDelete = (schedule: ExamSchedule) => {
    setSelectedSchedule(schedule)
    setDeleteDialogOpen(true)
  }

  const handleBulkDelete = async (selectedRows: ExamSchedule[]) => {
    try {
      await Promise.all(selectedRows.map((row) => deleteSchedule.mutateAsync(row.id)))
      toast.success(`Successfully deleted ${selectedRows.length} schedule(s)`)
    } catch (error) {
      toast.error("Failed to delete some schedules")
    }
  }

  const defaultColumns = [
    { field: "name", headerName: "Schedule Name" },
    { field: "exam", headerName: "Exam" },
    { field: "section", headerName: "Section" },
    { field: "startDate", headerName: "Start Date" },
    { field: "endDate", headerName: "End Date" },
    { field: "status", headerName: "Status" },
    { field: "papers", headerName: "Papers" },
    { field: "createdAt", headerName: "Created At" },
  ]

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader
          title="Exam Schedules"
          description="View and manage all exam schedules across sections"
        >
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/exams/schedules/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Schedule
              </Link>
            </Button>
          </div>
        </PageHeader>

        <DynamicDataTable
          data={schedules}
          apiColumns={defaultColumns}
          isLoading={isLoading}
          onBulkDelete={handleBulkDelete}
          idField="id"
          renderCell={({ row, field }: { row: ExamSchedule; field: string; value: unknown }) => {
            if (field === "name") {
              return (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{row.name}</span>
                </div>
              )
            }

            if (field === "exam") {
              return (
                <span className="text-sm">
                  {row.exam ? (
                    <span className="font-medium">{row.exam.name}</span>
                  ) : (
                    <span className="text-muted-foreground italic">Custom</span>
                  )}
                </span>
              )
            }

            if (field === "section") {
              return (
                <span className="text-sm">
                  {row.section?.sectionName || "—"}
                  {row.section?.grade && (
                    <span className="text-muted-foreground ml-1">({row.section.grade.gradeName})</span>
                  )}
                </span>
              )
            }

            if (field === "startDate" || field === "endDate") {
              return (
                <span className="text-sm text-muted-foreground">
                  {format(new Date(row[field as keyof ExamSchedule] as string), "MMM d, yyyy")}
                </span>
              )
            }

            if (field === "status") {
              return (
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${scheduleStatusColors[row.status] || ""}`}>
                  {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </span>
              )
            }

            if (field === "papers") {
              return (
                <span className="text-sm text-muted-foreground">
                  {row._count?.papers || 0} paper(s)
                </span>
              )
            }

            if (field === "createdAt") {
              return (
                <span className="text-sm text-muted-foreground">
                  {format(new Date(row.createdAt), "MMM d, yyyy")}
                </span>
              )
            }

            return undefined
          }}
          renderActions={(row: ExamSchedule) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleView(row)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEdit(row)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/exams/schedules/${row.id}/papers`}>
                    <FileText className="mr-2 h-4 w-4" />
                    Manage Papers
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(row)} className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </motion.div>

      <ViewScheduleDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} schedule={selectedSchedule} />
      <EditScheduleDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} schedule={selectedSchedule} />
      <DeleteScheduleDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} schedule={selectedSchedule} />
    </>
  )
}
