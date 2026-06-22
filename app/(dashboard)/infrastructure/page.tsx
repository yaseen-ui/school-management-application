"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Building2, Plus, MoreHorizontal, Pencil, Trash2, Layers, DoorOpen } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBuildings, useDeleteBuilding } from "@/hooks/use-buildings"
import { CreateBuildingDialog } from "@/components/infrastructure/create-building-dialog"
import { EditBuildingDialog } from "@/components/infrastructure/edit-building-dialog"
import { DeleteBuildingDialog } from "@/components/infrastructure/delete-building-dialog"
import Link from "next/link"
import type { Building } from "@/lib/api/buildings"

export default function InfrastructurePage() {
  const { data, isLoading } = useBuildings()
  const deleteBuilding = useDeleteBuilding()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)

  const buildings: Building[] = (data?.data || []) as Building[]

  const handleEdit = (building: Building) => {
    setSelectedBuilding(building)
    setIsEditOpen(true)
  }

  const handleDelete = (building: Building) => {
    setSelectedBuilding(building)
    setIsDeleteOpen(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PageHeader
        title="Infrastructure"
        description="Manage buildings, floors, and rooms in your institute"
      >
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Building
        </Button>
      </PageHeader>

      {!isLoading && buildings.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No buildings yet"
          description="Get started by adding your first building or block."
          action={{
            label: "Add Building",
            onClick: () => setIsCreateOpen(true),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buildings.map((building) => (
            <motion.div
              key={building.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Link href={`/infrastructure/${building.id}`}>
                <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{building.name}</CardTitle>
                          {building.code && (
                            <p className="text-sm text-muted-foreground">{building.code}</p>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(e) => e.preventDefault()}>
                          <DropdownMenuItem onClick={() => handleEdit(building)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(building)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {building.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{building.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Layers className="h-4 w-4" />
                        <span>{building._count?.floors || 0} floors</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DoorOpen className="h-4 w-4" />
                        <span>
                          {building.floors?.reduce((sum, f) => sum + (f._count?.rooms || 0), 0) || 0} rooms
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      <CreateBuildingDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <EditBuildingDialog open={isEditOpen} onOpenChange={setIsEditOpen} building={selectedBuilding} />
      <DeleteBuildingDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} building={selectedBuilding} />
    </motion.div>
  )
}
