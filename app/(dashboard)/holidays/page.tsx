"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CalendarDays, Plus, MoreHorizontal, Eye, Pencil, Trash2, Tag } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { DynamicDataTable, type ApiColumn } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/sonner"
import { useHolidays, useDeleteHoliday } from "@/hooks/use-holidays"
import { useHolidayCategories } from "@/hooks/use-holidays"
import { useAcademicYears } from "@/hooks/use-academic-years"
import type { Holiday, HolidayCategory } from "@/lib/api/holidays"
import { format } from "date-fns"

export default function HolidaysPage() {
  const router = useRouter()
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<string>("")
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("")

  const { data: academicYearsData } = useAcademicYears()
  const { data: categoriesData } = useHolidayCategories()
  const { data: holidaysData, isLoading } = useHolidays({
    academicYearId: selectedAcademicYearId || undefined,
    categoryId: selectedCategoryId || undefined,
  })
  const deleteHoliday = useDeleteHoliday()

  const academicYears = (academicYearsData as any)?.data?.rows || (academicYearsData as any)?.rows || (academicYearsData as any)?.data || []
  const categories: HolidayCategory[] = categoriesData || []
  const holidays: Holiday[] = holidaysData || []

  useEffect(() => {
    const activeYear = academicYears.find((y: any) => y.status === "active")
    if (!selectedAcademicYearId && activeYear) {
      setSelectedAcademicYearId(activeYear.id)
    }
  }, [academicYears, selectedAcademicYearId])

  const apiColumns: ApiColumn[] = [
    { field: "name", headerName: "Holiday Name" },
    { field: "date", headerName: "Date" },
    { field: "categoryName", headerName: "Category" },
    { field: "type", headerName: "Type" },
    { field: "isMandatory", headerName: "Mandatory" },
  ]

  const handleView = (holiday: Holiday) => {
    toast.info("View holiday details", {
      description: `${holiday.name} on ${format(new Date(holiday.date), "MMM d, yyyy")}`,
    })
  }

  const handleEdit = (holiday: Holiday) => {
    router.push(`/holidays/${holiday.id}/edit`)
  }

  const handleDelete = (holiday: Holiday) => {
    if (confirm(`Are you sure you want to delete "${holiday.name}"?`)) {
      deleteHoliday.mutate(holiday.id)
    }
  }

  const handleBulkDelete = (selectedRows: Holiday[]) => {
    toast.info(`Delete ${selectedRows.length} holiday(s)?`, {
      action: {
        label: "Confirm",
        onClick: async () => {
          try {
            await Promise.all(selectedRows.map((row) => deleteHoliday.mutateAsync(row.id)))
            toast.success(`Deleted ${selectedRows.length} holiday(s)`)
          } catch {
            toast.error("Failed to delete some holidays")
          }
        },
      },
    })
  }

  const renderCell = ({ row, field }: { row: Holiday; field: string; value: unknown }) => {
    switch (field) {
      case "name":
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">{row.name}</p>
              {row.remarks && <p className="text-xs text-muted-foreground truncate">{row.remarks}</p>}
            </div>
          </div>
        )

      case "date":
        return (
          <span className="text-sm text-muted-foreground">
            {format(new Date(row.date), "MMM d, yyyy")}
          </span>
        )

      case "categoryName":
        return row.categoryName ? (
          <Badge variant="secondary" className="gap-1">
            <Tag className="h-3 w-3" />
            {row.categoryName}
          </Badge>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )

      case "type":
        return (
          <Badge variant="outline" className="capitalize">
            {row.type}
          </Badge>
        )

      case "isMandatory":
        return (
          <Badge variant={row.isMandatory ? "default" : "secondary"}>
            {row.isMandatory ? "Mandatory" : "Optional"}
          </Badge>
        )

      default:
        return undefined
    }
  }

  const renderActions = (row: Holiday) => (
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
        <DropdownMenuItem onClick={() => handleEdit(row)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(row)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
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
      <PageHeader title="Holidays" description="Manage holiday calendar for your institution">
        <div className="flex gap-2">
          <Button onClick={() => router.push("/holidays/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Holiday
          </Button>
          <Button variant="outline" onClick={() => router.push("/holiday-categories")}>
            <Tag className="mr-2 h-4 w-4" />
            Categories
          </Button>
        </div>
      </PageHeader>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Academic Year</label>
              <Select value={selectedAcademicYearId || "all"} onValueChange={(v) => setSelectedAcademicYearId(v === "all" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="All academic years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All academic years</SelectItem>
                  {academicYears.map((year: any) => (
                    <SelectItem key={year.id} value={year.id}>
                      {year.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategoryId || "all"} onValueChange={(v) => setSelectedCategoryId(v === "all" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <DynamicDataTable
        data={holidays}
        apiColumns={apiColumns}
        renderCell={renderCell}
        renderActions={renderActions}
        onBulkDelete={handleBulkDelete}
        isLoading={isLoading}
        searchPlaceholder="Search holidays..."
        idField="id"
      />
    </motion.div>
  )
}