"use client"

import { useState } from "react"
import { Plus, UsersIcon } from "lucide-react"
import { motion } from "framer-motion"

import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { CompanyUsersTable } from "@/components/users/company-users-table"
import { CompanyUserDialog } from "@/components/users/company-user-dialog"
import { useCompanyUsers } from "@/hooks/use-users"
import type { User } from "@/lib/api/types"

export default function CompanyUsersPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const { data, isLoading } = useCompanyUsers()

  const users: User[] = Array.isArray(data) ? data : data?.data || []

  return (
    <div className="space-y-8">
      <PageHeader title="Company Users" description="Manage company operations staff and administrators">
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Company User
        </Button>
      </PageHeader>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {!isLoading && users.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title="No company users found"
            description="Get started by adding your first company user."
            action={{
              label: "Add Company User",
              onClick: () => setIsCreateOpen(true),
            }}
          />
        ) : (
          <CompanyUsersTable users={users} isLoading={isLoading} />
        )}
      </motion.div>

      <CompanyUserDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} mode="create" />
    </div>
  )
}
