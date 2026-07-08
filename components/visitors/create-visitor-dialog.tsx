"use client"

import { useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, X, Check } from "lucide-react"
import { useCreateVisitor, useVisitorPurposes } from "@/hooks/use-visitors"
import { useParents } from "@/hooks/use-parents"
import { toast } from "sonner"

interface CreateVisitorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ParentStudent {
  id: string
  firstName: string
  lastName: string
  admissionNumber?: string
  gradeName?: string
  sectionName?: string
  isPrimary?: boolean
}

export function CreateVisitorDialog({ open, onOpenChange }: CreateVisitorDialogProps) {
  const [visitorType, setVisitorType] = useState<"registered" | "non_registered">("non_registered")
  const [visitorName, setVisitorName] = useState("")
  const [visitorPhone, setVisitorPhone] = useState("")
  const [purposeId, setPurposeId] = useState("")
  const [description, setDescription] = useState("")

  // Parent search state
  const [parentSearch, setParentSearch] = useState("")
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null)
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([])

  const { data: purposes } = useVisitorPurposes()
  const { data: parentsData } = useParents()
  const createVisitor = useCreateVisitor()

  const parents: any[] = Array.isArray(parentsData) ? parentsData : ((parentsData as any)?.parents || [])

  // Filter parents by search query
  const filteredParents = useMemo(() => {
    if (!parentSearch.trim()) return parents
    const q = parentSearch.toLowerCase()
    return parents.filter((p: any) =>
      p.fullName?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q)
    )
  }, [parents, parentSearch])

  // Get linked students for the selected parent
  const selectedParent = parents.find((p: any) => p.id === selectedParentId)
  const linkedStudents: ParentStudent[] = selectedParent?.students || []

  // When parent changes, reset student selection
  const handleParentSelect = (parentId: string) => {
    setSelectedParentId(parentId)
    setSelectedStudentIds([])
  }

  const toggleStudent = (studentId: string) => {
    setSelectedStudentIds(prev =>
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    )
  }

  const handleSubmit = () => {
    if (visitorType === "registered" && !selectedParentId) {
      toast.error("Please select a parent")
      return
    }
    if (!purposeId) {
      toast.error("Please select a purpose")
      return
    }
    createVisitor.mutate(
      {
        visitorType,
        parentId: visitorType === "registered" ? selectedParentId || undefined : undefined,
        visitorName: visitorType === "non_registered" ? (visitorName || undefined) : undefined,
        visitorPhone: visitorType === "non_registered" ? (visitorPhone || undefined) : undefined,
        purposeId,
        description: description || undefined,
      },
      {
        onSuccess: () => {
          setVisitorType("non_registered")
          setVisitorName("")
          setVisitorPhone("")
          setPurposeId("")
          setDescription("")
          setParentSearch("")
          setSelectedParentId(null)
          setSelectedStudentIds([])
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Visitor</DialogTitle>
          <DialogDescription>Register a campus visitor.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 max-h-[70vh] overflow-y-auto">
          <div className="space-y-2">
            <Label>Visitor Type</Label>
            <Select value={visitorType} onValueChange={(v) => setVisitorType(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="non_registered">Non-Registered</SelectItem>
                <SelectItem value="registered">Registered (Parent)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {visitorType === "registered" ? (
            /* Registered Parent flow */
            <>
              <div className="space-y-2">
                <Label>Search Parent</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, phone, or email..."
                    value={parentSearch}
                    onChange={(e) => setParentSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
                {parentSearch && filteredParents.length === 0 && (
                  <p className="text-xs text-muted-foreground">No parents found</p>
                )}
              </div>

              {/* Parent results */}
              {parentSearch && filteredParents.length > 0 && (
                <div className="border rounded-lg divide-y max-h-40 overflow-y-auto">
                  {filteredParents.map((p: any) => (
                    <div
                      key={p.id}
                      className={`p-3 cursor-pointer hover:bg-muted/50 flex items-center justify-between ${
                        selectedParentId === p.id ? "bg-primary/5 border-l-2 border-primary" : ""
                      }`}
                      onClick={() => handleParentSelect(p.id)}
                    >
                      <div>
                        <p className="text-sm font-medium">{p.fullName}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.phone}{p.email ? ` • ${p.email}` : ""}
                        </p>
                      </div>
                      {selectedParentId === p.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Linked students */}
              {selectedParent && (
                <div className="space-y-2">
                  <Label>Linked Students</Label>
                  {linkedStudents.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No students linked to this parent.</p>
                  ) : (
                    <div className="border rounded-lg divide-y max-h-40 overflow-y-auto">
                      {linkedStudents.map((s) => (
                        <label
                          key={s.id}
                          className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 ${
                            selectedStudentIds.includes(s.id) ? "bg-primary/5" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedStudentIds.includes(s.id)}
                            onChange={() => toggleStudent(s.id)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <div>
                            <p className="text-sm font-medium">
                              {s.firstName} {s.lastName}
                              {s.isPrimary && (
                                <Badge variant="outline" className="ml-2 text-xs px-1 py-0">Primary</Badge>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {s.gradeName}{s.sectionName ? ` • ${s.sectionName}` : ""}
                              {s.admissionNumber ? ` • #${s.admissionNumber}` : ""}
                            </p>
                          </div>
                          {selectedStudentIds.includes(s.id) && (
                            <Check className="h-4 w-4 text-primary ml-auto" />
                          )}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Selected parent summary */}
              {selectedParent && (
                <div className="rounded-lg bg-muted p-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Parent</span>
                    <span className="font-medium">{selectedParent.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium">{selectedParent.phone || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Students Selected</span>
                    <span className="font-medium">{selectedStudentIds.length} of {linkedStudents.length}</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Non-Registered flow */
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={visitorName} onChange={(e) => setVisitorName(e.target.value)} placeholder="Visitor name" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={visitorPhone} onChange={(e) => setVisitorPhone(e.target.value)} placeholder="Phone number" />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Purpose</Label>
            <Select value={purposeId} onValueChange={setPurposeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                {(purposes || []).filter(p => p.isActive).map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Reason for visit..." rows={2} />
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={createVisitor.isPending}>
            {createVisitor.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Register Visitor
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}