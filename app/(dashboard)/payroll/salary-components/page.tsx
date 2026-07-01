"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ListOrdered, Eye, Pencil, Trash2, Plus } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { DynamicDataTable } from "@/components/shared/dynamic-data-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { toast } from "@/components/ui/sonner"
import { format } from "date-fns"

import {
  listSalaryComponents,
  createSalaryComponent,
  updateSalaryComponent,
  deleteSalaryComponent,
} from "@/lib/api/payroll"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SalaryComponent {
  id: string
  name: string
  description: string | null
  type: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

const COMPONENT_TYPES = [
  { value: "EARNING", label: "Earning" },
  { value: "DEDUCTION", label: "Deduction" },
]

export default function SalaryComponentsPage() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["salary-components"],
    queryFn: listSalaryComponents,
  })

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedComponent, setSelectedComponent] = useState<SalaryComponent | null>(null)

  // Form state
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formType, setFormType] = useState("EARNING")
  const [formSortOrder, setFormSortOrder] = useState(0)

  const components: SalaryComponent[] = data?.data || data || []

  const createMutation = useMutation({
    mutationFn: (data: { name: string; description?: string; type: string; sortOrder?: number }) =>
      createSalaryComponent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salary-components"] })
      toast.success("Salary component created successfully")
      resetForm()
      setCreateDialogOpen(false)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; name?: string; description?: string; type?: string; isActive?: boolean; sortOrder?: number }) =>
      updateSalaryComponent(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salary-components"] })
      toast.success("Salary component updated successfully")
      resetForm()
      setEditDialogOpen(false)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSalaryComponent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salary-components"] })
      toast.success("Salary component deleted successfully")
      setDeleteDialogOpen(false)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const resetForm = () => {
    setFormName("")
    setFormDescription("")
    setFormType("EARNING")
    setFormSortOrder(0)
    setSelectedComponent(null)
  }

  const openEditDialog = (component: SalaryComponent) => {
    setSelectedComponent(component)
    setFormName(component.name)
    setFormDescription(component.description || "")
    setFormType(component.type)
    setFormSortOrder(component.sortOrder)
    setEditDialogOpen(true)
  }

  const handleCreate = () => {
    createMutation.mutate({
      name: formName,
      description: formDescription || undefined,
      type: formType,
      sortOrder: formSortOrder || undefined,
    })
  }

  const handleUpdate = () => {
    if (!selectedComponent) return
    updateMutation.mutate({
      id: selectedComponent.id,
      name: formName,
      description: formDescription || undefined,
      type: formType,
      isActive: selectedComponent.isActive,
      sortOrder: formSortOrder || undefined,
    })
  }

  const defaultColumns = [
    { field: "name", headerName: "Name" },
    { field: "description", headerName: "Description" },
    { field: "type", headerName: "Type" },
    { field: "isActive", headerName: "Status" },
    { field: "sortOrder", headerName: "Sort Order" },
    { field: "createdAt", headerName: "Created" },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader
        title="Salary Components"
        description="Manage salary components like HRA, Allowances, Basic Salary, etc."
      >
        <Button onClick={() => { resetForm(); setCreateDialogOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Component
        </Button>
      </PageHeader>

      <DynamicDataTable
        data={components}
        apiColumns={defaultColumns}
        isLoading={isLoading}
        idField="id"
        renderCell={({ row, field }: { row: SalaryComponent; field: string; value: unknown }) => {
          if (field === "name") {
            return (
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                  <ListOrdered className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">{row.name}</span>
              </div>
            )
          }

          if (field === "description") {
            return <span className="text-sm text-muted-foreground">{row.description || "—"}</span>
          }

          if (field === "type") {
            return (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  row.type === "EARNING"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {row.type}
              </span>
            )
          }

          if (field === "isActive") {
            return (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  row.isActive
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                }`}
              >
                {row.isActive ? "Active" : "Inactive"}
              </span>
            )
          }

          if (field === "sortOrder") {
            return <span className="text-sm text-muted-foreground">{row.sortOrder}</span>
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
        renderActions={(row: SalaryComponent) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEditDialog(row)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => {
                  setSelectedComponent(row)
                  setDeleteDialogOpen(true)
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Salary Component</DialogTitle>
            <DialogDescription>Add a new salary component type.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. HRA" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Optional description"
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={formType} onValueChange={setFormType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMPONENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={formSortOrder}
                onChange={(e) => setFormSortOrder(Number(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!formName || createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Salary Component</DialogTitle>
            <DialogDescription>Update the salary component details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={formType} onValueChange={setFormType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMPONENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={formSortOrder}
                onChange={(e) => setFormSortOrder(Number(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={!formName || updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Salary Component</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedComponent?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedComponent && deleteMutation.mutate(selectedComponent.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
