"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Plus, MoreHorizontal, Eye, Pencil, CheckCircle2, Archive } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { DynamicDataTable, type ApiColumn } from "@/components/shared/dynamic-data-table"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAcademicYears } from "@/hooks/use-academic-years"
import { CreateAcademicYearDialog } from "@/components/academic-years/create-academic-year-dialog"
import { ViewAcademicYearDialog } from "@/components/academic-years/view-academic-year-dialog"
import { EditAcademicYearDialog } from "@/components/academic-years/edit-academic-year-dialog"
import { ActivateAcademicYearDialog } from "@/components/academic-years/activate-academic-year-dialog"
import type { AcademicYear } from "@/lib/api/academic-years"
import { cn } from "@/lib/utils"

export default function AcademicYearsPage() {
  const { data, isLoading } = useAcademicYears()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isActivateOpen, setIsActivateOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState<AcademicYear | null>(null)

  const academicYears = (data?.data?.rows || []) as AcademicYear[]
  const apiColumns: ApiColumn[] = data?.data?.columns || [
    { field: "name", headerName: "Academic Year" },
    { field: "startDate", headerName: "Start Date" },
    { field: "endDate", headerName: "End Date" },
    { field: "status", headerName: "Status" },
    { field: "createdAt", headerName: "Created At" },
  ]

  const handleView = (year: AcademicYear) => {
    setSelectedYear(year)
    setIsViewOpen(true)
  }

  const handleEdit = (year: AcademicYear) => {
    setSelectedYear(year)
    setIsEditOpen(true)
  }

  const handleActivate = (year: AcademicYear) => {
    setSelectedYear(year)
    setIsActivateOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "draft":
        return <Badge variant="secondary">Draft</Badge>
      case "archived":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Archived
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const renderCell = ({ row, field, value }: { row: AcademicYear; field: string; value: unknown }) => {
    const isArchived = row.status === "archived"

    switch (field) {
      case "name":
        return (
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg shrink-0",
                isArchived ? "bg-muted" : "bg-primary/10",
              )}
            >
              <Calendar className={cn("h-5 w-5", isArchived ? "text-muted-foreground" : "text-primary")} />
            </div>
            <div className="min-w-0">
              <p className={cn("font-medium truncate", isArchived && "text-muted-foreground")}>{row.name}</p>
            </div>
          </div>
        )

      case "startDate":
      case "endDate":
        return (
          <p className={cn("text-sm", isArchived ? "text-muted-foreground" : "text-foreground")}>
            {formatDate(value as string)}
          </p>
        )

      case "status":
        return getStatusBadge(row.status)

      case "createdAt":
      case "updatedAt":
        return (
          <p className={cn("text-sm", isArchived ? "text-muted-foreground" : "text-muted-foreground")}>
            {formatDate(value as string)}
          </p>
        )

      default:
        return undefined
    }
  }

  const renderActions = (row: AcademicYear) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleView(row)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        {row.status === "draft" && (
          <>
            <DropdownMenuItem onClick={() => handleEdit(row)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleActivate(row)}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Activate
            </DropdownMenuItem>
          </>
        )}
        {row.status === "archived" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled className="text-muted-foreground">
              <Archive className="mr-2 h-4 w-4" />
              Archived
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PageHeader title="Academic Years" description="Manage academic years for your institute">
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Academic Year
        </Button>
      </PageHeader>

      {!isLoading && academicYears.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No academic years yet"
          description="Get started by adding your first academic year."
          action={{
            label: "Add Academic Year",
            onClick: () => setIsCreateOpen(true),
          }}
        />
      ) : (
        <DynamicDataTable
          data={academicYears}
          apiColumns={apiColumns}
          renderCell={renderCell}
          renderActions={renderActions}
          isLoading={isLoading}
          searchPlaceholder="Search academic years..."
          idField="id"
        />
      )}

      <CreateAcademicYearDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <ViewAcademicYearDialog open={isViewOpen} onOpenChange={setIsViewOpen} academicYear={selectedYear} />
      <EditAcademicYearDialog open={isEditOpen} onOpenChange={setIsEditOpen} academicYear={selectedYear} />
      <ActivateAcademicYearDialog open={isActivateOpen} onOpenChange={setIsActivateOpen} academicYear={selectedYear} />
    </motion.div>
  )
}
