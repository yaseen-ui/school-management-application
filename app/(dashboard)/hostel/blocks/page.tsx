"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Building2, Plus, MoreHorizontal, Pencil, Trash2, Layers, DoorOpen, Users } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useHostelBlocks, useDeleteHostelBlock } from "@/hooks/use-hostel"
import { CreateBlockDialog } from "@/components/hostel/create-block-dialog"
import { EditBlockDialog } from "@/components/hostel/edit-block-dialog"
import { DeleteBlockDialog } from "@/components/hostel/delete-block-dialog"
import Link from "next/link"
import type { HostelBlock } from "@/lib/api/hostel"

export default function HostelBlocksPage() {
  const { data, isLoading } = useHostelBlocks()
  const deleteBlock = useDeleteHostelBlock()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<HostelBlock | null>(null)

  const blocks: HostelBlock[] = (data?.data || []) as HostelBlock[]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <PageHeader title="Hostel Blocks" description="Manage hostel buildings and blocks">
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Block
        </Button>
      </PageHeader>

      {!isLoading && blocks.length === 0 ? (
        <EmptyState icon={Building2} title="No hostel blocks yet" description="Start by adding your first hostel block." action={{ label: "Add Block", onClick: () => setIsCreateOpen(true) }} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blocks.map((block) => (
            <motion.div key={block.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
              <Link href={`/hostel/blocks/${block.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer relative group">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">{block.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {block.gender && <Badge variant="secondary" className="text-xs">{block.gender}</Badge>}
                      <span className={`inline-block w-2 h-2 rounded-full ${block.status === "active" ? "bg-green-500" : "bg-gray-400"}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5" /> {block._count?.floors ?? 0} floors</span>
                      <span className="flex items-center gap-1"><DoorOpen className="h-3.5 w-3.5" /> {block._count?.sections ?? 0} sections</span>
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {block._count?.staffAssignments ?? 0} staff</span>
                    </div>
                    {block.code && <p className="text-xs text-muted-foreground mt-2">Code: {block.code}</p>}
                  </CardContent>
                </Card>
              </Link>
              <div className="absolute top-2 right-2 z-10" onClick={(e) => e.preventDefault()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelected(block); setIsEditOpen(true) }}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); setSelected(block); setIsDeleteOpen(true) }}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <CreateBlockDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      {selected && <EditBlockDialog open={isEditOpen} onOpenChange={setIsEditOpen} block={selected} />}
      {selected && <DeleteBlockDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} block={selected} />}
    </motion.div>
  )
}