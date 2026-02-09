"use client"

import * as React from "react"
import {
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Settings2,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Trash2,
  X,
  Loader2,
  ExternalLink,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ImageViewer } from "@/components/shared/image-viewer"

// Utility function to check if a value is a valid image URL
const isImageUrl = (value: unknown): boolean => {
  if (typeof value !== "string") return false

  // Check for common image extensions
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i
  if (imageExtensions.test(value)) return true

  // Check if it's a URL and try to determine if it's an image
  try {
    const url = new URL(value)
    const pathname = url.pathname.toLowerCase()
    return imageExtensions.test(pathname)
  } catch {
    return false
  }
}

// Utility function to check if a value is a valid hyperlink
const isHyperlink = (value: unknown): boolean => {
  if (typeof value !== "string") return false

  // Don't treat images as hyperlinks
  if (isImageUrl(value)) return false

  // Check if it's a valid URL
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

// Component to render dynamic cell content
const DynamicCellContent: React.FC<{ value: unknown }> = ({ value }) => {
  const [isImageViewerOpen, setIsImageViewerOpen] = React.useState(false)

  // Handle null/undefined
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">—</span>
  }

  // Handle objects
  if (typeof value === "object") {
    return <span className="text-muted-foreground text-xs">{JSON.stringify(value)}</span>
  }

  const strValue = String(value)

  // Render image
  if (isImageUrl(strValue)) {
    return (
      <>
        <button
          onClick={() => setIsImageViewerOpen(true)}
          className="flex items-center justify-center hover:opacity-80 transition-opacity p-0"
          type="button"
          aria-label="Open image in viewer"
        >
          <img
            src={strValue}
            alt="Cell content"
            className="max-h-8 max-w-xs rounded object-contain"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = "/placeholder.svg"
            }}
          />
        </button>
        <ImageViewer
          isOpen={isImageViewerOpen}
          imageUrl={strValue}
          onClose={() => setIsImageViewerOpen(false)}
        />
      </>
    )
  }

  // Render hyperlink
  if (isHyperlink(strValue)) {
    return (
      <a
        href={strValue}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300 truncate"
      >
        <span className="truncate">{strValue}</span>
        <ExternalLink className="h-3 w-3 flex-shrink-0" />
      </a>
    )
  }

  // Render plain text
  return <span className="truncate">{strValue}</span>
}

// Column definition from API
export interface ApiColumn {
  field: string
  headerName: string
  type?: string
}

// Props for custom cell rendering
export interface CellRendererProps<TData> {
  row: TData
  field: string
  value: unknown
}

interface DynamicDataTableProps<TData> {
  /** Data rows from API */
  data: TData[]
  /** Column definitions from API */
  apiColumns: ApiColumn[]
  /** Custom cell renderer for specific fields */
  renderCell?: (props: CellRendererProps<TData>) => React.ReactNode
  /** Actions column renderer */
  renderActions?: (row: TData) => React.ReactNode
  /** Enable row selection */
  selectable?: boolean
  /** Callback when selected rows change */
  onSelectionChange?: (selectedRows: TData[]) => void
  /** Bulk delete handler */
  onBulkDelete?: (selectedRows: TData[]) => void
  /** Loading state */
  isLoading?: boolean
  /** Search placeholder */
  searchPlaceholder?: string
  /** ID field for row identification */
  idField?: string
}

export function DynamicDataTable<TData extends Record<string, unknown>>({
  data,
  apiColumns,
  renderCell,
  renderActions,
  selectable = true,
  onSelectionChange,
  onBulkDelete,
  isLoading = false,
  searchPlaceholder = "Search across all columns...",
  idField = "id",
}: DynamicDataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  // Get nested value from object using dot notation
  const getNestedValue = (obj: unknown, path: string): unknown => {
    const keys = path.split(".")
    let value: unknown = obj
    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = (value as Record<string, unknown>)[key]
      } else {
        return undefined
      }
    }
    return value
  }

  // Build columns from API definition
  const columns = React.useMemo<ColumnDef<TData>[]>(() => {
    const cols: ColumnDef<TData>[] = []

    // Add selection column if selectable
    if (selectable) {
      cols.push({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
      })
    }

    // Add data columns from API
    if (Array.isArray(apiColumns)) {
      for (const apiCol of apiColumns) {
      cols.push({
        id: apiCol.field,
        accessorFn: (row) => getNestedValue(row, apiCol.field),
        header: ({ column }) => {
          const isSorted = column.getIsSorted()
          return (
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 h-8 hover:bg-transparent"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              {apiCol.headerName}
              {isSorted === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : isSorted === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
              )}
            </Button>
          )
        },
        cell: ({ row }) => {
          const value = getNestedValue(row.original, apiCol.field)

          // Use custom renderer if provided
          if (renderCell) {
            const customRender = renderCell({
              row: row.original,
              field: apiCol.field,
              value,
            })
            if (customRender !== undefined) {
              return customRender
            }
          }

          // Use dynamic cell content renderer
          return <DynamicCellContent value={value} />
        },
      })
    }
    }

    // Add actions column if renderer provided
    if (renderActions) {
      cols.push({
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => renderActions(row.original),
        enableSorting: false,
        enableHiding: false,
        size: 50,
      })
    }

    return cols
  }, [apiColumns, selectable, renderCell, renderActions])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: selectable,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
    getRowId: (row) => String(row[idField]),
  })

  // Get selected rows data
  const selectedRows = React.useMemo(() => {
    return table.getFilteredSelectedRowModel().rows.map((row) => row.original)
  }, [table.getFilteredSelectedRowModel().rows])

  // Notify parent of selection changes
  React.useEffect(() => {
    onSelectionChange?.(selectedRows)
  }, [selectedRows, onSelectionChange])

  const selectedCount = table.getFilteredSelectedRowModel().rows.length
  const totalCount = table.getFilteredRowModel().rows.length

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>

        {/* Column visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto bg-background">
              <Settings2 className="mr-2 h-4 w-4" />
              Columns
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const apiCol = apiColumns.find((c) => c.field === column.id)
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {apiCol?.headerName || column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">
                {selectedCount} of {totalCount} row(s) selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => table.toggleAllRowsSelected(false)}
                className="h-7 px-2 text-muted-foreground hover:text-foreground"
              >
                <X className="mr-1 h-3 w-3" />
                Clear
              </Button>
            </div>
            {onBulkDelete && (
              <Button variant="destructive" size="sm" onClick={() => onBulkDelete(selectedRows)} className="h-8">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border/50 bg-card shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-border/50 bg-muted/30 hover:bg-muted/30">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-muted-foreground font-semibold whitespace-nowrap"
                    style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="text-sm">Loading data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "border-border/50 transition-colors",
                    row.getIsSelected() ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/50",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Search className="h-8 w-8 opacity-50" />
                    <span className="text-sm font-medium">No results found</span>
                    <span className="text-xs">Try adjusting your search or filters</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {totalCount} result(s)
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {/* Rows per page */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page</span>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px] bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 50, 100].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Page navigation */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-background"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">First page</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-background"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <span className="flex items-center gap-1 px-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{table.getState().pagination.pageIndex + 1}</span>
              <span>/</span>
              <span>{table.getPageCount() || 1}</span>
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-background"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-background"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Last page</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
