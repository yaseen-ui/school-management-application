"use client"

import { useState } from "react"
import { Plus, GraduationCap, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PageHeader } from "@/components/shared/page-header"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { CreateTeacherWizard } from "@/components/teachers/create-teacher-wizard"
import { ViewTeacherDialog } from "@/components/teachers/view-teacher-dialog"
import { DeleteTeacherDialog } from "@/components/teachers/delete-teacher-dialog"
import { useTeachers } from "@/hooks/use-teachers"
import type { Teacher } from "@/lib/api/teachers"
import { format } from "date-fns"
import type { ColumnDef } from "@tanstack/react-table"

export default function TeachersPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [viewTeacher, setViewTeacher] = useState<Teacher | null>(null)
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null)
  const [deleteTeacher, setDeleteTeacher] = useState<Teacher | null>(null)

  const { data: teachers, isLoading } = useTeachers()

  const columns: ColumnDef<Teacher>[] = [
    {
      header: "Name",
      accessorKey: "fullName",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.fullName}</span>
        </div>
      ),
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Phone",
      accessorKey: "phone",
    },
    {
      header: "Employee Code",
      accessorKey: "employeeCode",
    },
    {
      header: "Gender",
      accessorKey: "gender",
    },
    {
      header: "Date of Joining",
      accessorKey: "dateOfJoining",
      cell: ({ row }) => (row.original.dateOfJoining ? format(new Date(row.original.dateOfJoining), "MMM dd, yyyy") : "—"),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: "Staff & Curriculum", href: "/staff-curriculum" }, { label: "Teachers" }]} />
      <PageHeader title="Teachers" description="Manage teaching staff and their profiles">
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Teacher
        </Button>
      </PageHeader>

      <DynamicDataTable<Teacher>
        data={teachers || []}
        columns={columns}
        isLoading={isLoading}
        renderActions={(teacher) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setViewTeacher(teacher)}>
                <Eye className="h-4 w-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditTeacher(teacher)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteTeacher(teacher)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        idField="id"
        searchPlaceholder="Search teachers..."
      />

      <CreateTeacherWizard open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      <CreateTeacherWizard
        open={!!editTeacher}
        onOpenChange={(open) => { if (!open) setEditTeacher(null) }}
        teacherToEdit={editTeacher}
      />

      {viewTeacher && <ViewTeacherDialog teacher={viewTeacher} onClose={() => setViewTeacher(null)} />}

      {deleteTeacher && <DeleteTeacherDialog teacher={deleteTeacher} onClose={() => setDeleteTeacher(null)} />}
    </div>
  )
}
