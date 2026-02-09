"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"

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
import { useCreateRole, useUpdateRole } from "@/hooks/use-roles"
import type { Role } from "@/lib/api/roles"

const roleSchema = z.object({
  roleName: z.string().min(1, "Role name is required"),
  description: z.string().min(1, "Description is required"),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
})

type RoleFormValues = z.infer<typeof roleSchema>

interface RoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role?: Role | null
  mode: "create" | "edit"
}

const AVAILABLE_PERMISSIONS = [
  // Users
  { value: "manage_users", label: "Manage Users", module: "users" },
  { value: "view_users", label: "View Users", module: "users" },
  { value: "create_users", label: "Create Users", module: "users" },
  { value: "edit_users", label: "Edit Users", module: "users" },
  { value: "delete_users", label: "Delete Users", module: "users" },
  // Students
  { value: "manage_students", label: "Manage Students", module: "students" },
  { value: "view_students", label: "View Students", module: "students" },
  { value: "create_students", label: "Create Students", module: "students" },
  { value: "edit_students", label: "Edit Students", module: "students" },
  { value: "delete_students", label: "Delete Students", module: "students" },
  // Courses
  { value: "manage_courses", label: "Manage Courses", module: "courses" },
  { value: "view_courses", label: "View Courses", module: "courses" },
  { value: "create_courses", label: "Create Courses", module: "courses" },
  { value: "edit_courses", label: "Edit Courses", module: "courses" },
  { value: "delete_courses", label: "Delete Courses", module: "courses" },
  // Subjects
  { value: "manage_subjects", label: "Manage Subjects", module: "subjects" },
  { value: "view_subjects", label: "View Subjects", module: "subjects" },
  { value: "create_subjects", label: "Create Subjects", module: "subjects" },
  { value: "edit_subjects", label: "Edit Subjects", module: "subjects" },
  { value: "delete_subjects", label: "Delete Subjects", module: "subjects" },
  // Grades
  { value: "manage_grades", label: "Manage Grades", module: "grades" },
  { value: "view_grades", label: "View Grades", module: "grades" },
  { value: "create_grades", label: "Create Grades", module: "grades" },
  { value: "edit_grades", label: "Edit Grades", module: "grades" },
  { value: "delete_grades", label: "Delete Grades", module: "grades" },
  // Sections
  { value: "manage_sections", label: "Manage Sections", module: "sections" },
  { value: "view_sections", label: "View Sections", module: "sections" },
  { value: "create_sections", label: "Create Sections", module: "sections" },
  { value: "edit_sections", label: "Edit Sections", module: "sections" },
  { value: "delete_sections", label: "Delete Sections", module: "sections" },
  // Inventory
  { value: "manage_inventory", label: "Manage Inventory", module: "inventory" },
  { value: "view_inventory", label: "View Inventory", module: "inventory" },
  // Reports
  { value: "view_reports", label: "View Reports", module: "reports" },
  { value: "export_reports", label: "Export Reports", module: "reports" },
  // Settings
  { value: "manage_settings", label: "Manage Settings", module: "settings" },
  { value: "edit_content", label: "Edit Content", module: "settings" },
]

export function RoleDialog({ open, onOpenChange, role, mode }: RoleDialogProps) {
  const createRole = useCreateRole()
  const updateRole = useUpdateRole()

  const isEditing = mode === "edit" && role

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
    },
  })

  const selectedPermissions = watch("permissions")

  useEffect(() => {
    if (isEditing && role) {
      reset({
        roleName: role.roleName,
        description: role.description,
        permissions: role.permissions || [],
      })
    } else {
      reset({
        roleName: "",
        description: "",
        permissions: [],
      })
    }
  }, [role, isEditing, reset])

  const onSubmit = (data: RoleFormValues) => {
    if (isEditing && role) {
      updateRole.mutate(
        { id: role.id, data },
        {
          onSuccess: () => {
            onOpenChange(false)
            reset()
          },
        },
      )
    } else {
      createRole.mutate(data, {
        onSuccess: () => {
          onOpenChange(false)
          reset()
        },
      })
    }
  }

  const togglePermission = (permissionValue: string) => {
    const current = selectedPermissions || []
    const updated = current.includes(permissionValue)
      ? current.filter((p) => p !== permissionValue)
      : [...current, permissionValue]
    setValue("permissions", updated)
  }

  const toggleModule = (moduleName: string) => {
    const modulePermissions = AVAILABLE_PERMISSIONS.filter((p) => p.module === moduleName).map((p) => p.value)
    const allSelected = modulePermissions.every((p) => selectedPermissions?.includes(p))
    const current = selectedPermissions || []
    const updated = allSelected
      ? current.filter((p) => !modulePermissions.includes(p))
      : [...new Set([...current, ...modulePermissions])]
    setValue("permissions", updated)
  }

  const groupedPermissions = AVAILABLE_PERMISSIONS.reduce(
    (acc, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = []
      }
      acc[permission.module].push(permission)
      return acc
    },
    {} as Record<string, typeof AVAILABLE_PERMISSIONS>,
  )

  const isPending = createRole.isPending || updateRole.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Role" : "Create Role"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update role details and permissions." : "Create a new role with specific permissions."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roleName">Role Name</Label>
              <Input id="roleName" placeholder="e.g., Teacher, Staff" {...register("roleName")} />
              {errors.roleName && <p className="text-sm text-destructive">{errors.roleName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this role can do..."
                rows={2}
                {...register("description")}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Permissions</Label>
              {errors.permissions && <p className="text-sm text-destructive">{errors.permissions.message}</p>}
              <ScrollArea className="h-[300px] rounded-lg border border-border p-4">
                <div className="space-y-6">
                  {Object.entries(groupedPermissions).map(([module, perms]) => {
                    const allSelected = perms.every((p) => selectedPermissions?.includes(p.value))
                    const someSelected = perms.some((p) => selectedPermissions?.includes(p.value))

                    return (
                      <div key={module} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`module-${module}`}
                            checked={allSelected}
                            onCheckedChange={() => toggleModule(module)}
                            className={someSelected && !allSelected ? "opacity-50" : ""}
                          />
                          <label
                            htmlFor={`module-${module}`}
                            className="text-sm font-semibold capitalize cursor-pointer"
                          >
                            {module}
                          </label>
                        </div>
                        <div className="ml-6 grid grid-cols-2 gap-2">
                          {perms.map((permission) => (
                            <div key={permission.value} className="flex items-center gap-2">
                              <Checkbox
                                id={permission.value}
                                checked={selectedPermissions?.includes(permission.value)}
                                onCheckedChange={() => togglePermission(permission.value)}
                              />
                              <label
                                htmlFor={permission.value}
                                className="text-sm text-muted-foreground cursor-pointer"
                              >
                                {permission.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </div>
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
