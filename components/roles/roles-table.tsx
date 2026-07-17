"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash2, Shield, Key, Users, Tag, Copy } from "lucide-react"
import { format } from "date-fns"

import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RoleDialog } from "./role-dialog"
import { DeleteRoleDialog } from "./delete-role-dialog"
import type { Role } from "@/lib/api/roles"

interface RolesTableProps {
  roles: Role[]
  isLoading?: boolean
}

export function RolesTable({ roles, isLoading }: RolesTableProps) {
  const [editRole, setEditRole] = useState<Role | null>(null)
  const [deleteRole, setDeleteRole] = useState<Role | null>(null)
  const [createRole, setCreateRole] = useState<{ duplicateFrom?: Role } | null>(null)

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: "roleName",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">{role.roleName}</p>
              <p className="text-sm text-muted-foreground line-clamp-1">{role.description}</p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "groupName",
      header: "Group",
      cell: ({ row }) => {
        const groupName = row.original.groupName
        return groupName ? (
          <Badge variant="outline" className="gap-1">
            <Tag className="h-3 w-3" />
            {groupName}
          </Badge>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )
      },
    },
    {
      accessorKey: "permissions",
      header: "Permissions",
      cell: ({ row }) => {
        const permissions = row.original.permissions || []
        const count = permissions.length
        return (
          <Badge variant="secondary">
            <Key className="mr-1 h-3 w-3" />
            {count} permission{count !== 1 ? "s" : ""}
          </Badge>
        )
      },
    },
    {
      accessorKey: "userCount",
      header: "Users",
      cell: ({ row }) => {
        const count = row.original.userCount ?? 0
        return (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>{count}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string
        return date ? format(new Date(date), "MMM d, yyyy") : "-"
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const role = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setEditRole(role)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setCreateRole({ duplicateFrom: role }); setEditRole(null) }}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDeleteRole(role)} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete {role.userCount ? `(${role.userCount} users)` : ""}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={roles}
        searchKey="roleName"
        searchPlaceholder="Search roles..."
        isLoading={isLoading}
      />

      <RoleDialog
        open={!!editRole}
        onOpenChange={(open) => !open && setEditRole(null)}
        role={editRole}
        mode="edit"
      />

      <DeleteRoleDialog
        open={!!deleteRole}
        onOpenChange={(open) => !open && setDeleteRole(null)}
        role={deleteRole}
      />
    </>
  )
}