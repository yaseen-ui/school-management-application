"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Building2, Plus, MoreHorizontal, Eye, Pencil, Trash2, Mail, Phone, Globe } from "lucide-react"
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
import { useTenants } from "@/hooks/use-tenants"
import { toast } from "@/components/ui/sonner"
import { CreateTenantDialog } from "@/components/tenants/create-tenant-dialog"
import { ViewTenantDialog } from "@/components/tenants/view-tenant-dialog"
import { EditTenantDialog } from "@/components/tenants/edit-tenant-dialog"
import { DeleteTenantDialog } from "@/components/tenants/delete-tenant-dialog"

interface TenantData {
  id: string
  schoolName: string
  domain?: string | null
  logo?: string | null
  caption?: string | null
  contactAddress: {
    street: string
    city: string
    state: string
    zip: string
  }
  contactPhone: string
  contactEmail: string
  adminFullName?: string
  adminPhone?: string
  adminEmail: string
  subscriptionPlan: string
  status?: string
  createdAt: string
  updatedAt: string
}

const subscriptionColors: Record<string, string> = {
  basic: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  standard: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  premium: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
}

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  inactive: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  suspended: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
}

export default function TenantsPage() {
  const { data, isLoading } = useTenants()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<TenantData | null>(null)

  const tenants = (data?.data?.rows || []) as TenantData[]
  const apiColumns: ApiColumn[] = data?.data?.columns || [
    { field: "schoolName", headerName: "School Name" },
    { field: "adminEmail", headerName: "Admin Email" },
    { field: "contactEmail", headerName: "Contact Email" },
    { field: "contactPhone", headerName: "Contact Phone" },
    { field: "domain", headerName: "Domain" },
    { field: "subscriptionPlan", headerName: "Plan" },
  ]

  const handleView = (tenant: TenantData) => {
    setSelectedTenant(tenant)
    setIsViewOpen(true)
  }

  const handleEdit = (tenant: TenantData) => {
    setSelectedTenant(tenant)
    setIsEditOpen(true)
  }

  const handleDelete = (tenant: TenantData) => {
    setSelectedTenant(tenant)
    setIsDeleteOpen(true)
  }

  const renderCell = ({ row, field, value }: { row: TenantData; field: string; value: unknown }) => {
    switch (field) {
      case "schoolName":
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              {row.logo ? (
                <img
                  src={row.logo || "/placeholder.svg"}
                  alt={row.schoolName}
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <Building2 className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">{row.schoolName}</p>
              <p className="text-sm text-muted-foreground truncate">
                {row.contactAddress?.city}, {row.contactAddress?.state}
              </p>
            </div>
          </div>
        )

      case "adminEmail":
        return (
          <div>
            <p className="font-medium text-foreground">{row.adminFullName || "N/A"}</p>
            <p className="text-sm text-muted-foreground">{row.adminEmail}</p>
          </div>
        )

      case "contactEmail":
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{row.contactEmail}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span>{row.contactPhone}</span>
            </div>
          </div>
        )

      case "domain":
        return row.domain ? (
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-foreground">{row.domain}</span>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">Not configured</span>
        )

      case "subscriptionPlan":
        return (
          <Badge variant="secondary" className={subscriptionColors[row.subscriptionPlan] || subscriptionColors.basic}>
            {row.subscriptionPlan}
          </Badge>
        )

      case "status":
        return (
          <Badge variant="secondary" className={statusColors[row.status || "active"]}>
            {row.status || "active"}
          </Badge>
        )

      default:
        return undefined
    }
  }

  const renderActions = (row: TenantData) => (
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

  const handleBulkDelete = (selectedRows: TenantData[]) => {
    toast.info(`Delete ${selectedRows.length} tenant(s)?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Confirm",
        onClick: () => {
          toast.success(`Deleted ${selectedRows.length} tenant(s)`)
        },
      },
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PageHeader title="Tenants" description="Manage all registered institutes and schools">
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Tenant
        </Button>
      </PageHeader>

      {!isLoading && tenants.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No tenants yet"
          description="Get started by adding your first institute or school to the platform."
          action={{
            label: "Add Tenant",
            onClick: () => setIsCreateOpen(true),
          }}
        />
      ) : (
        <DynamicDataTable
          data={tenants}
          apiColumns={apiColumns}
          renderCell={renderCell}
          renderActions={renderActions}
          onBulkDelete={handleBulkDelete}
          isLoading={isLoading}
          searchPlaceholder="Search tenants..."
          idField="id"
        />
      )}

      <CreateTenantDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <ViewTenantDialog open={isViewOpen} onOpenChange={setIsViewOpen} tenant={selectedTenant} />
      <EditTenantDialog open={isEditOpen} onOpenChange={setIsEditOpen} tenant={selectedTenant} />
      <DeleteTenantDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} tenant={selectedTenant} />
    </motion.div>
  )
}
