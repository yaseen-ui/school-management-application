"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Plus, GraduationCap, MoreHorizontal, Eye, Pencil, Trash2, Filter } from "lucide-react"
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
import { ViewTeacherDialog } from "@/components/teachers/view-teacher-dialog"
import { DeleteTeacherDialog } from "@/components/teachers/delete-teacher-dialog"
import { useTeachers } from "@/hooks/use-teachers"
import type { Teacher } from "@/lib/api/teachers"
import { StaffStatusBadge } from "@/components/teachers/staff-status-badge"
import { InviteStaffButton } from "@/components/teachers/invite-staff-button"
import { format } from "date-fns"
import type { ColumnDef } from "@tanstack/react-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePermission, usePermissionsLoaded } from "@/hooks/use-permission"
import { ForbiddenPage } from "@/components/shared/forbidden-page"

const EMPLOYEE_TYPES = [
  { value: "all", label: "All Types" },
  { value: "teacher", label: "Teacher" },
  { value: "driver", label: "Driver" },
  { value: "clerk", label: "Clerk" },
  { value: "admin", label: "Admin" },
  { value: "accountant", label: "Accountant" },
  { value: "office_boy", label: "Office Boy" },
  { value: "security", label: "Security" },
  { value: "cleaner", label: "Cleaner" },
  { value: "other", label: "Other" },
]

export default function TeachersPage() {
  const canAccess = usePermission('teachers:read')
  const isLoaded = usePermissionsLoaded()
  if (!canAccess && isLoaded) return <ForbiddenPage />

  const router = useRouter()
  const { data: teacherData, isLoading } = useTeachers()

  const teachers: Teacher[] = teacherData?.rows ?? teacherData ?? []

  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [employeeTypeFilter, setEmployeeTypeFilter] = useState("all")

  const filteredTeachers = employeeTypeFilter === "all"
    ? teachers
    : teachers.filter((t) => t.employeeType === employeeTypeFilter)

  const handleView = (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    setIsViewOpen(true)
  }

  const handleEdit = (teacher: Teacher) => {
    router.push(`/teachers/${teacher.id}`)
  }

  const handleDelete = (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    setIsDeleteOpen(true)
  }

  const columns: ColumnDef<Teacher>[] = [
    {
      accessorKey: "fullName",
      header: "Staff Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{row.original.fullName}</p>
            <p className="text-sm text-muted-foreground">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "employeeCode",
      header: "Employee Code",
      cell: ({ row }) => <span className="text-sm font-mono">{row.original.employeeCode || "—"}</span>,
    },
    {
      accessorKey: "employeeType",
      header: "Type",
      cell: ({ row }) => <span className="text-sm capitalize">{row.original.employeeType?.replace("_", " ")}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StaffStatusBadge teacher={row.original} />,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleView(row.original)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDelete(row.original)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <PageHeader title="Staff & Teachers" description="Manage staff, teachers, and other employees">
        <div className="flex gap-2">
          <InviteStaffButton />
          <Button onClick={() => router.push("/teachers/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        </div>
      </PageHeader>

      <div className="flex items-center gap-4">
        <Select value={employeeTypeFilter} onValueChange={setEmployeeTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EMPLOYEE_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {filteredTeachers.length} staff member{filteredTeachers.length !== 1 ? "s" : ""}
        </span>
      </div>

      <DynamicDataTable
        data={filteredTeachers}
        apiColumns={[]}
        isLoading={isLoading}
        idField="id"
        searchPlaceholder="Search staff by name or email..."
      />

      <ViewTeacherDialog open={isViewOpen} onOpenChange={setIsViewOpen} teacher={selectedTeacher} />
      <DeleteTeacherDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} teacher={selectedTeacher} />
    </div>
  )
}