"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Users, Plus, Trash2, DollarSign, Calendar } from "lucide-react"
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

import { teachersApi } from "@/lib/api/teachers"
import type { Teacher } from "@/lib/api/teachers"
import {
  listSalaryComponents,
  listEmployeeCompensations,
  getEmployeeCompensation,
  upsertEmployeeCompensation,
  getCompensationHistory,
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
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SalaryComponent {
  id: string
  name: string
  type: string
  isActive?: boolean
}

interface CompensationComponent {
  salaryComponentId: string
  salaryComponentName: string
  type: string
  value: number
}

interface CompensationHistory {
  id: string
  effectiveDate: string
  totalCompensation: number
  components: CompensationComponent[]
  createdAt: string
}

export default function CompensationPage() {
  const queryClient = useQueryClient()

  const { data: teachersData, isLoading: teachersLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const response = await teachersApi.getAll()
      return response.data.rows
    },
  })

  const { data: salaryComponentsData } = useQuery({
    queryKey: ["salary-components"],
    queryFn: listSalaryComponents,
  })

  const teachers: Teacher[] = teachersData || []
  const salaryComponents: SalaryComponent[] = salaryComponentsData?.data || salaryComponentsData || []

  // Fetch all compensations to display salary in the table
  const { data: compensationsData } = useQuery({
    queryKey: ["employee-compensations"],
    queryFn: listEmployeeCompensations,
  })

  const compensations: any[] = compensationsData?.data || compensationsData || []
  const compensationMap = new Map<string, number>()
  compensations.forEach((comp: any) => {
    if (comp.employeeId && comp.totalCompensation != null) {
      compensationMap.set(comp.employeeId, comp.totalCompensation)
    }
  })

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Teacher | null>(null)
  const [historyRecords, setHistoryRecords] = useState<CompensationHistory[]>([])

  // Compensation form state
  const [effectiveDate, setEffectiveDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [components, setComponents] = useState<CompensationComponent[]>([])

  const saveMutation = useMutation({
    mutationFn: (data: { employeeId: string; effectiveFrom: string; components: { salaryComponentId: string; value: number }[] }) =>
      upsertEmployeeCompensation(data.employeeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-compensation"] })
      queryClient.invalidateQueries({ queryKey: ["employee-compensations"] })
      toast.success("Compensation saved successfully")
      setEditDialogOpen(false)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const openEditDialog = async (teacher: Teacher) => {
    setSelectedEmployee(teacher)
    setEffectiveDate(format(new Date(), "yyyy-MM-dd"))
    setComponents([])

    try {
      const response = await getEmployeeCompensation(teacher.id)
      const comp = response?.data || response
      if (comp) {
        setEffectiveDate(
          comp.effectiveFrom
            ? format(new Date(comp.effectiveFrom), "yyyy-MM-dd")
            : format(new Date(), "yyyy-MM-dd")
        )
        if (comp.components) {
          setComponents(
            comp.components.map((c: any) => ({
              salaryComponentId: c.salaryComponentId || c.salaryComponent?.id || "",
              salaryComponentName: c.salaryComponent?.name || c.salaryComponentName || "",
              type: c.salaryComponent?.type || c.type || "",
              value: c.value,
            }))
          )
        }
      }
    } catch {
      // No existing compensation, start fresh
    }

    setEditDialogOpen(true)
  }

  const openHistoryDialog = async (teacher: Teacher) => {
    setSelectedEmployee(teacher)
    try {
      const response = await getCompensationHistory(teacher.id)
      const history = response?.data || response || []
      setHistoryRecords(Array.isArray(history) ? history : [])
    } catch {
      setHistoryRecords([])
    }
    setHistoryDialogOpen(true)
  }

  const addComponentRow = () => {
    setComponents([...components, { salaryComponentId: "", salaryComponentName: "", type: "", value: 0 }])
  }

  const removeComponentRow = (index: number) => {
    setComponents(components.filter((_, i) => i !== index))
  }

  const updateComponent = (index: number, field: keyof CompensationComponent, value: string | number) => {
    const updated = [...components]
    if (field === "salaryComponentId") {
      const sc = salaryComponents.find((s) => s.id === value)
      updated[index] = {
        ...updated[index],
        salaryComponentId: value as string,
        salaryComponentName: sc?.name || "",
        type: sc?.type || "",
      }
    } else {
      ;(updated[index] as any)[field] = value
    }
    setComponents(updated)
  }

  const totalCompensation = components.reduce((sum, c) => {
    const val = Number(c.value) || 0
    return c.type === "DEDUCTION" ? sum - val : sum + val
  }, 0)

  const handleSave = () => {
    if (!selectedEmployee) return
    if (!effectiveDate) {
      toast.error("Effective date is required")
      return
    }
    if (components.length === 0) {
      toast.error("Add at least one component")
      return
    }

    const validComponents = components
      .filter((c) => c.salaryComponentId && c.salaryComponentId.trim() !== "")
      .map((c) => ({
        salaryComponentId: c.salaryComponentId,
        value: Number(c.value) || 0,
      }))

    if (validComponents.length === 0) {
      toast.error("Add at least one valid component with a selected component type")
      return
    }

    saveMutation.mutate({
      employeeId: selectedEmployee.id,
      effectiveFrom: effectiveDate,
      components: validComponents,
    })
  }

  const defaultColumns = [
    { field: "employeeCode", headerName: "Employee ID" },
    { field: "fullName", headerName: "Name" },
    { field: "email", headerName: "Email" },
    { field: "phone", headerName: "Phone" },
    { field: "salary", headerName: "Salary (₹)" },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader
        title="Employee Compensation"
        description="Manage salary structures and compensation for employees"
      />

      <DynamicDataTable
        data={teachers}
        apiColumns={defaultColumns}
        isLoading={teachersLoading}
        idField="id"
        renderCell={({ row, field }: { row: Teacher; field: string; value: unknown }) => {
          if (field === "fullName") {
            return (
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">{row.fullName}</span>
              </div>
            )
          }

          if (field === "email") {
            return <span className="text-sm text-muted-foreground">{row.email || "—"}</span>
          }

          if (field === "phone") {
            return <span className="text-sm text-muted-foreground">{row.phone || "—"}</span>
          }

          if (field === "employeeCode") {
            return <span className="text-sm text-muted-foreground">{row.employeeCode || "—"}</span>
          }

          if (field === "salary") {
            const salary = compensationMap.get(row.id)
            if (salary != null) {
              return (
                <span className="font-semibold text-green-600">
                  ₹{salary.toLocaleString("en-IN")}
                </span>
              )
            }
            return <span className="text-sm text-muted-foreground">—</span>
          }

          return undefined
        }}
        renderActions={(row: Teacher) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEditDialog(row)}>
                <DollarSign className="mr-2 h-4 w-4" />
                Manage Compensation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openHistoryDialog(row)}>
                <Calendar className="mr-2 h-4 w-4" />
                View History
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      {/* Compensation Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Compensation - {selectedEmployee?.fullName}
            </DialogTitle>
            <DialogDescription>
              Configure salary components and effective date for this employee.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Effective Date *</Label>
              <Input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Salary Components</Label>
              <Button variant="outline" size="sm" onClick={addComponentRow}>
                <Plus className="mr-1 h-4 w-4" />
                Add Component
              </Button>
            </div>

            <ScrollArea className="max-h-80">
              <div className="space-y-3">
                {components.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No components added. Click "Add Component" to start.
                  </p>
                )}
                {components.map((comp, index) => (
                  <div key={index} className="flex items-end gap-2">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">Component</Label>
                      <Select
                        value={comp.salaryComponentId}
                        onValueChange={(v) => updateComponent(index, "salaryComponentId", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select component" />
                        </SelectTrigger>
                        <SelectContent>
                          {salaryComponents
                            .filter((sc) => sc.isActive !== false)
                            .map((sc) => (
                              <SelectItem key={sc.id} value={sc.id}>
                                {sc.name} ({sc.type})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-32 space-y-1">
                      <Label className="text-xs">Value</Label>
                      <Input
                        type="number"
                        value={comp.value}
                        onChange={(e) => updateComponent(index, "value", Number(e.target.value))}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive mb-0.5"
                      onClick={() => removeComponentRow(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Separator />

            {/* Fixed Footer - Total Compensation */}
            <div className="flex items-center justify-between bg-muted/50 rounded-lg p-4">
              <span className="text-lg font-semibold">Total Compensation</span>
              <span className={`text-2xl font-bold ${totalCompensation >= 0 ? "text-green-600" : "text-red-600"}`}>
                ₹{totalCompensation.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : "Save Compensation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              Compensation History - {selectedEmployee?.fullName}
            </DialogTitle>
            <DialogDescription>
              Historical record of salary revisions and compensation changes.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh]">
            {historyRecords.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No compensation history found.
              </p>
            ) : (
              <div className="space-y-4">
                {historyRecords.map((record) => (
                  <Card key={record.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span>Effective: {format(new Date(record.effectiveDate), "MMM dd, yyyy")}</span>
                        <span className="text-green-600 font-bold">
                          ₹{record.totalCompensation.toLocaleString("en-IN")}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground space-y-1">
                        {record.components?.map((comp, i) => (
                          <div key={i} className="flex justify-between">
                            <span>{comp.salaryComponentName} ({comp.type})</span>
                            <span>₹{Number(comp.value).toLocaleString("en-IN")}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Recorded: {format(new Date(record.createdAt), "MMM dd, yyyy HH:mm")}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setHistoryDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
