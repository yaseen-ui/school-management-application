"use client"

import { useState } from "react"
import { Plus, UsersIcon } from "lucide-react"
import { motion } from "framer-motion"

import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { UsersTable } from "@/components/users/users-table"
import { UserDialog } from "@/components/users/user-dialog"
import { useUsers } from "@/hooks/use-users"
import type { User } from "@/lib/api/types"

export default function UsersPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const { data, isLoading } = useUsers()

  const users: User[] = Array.isArray(data) ? data : data?.data || []

  return (
    <div className="space-y-8">
      <PageHeader title="Users" description="Manage users and their access permissions">
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </PageHeader>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {!isLoading && users.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title="No users found"
            description="Get started by creating your first user."
            action={{
              label: "Add User",
              onClick: () => setIsCreateOpen(true),
            }}
          />
        ) : (
          <UsersTable users={users} isLoading={isLoading} />
        )}
      </motion.div>

      <UserDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} mode="create" />
    </div>
  )
}
