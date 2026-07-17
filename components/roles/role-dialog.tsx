"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, ChevronDown, ChevronRight } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateRole, useUpdateRole, useRoles } from "@/hooks/use-roles"
import type { Role } from "@/lib/api/roles"

// ── RBAC v2: canonical permission catalog ──
import { PERMISSIONS } from "@/lib/backend/rbac/permissions.js"

const roleSchema = z.object({
  roleName: z.string().min(1, "Role name is required"),
  description: z.string().min(1, "Description is required"),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
  groupId: z.string().optional(),
})

type RoleFormValues = z.infer<typeof roleSchema>

interface RoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role?: Role | null
  mode: "create" | "edit"
}

// Default groups (used for group picker; actual groups come from API)
const DEFAULT_GROUP_OPTIONS = [
  "Administration",
  "Teaching Staff",
  "Academic Staff",
  "Finance",
  "Transport",
  "Parents",
  "Support Staff",
]

// Group permissions by module for the categorized picker
function buildPermissionCatalog() {
  const modules: Record<string, { code: string; description: string; action: string; scope: string | null }[]> = {}
  for (const [code, def] of Object.entries(PERMISSIONS)) {
    const moduleName = (def as any).module ?? "other"
    if (!modules[moduleName]) modules[moduleName] = []
    modules[moduleName].push({
      code,
      description: (def as any).description ?? code,
      action: (def as any).action ?? "",
      scope: (def as any).scope ?? null,
    })
  }
  return modules
}

const MODULE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  users: "Users & Roles",
  roles: "Users & Roles",
  students: "Students",
  teachers: "Teachers",
  courses: "Courses",
  grades: "Grades",
  sections: "Sections",
  subjects: "Subjects",
  section_subjects: "Section-Subject Mapping",
  attendance: "Attendance",
  staff_attendance: "Staff Attendance",
  exams: "Exams",
  exam_schedules: "Exam Schedules",
  marks: "Marks Entry",
  results: "Results",
  grading: "Grading Scales",
  fee_heads: "Fees",
  fee_terms: "Fees",
  section_fees: "Fees",
  student_fees: "Fees",
  fee_payments: "Fees",
  fee_refunds: "Fees",
  payroll: "Payroll",
  salary_components: "Payroll",
  compensation: "Payroll",
  accounts: "Accounts",
  transactions: "Accounts",
  timetable: "Timetable",
  timetable_structures: "Timetable",
  timetable_periods: "Timetable",
  teacher_assignments: "Teacher Assignments",
  teacher_capabilities: "Teacher Assignments",
  teacher_availability: "Teacher Assignments",
  leave: "Leave Management",
  holidays: "Holidays",
  parents: "Parents",
  parent_portal: "Parent Portal",
  transport: "Transportation",
  infrastructure: "Infrastructure",
  store: "Store / Inventory",
  visitors: "Visitors",
  imports: "Imports",
  settings: "Settings",
  academic_years: "Settings",
  tenants: "Tenants",
  reports: "Reports",
  admin: "Admin",
}

