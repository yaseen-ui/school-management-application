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
import { format } from "date-fns"
import type { ColumnDef } from "@tanstack/react-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const EMPLOYEE_TYPES = [
  { value: "all", label: "All Types" },
  { value: "teacher", label: "Teacher" },
  { value: "driver", label: "Driver" },
  { value: "clerk", label: "Clerk" },
  { value: "office_boy", label: "Office Boy" },
  { value: "admin", label: "Admin" },
  { value: "accountant", label: "Accountant" },
  { value: "security", label: "Security" },
  { value: "cleaner", label: "Cleaner" },
  { value: "other", label: "Other" },
]

export default function StaffPage() {
  const router = useRouter()
  const [viewTeacher, setViewTeacher] = useState<Teacher | null>(null)
  const [deleteTeacher, setDeleteTeacher] = useState<Teacher | null>(null)
  const [employeeTypeFilter, setEmployeeTypeFilter] = useState("all")

  const { data: teachers, isLoading } = useTeachers()

  const filteredTeachers = useMemo(() => {
    if (!teachers) return []
    if (employeeTypeFilter === "all") return teachers
    return teachers.filter((t) => t.employeeType === employeeTypeFilter)
  }, [teachers, employeeTypeFilter])

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
      header: "Employee Type",
      accessorKey: "employeeType",
      cell: ({ row }) => {
        const type = row.original.employeeType
        if (!type) return "—"
        return (
          <span className="capitalize">{type.replace(/_/g, " ")}</span>
        )
      },
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
      <Breadcrumbs items={[{ label: "Staff & Curriculum", href: "/staff-curriculum" }, { label: "Staff" }]} />
      <PageHeader title="Staff" description="Manage all employees and their profiles">
        <Button onClick={() => router.push("/teachers/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Staff
        </Button>
      </PageHeader>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={employeeTypeFilter} onValueChange={setEmployeeTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            {EMPLOYEE_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DynamicDataTable<Teacher>
        data={filteredTeachers}
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
              <DropdownMenuItem onClick={() => router.push(`/teachers/${teacher.id}/edit`)}>
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
        searchPlaceholder="Search staff..."
      />

      {viewTeacher && <ViewTeacherDialog teacher={viewTeacher} onClose={() => setViewTeacher(null)} />}

      {deleteTeacher && <DeleteTeacherDialog teacher={deleteTeacher} onClose={() => setDeleteTeacher(null)} />}
    </div>
  )
}
