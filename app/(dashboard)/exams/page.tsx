"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Eye, Pencil, Trash2, Plus, Calendar, BookOpen } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useExams, useDeleteExam } from "@/hooks/use-exams"
import { ViewExamDialog } from "@/components/exams/view-exam-dialog"
import { DeleteExamDialog } from "@/components/exams/delete-exam-dialog"
import { format } from "date-fns"
import { MoreVertical } from "lucide-react"
import { toast } from "@/components/ui/sonner"
import { usePermission, usePermissionsLoaded } from "@/hooks/use-permission"
import { ForbiddenPage } from "@/components/shared/forbidden-page"
import type { Exam } from "@/lib/api/exams"
import Link from "next/link"

const examTypeLabels: Record<string, string> = {
  weekly: "Weekly",
  quarterly: "Quarterly",
  half_yearly: "Half-Yearly",
  annually: "Annually",
}

const statusLabels: Record<string, string> = {
  draft: "Draft",
  published: "Published",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
}

const statusColors: Record<string, string> = {
  draft: "text-muted-foreground bg-muted",
  published: "text-blue-600 bg-blue-100",
  in_progress: "text-amber-600 bg-amber-100",
  completed: "text-green-600 bg-green-100",
  cancelled: "text-red-600 bg-red-100",
}

export default function ExamsPage() {
  const canAccess = usePermission('exams:read')
  const isLoaded = usePermissionsLoaded()
  if (!canAccess && isLoaded) return <ForbiddenPage />
  const { data, isLoading } = useExams()
  const deleteExam = useDeleteExam()

  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)

  const exams: Exam[] = data || []

  const handleView = (exam: Exam) => {
    setSelectedExam(exam)
    setViewDialogOpen(true)
  }

  const handleDelete = (exam: Exam) => {
    setSelectedExam(exam)
    setDeleteDialogOpen(true)
  }

  const handleBulkDelete = async (selectedRows: Exam[]) => {
    try {
      await Promise.all(selectedRows.map((row) => deleteExam.mutateAsync(row.id)))
      toast.success(`Successfully deleted ${selectedRows.length} exam(s)`)
    } catch (error) {
      toast.error("Failed to delete some exams")
    }
  }

  const defaultColumns = [
    { field: "name", headerName: "Exam Name" },
    { field: "examType", headerName: "Exam Type" },
    { field: "academicYear", headerName: "Academic Year" },
    { field: "startDate", headerName: "Start Date" },
    { field: "endDate", headerName: "End Date" },
    { field: "status", headerName: "Status" },
    { field: "source", headerName: "Source" },
    { field: "createdAt", headerName: "Created At" },
  ]

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader title="Exams" description="Create and manage exam blueprints for your institution">
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/exams/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Exam
              </Link>
            </Button>
          </div>
        </PageHeader>

        <DynamicDataTable
          data={exams}
          apiColumns={defaultColumns}
          isLoading={isLoading}
          onBulkDelete={handleBulkDelete}
          idField="id"
          renderCell={({ row, field }: { row: Exam; field: string; value: unknown }) => {
            if (field === "name") {
              return (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">{row.name}</span>
                    {row.description && (
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{row.description}</p>
                    )}
                  </div>
                </div>
              )
            }

            if (field === "examType") {
              return (
                <span className="text-sm font-medium capitalize">
                  {examTypeLabels[row.examType] || row.examType}
                </span>
              )
            }

            if (field === "academicYear") {
              return (
                <span className="text-sm text-muted-foreground">
                  {row.academicYear?.name || "—"}
                </span>
              )
            }

            if (field === "startDate" || field === "endDate") {
              return (
                <span className="text-sm text-muted-foreground">
                  {format(new Date(row[field as keyof Exam] as string), "MMM d, yyyy")}
                </span>
              )
            }

            if (field === "status") {
              return (
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[row.status] || ""}`}>
                  {statusLabels[row.status] || row.status}
                </span>
              )
            }

            if (field === "source") {
              return (
                <span className={`text-sm font-medium ${row.source === "admin" ? "text-blue-600" : "text-purple-600"}`}>
                  {row.source === "admin" ? "Admin" : "Custom"}
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
          renderActions={(row: Exam) => (
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
                <DropdownMenuItem asChild>
                  <Link href={`/exams/${row.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/exams/${row.id}/schedules`}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedules
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

      <ViewExamDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} exam={selectedExam} />
      <DeleteExamDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} exam={selectedExam} />
    </>
  )
}
