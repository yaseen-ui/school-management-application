"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DoorOpen, Plus } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useHostelRooms, useHostelBlocks } from "@/hooks/use-hostel"
import type { HostelRoom } from "@/lib/api/hostel"

export default function HostelRoomsPage() {
  const [floorFilter, setFloorFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const { data, isLoading } = useHostelRooms(
    floorFilter !== "all" || typeFilter !== "all" || statusFilter !== "all"
      ? { floorId: floorFilter !== "all" ? floorFilter : undefined, roomTypeId: typeFilter !== "all" ? typeFilter : undefined, status: statusFilter !== "all" ? statusFilter : undefined }
      : undefined
  )

  const rooms: HostelRoom[] = (data?.data || []) as HostelRoom[]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <PageHeader title="Hostel Rooms" description="View and manage all hostel rooms across blocks" />

      <div className="flex gap-3 flex-wrap">
        <Select value={floorFilter} onValueChange={setFloorFilter}><SelectTrigger className="w-48"><SelectValue placeholder="All floors" /></SelectTrigger><SelectContent><SelectItem value="all">All Floors</SelectItem></SelectContent></Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}><SelectTrigger className="w-48"><SelectValue placeholder="All types" /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem></SelectContent></Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-36"><SelectValue placeholder="All status" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select>
      </div>

      {!isLoading && rooms.length === 0 ? (
        <EmptyState icon={DoorOpen} title="No rooms found" description="Rooms are created within block details." />
      ) : (
        <Card>
          <Table>
            <TableHeader><TableRow><TableHead>Room #</TableHead><TableHead>Type</TableHead><TableHead>Block / Floor</TableHead><TableHead>Occupancy</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {rooms.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.roomNumber}</TableCell>
                  <TableCell>{r.roomType?.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.floor?.block?.name} / Floor {r.floor?.floorNumber}</TableCell>
                  <TableCell><Badge variant={(r._count?.studentAllocations ?? 0) >= r.capacity ? "destructive" : "outline"}>{(r._count?.studentAllocations ?? 0)}/{r.capacity}</Badge></TableCell>
                  <TableCell><span className={`inline-block w-2 h-2 rounded-full ${r.status === "active" ? "bg-green-500" : "bg-gray-400"} mr-2`} />{r.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </motion.div>
  )
}