function moduleLabel(module: string): string {
  return MODULE_LABELS[module] ?? module.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

export function RoleDialog({ open, onOpenChange, role, mode }: RoleDialogProps) {
  const createRole = useCreateRole()
  const updateRole = useUpdateRole()
  const { data: rolesData } = useRoles()
  const existingRoles = Array.isArray(rolesData) ? rolesData : []
  const permissionCatalog = buildPermissionCatalog()

  const isEditing = mode === "edit" && role
  const [duplicateFrom, setDuplicateFrom] = useState<string>("none")
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      roleName: "",
      description: "",
      permissions: [],
      groupId: "",
    },
  })

  const selectedPermissions = watch("permissions")

  useEffect(() => {
    if (isEditing && role) {
      reset({
        roleName: role.roleName,
        description: role.description,
        permissions: role.permissions || [],
        groupId: role.groupId || "",
      })
      // Expand modules that have selected permissions
      const expanded = new Set<string>()
      if (role.permissions) {
        for (const code of role.permissions) {
          const def = (PERMISSIONS as any)[code]
          if (def) expanded.add(def.module)
        }
      }
      setExpandedModules(expanded)
    } else {
      reset({
        roleName: "",
        description: "",
        permissions: [],
        groupId: "",
      })
      setExpandedModules(new Set())
      setDuplicateFrom("none")
    }
  }, [role, isEditing, reset])

  // Duplicate from existing role
  const handleDuplicate = (roleId: string) => {
    if (roleId === "none") return
    const source = existingRoles.find((r: any) => r.id === roleId)
    if (source) {
      setValue("permissions", source.permissions || [])
      if (source.groupId) setValue("groupId", source.groupId)
      // Expand modules that have permissions
      const expanded = new Set<string>()
      if (source.permissions) {
        for (const code of source.permissions) {
          const def = (PERMISSIONS as any)[code]
          if (def) expanded.add(def.module)
        }
      }
      setExpandedModules(expanded)
    }
  }

  const onSubmit = (data: RoleFormValues) => {
    if (isEditing && role) {
      updateRole.mutate(
        { id: role.id, data },
        { onSuccess: () => { onOpenChange(false); reset() } },
      )
    } else {
      createRole.mutate(data, {
        onSuccess: () => { onOpenChange(false); reset() },
      })
    }
  }

  const togglePermission = (code: string) => {
    const current = selectedPermissions || []
    const updated = current.includes(code)
      ? current.filter((p) => p !== code)
      : [...current, code]
    setValue("permissions", updated)
  }

  const toggleModule = (module: string) => {
    const modulePerms = permissionCatalog[module]?.map((p) => p.code) ?? []
    const allSelected = modulePerms.every((p) => selectedPermissions?.includes(p))
    const current = selectedPermissions || []
    const updated = allSelected
      ? current.filter((p) => !modulePerms.includes(p))
      : [...new Set([...current, ...modulePerms])]
    setValue("permissions", updated)
  }

  const toggleExpand = (module: string) => {
    const next = new Set(expandedModules)
    if (next.has(module)) next.delete(module)
    else next.add(module)
    setExpandedModules(next)
  }

  // Check select-all state per module
  const moduleStates = Object.keys(permissionCatalog).map((module) => {
    const perms = permissionCatalog[module]
    const allSelected = perms.every((p) => selectedPermissions?.includes(p.code))
    const someSelected = perms.some((p) => selectedPermissions?.includes(p.code))
    return { module, allSelected, someSelected, count: perms.length }
  })

  const isPending = createRole.isPending || updateRole.isPending
  const totalSelected = selectedPermissions?.length ?? 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[680px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Role" : "Create Role"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update role details and permissions."
              : "Create a new role with specific permissions."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-hidden flex flex-col space-y-6">
          <div className="space-y-4">
            {/* Name & Description */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roleName">Role Name</Label>
                <Input id="roleName" placeholder="e.g., Class Teacher" {...register("roleName")} />
                {errors.roleName && <p className="text-sm text-destructive">{errors.roleName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="groupId">Group</Label>
                <Select value={watch("groupId")} onValueChange={(v) => setValue("groupId", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {DEFAULT_GROUP_OPTIONS.map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe what this role can do..." rows={2} {...register("description")} />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            {/* Duplicate from existing */}
            {!isEditing && existingRoles.length > 0 && (
              <div className="space-y-2">
                <Label>Duplicate from existing role</Label>
                <Select value={duplicateFrom} onValueChange={(v) => { setDuplicateFrom(v); handleDuplicate(v) }}>
                  <SelectTrigger>
                    <SelectValue placeholder="None — start fresh" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None — start fresh</SelectItem>
                    {existingRoles.map((r: any) => (
                      <SelectItem key={r.id} value={r.id}>{r.roleName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Permissions Picker */}
          <div className="flex-1 space-y-2 min-h-0">
            <div className="flex items-center justify-between">
              <Label>Permissions</Label>
              <span className="text-xs text-muted-foreground">{totalSelected} selected</span>
            </div>
            {errors.permissions && <p className="text-sm text-destructive">{errors.permissions.message}</p>}
            <ScrollArea className="flex-1 h-[360px] rounded-lg border border-border p-4">
              <div className="space-y-2">
                {moduleStates.map(({ module, allSelected, someSelected, count }) => {
                  const isExpanded = expandedModules.has(module)
                  const perms = permissionCatalog[module]
                  return (
                    <div key={module} className="border border-border rounded-lg overflow-hidden">
                      {/* Module header */}
                      <button
                        type="button"
                        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-accent/50 transition-colors text-left"
                        onClick={() => toggleExpand(module)}
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`module-${module}`}
                            checked={allSelected}
                            onCheckedChange={() => toggleModule(module)}
                            className={someSelected && !allSelected ? "opacity-50" : ""}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className="text-sm font-semibold">{moduleLabel(module)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{someSelected && !allSelected ? `${selectedPermissions?.filter((p: string) => perms.some((pp) => pp.code === p)).length ?? 0}/` : ""}{count}</span>
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </div>
                      </button>

                      {/* Permission items */}
                      {isExpanded && (
                        <div className="border-t border-border px-3 py-2 bg-muted/20">
                          <div className="grid grid-cols-1 gap-1.5 max-h-[200px] overflow-y-auto">
                            {perms.map((perm) => (
                              <div key={perm.code} className="flex items-start gap-2 py-0.5">
                                <Checkbox
                                  id={perm.code}
                                  checked={selectedPermissions?.includes(perm.code)}
                                  onCheckedChange={() => togglePermission(perm.code)}
                                  className="mt-0.5"
                                />
                                <label htmlFor={perm.code} className="text-sm cursor-pointer leading-tight">
                                  <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono">{perm.code}</code>
                                  <span className="text-muted-foreground ml-1">{perm.description}</span>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Role" : "Create Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}