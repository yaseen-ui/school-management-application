"use client"

import { useState } from "react"
import { Plus, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { CreateTeacherWizard } from "@/components/teachers/create-teacher-wizard"
import { ViewTeacherDialog } from "@/components/teachers/view-teacher-dialog"
import { EditTeacherDialog } from "@/components/teachers/edit-teacher-dialog"
import { DeleteTeacherDialog } from "@/components/teachers/delete-teacher-dialog"
import { useTeachers } from "@/hooks/use-teachers"
import type { Teacher } from "@/lib/api/teachers"
import { format } from "date-fns"

export default function TeachersPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [viewTeacher, setViewTeacher] = useState<Teacher | null>(null)
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null)
  const [deleteTeacher, setDeleteTeacher] = useState<Teacher | null>(null)

  const { data: teachers, isLoading } = useTeachers()

  const columns = [
    {
      header: "Name",
      accessorKey: "firstName",
      cell: (row: Teacher) => (
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
          <span>
            {row.firstName} {row.middleName} {row.lastName}
          </span>
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
      cell: (row: Teacher) => (row.dateOfJoining ? format(new Date(row.dateOfJoining), "MMM dd, yyyy") : "—"),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Teachers" description="Manage teaching staff and their profiles">
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Teacher
        </Button>
      </PageHeader>

      <DynamicDataTable
        data={teachers || []}
        columns={columns}
        isLoading={isLoading}
        onView={(teacher) => setViewTeacher(teacher)}
        onEdit={(teacher) => setEditTeacher(teacher)}
        onDelete={(teacher) => setDeleteTeacher(teacher)}
        idField="id"
        searchPlaceholder="Search teachers..."
      />

      <CreateTeacherWizard open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      {viewTeacher && <ViewTeacherDialog teacher={viewTeacher} onClose={() => setViewTeacher(null)} />}

      {editTeacher && <EditTeacherDialog teacher={editTeacher} onClose={() => setEditTeacher(null)} />}

      {deleteTeacher && <DeleteTeacherDialog teacher={deleteTeacher} onClose={() => setDeleteTeacher(null)} />}
    </div>
  )
}
