"use client"

import { useState } from "react"
import { Plus, Shield } from "lucide-react"
import { motion } from "framer-motion"

import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { RolesTable } from "@/components/roles/roles-table"
import { RoleDialog } from "@/components/roles/role-dialog"
import { useRoles } from "@/hooks/use-roles"
import type { Role } from "@/lib/api/roles"

export default function RolesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const { data, isLoading } = useRoles()

  const roles: Role[] = Array.isArray(data) ? data : []

  return (
    <div className="space-y-8">
      <PageHeader title="Roles & Permissions" description="Manage roles and define access permissions for users">
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      </PageHeader>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {!isLoading && roles.length === 0 ? (
          <EmptyState
            icon={Shield}
            title="No roles found"
            description="Get started by creating your first role with specific permissions."
            action={{
              label: "Create Role",
              onClick: () => setIsCreateOpen(true),
            }}
          />
        ) : (
          <RolesTable roles={roles} isLoading={isLoading} />
        )}
      </motion.div>

      <RoleDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} mode="create" />
    </div>
  )
}
