"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash2, Phone, CheckCircle2, AlertCircle } from "lucide-react"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserDialog } from "./user-dialog"
import { DeleteUserDialog } from "./delete-user-dialog"
import type { User } from "@/lib/api/types"

interface UsersTableProps {
  users: User[]
  isLoading?: boolean
}

export function UsersTable({ users, isLoading }: UsersTableProps) {
  const [editUser, setEditUser] = useState<User | null>(null)
  const [deleteUser, setDeleteUser] = useState<User | null>(null)

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => {
        const user = row.original
        const name = user.fullName || user.email
        const initials = user.fullName
          ? user.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
          : user.email?.[0]?.toUpperCase() || "U"

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary text-sm">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => {
        const phone = row.getValue("phone") as string
        return phone ? (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
            {phone}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
    },
    {
      accessorKey: "userType",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("userType") as string
        return (
          <Badge variant={type === "company" ? "default" : "outline"} className="capitalize">
            {type}
          </Badge>
        )
      },
    },
    {
      accessorKey: "isFirstLogin",
      header: "Status",
      cell: ({ row }) => {
        const isFirstLogin = row.getValue("isFirstLogin") as boolean
        return isFirstLogin ? (
          <Badge variant="outline" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            First Login
          </Badge>
        ) : (
          <Badge variant="secondary" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Active
          </Badge>
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
        const user = row.original

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
              <DropdownMenuItem onClick={() => setEditUser(user)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteUser(user)} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
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
        data={users}
        searchKey="name"
        searchPlaceholder="Search users..."
        isLoading={isLoading}
      />

      <UserDialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)} user={editUser} mode="edit" />

      <DeleteUserDialog open={!!deleteUser} onOpenChange={(open) => !open && setDeleteUser(null)} user={deleteUser} />
    </>
  )
}
